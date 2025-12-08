import { env } from "@/lib/env";

export function constructUrl(key: string): string {
    // Handle missing environment variable or empty key
    if (!env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES || !key) {
        console.warn("⚠️ Missing S3 bucket name or file key. Using placeholder image.");
        return "/placeholder-course.jpg"; // Fallback to a local placeholder
    }

    return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${key}`;
}

// Keep the hook version for backward compatibility
export function useConstructUrl(key: string): string {
    return constructUrl(key);
}
