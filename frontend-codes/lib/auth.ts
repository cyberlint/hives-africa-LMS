import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP, admin } from "better-auth/plugins";
import { resend } from "./resend";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true, // Users must verify email before they can sign in
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "admin",
                input: true, // Allow this field to be set during signup
            },
        },
    },
    socialProviders: env.AUTH_GITHUB_CLIENT_ID && env.AUTH_GITHUB_SECRET ? {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
        },
    } : {},
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp }) {
                // 🔥 DEVELOPMENT: Log OTP to console when email server is down
                console.log("\n" + "=".repeat(60));
                console.log("📧 EMAIL VERIFICATION OTP");
                console.log("=".repeat(60));
                console.log(`📨 Email: ${email}`);
                console.log(`🔑 OTP Code: ${otp}`);
                console.log(`⏰ Expires: 10 minutes`);
                console.log("=".repeat(60) + "\n");

                try {
                    const response = await resend.emails.send({
                        from: 'NextHive LMS <onboarding@resend.dev>',
                        to: [email],
                        subject: 'NextHive LMS - Verify Your Email Address',
                        html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>Verify your email address</h2>
                <p>Your one-time verification code is:</p>
                <h3 style="color: #2563eb;">${otp}</h3>
                <p>This code expires in 10 minutes.</p>
              </div>
            `,
                    });

                    console.log("✅ OTP email sent successfully:", response);
                } catch (error: any) {
                    console.error("❌ Failed to send OTP email via Resend:", error);
                    // Don't throw error in development - OTP is already logged to console
                    console.warn("⚠️  Email sending failed, but OTP is available in console above");
                }
            },
        }),
        admin(),
    ],
});
