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
        async sendResetPassword({ user, url, token }: { user: { email: string }, url: string, token: string }, request: any) {
            // 🔥 DEVELOPMENT: Log Reset Link to console
            console.log("\n" + "=".repeat(60));
            console.log("🔒 PASSWORD RESET REQUEST");
            console.log("=".repeat(60));
            console.log(`📨 Email: ${user.email}`);
            console.log(`🔗 Reset Link: ${url}`);
            console.log(`🔑 Token: ${token}`);
            console.log("=".repeat(60) + "\n");

            // Send email without awaiting to prevent timing attacks and timeouts
            void resend.emails.send({
                from: 'NextHive LMS <onboarding@resend.dev>',
                to: [user.email],
                subject: 'NextHive LMS - Reset Your Password',
                html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                            <h2>Reset your password</h2>
                            <p>You requested a password reset. Click the link below to set a new password:</p>
                            <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #FDB606; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="color: #666; word-break: break-all;">${url}</p>
                            <p>This link expires shortly.</p>
                        </div>
                    `,
            }).then(response => {
                console.log("✅ Reset password email sent successfully:", response);
            }).catch(error => {
                console.error("❌ Failed to send reset password email via Resend:", error);
            });
        },
        onPasswordReset: async ({ user }: { user: { email: string } }, request: any) => {
            console.log(`Password for user ${user.email} has been reset.`);
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
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
            async sendVerificationOTP({ email, otp, type }) {
                // 🔥 DEVELOPMENT: Log OTP to console when email server is down
                console.log("\n" + "=".repeat(60));
                console.log("📧 EMAIL VERIFICATION OTP");
                console.log("=".repeat(60));
                console.log(`📨 Email: ${email}`);
                console.log(`🔑 OTP Code: ${otp}`);
                console.log(`⏰ Expires: 10 minutes`);
                console.log("=".repeat(60) + "\n");

                void resend.emails.send({
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
                }).then(response => {
                    console.log("✅ OTP email sent successfully:", response);
                }).catch(error => {
                    console.error("❌ Failed to send OTP email via Resend:", error);
                });
            },
        }),
        admin(),
    ],
});