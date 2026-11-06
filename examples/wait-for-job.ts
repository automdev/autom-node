import { AutomClient } from "@autom/sdk";

const client = new AutomClient({ apiKey: process.env.AUTOM_API_KEY });

const submitted = await client.googleSearch({
  query: "web scraping api",
  is_async: true,
});
const job = await client.waitForJob(submitted.data.job_id, {
  onProgress: (j) => console.log(`${j.status} ${j.progress ?? 0}%`),
});
console.log(JSON.stringify(job.data, null, 2));
