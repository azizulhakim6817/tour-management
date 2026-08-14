/* eslint-disable no-console */
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { envVars } from "../app/config/env.js";

const transporter = nodemailer.createTransport({
  host: envVars.SMTP_HOST,
  port: Number(envVars.SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
  },
});

interface ISendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, unknown>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: ISendEmailOptions) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "app",
    "templates",
    `${templateName}.ejs`,
  );

  const html = await ejs.renderFile(templatePath, templateData);

  const info = await transporter.sendMail({
    from: envVars.SMTP_FROM,
    to: to,
    subject: subject,
    html: html,
    attachments: attachments?.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
      contentType: attachment.contentType,
    })),
  });

  console.log(`✉️ Email sent to ${to}: ${info.messageId}`);

  return info;
};
