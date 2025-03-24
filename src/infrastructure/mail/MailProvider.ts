import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { config } from '@core/config/env';

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: Number(config.mail.port),
  secure: false,
  auth: {
    user: config.mail.user,
    pass: config.mail.password,
  },
});

/**
 * Envoie un email à un utilisateur avec un lien pour définir son mot de passe
 * @param to Adresse email du destinataire
 * @param token Token unique à usage temporaire
 */
export async function sendFirstLoginEmail(
  to: string,
  token: string
): Promise<void> {
  const filePath = path.resolve('resources/template/mail/first-login.html');
  let html = fs.readFileSync(filePath, 'utf-8');

  const link = `${config.server.frontend}/set-password?token=${token}`;
  html = html.replace('{{link}}', link);

  await transporter.sendMail({
    from: '"Services Financiers Étudiants" <no-reply@services-financiers-etudiants.com>',
    to,
    subject: 'Définissez votre mot de passe - Services Financiers Étudiants',
    html,
  });
}

export async function sendResetPasswordEmail(
  to: string,
  token: string
): Promise<void> {
  let html = fs.readFileSync(
    'resources/template/mail/reset-password.html',
    'utf-8'
  );
  const link = `${config.server.frontend}/reset-password?token=${token}`;
  html = html.replace('{{link}}', link);

  await transporter.sendMail({
    from: '"Services Financiers Étudiants" <no-reply@services-financiers-etudiants.com>',
    to,
    subject: 'Réinitialisation de votre mot de passe',
    html,
  });
}
