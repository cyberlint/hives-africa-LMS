import { requireAdmin } from "@/lib/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


// Define additional rules to protect the route.
const aj = arcjet
    .withRule(
        detectBot({
            mode: "LIVE",
            allow: [],    //List of bots allowed to interact with your route handler. E.g OpenAI
        })
    )
    .withRule(
        fixedWindow({
            mode: "LIVE",   //// Allows up to 10 file delete requests in a 1 minute window. Adjust as needed.
            window: "1m",
            max: 10,
        })
    );


export async function DELETE(request: Request) {
    const session = await requireAdmin()

    try {

        const decision = await aj.protect(request, {
            fingerprint: session?.user.id as string,
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
