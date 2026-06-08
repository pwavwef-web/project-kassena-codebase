export const getWelcomeEmailHtml = (displayName: string): string => {
  const firstName = displayName.split(" ")[0] || "Friend";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Kasem App</title>
</head>
<body style="margin:0; padding:0; background-color:#fffaf0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffaf0; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(20,83,45,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #14532d 0%, #1a6b3a 50%, #14532d 100%); padding:48px 40px; text-align:center;">
              <div style="font-size:40px; margin-bottom:8px;">🌍</div>
              <h1 style="color:#caa54a; font-size:28px; margin:0 0 4px 0; font-weight:700; letter-spacing:1px;">KASEM APP</h1>
              <p style="color:#f5eddc; font-size:13px; margin:0; letter-spacing:2px; text-transform:uppercase; opacity:0.85;">Preserving Language. Empowering Culture.</p>
            </td>
          </tr>

          <!-- Gold Accent Bar -->
          <tr>
            <td style="height:4px; background: linear-gradient(90deg, #caa54a, #c96a2d, #caa54a);"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px 32px 40px;">

              <p style="color:#333; font-size:17px; margin:0 0 24px 0; line-height:1.6;">
                Hi <strong style="color:#14532d;">${firstName}</strong>,
              </p>

              <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 28px 0;">
                Welcome to <strong style="color:#14532d;">Kasem App</strong> — a community-driven platform dedicated to preserving and celebrating the <strong>Kasem language</strong> and culture. We're absolutely thrilled to have you join us on this meaningful journey.
              </p>

              <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 28px 0;">
                Every word you contribute, every phrase you share, and every story you tell helps keep our heritage alive for generations to come. Together, we are building something truly special.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="https://kassena-app.web.app/dashboard" style="display:inline-block; background: linear-gradient(135deg, #c96a2d, #caa54a); color:#ffffff; text-decoration:none; padding:16px 44px; border-radius:50px; font-size:16px; font-weight:600; letter-spacing:0.5px; box-shadow:0 4px 16px rgba(201,106,45,0.3);">
                      Get Started →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Feature Cards -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#f5eddc; border-radius:12px; padding:28px 28px; border-left:4px solid #14532d;">
                    <h3 style="color:#14532d; font-size:16px; margin:0 0 14px 0;">Here's what you can do:</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0; color:#444; font-size:14px; line-height:1.6;">📖&nbsp;&nbsp;<strong>Contribute Words</strong> — Add Kasem words and phrases to our growing dictionary</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#444; font-size:14px; line-height:1.6;">🎤&nbsp;&nbsp;<strong>Record Audio</strong> — Share authentic pronunciations for future learners</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#444; font-size:14px; line-height:1.6;">📚&nbsp;&nbsp;<strong>Explore the Dictionary</strong> — Discover and search Kasem words anytime</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#444; font-size:14px; line-height:1.6;">🏆&nbsp;&nbsp;<strong>Earn Rewards</strong> — Climb the leaderboard and unlock achievements</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color:#444; font-size:15px; line-height:1.7; margin:0 0 8px 0;">
                We can't wait to see the incredible contributions you'll make. If you ever need help, have questions, or just want to say hello — we're always here for you.
              </p>

            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:0 40px 36px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e8e0d0;">
                <tr>
                  <td style="padding-top:28px;">
                    <p style="color:#555; font-size:15px; margin:0 0 4px 0;">With warmth and gratitude,</p>
                    <p style="color:#14532d; font-size:17px; font-weight:700; margin:0 0 2px 0;">Francis Pwavwe</p>
                    <p style="color:#c96a2d; font-size:13px; margin:0 0 16px 0; font-weight:600;">Co-Founder, Kasem App</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#14532d; padding:28px 40px; text-align:center;">
              <p style="color:#caa54a; font-size:15px; margin:0 0 6px 0; font-weight:600;">Kasem App</p>
              <p style="color:#a8c4b0; font-size:12px; margin:0 0 14px 0; line-height:1.5;">
                Preserving the Kasem language, one word at a time.
              </p>
              <p style="color:#6b9a7e; font-size:11px; margin:0;">
                © ${new Date().getFullYear()} Kasem App. All rights reserved.
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
