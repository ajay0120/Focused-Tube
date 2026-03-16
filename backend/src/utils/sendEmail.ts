import nodemailer from 'nodemailer';
import logger from './logger';

interface EmailOptions {
  email: string;
  subject: string;
  message: string; // main content (OTP / text / etc)
}

/**
 * FocusedTube HTML Email Template
 */
const generateTemplate = (content: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>

  <body style="margin:0;padding:0;background:#0f0f0f;font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;background:#0f0f0f;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#1c1c1c;border-radius:10px;padding:30px;color:#ffffff;">

            <!-- HEADER -->
            <tr>
              <td align="center" style="padding-bottom:15px;">
                <h1 style="margin:0;color:#ff0000;font-size:28px;">FocusedTube</h1>
                <p style="margin:5px 0 0;color:#aaa;font-size:14px;">
                  Watch smarter. Stay focused.
                </p>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:20px 0;font-size:16px;line-height:1.6;color:#e4e4e4;">
                ${content}
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td align="center" style="padding:20px 0;">
                <a href="https://focusedtube.vercel.app"
                  style="
                    background:#ff0000;
                    color:#ffffff;
                    padding:12px 25px;
                    text-decoration:none;
                    font-size:16px;
                    border-radius:6px;
                    font-weight:bold;
                    display:inline-block;
                  ">
                  Open FocusedTube
                </a>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="text-align:center;padding-top:15px;">
                <hr style="border:none;border-top:1px solid #333;margin:20px 0;" />
                <p style="margin:0;font-size:13px;color:#888;">
                  You received this email because you use FocusedTube.
                </p>
                <p style="margin:6px 0 0;font-size:13px;color:#888;">
                  © ${new Date().getFullYear()} FocusedTube
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};

const sendEmail = async (options: EmailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // must be Gmail App Password
      },
      connectionTimeout: 10000,
    });

    await transporter.verify();
    logger.info('SMTP ready');

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'FocusedTube'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: generateTemplate(options.message),
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info('Email sent', {
      to: options.email,
      messageId: info.messageId,
    });

  } catch (error: any) {
    logger.error('Email error', {
      email: options.email,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
