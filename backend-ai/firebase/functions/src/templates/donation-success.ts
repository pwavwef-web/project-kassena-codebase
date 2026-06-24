/* eslint-disable max-len */

type DonationSuccessEmailOptions = {
  appUrl: string;
  amount: number;
  date: string | Date;
  donorName: string;
  logoUrl: string;
  reference: string;
  supportEmail: string;
};

type SupporterLevel = {
  label: string;
  range: string;
};

const SUPPORTER_LEVELS: Array<SupporterLevel & {min: number}> = [
  {label: "Strategic Supporter", range: "GHS 500+", min: 500},
  {label: "Cultural Guardian", range: "GHS 100-499", min: 100},
  {label: "Language Champion", range: "GHS 50-99", min: 50},
  {label: "Community Supporter", range: "GHS 25-49", min: 25},
  {label: "Language Friend", range: "GHS 10-24", min: 10},
];

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    };

    return entities[character] || character;
  });

const getFirstName = (name: string): string => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return "Friend";
  }

  return trimmedName.split(/\s+/)[0] || "Friend";
};

const getSupporterLevel = (amount: number): SupporterLevel => {
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return (
    SUPPORTER_LEVELS.find((level) => safeAmount >= level.min) ||
    SUPPORTER_LEVELS[SUPPORTER_LEVELS.length - 1]
  );
};

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

const impactCards = [
  {
    title: "Contributor Rewards",
    body: "Support community members who contribute language data.",
  },
  {
    title: "Elder Validation",
    body: "Help experienced speakers verify language accuracy.",
  },
  {
    title: "Cultural Preservation",
    body: "Protect stories, proverbs, expressions, and heritage.",
  },
  {
    title: "Future AI Systems",
    body:
      "Help build translation and language technologies for future generations.",
  },
];

const renderImpactCard = (title: string, body: string): string => `
  <td class="stack-column" width="50%" style="padding:8px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="height:100%; border:1px solid #eadfca; border-radius:14px; background:#ffffff;">
      <tr>
        <td style="padding:18px 16px;">
          <p style="margin:0 0 8px 0; color:#0B4F3A; font-size:14px; font-weight:800; line-height:1.35;">
            <span style="display:inline-block; width:22px; height:22px; border-radius:999px; background:#0B4F3A; color:#ffffff; line-height:22px; text-align:center; font-size:13px; margin-right:8px;">&#10003;</span>
            ${escapeHtml(title)}
          </p>
          <p style="margin:0; color:#5a5145; font-size:13px; line-height:1.65;">${escapeHtml(body)}</p>
        </td>
      </tr>
    </table>
  </td>`;

export const getDonationSuccessEmailHtml = ({
  appUrl,
  amount,
  date,
  donorName,
  logoUrl,
  reference,
  supportEmail,
}: DonationSuccessEmailOptions): string => {
  const firstName = escapeHtml(getFirstName(donorName));
  const amountLabel = escapeHtml(formatAmount(amount));
  const dateLabel = escapeHtml(formatDate(date));
  const referenceLabel = escapeHtml(reference);
  const supporterLevel = getSupporterLevel(amount);
  const supporterLevelLabel = escapeHtml(supporterLevel.label);
  const supporterLevelRange = escapeHtml(supporterLevel.range);
  const websiteUrl = escapeHtml(appUrl);
  const supportUrl = escapeHtml(`${appUrl}/support`);
  const logoSrc = escapeHtml(logoUrl);
  const emailAddress = escapeHtml(supportEmail);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Thank You for Supporting Project Kasena</title>
  <style>
    @media only screen and (max-width: 620px) {
      .email-shell { width: 100% !important; }
      .mobile-padding { padding-left: 22px !important; padding-right: 22px !important; }
      .stack-column { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .cta-button { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#F8F5EE; font-family:Arial, Helvetica, sans-serif; color:#26352d;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Your support helps preserve Kasem language, culture, and identity for future generations.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F8F5EE; padding:32px 14px;">
    <tr>
      <td align="center">
        <table class="email-shell" width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:600px; max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #eadfca; box-shadow:0 20px 54px rgba(34, 39, 30, 0.12);">
          <tr>
            <td class="mobile-padding" align="center" style="padding:38px 40px 30px 40px; background:#ffffff;">
              <img src="${logoSrc}" width="72" height="72" alt="Project Kasena logo" style="display:block; border:0; outline:none; text-decoration:none; margin:0 auto 18px auto; border-radius:18px;" />
              <h1 style="margin:0; color:#0B4F3A; font-size:38px; line-height:1.05; font-weight:900;">Thank You</h1>
              <p style="margin:12px auto 0 auto; max-width:430px; color:#5a5145; font-size:15px; line-height:1.7;">
                Your support helps preserve language, culture, and identity for future generations.
              </p>
            </td>
          </tr>

          <tr>
            <td style="height:7px; background:linear-gradient(90deg, #0B4F3A 0%, #D4A017 52%, #C96C2D 100%);"></td>
          </tr>

          <tr>
            <td class="mobile-padding" style="padding:36px 40px 22px 40px;">
              <p style="margin:0 0 10px 0; color:#C96C2D; font-size:12px; line-height:1.4; font-weight:800; text-transform:uppercase; letter-spacing:1.4px;">
                You are now part of the preservation journey
              </p>
              <h2 style="margin:0 0 20px 0; color:#0B4F3A; font-size:26px; line-height:1.25; font-weight:900;">
                You Are Now Part of the Preservation Journey
              </h2>
              <p style="margin:0 0 16px 0; color:#403a31; font-size:15px; line-height:1.8;">Hello <strong style="color:#0B4F3A;">${firstName}</strong>,</p>
              <p style="margin:0 0 16px 0; color:#403a31; font-size:15px; line-height:1.8;">
                Thank you for supporting <strong style="color:#0B4F3A;">Project Kasena</strong>.
              </p>
              <p style="margin:0 0 16px 0; color:#403a31; font-size:15px; line-height:1.8;">
                Your contribution is helping us build digital tools, preserve cultural knowledge, support community contributors, and create the foundation for future Kasem language technology.
              </p>
              <p style="margin:0; color:#403a31; font-size:15px; line-height:1.8;">
                Every contribution matters. Because of people like you, our language can continue to thrive in the digital age.
              </p>
            </td>
          </tr>

          <tr>
            <td class="mobile-padding" style="padding:12px 40px 28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:16px; background:#fbfaf7; border:1px solid #eadfca; overflow:hidden;">
                <tr>
                  <td style="padding:20px 22px 8px 22px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="color:#0B4F3A; font-size:16px; font-weight:900;">Donation Summary</td>
                        <td align="right">
                          <span style="display:inline-block; padding:7px 11px; border-radius:999px; background:#e8f4ed; color:#0B4F3A; font-size:12px; font-weight:900;">Successful</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 22px 22px 22px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td class="stack-column" width="50%" style="padding:10px 12px 10px 0; border-bottom:1px solid #eadfca;">
                          <p style="margin:0 0 5px 0; color:#847968; font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:800;">Donation Amount</p>
                          <p style="margin:0; color:#0B4F3A; font-size:22px; line-height:1.25; font-weight:900;">${amountLabel}</p>
                        </td>
                        <td class="stack-column" width="50%" style="padding:10px 0 10px 12px; border-bottom:1px solid #eadfca;">
                          <p style="margin:0 0 5px 0; color:#847968; font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:800;">Supporter Level</p>
                          <p style="margin:0; color:#C96C2D; font-size:15px; line-height:1.4; font-weight:900;">${supporterLevelLabel}</p>
                        </td>
                      </tr>
                      <tr>
                        <td class="stack-column" width="50%" style="padding:14px 12px 0 0;">
                          <p style="margin:0 0 5px 0; color:#847968; font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:800;">Reference</p>
                          <p style="margin:0; color:#403a31; font-size:13px; line-height:1.55; font-weight:800; word-break:break-word;">${referenceLabel}</p>
                        </td>
                        <td class="stack-column" width="50%" style="padding:14px 0 0 12px;">
                          <p style="margin:0 0 5px 0; color:#847968; font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:800;">Date</p>
                          <p style="margin:0; color:#403a31; font-size:13px; line-height:1.55; font-weight:800;">${dateLabel}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="mobile-padding" style="padding:0 40px 28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:16px; background:#0B4F3A;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 7px 0; color:#D4A017; font-size:12px; text-transform:uppercase; letter-spacing:1.2px; font-weight:900;">Supporter Recognition</p>
                    <p style="margin:0 0 11px 0; color:#ffffff; font-size:22px; line-height:1.25; font-weight:900;">${supporterLevelLabel}</p>
                    <span style="display:inline-block; padding:7px 12px; border-radius:999px; background:#ffffff; color:#0B4F3A; font-size:12px; font-weight:900;">${supporterLevelRange}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="mobile-padding" style="padding:0 32px 30px 32px;">
              <h2 style="margin:0 8px 12px 8px; color:#0B4F3A; font-size:21px; line-height:1.3; font-weight:900;">What Your Support Makes Possible</h2>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  ${impactCards.slice(0, 2).map((card) => renderImpactCard(card.title, card.body)).join("")}
                </tr>
                <tr>
                  ${impactCards.slice(2).map((card) => renderImpactCard(card.title, card.body)).join("")}
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="mobile-padding" style="padding:0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:16px; background:#F8F5EE; border:1px solid #eadfca;">
                <tr>
                  <td style="padding:26px 24px;">
                    <p style="margin:0 0 14px 0; color:#0B4F3A; font-size:20px; line-height:1.55; font-weight:900;">
                      "When a language disappears, a unique way of seeing the world disappears with it."
                    </p>
                    <p style="margin:0 0 12px 0; color:#403a31; font-size:14px; line-height:1.8;">
                      Project Kasena exists to ensure the Kasem language remains visible, accessible, and relevant in the digital age.
                    </p>
                    <p style="margin:0; color:#403a31; font-size:14px; line-height:1.8;">
                      Your contribution helps make that vision possible.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="mobile-padding" align="center" style="padding:0 40px 34px 40px;">
              <a class="cta-button" href="${supportUrl}" style="display:inline-block; background:#0B4F3A; color:#ffffff; text-decoration:none; padding:15px 28px; border-radius:12px; font-size:15px; line-height:1.2; font-weight:900;">View Project Impact</a>
              <div style="height:13px; line-height:13px;">&nbsp;</div>
              <a href="${websiteUrl}" style="display:inline-block; color:#C96C2D; text-decoration:none; font-size:14px; line-height:1.4; font-weight:900;">Share Project Kasena</a>
            </td>
          </tr>

          <tr>
            <td class="mobile-padding" style="padding:0 40px 34px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-top:1px solid #eadfca;">
                <tr>
                  <td style="padding-top:26px;">
                    <p style="margin:0 0 16px 0; color:#403a31; font-size:15px; line-height:1.8;">
                      Thank you for believing that every language deserves a place in the future.
                    </p>
                    <p style="margin:0 0 18px 0; color:#403a31; font-size:15px; line-height:1.8;">
                      Together, we are preserving Kasem for generations to come.
                    </p>
                    <p style="margin:0; color:#5a5145; font-size:14px; line-height:1.7;">With gratitude,</p>
                    <p style="margin:2px 0 0 0; color:#0B4F3A; font-size:16px; line-height:1.6; font-weight:900;">The Project Kasena Team</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:28px 34px; background:#0B4F3A;">
              <p style="margin:0 0 5px 0; color:#D4A017; font-size:16px; line-height:1.4; font-weight:900;">Project Kasena</p>
              <p style="margin:0 0 16px 0; color:#e9f0eb; font-size:13px; line-height:1.65;">
                Preserving Our Language.<br />
                Empowering Our People.
              </p>
              <p style="margin:0 0 14px 0; color:#dce8e2; font-size:12px; line-height:1.8;">
                <a href="${websiteUrl}" style="color:#ffffff; text-decoration:none; font-weight:800;">Website</a>
                <span style="color:#D4A017;">&nbsp;|&nbsp;</span>
                <a href="mailto:${emailAddress}" style="color:#ffffff; text-decoration:none; font-weight:800;">Support Email</a>
                <span style="color:#D4A017;">&nbsp;|&nbsp;</span>
                <a href="${websiteUrl}" style="color:#ffffff; text-decoration:none; font-weight:800;">Social Links</a>
              </p>
              <p style="margin:0; color:#b8cec4; font-size:11px; line-height:1.6;">
                &copy; ${new Date().getFullYear()} Project Kasena. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
