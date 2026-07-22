import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { emailOTP, admin } from "better-auth/plugins";
import { resend } from "./resend";
// import { VerificationEmail, ResetPasswordEmail } from "lib/email-templates/authentication-emails";
import { verificationEmail } from "@/lib/email-templates/verification-email-template"
import { resetPasswordEmail } from "@/lib/email-templates/reset-password-email-template"

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
            const EMAIL_FROM = process.env.EMAIL_FROM || "auth@notifications.hives.africa";
            const emailTemplate  = resetPasswordEmail(url);
            await resend.emails.send({
                from: `NextHive <${EMAIL_FROM}>`,
                to: [user.email],
                subject: emailTemplate .subject,
                html: emailTemplate .html,
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
                    const emailTemplate  = verificationEmail(otp);
                    await resend.emails.send({
                        from: `NextHive <${process.env.EMAIL_FROM}>`,
                        to: [email],
                        subject: emailTemplate.subject,
                        html: emailTemplate.html,
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