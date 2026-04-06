// =============================================================================
// server/src/lib/email.ts — Brevo email service
// =============================================================================

import * as Brevo from '@sib-swiss/brevo-node';
import { config } from '../config';
import { logger } from './logger';

const client = new Brevo.TransactionalEmailsApi();
client.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, config.brevo.apiKey);

interface SendEmailOptions {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
}

async function sendEmail(opts: SendEmailOptions): Promise<void> {
  if (!config.brevo.apiKey) {
    logger.warn({ to: opts.to.email, subject: opts.subject }, 'Brevo API key not set — skipping email');
    return;
  }

  const email = new Brevo.SendSmtpEmail();
  email.sender = { email: config.brevo.fromEmail, name: config.brevo.fromName };
  email.to = [{ email: opts.to.email, name: opts.to.name }];
  email.subject = opts.subject;
  email.htmlContent = opts.htmlContent;

  await client.sendTransacEmail(email);
  logger.info({ to: opts.to.email, subject: opts.subject }, 'Email sent via Brevo');
}

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------

export async function sendInvitationEmail(opts: {
  to: { email: string; name: string };
  invitedByName: string;
  inviteUrl: string;
}): Promise<void> {
  await sendEmail({
    to: opts.to,
    subject: `${opts.invitedByName} tě zve do Mo.one Brand workspace`,
    htmlContent: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0f0f0f; color: #ffffff; padding: 40px 32px; border-radius: 12px;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">Mo.one</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Byl/a jsi pozván/a do Brand workspace</h1>
        <p style="color: #a3a3a3; margin: 0 0 8px;">${opts.invitedByName} tě zve ke spolupráci na Mo.one Corporate Identity.</p>
        <p style="color: #a3a3a3; margin: 0 0 32px;">Klikni na tlačítko níže a nastav si heslo.</p>
        <a href="${opts.inviteUrl}" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">Přijmout pozvánku</a>
        <p style="color: #525252; font-size: 13px; margin: 32px 0 0;">Odkaz vyprší za 72 hodin. Pokud jsi pozvánku nečekal/a, ignoruj tento email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(opts: {
  to: { email: string; name: string };
  resetUrl: string;
}): Promise<void> {
  await sendEmail({
    to: opts.to,
    subject: 'Resetování hesla — Mo.one Brand',
    htmlContent: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0f0f0f; color: #ffffff; padding: 40px 32px; border-radius: 12px;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">Mo.one</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Resetování hesla</h1>
        <p style="color: #a3a3a3; margin: 0 0 32px;">Klikni na tlačítko níže a nastav si nové heslo. Odkaz platí 1 hodinu.</p>
        <a href="${opts.resetUrl}" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">Nastavit nové heslo</a>
        <p style="color: #525252; font-size: 13px; margin: 32px 0 0;">Pokud jsi reset nepožadoval/a, ignoruj tento email.</p>
      </div>
    `,
  });
}
