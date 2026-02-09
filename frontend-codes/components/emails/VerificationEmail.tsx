import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from "@react-email/components";
import * as React from "react";

export const VerificationEmail = ({ otp }: { otp: string }) => (
  <Html>
    <Head />
    <Preview>Your NextHive verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={logo}>NextHive LMS</Heading>
        <Text style={paragraph}>Hello,</Text>
        <Text style={paragraph}>
          Thank you for joining NextHive. Please use the verification code below to complete your registration:
        </Text>
        <Section style={codeContainer}>
          <Text style={codeText}>{otp}</Text>
        </Section>
        <Text style={paragraph}>This code will expire in 10 minutes.</Text>
        <Hr style={hr} />
        <Text style={footer}>Hives Africa, Lagos, Nigeria</Text>
      </Container>
    </Body>
  </Html>
);

const main = { backgroundColor: "#ffffff", fontFamily: 'system-ui, -apple-system, sans-serif' };
const container = { margin: "0 auto", padding: "20px 0 48px" };
const logo = { color: "#FDB606", fontSize: "28px", fontWeight: "bold" };
const paragraph = { fontSize: "16px", lineHeight: "26px" };
const codeContainer = { background: "#F4F4F4", borderRadius: "4px", margin: "16px 0", padding: "24px", textAlign: "center" as const };
const codeText = { color: "#000", fontSize: "36px", fontWeight: "bold", letterSpacing: "8px" };
const hr = { borderColor: "#cccccc", margin: "20px 0" };
const footer = { color: "#8898aa", fontSize: "12px" };