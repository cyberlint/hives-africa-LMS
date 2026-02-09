import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";
import arcjet, { 
    detectBot, 
    protectSignup, 
    slidingWindow, 
    shield 
} from "@/lib/arcjet";
import ip from "@arcjet/ip";

export const GET = (req: NextRequest) => auth.handler(req);

export const POST = async (req: NextRequest) => {
    const clonedReq = req.clone();
    const userIp = ip(req) || "127.0.0.1";
    const pathname = req.nextUrl.pathname;
    
    let body: any = {};
    if (pathname.includes("/sign-up")) {
        try {
            body = await clonedReq.json();
        } catch (e) {
            console.error("Arcjet body parse error:", e);
        }
    }

    // --- ARCJET RULE ENGINE ---
    
    let decision;

    if (pathname.includes("/sign-up")) {
        // 1. Strict Protection for Signups
        decision = await arcjet
            .withRule(
                protectSignup({
                    email: {
                        mode: "LIVE",
                        deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
                    },
                    bots: { mode: "LIVE", allow: [] }, 
                    rateLimit: { mode: "LIVE", interval: "2m", max: 5 },
                })
            )
            .protect(req, { 
                email: body?.email ?? "", 
                fingerprint: userIp 
            });
    } else {
        // 2. Standard Protection for all other Auth routes (Sign-in, Session, etc.)
        decision = await arcjet
            .withRule(shield({ mode: "LIVE" })) // Basic WAF protection
            .withRule(detectBot({ mode: "LIVE", allow: [] })) // Block login bots
            .withRule(slidingWindow({ mode: "LIVE", interval: "1m", max: 10 })) // General rate limit
            .protect(req, { fingerprint: userIp });
    }

    // --- DENIAL LOGIC ---

    if (decision.isDenied()) {
        console.warn(`[SECURITY] Request denied on ${pathname}. Reason:`, decision.reason);

        if (decision.reason.isRateLimit()) {
            return new Response("Too many attempts. Please wait a moment.", { status: 429 });
        }

        if (decision.reason.isEmail()) {
            let message = "Invalid email address.";
            if (decision.reason.emailTypes.includes("DISPOSABLE")) {
                message = "Disposable emails are not permitted.";
            } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
                message = "This email domain does not seem to exist.";
            }
            return Response.json({ message }, { status: 400 });
        }

        if (decision.reason.isBot()) {
            return new Response("Automated access denied.", { status: 403 });
        }

        return new Response("Access Forbidden", { status: 403 });
    }

    // --- SUCCESS: HANDOFF ---
    return auth.handler(req);
};