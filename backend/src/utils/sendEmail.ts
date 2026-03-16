import { Resend } from "resend";
import logger from "./logger";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

const sendEmail = async (options: EmailOptions) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "FocusedTube <onboarding@resend.dev>",
      to: options.email,
      subject: options.subject,
      html: options.html || `<p>${options.message}</p>`
    });

    if (error) throw error;

    logger.info("Email sent", data);

  } catch (error: any) {
    logger.error("Email failed", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;