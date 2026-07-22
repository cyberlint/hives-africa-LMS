import { baseEmailLayout } from "@/domains/communications/base";
import { blocks } from "@/domains/communications/blocks";
import { renderEmailBlocks } from "@/domains/communications/renderers/email";

export function resetPasswordEmail(url: string) {
  const preheader =
    "Reset your password";

  const contentBlocks = [
    blocks.text("Hello,"),

    blocks.text(
      "We received a request to reset the password for your NextHive account."
    ),

    blocks.text(
      "Click the button below to choose a new password."
    ),

    blocks.cta(
      "Reset Password",
      url
    ),

    blocks.callout(
      "Link Expiry",
      "This password reset link will expire shortly for your security.",
      "warning"
    ),

    blocks.text(
      "If you didn't request a password reset, you can safely ignore this email. Your account remains secure."
    ),

    blocks.text(
      "If the button above doesn't work, copy and paste the following link into your browser:"
    ),

    blocks.callout(
      "Password Reset Link",
      url
    ),
  ];

  return {
    subject: "Reset your password",
    html: baseEmailLayout(
      renderEmailBlocks(contentBlocks),
      preheader
    ),
  };
}