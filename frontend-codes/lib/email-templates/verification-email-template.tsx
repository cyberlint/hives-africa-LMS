import { baseEmailLayout } from "@/domains/communications/base";
import { blocks } from "@/domains/communications/blocks";
import { renderEmailBlocks } from "@/domains/communications/renderers/email";

export function verificationEmail(otp: string) {
  const preheader =
    "Verify your email address";

  const contentBlocks = [
    blocks.text("Hello,"),

    blocks.text(
      "Welcome to NextHive. Use the verification code below to complete your email verification."
    ),

    blocks.callout(
      "Verification Code",
      otp,
      "highlight"
    ),

    blocks.text(
      "This verification code will expire in 10 minutes."
    ),

    blocks.text(
      "If you didn't create a NextHive account, you can safely ignore this email."
    ),
  ];

  return {
    subject: "Verify your email address",
    html: baseEmailLayout(
      renderEmailBlocks(contentBlocks),
      preheader
    ),
  };
}