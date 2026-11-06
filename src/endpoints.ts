// Generated from the Autom OpenAPI document. Do not edit by hand.

import type { EndpointDefinition } from "./types.js";

/** Every documented operation, keyed by its snake_case name. */
export const ENDPOINTS = {
  bing_search: {
    path: "/v1/bing/search",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  brave_images: {
    path: "/v1/brave/images",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  brave_search: {
    path: "/v1/brave/search",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  brave_videos: {
    path: "/v1/brave/videos",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  duckduckgo_search: {
    path: "/v1/duckduckgo/search",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  finder_google_countries: {
    path: "/v1/finder/google-countries",
    methods: ["GET"],
    response: "json",
    required: ["query"],
  },
  finder_google_languages: {
    path: "/v1/finder/google-languages",
    methods: ["GET"],
    response: "json",
    required: ["query"],
  },
  finder_google_locations: {
    path: "/v1/finder/google-locations",
    methods: ["GET"],
    response: "json",
    required: ["query"],
  },
  google_images: {
    path: "/v1/google/images",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  google_jobs: {
    path: "/v1/google/jobs",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  google_maps: {
    path: "/v1/google/maps",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  google_news: {
    path: "/v1/google/news",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  google_search: {
    path: "/v1/google/search",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  google_search_ai: {
    path: "/v1/google/search/ai",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  google_search_autocomplete: {
    path: "/v1/google/search/autocomplete",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  google_search_light: {
    path: "/v1/google/search/light",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  google_shopping: {
    path: "/v1/google/shopping",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  google_videos: {
    path: "/v1/google/videos",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query", "page"],
  },
  jobs: {
    path: "/v1/jobs/{id}",
    methods: ["GET"],
    response: "json",
    required: ["id"],
  },
  search: {
    path: "/v1/search",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
  stats: {
    path: "/v1/stats",
    methods: ["GET"],
    response: "json",
    required: [],
  },
  usage: {
    path: "/v1/usage",
    methods: ["GET"],
    response: "json",
    required: [],
  },
  yahoo_search: {
    path: "/v1/yahoo/search",
    methods: ["GET", "POST"],
    response: "json",
    required: ["query"],
  },
} as const satisfies Record<string, EndpointDefinition>;

export type EndpointName = keyof typeof ENDPOINTS;
