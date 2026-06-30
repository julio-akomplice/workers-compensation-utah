import nodemailer from 'nodemailer'

// Brevo (Sendinblue) SMTP relay.
// Host/port default to Brevo's standard STARTTLS relay; override via env if needed.
export function createEmailTransport() {
  return nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: Number(process.env.BREVO_SMTP_PORT) || 587,
    secure: false, // STARTTLS on 587
    auth: {
      user: process.env.BREVO_SMTP_LOGIN,
      pass: process.env.BREVO_SMTP_KEY,
    },
  })
}
