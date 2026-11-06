import {
  AutomApiError,
  AutomConfigurationError,
  AutomResponseDecodingError,
  AutomSerializationError,
  AutomTransportError,
  AutomJobTimeoutError,
} from "./errors.js";
import { ENDPOINTS, type EndpointName } from "./endpoints.js";
import type * as Params from "./params.js";
import { encodeQueryPairs, serializeRequest } from "./serialization.js";
import type {
  ApiResponse,
  BatchOptions,
  BatchResult,
  BinaryResponse,
  HttpMethod,
  JsonResponse,
  RawResponse,
  RequestOptions,
  AutomClientOptions,
  AutomFetch,
  WaitForJobOptions,
} from "./types.js";
import { VERSION } from "./version.js";

export const DEFAULT_BASE_URL = "https://api.autom.dev";
export const DEFAULT_TIMEOUT_MS = 120_000;
/** Retries after a network error or a 408, 429, 500, 502, 503 or 504 response. */
export const MAX_RETRIES = 3;
/** Delay before the first retry, in milliseconds. */
export const DEFAULT_RETRY_DELAY_MS = 1_000;
/** Each retry waits this many times longer than the previous one (a Retry-After header wins). */
export const RETRY_BACKOFF_FACTOR = 1.5;
/** Longest wait between two attempts, in milliseconds. */
export const MAX_RETRY_DELAY_MS = 30_000;
/** Tasks run at the same time by batch(). */
export const DEFAULT_CONCURRENCY = 10;
const RETRYABLE_STATUSES = new Set([408, 500, 502, 503, 504]);

/**
 * Server errors and plan rate limits are retried. The API reports rate limits as 401 (or 429) with a
 * "Rate limit exceeded" message; per-key quotas ("…: quota daily") do not reset within seconds, so they are not.
 */
function isRetryable(rawResponse: RawResponse): boolean {
  if (RETRYABLE_STATUSES.has(rawResponse.status)) return true;
  if (rawResponse.status !== 401 && rawResponse.status !== 429) return false;
  const message = (
    createApiError(rawResponse).errorMessage ?? ""
  ).toLowerCase();
  if (message.includes("quota")) return false;
  return (
    message.includes("rate limit") ||
    (rawResponse.status === 429 && message === "")
  );
}
const API_KEY_ENVIRONMENT_VARIABLE = "AUTOM_API_KEY";

type EmptyParams = Params.EmptyParams;

/**
 * Official Autom API client. Create one instance and reuse it.
 */
export class AutomClient {
  readonly #apiKey: string;
  readonly #baseUrl: string;
  readonly #timeout: number;
  readonly #maxRetries: number;
  readonly #retryDelay: number;
  readonly #headers: Readonly<Record<string, string>>;
  readonly #fetch: AutomFetch;

  constructor(options: AutomClientOptions = {}) {
    if (
      typeof options !== "object" ||
      options === null ||
      Array.isArray(options)
    ) {
      throw new AutomConfigurationError(
        "AutomClient options must be an object.",
      );
    }
    const apiKey =
      options.apiKey ?? readEnvironment(API_KEY_ENVIRONMENT_VARIABLE);
    if (typeof apiKey !== "string" || apiKey.trim().length === 0) {
      throw new AutomConfigurationError(
        `A non-blank Autom API key is required. Pass apiKey or set ${API_KEY_ENVIRONMENT_VARIABLE}.`,
      );
    }
    try {
      new Headers({ "x-api-key": apiKey });
    } catch (cause) {
      throw new AutomConfigurationError(
        "The Autom API key cannot be used in an HTTP header.",
        { cause },
      );
    }

    const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    let parsedBaseUrl: URL;
    try {
      parsedBaseUrl = new URL(baseUrl);
    } catch (cause) {
      throw new AutomConfigurationError("baseUrl must be an absolute URL.", {
        cause,
      });
    }
    if (
      parsedBaseUrl.protocol !== "https:" &&
      parsedBaseUrl.protocol !== "http:"
    ) {
      throw new AutomConfigurationError("baseUrl must use http or https.");
    }

    const timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;
    if (
      typeof timeout !== "number" ||
      !Number.isFinite(timeout) ||
      timeout < 0
    ) {
      throw new AutomConfigurationError(
        "timeout must be a non-negative number of milliseconds.",
      );
    }

    const maxRetries = options.maxRetries ?? MAX_RETRIES;
    if (!Number.isInteger(maxRetries) || maxRetries < 0) {
      throw new AutomConfigurationError(
        "maxRetries must be a non-negative integer.",
      );
    }
    const retryDelayMs = options.retryDelay ?? DEFAULT_RETRY_DELAY_MS;
    if (
      typeof retryDelayMs !== "number" ||
      !Number.isFinite(retryDelayMs) ||
      retryDelayMs < 0
    ) {
      throw new AutomConfigurationError(
        "retryDelay must be a non-negative number of milliseconds.",
      );
    }

    const fetchImplementation = options.fetch ?? globalThis.fetch;
    if (typeof fetchImplementation !== "function") {
      throw new AutomConfigurationError(
        "A Fetch-compatible transport is required.",
      );
    }

    this.#apiKey = apiKey;
    this.#baseUrl = baseUrl.replace(/\/+$/, "");
    this.#timeout = timeout;
    this.#maxRetries = maxRetries;
    this.#retryDelay = retryDelayMs;
    this.#headers = Object.freeze({ ...(options.headers ?? {}) });
    this.#fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
  }

  /**
   * Sends any request to the Autom API. Use it for endpoints released after this SDK version.
   * GET parameters travel in the query string; POST parameters travel in a JSON body.
   */
  async request<T = any>(
    method: HttpMethod,
    path: string,
    params?: Readonly<Record<string, unknown>> | null,
    options?: RequestOptions | null,
  ): Promise<ApiResponse<T>> {
    return this.#send<T>(method, path, params, options, "any");
  }

  /**
   * Runs `task` for every item with at most `concurrency` tasks in flight (default 10) and returns one result per
   * item, in input order. A failing item never stops the others.
   *
   * ```ts
   * const results = await client.batch(ids, (id) => client.someEndpoint({ query: id }));
   * ```
   */
  async batch<I, T>(
    items: Iterable<I>,
    task: (item: I, index: number) => Promise<T>,
    options: BatchOptions = {},
  ): Promise<BatchResult<T>[]> {
    const list = [...items];
    const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
    if (!Number.isInteger(concurrency) || concurrency < 1) {
      throw new AutomConfigurationError(
        "concurrency must be a positive integer.",
      );
    }
    const results: BatchResult<T>[] = new Array(list.length);
    let next = 0;
    const worker = async (): Promise<void> => {
      while (next < list.length) {
        const index = next++;
        options.signal?.throwIfAborted();
        try {
          results[index] = {
            status: "fulfilled",
            index,
            value: await task(list[index]!, index),
          };
        } catch (reason) {
          results[index] = { status: "rejected", index, reason };
        }
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(concurrency, list.length) }, worker),
    );
    return results;
  }

  /**
   * Bing Search. Query Bing Search via API and retrieve structured organic results (title, link, snippet, position). Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/bing/search`
   */
  bingSearch<T = any>(
    params: Params.BingSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bing_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Brave Images. Search Brave Images via API and retrieve structured image results with pagination and SafeSearch. Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/brave/images`
   */
  braveImages<T = any>(
    params: Params.BraveImagesParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("brave_images", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Brave Search. Search Brave Search via API and retrieve structured organic results with pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/brave/search`
   */
  braveSearch<T = any>(
    params: Params.BraveSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("brave_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Brave Videos. Search Brave Videos via API and retrieve structured video results with pagination and SafeSearch. Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/brave/videos`
   */
  braveVideos<T = any>(
    params: Params.BraveVideosParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("brave_videos", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * DuckDuckGo Search. Query DuckDuckGo via API and retrieve structured organic results with region and language. Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/duckduckgo/search`
   */
  duckduckgoSearch<T = any>(
    params: Params.DuckduckgoSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("duckduckgo_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Countries. Search Google countries and retrieve country codes (free Finder endpoint).
   *
   * `GET /v1/finder/google-countries`
   */
  finderGoogleCountries<T = any>(
    params: Params.FinderGoogleCountriesParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("finder_google_countries", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Languages. Search Google languages and retrieve language codes (free Finder endpoint).
   *
   * `GET /v1/finder/google-languages`
   */
  finderGoogleLanguages<T = any>(
    params: Params.FinderGoogleLanguagesParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("finder_google_languages", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Locations. Find supported Google locations and retrieve location IDs and country codes (free endpoint).
   *
   * `GET /v1/finder/google-locations`
   */
  finderGoogleLocations<T = any>(
    params: Params.FinderGoogleLocationsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("finder_google_locations", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Images. Search Google Images via API and retrieve image results (URLs, titles, sources, dimensions). Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/google/images`
   */
  googleImages<T = any>(
    params: Params.GoogleImagesParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_images", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Jobs. Scrape Google Jobs results via API and retrieve structured job listings with title, company, location, and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/google/jobs`
   */
  googleJobs<T = any>(
    params: Params.GoogleJobsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_jobs", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Maps. Search Google Maps via API and retrieve structured place results (address, website, phone). Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/google/maps`
   */
  googleMaps<T = any>(
    params: Params.GoogleMapsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_maps", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google News. Search Google News via API and retrieve structured news results with pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/google/news`
   */
  googleNews<T = any>(
    params: Params.GoogleNewsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_news", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Search. Scrape Google Search results via API and retrieve structured SERP data with pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/google/search`
   */
  googleSearch<T = any>(
    params: Params.GoogleSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google AI Mode. Query Google AI Mode via API. JSON with text_blocks, references, and shopping_results. Credit cost: 3 credits per call.
   *
   * `GET / POST /v1/google/search/ai`
   */
  googleSearchAi<T = any>(
    params: Params.GoogleSearchAiParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_search_ai", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Search Autocomplete. Get Google Search autocomplete suggestions via API for a given query. Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/google/search/autocomplete`
   */
  googleSearchAutocomplete<T = any>(
    params: Params.GoogleSearchAutocompleteParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_search_autocomplete", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Search Light. Scrape lightweight Google Search results via API: fast, cost-efficient, organic results only. Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/google/search/light`
   */
  googleSearchLight<T = any>(
    params: Params.GoogleSearchLightParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_search_light", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Shopping. Scrape Google Shopping results via API and retrieve structured product listings with prices, ratings, and merchant data. Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/google/shopping`
   */
  googleShopping<T = any>(
    params: Params.GoogleShoppingParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_shopping", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Videos. Search Google Videos via API and retrieve structured video results with metadata. Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/google/videos`
   */
  googleVideos<T = any>(
    params: Params.GoogleVideosParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_videos", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Jobs. Poll the status, progress (0–100) and result of a job started with is_async=true. Polling is free. Poll until status is terminal: CompletedJob, Error, NotFound or BadRequest.
   *
   * `GET /v1/jobs/{id}`
   */
  jobs<T = any>(
    params: Params.JobsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("jobs", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * Search. One call walks engines in order and returns the first organic results. engines=auto tries Google, then Brave, Bing, DuckDuckGo, Yahoo, and Baidu. Omitted gl is us and omitted hl is en. There is no page parameter: the response is always pag… Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/search`
   */
  search<T = any>(
    params: Params.SearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("search", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * Stats. Infrastructure health for an engine or endpoint over the last hour. Not scoped to your account or tenant. Enabled per account: HTTP 403 means contact support to activate it.
   *
   * `GET /v1/stats`
   */
  stats<T = any>(
    params?: Params.StatsParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("stats", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * Usage. Retrieve real-time usage statistics and credit balance for your Autom account.
   *
   * `GET /v1/usage`
   */
  usage<T = any>(
    params?: EmptyParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("usage", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * Yahoo Search. Query Yahoo via API and retrieve structured organic results with country and language. Credit cost: 1 credit per call.
   *
   * `GET / POST /v1/yahoo/search`
   */
  yahooSearch<T = any>(
    params: Params.YahooSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("yahoo_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Polls `GET /v1/jobs/{id}` until the job reaches a terminal status
   * (CompletedJob, Error, NotFound, BadRequest) and returns the final job document.
   */
  async waitForJob<T = any>(
    jobId: string,
    options: WaitForJobOptions = {},
  ): Promise<JsonResponse<T>> {
    if (typeof jobId !== "string" || jobId.trim().length === 0) {
      throw new AutomSerializationError(
        "A non-blank job id is required.",
        "id",
      );
    }
    let delayMs = options.intervalMs ?? 3_000;
    const maxDelayMs = Math.max(delayMs, MAX_POLL_INTERVAL_MS);
    const timeoutMs = options.timeoutMs ?? 43_200_000;
    const startedAt = Date.now();
    let last: JsonResponse<T> | undefined;
    for (;;) {
      options.signal?.throwIfAborted();
      const response = await this.request<T>(
        "GET",
        "/v1/jobs/{id}",
        { id: jobId },
        options.signal ? { signal: options.signal } : null,
      );
      if (response.kind !== "json") {
        throw new AutomResponseDecodingError(
          "The job endpoint did not return JSON.",
          response.rawResponse,
        );
      }
      last = response;
      options.onProgress?.(last.data);
      const status = (last.data as { status?: unknown } | null)?.status;
      if (typeof status === "string" && JOB_TERMINAL_STATUSES.includes(status))
        return last;
      if (Date.now() - startedAt + delayMs > timeoutMs) {
        throw new AutomJobTimeoutError(jobId, last);
      }
      await sleep(delayMs, options.signal ?? undefined);
      delayMs = Math.min(delayMs * 1.5, maxDelayMs);
    }
  }

  async #call(
    name: EndpointName,
    params: Readonly<object> | null | undefined,
    options: RequestOptions | null | undefined,
  ): Promise<ApiResponse> {
    const endpoint = ENDPOINTS[name];
    const supported: readonly HttpMethod[] = endpoint.methods;
    const method = options?.method ?? supported[0] ?? "GET";
    if (!supported.includes(method)) {
      throw new AutomConfigurationError(
        `${endpoint.path} supports ${supported.join(", ")}, not ${method}.`,
      );
    }
    const values = (params ?? {}) as Readonly<Record<string, unknown>>;
    for (const name of endpoint.required as readonly string[]) {
      if (values[name] === undefined || values[name] === null) {
        throw new AutomSerializationError(
          `The "${name}" parameter is required.`,
          name,
        );
      }
    }
    return this.#send(
      method,
      endpoint.path,
      values,
      { ...options, method },
      endpoint.response,
    );
  }

  async #send<T>(
    method: HttpMethod,
    path: string,
    params: Readonly<Record<string, unknown>> | null | undefined,
    options: RequestOptions | null | undefined,
    expected: "json" | "any",
  ): Promise<ApiResponse<T>> {
    if (method !== "GET" && method !== "POST") {
      throw new AutomConfigurationError(
        `Unsupported HTTP method: ${String(method)}.`,
      );
    }
    if (typeof path !== "string" || !path.startsWith("/")) {
      throw new AutomConfigurationError(
        'The request path must start with "/".',
      );
    }
    const serialized = serializeRequest(method, path, params);
    const url = new URL(this.#baseUrl + serialized.path);
    if (serialized.query.length > 0)
      url.search = encodeQueryPairs(serialized.query);

    const headers = new Headers({
      Accept: "application/json, */*;q=0.8",
      "User-Agent": `autom-node/${VERSION}`,
      ...this.#headers,
      ...(options?.headers ?? {}),
      "x-api-key": this.#apiKey,
    });
    const init: RequestInit = { method, headers, redirect: "manual" };
    if (serialized.body !== undefined) {
      headers.set("Content-Type", "application/json");
      init.body = JSON.stringify(serialized.body);
    }

    const timeout = options?.timeout ?? this.#timeout;
    const maxRetries = options?.maxRetries ?? this.#maxRetries;
    let rawResponse: RawResponse;
    for (let attempt = 0; ; attempt++) {
      options?.signal?.throwIfAborted();
      const signals: AbortSignal[] = [];
      if (options?.signal) signals.push(options.signal);
      const deadline = timeout > 0 ? AbortSignal.timeout(timeout) : undefined;
      if (deadline) signals.push(deadline);
      if (signals.length > 0)
        init.signal =
          signals.length === 1 ? signals[0]! : AbortSignal.any(signals);

      try {
        const response = await this.#fetch(url, init);
        const body = new Uint8Array(await response.arrayBuffer());
        rawResponse = createRawResponse(response, body);
      } catch (cause) {
        if (options?.signal?.aborted) throw cause;
        if (deadline?.aborted) {
          throw new AutomTransportError(
            `Autom request timed out after ${timeout} ms.`,
            cause,
          );
        }
        if (attempt < maxRetries) {
          await sleep(
            retryDelay(this.#retryDelay, attempt, undefined),
            options?.signal ?? undefined,
          );
          continue;
        }
        throw new AutomTransportError(
          "Autom request failed before an HTTP response body was received.",
          cause,
        );
      }

      if (rawResponse.status >= 200 && rawResponse.status <= 299) break;
      if (isRetryable(rawResponse) && attempt < maxRetries) {
        const retryAfter = rawResponse.headers.get("retry-after")?.[0];
        await sleep(
          retryDelay(this.#retryDelay, attempt, retryAfter),
          options?.signal ?? undefined,
        );
        continue;
      }
      throw createApiError(rawResponse);
    }
    return decodeSuccessResponse<T>(rawResponse, expected);
  }
}

function retryDelay(
  baseMs: number,
  attempt: number,
  retryAfter: string | undefined,
): number {
  const seconds = retryAfter === undefined ? Number.NaN : Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0)
    return Math.min(seconds * 1_000, 60_000);
  return Math.min(baseMs * RETRY_BACKOFF_FACTOR ** attempt, MAX_RETRY_DELAY_MS);
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = (): void => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function readEnvironment(name: string): string | undefined {
  const env = (
    globalThis as { process?: { env?: Record<string, string | undefined> } }
  ).process?.env;
  const value = env?.[name];
  return value === undefined || value === "" ? undefined : value;
}

function createRawResponse(response: Response, body: Uint8Array): RawResponse {
  const headers = new Map<string, readonly string[]>();
  for (const [name, value] of response.headers) {
    headers.set(name.toLowerCase(), Object.freeze([value]));
  }
  const getSetCookie = (
    response.headers as Headers & { getSetCookie?: () => string[] }
  ).getSetCookie;
  if (typeof getSetCookie === "function") {
    const values = getSetCookie.call(response.headers);
    if (values.length > 0)
      headers.set("set-cookie", Object.freeze([...values]));
  }
  return {
    status: response.status,
    statusText: response.statusText,
    headers,
    contentType: response.headers.get("content-type"),
    body,
  };
}

function createApiError(rawResponse: RawResponse): AutomApiError {
  const parsed = tryParseJson(rawResponse.body);
  const objectBody =
    parsed.ok && isJsonObject(parsed.value) ? parsed.value : null;
  let errorMessage: string | undefined;
  for (const key of ["error", "message", "error_message", "detail"]) {
    const value = objectBody?.[key];
    if (typeof value === "string" && value.length > 0) {
      errorMessage = value;
      break;
    }
  }
  return new AutomApiError({
    rawResponse,
    ...(parsed.ok ? { responseBody: parsed.value } : {}),
    ...(errorMessage === undefined ? {} : { errorMessage }),
  });
}

function decodeSuccessResponse<T>(
  rawResponse: RawResponse,
  expected: "json" | "any",
): ApiResponse<T> {
  if (!isJsonMediaType(rawResponse.contentType)) {
    if (expected === "json") {
      throw new AutomResponseDecodingError(
        "Autom returned a successful non-JSON response for a JSON operation.",
        rawResponse,
        new TypeError(
          `Unexpected content type: ${rawResponse.contentType ?? "none"}.`,
        ),
      );
    }
    const binary: BinaryResponse = {
      kind: "binary",
      bytes: rawResponse.body,
      contentType: rawResponse.contentType,
      rawResponse,
    };
    return binary;
  }
  const parsed = tryParseJson(rawResponse.body);
  if (!parsed.ok) {
    throw new AutomResponseDecodingError(
      "Autom returned a successful JSON response that could not be decoded.",
      rawResponse,
      parsed.cause,
    );
  }
  const json: JsonResponse<T> = {
    kind: "json",
    data: parsed.value as T,
    rawResponse,
  };
  return json;
}

function isJsonMediaType(contentType: string | null): boolean {
  if (contentType === null) return false;
  const mediaType = contentType.split(";", 1)[0]?.trim().toLowerCase();
  return (
    mediaType === "application/json" || Boolean(mediaType?.endsWith("+json"))
  );
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function tryParseJson(
  body: Uint8Array,
): { ok: true; value: unknown } | { ok: false; cause: unknown } {
  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(body)) };
  } catch (cause) {
    return { ok: false, cause };
  }
}

export const JOB_TERMINAL_STATUSES: readonly string[] = [
  "CompletedJob",
  "Error",
  "NotFound",
  "BadRequest",
];
const MAX_POLL_INTERVAL_MS = 60_000;
