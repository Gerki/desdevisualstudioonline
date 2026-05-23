// lib/email.ts
// Transactional email service using Resend

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  await resend.emails.send({
    from: "noreply@visualgv.com",
    to: email,
    subject: "Welcome to visualgv.com",
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Your visualgv.com account has been created successfully.</p>
      <p>Start managing your advertising campaigns today.</p>
    `,
  });
}

/**
 * Send organization invitation
 */
export async function sendInvitationEmail(
  email: string,
  organizationName: string,
  inviteLink: string
): Promise<void> {
  await resend.emails.send({
    from: "noreply@visualgv.com",
    to: email,
    subject: `You're invited to ${organizationName} on visualgv.com`,
    html: `
      <h1>You're invited!</h1>
      <p>You've been invited to join <strong>${organizationName}</strong> on visualgv.com</p>
      <p><a href="${inviteLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Accept Invitation</a></p>
    `,
  });
}

/**
 * Send print order notification
 */
export async function sendPrintOrderNotification(
  email: string,
  campaignName: string,
  orderId: string
): Promise<void> {
  await resend.emails.send({
    from: "noreply@visualgv.com",
    to: email,
    subject: `New print order for ${campaignName}`,
    html: `
      <h1>New Print Order</h1>
      <p>A new print order has been created for campaign <strong>${campaignName}</strong></p>
      <p>Order ID: ${orderId}</p>
      <p>Log in to visualgv.com to view details and manage your order.</p>
    `,
  });
}
