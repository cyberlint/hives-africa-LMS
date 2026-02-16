import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { emailOTP, admin } from "better-auth/plugins";
import { resend } from "./resend";
import { VerificationEmail, ResetPasswordEmail } from "lib/email-templates/authentication-emails";

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
            await resend.emails.send({
                from: "NextHive <auth@notifications.hives.africa>",
                to: [user.email],
                subject: "Reset your password",
                html: ResetPasswordEmail(url),
            });
        },
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },  
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
    },
    plugins: [
        emailOTP({
            sendVerificationOnSignUp: true,
            async sendVerificationOTP({ email, otp }) {
                try {
                    await resend.emails.send({
                        from: "NextHive <auth@notifications.hives.africa>",
                        to: [email],
                        subject: "Verify your email",
                        html: VerificationEmail(otp),
                    });
                    console.log(`OTP sent to ${email}`);
                } catch (err) {
                    console.error("Email Plugin Error:", err);
                }
            },
        }),
        admin(),
    ],
});