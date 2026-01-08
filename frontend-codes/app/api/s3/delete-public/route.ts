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

        const body = await request.json();
        const key = body.key;

        if (!key) {
            return NextResponse.json(
                { error: "Missing or invalid object key" },
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

    } catch {
        return NextResponse.json(
            { error: "Missing or invalid object key" },
            { status: 500 }
        );
    }
}
