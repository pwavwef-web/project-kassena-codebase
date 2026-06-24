type WelcomeEmailOptions = {
  appUrl: string
  displayName: string
  logoUrl: string
}

export const getWelcomeEmailHtml = ({
  appUrl,
  displayName,
  logoUrl,
}: WelcomeEmailOptions): string => {
  const firstName = displayName.split(" ")[0] || "Friend"

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Kasem App</title>
</head>
<body style="margin:0; padding:0; background-color:#efe9dd; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg, #efe9dd 0%, #f7f1e7 52%, #ece4d6 100%); padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 18px 60px rgba(53,38,17,0.16); border:1px solid rgba(145,111,58,0.12);">

          <tr>
            <td style="background:radial-gradient(circle at top, #204f32 0%, #163922 45%, #102a18 100%); padding:48px 40px 42px 40px; text-align:center;">
              <div style="display:inline-block; padding:12px; border-radius:20px; background:rgba(255,255,255,0.08); margin-bottom:16px;">
                <img src="${logoUrl}" alt="Kasem App logo" width="64" height="64" style="display:block; border:0; outline:none; text-decoration:none;" />
              </div>
              <h1 style="color:#f2d38a; font-size:30px; line-height:1.1; margin:0 0 8px 0; font-weight:800; letter-spacing:1.5px;">KASEM APP</h1>
              <p style="color:#d7e5d8; font-size:13px; margin:0; letter-spacing:2px; text-transform:uppercase;">Preserving language. Empowering culture.</p>
            </td>
          </tr>

          <tr>
            <td style="height:6px; background:linear-gradient(90deg, #d3a84a 0%, #c96a2d 50%, #d3a84a 100%);"></td>
          </tr>

          <tr>
            <td style="padding:46px 40px 34px 40px;">

              <p style="color:#5f4a2c; font-size:17px; margin:0 0 22px 0; line-height:1.7;">
                Hi <strong style="color:#1c4c30;">${firstName}</strong>,
              </p>

              <p style="color:#4f4538; font-size:15px; line-height:1.8; margin:0 0 22px 0;">
                Welcome to <strong style="color:#1c4c30;">Kasem App</strong>, a community-powered space for preserving and celebrating the <strong>Kasem language</strong> and the stories behind it.
              </p>

              <p style="color:#4f4538; font-size:15px; line-height:1.8; margin:0 0 30px 0;">
                Every word you add, every pronunciation you record, and every contribution you make helps keep our heritage alive for the next generation.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}" style="display:inline-block; background:linear-gradient(135deg, #1c4c30 0%, #2f7144 100%); color:#ffffff; text-decoration:none; padding:16px 42px; border-radius:999px; font-size:16px; font-weight:700; letter-spacing:0.3px; box-shadow:0 8px 20px rgba(28,76,48,0.28);">
                      Get Started →
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
                <tr>
                  <td style="background:linear-gradient(180deg, #fbf7ef 0%, #f3ead7 100%); border-radius:18px; padding:28px; border:1px solid rgba(201,106,45,0.14);">
                    <h3 style="color:#1c4c30; font-size:16px; margin:0 0 14px 0;">Here is a quick path to get started:</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0; color:#4f4538; font-size:14px; line-height:1.6;"><strong style="color:#1c4c30;">1. Explore the dictionary</strong> to see how Kasem words are organized.</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; color:#4f4538; font-size:14px; line-height:1.6;"><strong style="color:#1c4c30;">2. Complete your profile</strong> so others can recognize your contributions.</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; color:#4f4538; font-size:14px; line-height:1.6;"><strong style="color:#1c4c30;">3. Share a contribution</strong> with a word, phrase, or example sentence.</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; color:#4f4538; font-size:14px; line-height:1.6;"><strong style="color:#1c4c30;">4. Track your progress</strong> through achievements, rewards, and the leaderboard.</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color:#4f4538; font-size:15px; line-height:1.8; margin:0;">
                If you need help or want to say hello, we are always here for you.
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 38px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eadfc8;">
                <tr>
                  <td style="padding-top:28px;">
                    <p style="color:#5b5141; font-size:15px; margin:0 0 4px 0;">With warmth and gratitude,</p>
                    <p style="color:#1c4c30; font-size:17px; font-weight:700; margin:0 0 2px 0;">Francis Pwavwe</p>
                    <p style="color:#c96a2d; font-size:13px; margin:0 0 16px 0; font-weight:700;">Co-Founder, Kasem App</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:linear-gradient(135deg, #102a18 0%, #163922 100%); padding:28px 40px; text-align:center;">
              <p style="color:#f2d38a; font-size:15px; margin:0 0 6px 0; font-weight:700;">Kasem App</p>
              <p style="color:#c3d3c5; font-size:12px; margin:0 0 14px 0; line-height:1.6;">
                Preserve the Kasem language, one contribution at a time.
              </p>
              <p style="color:#8fb49a; font-size:11px; margin:0 0 10px 0;">
                <a href="${appUrl}" style="color:#f2d38a; text-decoration:none;">${appUrl}</a>
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
