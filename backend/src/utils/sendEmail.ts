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
            service: 'gmail', // Or use host/port from env
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `${process.env.FROM_NAME || 'FocusedTube'} <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${options.email}: ${info.messageId}`);
    } catch (error) {
        logger.error(`Error sending email to ${options.email}:`, error);
        throw new Error('Email could not be sent');
    }
};

export default sendEmail;
