export function getOtpEmailHtml(otp: string, type: "verification" | "reset") {
  const title = type === "verification" ? "Verify your email" : "Reset your password";
  const description = type === "verification"
    ? "Please use the verification code below to complete your registration."
    : "Please use the verification code below to reset your password.";

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #111111; font-size: 24px; font-weight: 600; margin: 0;">${title}</h1>
      </div>
      <p style="color: #555555; text-align: center; font-size: 16px; line-height: 24px; margin-bottom: 32px;">
        ${description}
      </p>
      <div style="background-color: #fafafa; border: 1px solid #eaeaea; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 32px;">
        <span style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #000000; margin-left: 12px;">${otp}</span>
      </div>
      <p style="color: #888888; text-align: center; font-size: 14px; line-height: 24px;">
        This code will expire in <strong>15 minutes</strong>.<br>
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;
}
