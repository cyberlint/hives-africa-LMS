import { env } from '@/lib/env';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3 } from '@/lib/S3Client';
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet';
import { requireAdmin } from '@/lib/require-admin';

const fileUploadSchema = z.object({
    fileName: z.string().min(1, { message: "File name is required" }),
    contentType: z.string().optional().default("application/octet-stream"),
    size: z.number().min(1, { message: "Size is required" }),
    isImage: z.boolean(),
});


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
            mode: "LIVE",   //// Allows up to 10 file uploads in a 1 minute window. Adjust as needed.
            window: "1m",
            max: 10,
        })
    );

export async function POST(request: Request) {
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

        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        const validation = fileUploadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid Request Body", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { fileName, contentType, size } = validation.data

        const uniqueKey = `${uuidv4()}-${fileName}`

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            ContentType: contentType,
            ContentLength: size,
            Key: uniqueKey,
        });

        const presignedUrl = await getSignedUrl(S3, command, {
            expiresIn: 360,  //URL expires in 6 minutes
        },);

        const response = {
            presignedUrl,
            key: uniqueKey,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("S3 Upload Error:", error);
        return NextResponse.json(
            { error: "Failed to generate presigned URL" },
            { status: 500 }
        );
    }
}
