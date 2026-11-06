// Generated from the Autom OpenAPI document. Do not edit by hand.

import type { OpenString } from "./types.js";

/** Parameters for operations that take none. */
export type EmptyParams = Record<string, never>;

/** Parameters for `bingSearch()` — `GET / POST /v1/bing/search`. */
export interface BingSearchParams {
  /** The search query you want to run on Bing. */
  query: string;
  /** Page number for pagination (1 = first page). Default: `1`. */
  page?: number | undefined;
  /** Number of results per page (e.g. 10, 20, 50). This value is a suggestion. Default: `10`. */
  num?: number | undefined;
  /** Search origin location (e.g. city). */
  location?: string | undefined;
  /** GPS latitude for the search origin. */
  lat?: number | undefined;
  /** GPS longitude for the search origin. */
  lon?: number | undefined;
  /** Market code where results come from (e.g. en-US). Cannot be used together with cc. */
  mkt?: string | undefined;
  /** Country code to search from (2-letter ISO 3166-1). Cannot be used together with mkt. */
  cc?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `braveImages()` — `GET / POST /v1/brave/images`. */
export interface BraveImagesParams {
  /** The search query you want to run on Brave Images. */
  query: string;
  /** Page number for pagination (50 results per page). Default: `1`. */
  page?: number | undefined;
  /** Country code (e.g. fr, us). Mapped to Brave country. */
  gl?: string | undefined;
  /** Language code (e.g. fr, en). Mapped to Brave lang. */
  hl?: string | undefined;
  /** SafeSearch: active | off | moderate | strict. Google-style active maps to Brave strict. */
  safe?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `braveSearch()` — `GET / POST /v1/brave/search`. */
export interface BraveSearchParams {
  /** The search query you want to run on Brave Search. */
  query: string;
  /** Page number for pagination. Default: `1`. */
  page?: number | undefined;
  /** Country code, for example us, fr, gb, de. Default: `"us"`. */
  gl?: string | undefined;
  /** Language code, for example en, fr, de. Default: `"en"`. */
  hl?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `braveVideos()` — `GET / POST /v1/brave/videos`. */
export interface BraveVideosParams {
  /** The search query you want to run on Brave Videos. */
  query: string;
  /** Page number for pagination. Default: `1`. */
  page?: number | undefined;
  /** Country code (e.g. fr, us). Mapped to Brave country. */
  gl?: string | undefined;
  /** Language code (e.g. fr, en). Mapped to Brave lang. */
  hl?: string | undefined;
  /** SafeSearch: active | off | moderate | strict. Google-style active maps to Brave strict. */
  safe?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `duckduckgoSearch()` — `GET / POST /v1/duckduckgo/search`. */
export interface DuckduckgoSearchParams {
  /** Search query sent to DuckDuckGo Search. */
  query: string;
  /** Page number. Page 1 is the first page of results. Default: `1`. */
  page?: number | undefined;
  /** Country code, for example us, fr, gb, de, jp. */
  gl?: string | undefined;
  /** Language code, for example en, fr, de, ja, zh. */
  hl?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `finderGoogleCountries()` — `GET /v1/finder/google-countries`. */
export interface FinderGoogleCountriesParams {
  /** Filter countries by a search string (case-insensitive). Returns all countries whose code or name matches the specified query. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `finderGoogleLanguages()` — `GET /v1/finder/google-languages`. */
export interface FinderGoogleLanguagesParams {
  /** Filter languages by a search string (case-insensitive). Returns all languages whose names contain the specified string. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `finderGoogleLocations()` — `GET /v1/finder/google-locations`. */
export interface FinderGoogleLocationsParams {
  /** Search locations supported by Piloterr (cities, countries, etc.) by providing a query string. Returns matching locations ordered by reach. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleImages()` — `GET / POST /v1/google/images`. */
export interface GoogleImagesParams {
  /** Query you want to search on Google Images (e.g. "lion", "nike logo", "modern house exterior"). */
  query: string;
  /** Page number for pagination (1 = first page). Default: `1`. */
  page?: number | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** If true, returns a job and lets you fetch results asynchronously. Default: `false`. */
  async?: boolean | undefined;
  /** Adult content filter. active enables Google SafeSearch; off disables it. Omit to use Google default. */
  safe?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleJobs()` — `GET / POST /v1/google/jobs`. */
export interface GoogleJobsParams {
  /** The job search query to run on Google Jobs (e.g. developer, barista new york). */
  query: string;
  /** Advanced search filters string for Google Jobs (encoded filter chips). */
  uds?: string | undefined;
  /** Search radius in kilometers. Does not strictly limit the radius, but influences result proximity. */
  lrad?: number | undefined;
  /** Filter results by work type. Set to 1 to filter for work from home / remote jobs. */
  ltype?: number | undefined;
  /** Human-readable location to originate the search from (e.g. New York, NY, Paris, France). If several locations match, the most popular one is used. Note: location and uule cannot be used together. */
  location?: string | undefined;
  /** Google encoded location parameter. Use for precise geo targeting. Note: uule and location cannot be used together. */
  uule?: string | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). Default: `"us"`. */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). Default: `"en"`. */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Token to fetch the next page of results. Returned in the serpapi_pagination.next_page_token field of the previous response. */
  next_page_token?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleMaps()` — `GET / POST /v1/google/maps`. */
export interface GoogleMapsParams {
  /** Search query for Google Maps (e.g. business type, brand, or place name). */
  query: string;
  /** Page number for pagination (1 = first page). Default: `1`. */
  page?: number | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Map center / geo hint in Google format (e.g. @43.5131985,1.4600501,60m). Helps focus results around a coordinate and zoom radius. */
  ll?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleNews()` — `GET / POST /v1/google/news`. */
export interface GoogleNewsParams {
  /** Query to search on Google News (keywords, company, topic). */
  query: string;
  /** Page number for pagination (1 = first page). Default: `1`. */
  page?: number | undefined;
  /** Maximum number of results per page (e.g. 10). Default: `10`. */
  num?: number | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleSearch()` — `GET / POST /v1/google/search`. */
export interface GoogleSearchParams {
  /** The search query you want to run on Google (supports advanced operators like site:, inurl:, intitle:). */
  query: string;
  /** Advanced search filters string (e.g. time ranges: qdr:h last hour, qdr:d last day, qdr:w last week, qdr:m last month, qdr:y last year). */
  tbs?: string | undefined;
  /** Adult content filter. active enables Google SafeSearch; off disables it. Omit to use Google default. */
  safe?: string | undefined;
  /** Human-readable location to originate the search from (e.g. New York, NY, Paris, France). If several locations match, the most popular one is used. Note: location and uule cannot be used together. */
  location?: string | undefined;
  /** Google encoded location parameter. Use for precise geo targeting. Note: uule and location cannot be used together. */
  uule?: string | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Page number / offset used for pagination. Default: `1`. */
  page?: number | undefined;
  /** Maximum number of results to return per page (deprecated). Default: `10`. */
  num?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleSearchAi()` — `GET / POST /v1/google/search/ai`. */
export interface GoogleSearchAiParams {
  /** The question or search query you want Google AI Mode to answer (supports advanced operators like site:, inurl:, intitle:). */
  query: string;
  /** Human-readable location to originate the search from (e.g. New York, NY, Paris, France). If several locations match, the most popular one is used. Note: location and uule cannot be used together. */
  location?: string | undefined;
  /** Google encoded location parameter. Use for precise geo targeting. Note: uule and location cannot be used together. */
  uule?: string | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleSearchAutocomplete()` — `GET / POST /v1/google/search/autocomplete`. */
export interface GoogleSearchAutocompleteParams {
  /** The search query for which you want to get autocomplete suggestions. */
  query: string;
  /** Cursor position in the search query where you want to get autocomplete suggestions. Default: `0`. */
  cp?: number | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleSearchLight()` — `GET / POST /v1/google/search/light`. */
export interface GoogleSearchLightParams {
  /** The search query you want to run on Google (supports advanced operators like site:, inurl:, intitle:). */
  query: string;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleShopping()` — `GET / POST /v1/google/shopping`. */
export interface GoogleShoppingParams {
  /** Query to search on Google Shopping (product name, brand, category). */
  query: string;
  /** Page number for pagination (1 = first page). Default: `1`. */
  page?: number | undefined;
  /** Location to localize results (e.g. New York, United States). Generates a UULE parameter automatically. */
  location?: string | undefined;
  /** Encoded location parameter (UULE). Use location instead if you don't have a pre-encoded value. */
  uule?: string | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). Default: `"us"`. */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). Default: `"en"`. */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Adult content filter. active enables Google SafeSearch; off disables it. Omit to use Google default. */
  safe?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleVideos()` — `GET / POST /v1/google/videos`. */
export interface GoogleVideosParams {
  /** The search query you want to run on Google Videos. */
  query: string;
  /** Human-readable location to originate the search from. Note: location and uule cannot be used together. */
  location?: string | undefined;
  /** Google encoded location parameter. Note: uule and location cannot be used together. */
  uule?: string | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Page number for pagination (1 = first page). Default: `1`. */
  page: number;
  /** Maximum number of results per page (e.g. 10). Default: `10`. */
  num?: number | undefined;
  /** Adult content filter. active enables Google SafeSearch; off disables it. Omit to use Google default. */
  safe?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `jobs()` — `GET /v1/jobs/{id}`. */
export interface JobsParams {
  /** The job_id returned by an endpoint called with is_async=true. */
  id: string;
}

/** Parameters for `search()` — `GET / POST /v1/search`. */
export interface SearchParams {
  /** Search query. */
  query: string;
  /** Engine order. Default auto tries google, brave, bing, duckduckgo, yahoo, then baidu. A comma-separated list is followed as given. ddg and duck mean duckduckgo. Unknown names are ignored. Default: `"auto"`. */
  engines?: string | undefined;
  /** Country code. Defaults to us when omitted. For example us, fr, gb, de. */
  gl?: string | undefined;
  /** Language code. Defaults to en when omitted. For example en, fr, de. */
  hl?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `stats()` — `GET /v1/stats`. */
export interface StatsParams {
  /** API family to check, for example google. Provide at least engine or path. */
  engine?: string | undefined;
  /** Specific endpoint to check, for example /v1/google/search. If you also pass engine, use an endpoint from that API. */
  path?: string | undefined;
}

/** Parameters for `yahooSearch()` — `GET / POST /v1/yahoo/search`. */
export interface YahooSearchParams {
  /** Search query sent to Yahoo Search. */
  query: string;
  /** Page number. Page 1 is the first page of results. Default: `1`. */
  page?: number | undefined;
  /** Country code, for example us, fr, gb, de, jp. */
  gl?: string | undefined;
  /** Language code, for example en, fr, de, ja, zh. */
  hl?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}
