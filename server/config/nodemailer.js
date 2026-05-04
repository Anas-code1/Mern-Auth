import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,         // Switch back to 587
    secure: false,     // Must be false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false // <-- THIS IS THE MAGIC FIX FOR RENDER
    }
});

export default transporter;