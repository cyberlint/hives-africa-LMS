import { NextResponse } from "next/server";
import { processPendingEmails } from "@/domains/communications/workers/sender";
import crypto from "crypto";

export async function GET(request: Request) {
  try {
    // ✅ 0. Ensure method is GET only (extra safety)
    if (request.method !== "GET") {
      return new NextResponse("Method Not Allowed", { status: 405 });
    }

    // ✅ 1. Validate secret exists
    const secret = process.env.CRON_SECRET;

    // 🔒 Security Note: In production, the secret must be set and will be used to protect this endpoint.
    if (process.env.NODE_ENV === "production" && !secret) {
      console.error("[Cron Security] CRON_SECRET is not defined.");
      return new NextResponse("Server Misconfigured", { status: 500 });
    }

    // ✅ 2. Authorization Verification (secure compare)
    const authHeader = request.headers.get("authorization");

    if (process.env.NODE_ENV === "production") {
      if (!authHeader) {
        console.warn("[Cron Security] Missing authorization header.");
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const expected = `Bearer ${secret}`;

      const isValid = crypto.timingSafeEqual(
        Buffer.from(authHeader),
        Buffer.from(expected)
      );

      if (!isValid) {
        console.warn("[Cron Security] Invalid authorization attempt blocked.");
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    // ✅ 3. Execute worker
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