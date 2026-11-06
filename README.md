# Autom Node.js SDK

The official Node.js and TypeScript SDK for the [Autom](https://www.autom.dev) SERP API.

Google, Bing and Brave search results as structured JSON — web, maps, news, shopping, images, jobs and AI Mode.

The SDK exposes **23 typed methods**, one per documented endpoint, plus a generic `request()` for anything else.

## Requirements

- Node.js 20 or newer

## Installation

```sh
npm install @automdev/sdk
```

The SDK works with TypeScript and JavaScript (ES modules). The examples below use TypeScript; JavaScript users can use the same API by omitting TypeScript-only syntax.

## Get your API key

[Sign up for Autom](https://app.autom.dev/register) or sign in to your existing account, then copy your API key from the [dashboard](https://app.autom.dev). Store it securely, for example in the `AUTOM_API_KEY` environment variable, which the client reads by default.

## Quick start

```ts
import { AutomClient } from "@automdev/sdk";

const client = new AutomClient({ apiKey: process.env.AUTOM_API_KEY });

const response = await client.googleSearch({ query: "web scraping api" });
console.log(response.data);
```

Every method takes a parameter object that mirrors the [API reference](https://docs.autom.dev) (snake_case names, exactly as documented) and an optional `RequestOptions` object.

## Async jobs

Any call accepts `is_async: true` (useful past the 60-second server limit): the response is then a `job_id`. `waitForJob()` polls `GET /v1/jobs/{id}` until the job reaches a terminal status (`CompletedJob`, `Error`, `NotFound`, `BadRequest`):

```ts
const submitted = await client.googleSearch({
  query: "web scraping api",
  is_async: true,
});
const job = await client.waitForJob(submitted.data.job_id, {
  onProgress: (j) => console.log(`${j.status} ${j.progress ?? 0}%`),
});
console.log(JSON.stringify(job.data, null, 2));
```

## GET or POST

Methods use GET when the endpoint supports it: parameters travel in the query string. POST sends the same parameters as a JSON body.

```ts
await client.bingSearch({ query: "test" }, { method: "POST" });
```

`null`, `undefined` and empty arrays are omitted, `false` and `0` are sent, and arrays repeat the parameter name (`a=1&a=2`).

## Any endpoint

`request()` reaches any path, including endpoints released after this SDK version:

```ts
const response = await client.request("GET", "/v1/usage");
```

## Responses

- `JsonResponse` — `kind: "json"`, the parsed body in `data` (pass a type argument to type it: `client.googleSearch<MyType>(…)`).
- `BinaryResponse` — `kind: "binary"`, the body in `bytes` and its `contentType`.

Both keep the buffered `rawResponse` (status, headers, content type, body bytes).

## Errors

```ts
import { AutomApiError } from "@automdev/sdk";

try {
  await client.googleSearch({ query: "web scraping api" });
} catch (error) {
  if (error instanceof AutomApiError) {
    console.error(error.status, error.message, error.responseBody);
  }
  throw error;
}
```

| Error                        | When                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------- |
| `AutomConfigurationError`    | Missing API key, invalid options or unsupported method.                       |
| `AutomSerializationError`    | A required parameter is missing or a value can't be sent.                     |
| `AutomTransportError`        | Network failure or client-side timeout.                                       |
| `AutomApiError`              | The API answered with a non-2xx status (`status`, `message`, `responseBody`). |
| `AutomResponseDecodingError` | A success response could not be decoded.                                      |

All of them extend `AutomError`. Common statuses: `400` invalid parameters, `401` invalid API key, `402` no credits left, `429` rate limit exceeded.

## Retries

Requests are retried up to 3 times after a network error, a `408`, `500`, `502`, `503` or `504`, or a rate limit — which the API returns as `401` (or `429`) with a `Rate limit exceeded` message. Per-key quota errors (`…: quota daily`) are not retried, nor are `400`, `402`, `404` or client-side timeouts. The delay starts at 1 second and grows 1.5× per retry (capped at 30 seconds); a `Retry-After` header wins.

```ts
const client = new AutomClient({ maxRetries: 5, retryDelay: 500 });

// or for one request
await client.googleSearch({ query: "web scraping api" }, { maxRetries: 0 });
```

## Batch requests

`batch()` runs a task per item with at most 10 in flight (`concurrency`), and returns one result per item in input order, shaped like `Promise.allSettled`. One failure never stops the others.

```ts
const inputs = ["web scraping api", "serp api", "rank tracker"];
const results = await client.batch(
  inputs,
  (query) => client.googleSearch({ query }),
  { concurrency: 5 },
);

for (const result of results) {
  if (result.status === "fulfilled") console.log(result.value.data);
  else console.error(inputs[result.index], result.reason);
}
```

| Constant                 | Default  | Description                                                     |
| ------------------------ | -------- | --------------------------------------------------------------- |
| `DEFAULT_CONCURRENCY`    | `10`     | Tasks run at the same time by batch                             |
| `DEFAULT_TIMEOUT_MS`     | `120000` | Request timeout (milliseconds)                                  |
| `MAX_RETRIES`            | `3`      | Retry attempts after a network error, a 408/5xx or a rate limit |
| `RETRY_BACKOFF_FACTOR`   | `1.5`    | Exponential backoff multiplier                                  |
| `DEFAULT_RETRY_DELAY_MS` | `1000`   | Delay before the first retry (milliseconds)                     |

## Timeouts and cancellation

```ts
const client = new AutomClient({ timeout: 60_000 }); // default 120000 ms, 0 disables

await client.googleSearch(
  { query: "web scraping api" },
  {
    signal: AbortSignal.timeout(30_000),
  },
);
```

## Advanced: custom Fetch transport

```ts
import { AutomClient, type AutomFetch } from "@automdev/sdk";

const loggingFetch: AutomFetch = async (input, init) => {
  const response = await fetch(input, init);
  console.log(init.method, String(input), response.status);
  return response;
};

const client = new AutomClient({ fetch: loggingFetch });
```

## Endpoints

23 methods, generated from the [OpenAPI document](https://app.autom.dev/openapi).

| Method                       | HTTP                                        | Description                                                                                                                                  |
| ---------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `bingSearch()`               | GET / POST `/v1/bing/search`                | Query Bing Search via API and retrieve structured organic results (title, link, snippet, position).                                          |
| `braveImages()`              | GET / POST `/v1/brave/images`               | Search Brave Images via API and retrieve structured image results with pagination and SafeSearch.                                            |
| `braveSearch()`              | GET / POST `/v1/brave/search`               | Search Brave Search via API and retrieve structured organic results with pagination.                                                         |
| `braveVideos()`              | GET / POST `/v1/brave/videos`               | Search Brave Videos via API and retrieve structured video results with pagination and SafeSearch.                                            |
| `duckduckgoSearch()`         | GET / POST `/v1/duckduckgo/search`          | Query DuckDuckGo via API and retrieve structured organic results with region and language.                                                   |
| `finderGoogleCountries()`    | GET `/v1/finder/google-countries`           | Search Google countries and retrieve country codes (free Finder endpoint).                                                                   |
| `finderGoogleLanguages()`    | GET `/v1/finder/google-languages`           | Search Google languages and retrieve language codes (free Finder endpoint).                                                                  |
| `finderGoogleLocations()`    | GET `/v1/finder/google-locations`           | Find supported Google locations and retrieve location IDs and country codes (free endpoint).                                                 |
| `googleImages()`             | GET / POST `/v1/google/images`              | Search Google Images via API and retrieve image results (URLs, titles, sources, dimensions).                                                 |
| `googleJobs()`               | GET / POST `/v1/google/jobs`                | Scrape Google Jobs results via API and retrieve structured job listings with title, company, location, and pagination.                       |
| `googleMaps()`               | GET / POST `/v1/google/maps`                | Search Google Maps via API and retrieve structured place results (address, website, phone).                                                  |
| `googleNews()`               | GET / POST `/v1/google/news`                | Search Google News via API and retrieve structured news results with pagination.                                                             |
| `googleSearch()`             | GET / POST `/v1/google/search`              | Scrape Google Search results via API and retrieve structured SERP data with pagination.                                                      |
| `googleSearchAi()`           | GET / POST `/v1/google/search/ai`           | Query Google AI Mode via API. JSON with text_blocks, references, and shopping_results.                                                       |
| `googleSearchAutocomplete()` | GET / POST `/v1/google/search/autocomplete` | Get Google Search autocomplete suggestions via API for a given query.                                                                        |
| `googleSearchLight()`        | GET / POST `/v1/google/search/light`        | Scrape lightweight Google Search results via API: fast, cost-efficient, organic results only.                                                |
| `googleShopping()`           | GET / POST `/v1/google/shopping`            | Scrape Google Shopping results via API and retrieve structured product listings with prices, ratings, and merchant data.                     |
| `googleVideos()`             | GET / POST `/v1/google/videos`              | Search Google Videos via API and retrieve structured video results with metadata.                                                            |
| `jobs()`                     | GET `/v1/jobs/{id}`                         | Poll the status, progress (0–100) and result of a job started with is_async=true. Polling is free. Poll until status is terminal: Completed… |
| `search()`                   | GET / POST `/v1/search`                     | One call walks engines in order and returns the first organic results. engines=auto tries Google, then Brave, Bing, DuckDuckGo, Yahoo, and…  |
| `stats()`                    | GET `/v1/stats`                             | Infrastructure health for an engine or endpoint over the last hour. Not scoped to your account or tenant. Enabled per account: HTTP 403 mea… |
| `usage()`                    | GET `/v1/usage`                             | Retrieve real-time usage statistics and credit balance for your Autom account.                                                               |
| `yahooSearch()`              | GET / POST `/v1/yahoo/search`               | Query Yahoo via API and retrieve structured organic results with country and language.                                                       |

## All Autom SDKs

| SDK        | Package                                                        | Install                               |
| ---------- | -------------------------------------------------------------- | ------------------------------------- |
| Node.js    | [`@automdev/sdk`](https://www.npmjs.com/package/@automdev/sdk) | `npm install @automdev/sdk`           |
| Python     | [`automdev`](https://pypi.org/project/automdev/)               | `pip install automdev`                |
| Go         | [`autom-go`](https://pkg.go.dev/github.com/automdev/autom-go)  | `go get github.com/automdev/autom-go` |
| .NET       | [`Autom`](https://www.nuget.org/packages/Autom)                | `dotnet add package Autom`            |
| Ruby       | [`autom`](https://rubygems.org/gems/autom)                     | `gem install autom`                   |
| PHP        | [`autom/sdk`](https://packagist.org/packages/autom/sdk)        | `composer require autom/sdk`          |
| Java       | [`autom-java`](https://github.com/automdev/autom-java)         | build from source, see its README     |
| CLI        | [`@automdev/cli`](https://www.npmjs.com/package/@automdev/cli) | `npm install -g @automdev/cli`        |
| MCP server | [`@automdev/mcp`](https://www.npmjs.com/package/@automdev/mcp) | `npx -y @automdev/mcp`                |

## License

MIT — see [LICENSE](LICENSE).
