import nodemailer from 'nodemailer';
import logger from './logger';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

const sendEmail = async (options: EmailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // TLS via STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // MUST be Gmail App Password (not normal password)
      },
      connectionTimeout: 10000,
    });

    // Verify SMTP connection
    await transporter.verify();
    logger.info('SMTP server is ready');

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'FocusedTube'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info('Email sent successfully', {
      to: options.email,
      messageId: info.messageId,
    });
  } catch (error: any) {
    logger.error('Error sending email', {
      email: options.email,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    throw new Error('Email could not be sent');
  }
};

export default sendEmail;