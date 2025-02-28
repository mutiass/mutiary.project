import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Email pengirim
      pass: process.env.EMAIL_PASS, // App Password Gmail
    },
  });
}
