import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { processPendingEmails } from "@/domains/communications/workers/sender";

// Initialize the Upstash Receiver
const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    // Extract the unique signature Upstash attaches to the headers
    const signature = req.headers.get("upstash-signature");
    
    if (process.env.NODE_ENV === "production" && !signature) {
      console.warn("[Cron Security] Missing Upstash signature.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Read the raw request body (required to verify the math)
    const body = await req.text();

    if (process.env.NODE_ENV === "production") {
      // Verify the signature mathematically
      const isValid = await receiver.verify({
        signature: signature as string,
        body,
      });

      if (!isValid) {
        console.warn("[Cron Security] Invalid Upstash signature blocked.");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Execute worker
    console.log("🔒 Verified secure request from Upstash QStash");
    console.log("[Cron Execution] Starting email batch processor...");
    
    await processPendingEmails();

    return NextResponse.json(
      { success: true, message: "Batch processed successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("[Cron Execution] Failure:", error);

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}