import { processPendingEmails } from "@/domains/communications/workers/sender";

async function run() {
  console.log("🔥 Running email worker test...");
  await processPendingEmails();
  console.log("✅ Done");
}

run().catch(console.error);