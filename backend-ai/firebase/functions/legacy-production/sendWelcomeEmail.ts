import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import type * as nodemailer from "nodemailer";

const SMTP_USER = "francis@azlearner.me";
const SMTP_PASS = defineSecret("SMTP_PASS");
const APP_URL = "https://project-kassena-7e026.web.app";
const LOGO_URL = `${APP_URL}/favicon.png`;
const SIGNUP_ALERT_RECIPIENT = "francis@azlearner.me";

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
    const userId = event.params.userId;

    if (!email) {
      logger.warn(`No email found for new user ${userId}. Skipping welcome email.`);
      return;
    }

    const [{default: nodemailer}, {getWelcomeEmailHtml}] = await Promise.all([
      import("nodemailer"),
      import("./templates/welcomeEmail.js"),
    ]);
    const {getSignupAlertEmailHtml} = await import("./templates/signupAlertEmail.js");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS.value(),
      },
    });

    const name = displayName || "there";
    const htmlContent = getWelcomeEmailHtml({
      appUrl: APP_URL,
      displayName: name,
      logoUrl: LOGO_URL,
    });
    const adminHtmlContent = getSignupAlertEmailHtml({
      appUrl: APP_URL,
      createdAt: userData.createdAt,
      displayName: userData.displayName,
      email: userData.email,
      logoUrl: LOGO_URL,
      photoURL: userData.photoURL,
      role: userData.role,
      uid: userId,
      userData,
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Kasem App" <${SMTP_USER}>`,
      to: email,
      subject: "Welcome to Kasem App! 🌍",
      html: htmlContent,
    };

    const signupAlertMailOptions: nodemailer.SendMailOptions = {
      from: `"Kasem App" <${SMTP_USER}>`,
      to: SIGNUP_ALERT_RECIPIENT,
      subject: `New signup: ${name}`,
      html: adminHtmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`Welcome email sent successfully to ${email} (${name})`);

      try {
        await transporter.sendMail(signupAlertMailOptions);
        logger.info(`Signup alert sent successfully to ${SIGNUP_ALERT_RECIPIENT} for ${email}`);
      } catch (error) {
        logger.error(`Failed to send signup alert to ${SIGNUP_ALERT_RECIPIENT} for ${email}:`, error);
      }
    } catch (error) {
      logger.error(`Failed to send welcome email to ${email}:`, error);
    }
  },
);
