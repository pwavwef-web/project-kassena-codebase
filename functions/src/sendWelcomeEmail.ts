import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import type * as nodemailer from "nodemailer";

const SMTP_USER = "francis@azlearner.me";
const SMTP_PASS = defineSecret("SMTP_PASS");

export const sendWelcomeEmail = onDocumentCreated(
  {
    document: "users/{userId}",
    secrets: [SMTP_PASS],
  },
  async (event) => {
    const snap = event.data;

    if (!snap) {
      logger.warn("No data in Firestore event for users document.");
      return;
    }

    const userData = snap.data();
    const { email, displayName } = userData;

    if (!email) {
      logger.warn(`No email found for new user ${event.params.userId}. Skipping welcome email.`);
      return;
    }

    const [{default: nodemailer}, {getWelcomeEmailHtml}] = await Promise.all([
      import("nodemailer"),
      import("./templates/welcomeEmail.js"),
    ]);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS.value(),
      },
    });

    const name = displayName || "there";
    const htmlContent = getWelcomeEmailHtml(name);

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Kasem App" <${SMTP_USER}>`,
      to: email,
      subject: "Welcome to Kasem App! 🌍",
      html: htmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`Welcome email sent successfully to ${email} (${name})`);
    } catch (error) {
      logger.error(`Failed to send welcome email to ${email}:`, error);
    }
  }
);
