import {
  Body, Button, Container, Head, Html, Preview, Section, Text, Heading,
} from "@react-email/components";
import * as React from "react";

export const ResetPasswordEmail = ({ url }: { url: string }) => (
  <Html>
    <Head />
    <Preview>Reset your NextHive password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={logo}>NextHive LMS</Heading>
        <Text style={paragraph}>Someone requested a password reset for your account.</Text>
        <Section style={btnContainer}>
          <Button style={button} href={url}>
            Reset Password
          </Button>
        </Section>
        <Text style={paragraph}>
          If you didn't request this, you can safely ignore this email.
        </Text>
        <Text style={paragraph}>
          Alternatively, copy and paste this link: <br />
          <span style={link}>{url}</span>
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = { backgroundColor: "#ffffff", fontFamily: 'system-ui, -apple-system, sans-serif' };
const container = { margin: "0 auto", padding: "20px 0 48px" };
const logo = { color: "#FDB606", fontSize: "28px", fontWeight: "bold" };
const paragraph = { fontSize: "16px", lineHeight: "26px" };
const btnContainer = { textAlign: "center" as const, margin: "32px 0" };
const button = { backgroundColor: "#FDB606", borderRadius: "5px", color: "#fff", fontSize: "16px", fontWeight: "bold", textDecoration: "none", textAlign: "center" as const, display: "block", padding: "12px" };
const link = { color: "#8898aa", fontSize: "14px" };