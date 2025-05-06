import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { config } from '@core/config/env';
import { PrismaClient } from '@prisma/client';
import { ClientFileDTO } from '@features/clientFile/presentation/dto/ClientFileDTO';
import { logger } from '@core/config/logger';

const prisma = new PrismaClient();

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
  const filePath = path.resolve('src/resources/template/mail/first-login.html');
  let html = fs.readFileSync(filePath, 'utf-8');

  const link = `${config.server.frontend}/auth/set-password?token=${token}`;
  html = html.replace('{{link}}', link);

  await transporter.sendMail({
    from: '"Services Financiers Étudiants" <no-reply@sf-e.ca>',
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
    'src/resources/template/mail/reset-password.html',
    'utf-8'
  );
  const link = `${config.server.frontend}/auth/reset-password?token=${token}`;
  html = html.replace('{{link}}', link);

  await transporter.sendMail({
    from: '"Services Financiers Étudiants" <no-reply@sf-e.ca>',
    to,
    subject: 'Réinitialisation de votre mot de passe',
    html,
  });
}

/**
 * Envoie un mail de notification au super admin lorsqu’un utilisateur demande la suppression de son compte
 */
export async function sendAccountDeletionRequestEmail(
  userId: string,
  reason: string
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const htmlTemplate = fs.readFileSync(
    path.resolve('src/resources/template/mail/delete-account-request.html'),
    'utf-8'
  );

  const html = htmlTemplate
    .replace('{{firstname}}', user.firstname)
    .replace('{{lastname}}', user.lastname)
    .replace('{{email}}', user.email)
    .replace('{{username}}', user.username)
    .replace('{{reason}}', reason);

  await transporter.sendMail({
    from: '"Services Financiers Étudiants" <no-reply@sf-e.ca>',
    to: config.mail.admin,
    subject: 'Demande de suppression de compte utilisateur',
    html,
  });
}

/**
 * Envoie la fiche client au format PDF par email au client concerné
 */
export async function sendClientFileFinalValidationEmail(
  clientFile: ClientFileDTO
): Promise<void> {
  if (!clientFile || !clientFile.email) {
    logger.warn('Aucune adresse email liée à la fiche client.');
    return;
  }

  const htmlTemplate = fs.readFileSync(
    path.resolve(
      'src/resources/template/mail/client-file-final-validation.html'
    ),
    'utf-8'
  );

  const html = htmlTemplate
    .replace('{{firstName}}', clientFile.firstName ?? '')
    .replace('{{lastName}}', clientFile.lastName ?? '')
    .replace('{{reference}}', clientFile.reference);

  await transporter.sendMail({
    from: '"Services Financiers Etudiants Cameroun" <no-reply@sf-e.ca>',
    to: clientFile.email,
    subject: `Votre fiche client est validée - Réf. ${clientFile.reference}`,
    html,
  });
}

export async function sendClientFileAdminValidationEmail(
  to: string,
  reference: string
) {
  const html = fs
    .readFileSync(
      path.resolve(
        'src/resources/template/mail/client-file-awaiting-admin.html'
      ),
      'utf-8'
    )
    .replace('{{reference}}', reference);

  await transporter.sendMail({
    from: '"Services Financiers Etudiants Cameroun" <no-reply@sf-e.ca>',
    to,
    subject: `Nouvelle fiche à valider - Réf. ${reference}`,
    html,
  });
}

export async function sendClientFileSuperAdminValidationEmail(
  to: string,
  reference: string
) {
  const html = fs
    .readFileSync(
      path.resolve(
        'src/resources/template/mail/client-file-awaiting-superadmin.html'
      ),
      'utf-8'
    )
    .replace('{{reference}}', reference);

  await transporter.sendMail({
    from: '"Services Financiers Etudiants Cameroun" <no-reply@sf-e.ca>',
    to,
    subject: `Validation finale requise - Réf. ${reference}`,
    html,
  });
}

export async function sendClientFileRejectedEmail(
  to: string,
  reference: string,
  reason: string
) {
  const html = fs
    .readFileSync(
      path.resolve('src/resources/template/mail/client-file-rejected.html'),
      'utf-8'
    )
    .replace('{{reference}}', reference)
    .replace('{{reason}}', reason);

  await transporter.sendMail({
    from: '"Services Financiers Etudiants Cameroun" <no-reply@sf-e.ca>',
    to,
    subject: `Fiche client rejetée - Réf. ${reference}`,
    html,
  });
}
