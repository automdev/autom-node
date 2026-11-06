import { AutomApiError, AutomClient } from "@autom/sdk";

const client = new AutomClient({ apiKey: process.env.AUTOM_API_KEY });

try {
  // Any endpoint, including ones released after this SDK version.
  const response = await client.request("GET", "/v1/usage");
  if (response.kind === "json") console.log(response.data);
} catch (error) {
  if (error instanceof AutomApiError) {
    console.error(`HTTP ${error.status}: ${error.message}`);
  } else {
    throw error;
  }
}
