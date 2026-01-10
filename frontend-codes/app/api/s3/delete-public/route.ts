// This route handles deleting files from the s3 bucket by any authenticated user, not just admin.

import { getCurrentUser } from '@/domains/auth/user';
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";


// Define additional rules to protect the route.
const aj = arcjet
    .withRule(
        detectBot({
            mode: "LIVE",
            allow: [],    // List of bots allowed to interact with your route handler. E.g OpenAI
        })
    )
    .withRule(
        fixedWindow({
            mode: "LIVE",   // Allows up to 10 file delete requests in a 1 minute window. Adjust as needed.
            window: "1m",
            max: 10,
        })
    );


export async function DELETE(request: Request) {
    const user = await getCurrentUser()

    if (!user || !user.id) {
        return NextResponse.json(
            { error: "Unauthorized: You must be logged in to delete files." },
            { status: 401 }
        );
    }

    // 3. Use the AUTHENTICATED USER ID for the Arcjet Fingerprint
    const userId = user.id;
    try {

        const decision = await aj.protect(request, {
            fingerprint: userId as string,
        });

        if (decision.isDenied()) {
            return NextResponse
                .json(
                    { error: "You have sent multiple requests within a short time. Please wait for some minutes and try again." },
                    { status: 429 });
        }

        // Try to get key from query params first
        const { searchParams } = new URL(request.url);
        let key = searchParams.get("key");

        // If not in query params, try to get from body
        if (!key) {
            try {
                const body = await request.json();
                key = body.key;
            } catch (e) {
                // If body is empty or not JSON, we'll just fall back to the key check below
            }
        }

        if (!key) {
            return NextResponse.json(
                { error: "Missing or invalid object key. Provide key in body or as a 'key' query parameter." },
                { status: 400 }
            );
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: key,
        });

        await S3.send(command);

        return NextResponse.json(
            { message: "File deleted succesfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("S3 Public Delete Error:", error);
        return NextResponse.json(
            { error: "Failed to delete file from S3" },
            { status: 500 }
        );
    }
}
