import { AutomClient } from "@autom/sdk";

const client = new AutomClient({ apiKey: process.env.AUTOM_API_KEY });

const response = await client.googleSearch({ query: "web scraping api" });
console.log(JSON.stringify(response.data, null, 2));
