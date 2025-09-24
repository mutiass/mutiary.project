import { getTransporter } from '../config/mail.config.js';

export const sendEmailResetPassword = async (to, resetUrl) => {
  try {
    const transporter = getTransporter();

    await transporter.verify();
    console.log('✅ Email transporter is ready to send emails');

    const subject = 'Reset Password - Mutiary';
    const text = `Hello, 

We received a request to reset your password for your Mutiary account. 
To reset your password, please click the link below:

${resetUrl}

If the button does not work, you can copy and paste this link into your browser:
${resetUrl}

If you did not request a password reset, please ignore this email or contact support if you have any concerns.

Thank you,
Mutiary Support Team`;

    const html = `
      <p>Hello,</p>
      <p>We received a request to reset your password for your <b>Mutiary</b> account.</p>
      <p>To reset your password, please click the button below:</p>
      <p>
        <a href="${resetUrl}" target="_blank" 
          style="padding:10px 15px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
          Reset Password
        </a>
      </p>
      <p>If the button above doesn't work, please copy and paste the link below into your browser:</p>
      <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
      <p>Thank you,<br>Mutiary Support Team</p>
    `;

    const info = await transporter.sendMail({
      from: `"Mutiary Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`✅ Email sent to ${to} with Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw new Error('Email could not be sent');
  }
};
