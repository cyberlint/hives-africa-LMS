import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    AUTH_GITHUB_CLIENT_ID: z.string().optional(),
    AUTH_GITHUB_SECRET: z.string().optional(),
    DATABASE_URL: z.string().url().optional(),
    RESEND_API_KEY: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().optional(),
    AWS_ENDPOINT: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().optional(),
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES: z.string().optional(),
    NEXT_PUBLIC_S3_BUCKET_NAME_VIDEOS: z.string().optional(),

  },
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    AUTH_GITHUB_CLIENT_ID: process.env.AUTH_GITHUB_CLIENT_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
    NEXT_PUBLIC_S3_BUCKET_NAME_VIDEOS: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_VIDEOS,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ENDPOINT: process.env.AWS_ENDPOINT,
  },
});
