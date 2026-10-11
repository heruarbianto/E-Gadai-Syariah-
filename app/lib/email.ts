import { BrevoClient } from "@getbrevo/brevo";

interface SendVerificationEmailParams {
  email: string;
  verificationUrl: string;
}

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

export async function sendVerificationEmail({
  email,
  verificationUrl,
}: SendVerificationEmailParams) {
  await brevo.transactionalEmails.sendTransacEmail({
    to: [{ email }],

    templateId: Number(
      process.env.BREVO_VERIFICATION_TEMPLATE_ID
    ),

    params: {
      VERIFICATION_URL: verificationUrl,
    },
  });

  return true;
}


export async function sendForgotPasswordEmail({
  email,
  resetUrl,
}: {
  email: string;
  resetUrl: string;
}) {
  await brevo.transactionalEmails.sendTransacEmail({
    to: [{ email }],

    templateId: Number(
      process.env.BREVO_RESET_PASSWORD_TEMPLATE_ID
    ),

    params: {
      RESET_URL: resetUrl,
    },
  });

  return true;
}