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
      <div style="font-family: Arial, sans-serif; color: #222; background-color: #fff; padding: 20px; border-radius: 8px;">
        <p style="color:#222;">Hello,</p>
        <p style="color:#222;">
          We received a request to reset your password for your <b>Mutiary</b> account.
        </p>
        <p style="color:#222;">To reset your password, please click the button below:</p>
        <p>
          <a href="${resetUrl}" target="_blank" 
            style="display:inline-block; padding:10px 15px; background:#4CAF50; color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;">
            Reset Password
          </a>
        </p>
        <p style="font-size:12px; color:#999; margin-top:20px;">
          If the button above doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" target="_blank" style="color:#4CAF50; word-break:break-all;">
            ${resetUrl}
          </a>
        </p>
        <p style="color:#222;">
          If you did not request a password reset, please ignore this email or contact support if you have any concerns.
        </p>
        <p style="color:#222;">Thank you,<br>Mutiary Support Team</p>
      </div>
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
