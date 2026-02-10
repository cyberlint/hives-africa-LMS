import { render } from "@react-email/render";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { emailOTP, admin } from "better-auth/plugins";
import { resend } from "./resend";
import React from "react";

import { VerificationEmail } from "@/components/emails/VerificationEmail";
import { ResetPasswordEmail } from "@/components/emails/ResetPasswordEmail";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    trustedOrigins: [
        process.env.NEXT_PUBLIC_API_BASE_URL || "",
        "http://localhost:3000",
        "https://www.hives.africa",
        "https://hives.africa",
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        async sendResetPassword({ user, url }) {
            const html = await render(React.createElement(ResetPasswordEmail, { url }));
            
            await resend.emails.send({
                from: "NextHive <auth@notifications.hives.africa>",
                to: [user.email],
                subject: "Reset your password",
                html,
            });
        },
    },
    plugins: [
        emailOTP({
            sendVerificationOnSignUp: true,
            async sendVerificationOTP({ email, otp }) {
                const html = await render(React.createElement(VerificationEmail, { otp }));

                await resend.emails.send({
                    from: "NextHive <auth@notifications.hives.africa>",
                    to: [email],
                    subject: "Verify your email",
                    html,
                });
            },
        }),
        admin(),
    ],
});