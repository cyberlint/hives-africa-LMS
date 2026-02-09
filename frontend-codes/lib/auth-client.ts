import { createAuthClient } from "better-auth/react"
import { emailOTPClient, adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    // If NEXT_PUBLIC_API_BASE_URL is missing, using undefined 
    // tells Better Auth to use the current window's origin.
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
    plugins: [
        emailOTPClient(),
        adminClient(),
    ]
});