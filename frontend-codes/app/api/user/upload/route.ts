import { env } from '@/lib/env';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from '@/lib/S3Client';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const fileUploadSchema = z.object({
    fileName: z.string().min(1, { message: "File name is required" }),
    contentType: z.string().min(1, { message: "Content type is required" }),
    size: z.number().min(1, { message: "Size is required" }),
    isImage: z.boolean(),
});

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validation = fileUploadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid Request Body" },
                { status: 400 }
            );
        }

        const { fileName, contentType, size } = validation.data;

        // Ensure it's an image
        if (!contentType.startsWith('image/')) {
            return NextResponse.json(
                { error: "Only images are allowed" },
                { status: 400 }
            );
        }

        const uniqueKey = `user-avatars/${session.user.id}/${uuidv4()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            ContentType: contentType,
            ContentLength: size,
            Key: uniqueKey,
        });

        const presignedUrl = await getSignedUrl(S3, command, {
            expiresIn: 360,
        });

        return NextResponse.json({
            presignedUrl,
            key: uniqueKey,
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to generate upload URL" },
            { status: 500 }
        );
    }
}
