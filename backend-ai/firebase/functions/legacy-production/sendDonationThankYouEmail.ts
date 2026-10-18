import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import type * as nodemailer from "nodemailer";
import {getDonationSuccessEmailHtml} from "./templates/donation-success.js";

export const DONATION_EMAIL_SMTP_PASS = defineSecret("SMTP_PASS");

type DonationThankYouEmailParams = {
  amount: number;
  date: string | Date;
  email: string;
  name: string;
  reference: string;
};

type DonationThankYouEmailDelivery = {
  attempts: number;
  messageId?: string;
  status: "sent";
};

const SMTP_USER = "francis@azlearner.me";
const SUPPORT_EMAIL = "francis@azlearner.me";
const APP_URL = "https://project-kassena-7e026.web.app";
const LOGO_URL = `${APP_URL}/favicon.png`;
const DONATION_EMAIL_SUBJECT =
  "Thank You for Supporting Project Kasena \u2764\uFE0F";
const MAX_SEND_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [0, 1000, 3000];

const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const formatAmount = (amount: number): string => {
  const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
  const hasPesewas = !Number.isInteger(safeAmount);

  return `GHS ${safeAmount.toLocaleString("en-GH", {
    maximumFractionDigits: 2,
    minimumFractionDigits: hasPesewas ? 2 : 0,
  })}`;
};

const formatDate = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value);

  if (!Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("en-GH", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Africa/Accra",
    }).format(date);
  }

  return typeof value === "string" && value.trim() ? value.trim() : "Today";
};

const getPlainTextEmail = ({
  amount,
  date,
  name,
  reference,
}: DonationThankYouEmailParams): string => {
  const firstName = name.trim().split(/\s+/)[0] || "Friend";

  return [
    `Hello ${firstName},`,
    "",
    "Thank you for supporting Project Kasena.",
    "",
    "You are now part of the preservation journey. Your contribution is " +
      "helping us build digital tools, preserve cultural knowledge, " +
      "support community contributors, and create the foundation for future " +
      "Kasem language technology.",
    "",
    `Donation Amount: ${formatAmount(amount)}`,
    `Reference: ${reference}`,
    `Date: ${formatDate(date)}`,
    "Status: Successful",
    "",
    "What your support makes possible:",
    "- Contributor Rewards",
    "- Elder Validation",
    "- Cultural Preservation",
    "- Future AI Systems",
    "",
    "Thank you for believing that every language deserves a place in the " +
      "future.",
    "Together, we are preserving Kasem for generations to come.",
    "",
    "With gratitude,",
    "The Project Kasena Team",
    "",
    `View Project Impact: ${APP_URL}/support`,
    `Share Project Kasena: ${APP_URL}`,
  ].join("\n");
};

export const sendDonationThankYouEmail = async (
  params: DonationThankYouEmailParams,
): Promise<DonationThankYouEmailDelivery> => {
  const recipient = params.email.trim();

  if (!recipient) {
    throw new Error("Donation thank-you email requires a recipient address.");
  }

  const smtpPassword = DONATION_EMAIL_SMTP_PASS.value();

  if (!smtpPassword) {
    throw new Error("SMTP_PASS is not configured.");
  }

  const [{default: nodemailerModule}] = await Promise.all([
    import("nodemailer"),
  ]);
  const transporter = nodemailerModule.createTransport({
    auth: {
      pass: smtpPassword,
      user: SMTP_USER,
    },
    service: "gmail",
  });
  const html = getDonationSuccessEmailHtml({
    amount: params.amount,
    appUrl: APP_URL,
    date: params.date,
    donorName: params.name,
    logoUrl: LOGO_URL,
    reference: params.reference,
    supportEmail: SUPPORT_EMAIL,
  });
  const mailOptions: nodemailer.SendMailOptions = {
    from: `"Project Kasena" <${SMTP_USER}>`,
    html,
    subject: DONATION_EMAIL_SUBJECT,
    text: getPlainTextEmail(params),
    to: recipient,
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_SEND_ATTEMPTS; attempt += 1) {
    const delay = RETRY_DELAYS_MS[attempt - 1] || 0;

    if (delay > 0) {
      await wait(delay);
    }

    try {
      const info = await transporter.sendMail(mailOptions);

      logger.info("Donation thank-you email sent.", {
        attempt,
        email: recipient,
        messageId: info.messageId,
        reference: params.reference,
      });

      return {
        attempts: attempt,
        messageId: info.messageId,
        status: "sent",
      };
    } catch (error) {
      lastError = error;
      logger.warn("Donation thank-you email delivery attempt failed.", {
        attempt,
        email: recipient,
        error: getErrorMessage(error),
        maxAttempts: MAX_SEND_ATTEMPTS,
        reference: params.reference,
      });
    }
  }

  logger.error("Donation thank-you email failed after retries.", {
    attempts: MAX_SEND_ATTEMPTS,
    email: recipient,
    error: getErrorMessage(lastError),
    reference: params.reference,
  });

  throw lastError instanceof Error ?
    lastError :
    new Error("Donation thank-you email failed.");
};
