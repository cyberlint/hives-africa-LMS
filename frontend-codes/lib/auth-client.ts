import { createAuthClient } from "better-auth/react"
import { emailOTPClient, adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    plugins: [
        emailOTPClient(),
        adminClient(),
    ]
});