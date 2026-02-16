const styles = {
  main: 'background-color: #ffffff; font-family: system-ui, -apple-system, sans-serif;',
  container: 'margin: 0 auto; padding: 20px 0 48px; max-width: 600px;',
  logo: 'color: #FDB606; font-size: 28px; font-weight: bold; margin-bottom: 24px;',
  paragraph: 'font-size: 16px; line-height: 26px; color: #333;',
  codeContainer: 'background: #F4F4F4; border-radius: 4px; margin: 16px 0; padding: 24px; text-align: center;',
  codeText: 'color: #000; font-size: 36px; font-weight: bold; letter-spacing: 8px;',
  button: 'background-color: #FDB606; border-radius: 5px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; text-align: center; display: inline-block; padding: 12px 24px;',
  footer: 'color: #8898aa; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;'
};

export const VerificationEmail = (otp: string) => `
  <div style="${styles.main}">
    <div style="${styles.container}">
      <h1 style="${styles.logo}">NextHive LMS</h1>
      <p style="${styles.paragraph}">Hello,</p>
      <p style="${styles.paragraph}">Thank you for joining NextHive. Use the code below to complete registration:</p>
      <div style="${styles.codeContainer}">
        <span style="${styles.codeText}">${otp}</span>
      </div>
      <p style="${styles.paragraph}">This code will expire in 10 minutes.</p>
      <div style="${styles.footer}">NextHive. <a href="https://www.hives.africa" style="color: #FDB606;">www.hives.africa</a></div>
    </div>
  </div>
`;

export const ResetPasswordEmail = (url: string) => `
  <div style="${styles.main}">
    <div style="${styles.container}">
      <h1 style="${styles.logo}">NextHive LMS</h1>
      <p style="${styles.paragraph}">Someone requested a password reset for your account.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${url}" style="${styles.button}">Reset Password</a>
      </div>
      <p style="${styles.paragraph}">If you didn't request this, you can safely ignore this email.</p>
      <p style="${styles.paragraph}">Alternatively, copy and paste this link: <br />
        <span style="color: #8898aa; font-size: 14px; word-break: break-all;">${url}</span>
      </p>
    </div>
  </div>
`;
