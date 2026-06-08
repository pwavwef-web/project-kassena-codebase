type SignupAlertUserData = Record<string, unknown>

type SignupAlertEmailOptions = {
  appUrl: string
  createdAt?: unknown
  displayName?: string | null
  email?: string | null
  logoUrl: string
  photoURL?: string | null
  role?: string | null
  uid: string
  userData: SignupAlertUserData
}

const toLabel = (value: unknown, fallback = 'Not provided'): string => {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (typeof value === 'object' && value && 'toDate' in value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toLocaleString()
  }

  return fallback
}

export const getSignupAlertEmailHtml = ({
  appUrl,
  createdAt,
  displayName,
  email,
  logoUrl,
  photoURL,
  role,
  uid,
  userData,
}: SignupAlertEmailOptions): string => {
  const currentRole = toLabel(role, 'contributor')
  const joinedAt = toLabel(createdAt, 'Just now')
  const userName = toLabel(displayName, 'New user')
  const userEmail = toLabel(email, 'No email available')
  const profilePhoto = toLabel(photoURL, 'Not provided')
  const community = toLabel(userData.community)
  const dialect = toLabel(userData.dialect)
  const phone = toLabel(userData.phone)
  const bio = toLabel(userData.bio)
  const contributionFocus = toLabel(userData.contributionFocus)
  const staffRank = toLabel(userData.staffRank)
  const status = toLabel(userData.status, 'active')
  const accountFlags = [
    profilePhoto === 'Not provided' ? 'Profile photo missing' : null,
    community === 'Not provided' ? 'Community not specified' : null,
    dialect === 'Not provided' ? 'Dialect not specified' : null,
    phone === 'Not provided' ? 'Phone number missing' : null,
    bio === 'Not provided' ? 'Bio missing' : null,
    contributionFocus === 'Not provided' ? 'Contribution focus missing' : null,
  ].filter(Boolean) as string[]

  const recommendedActions = [
    'Welcome the new user and confirm they can access the platform.',
    'Review the profile fields above and complete any missing onboarding details.',
    'Verify the assigned role and promote only if there is a clear approval reason.',
    'Encourage the user to add a first word, translation, or audio contribution.',
  ]

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New signup alert</title>
</head>
<body style="margin:0; padding:0; background-color:#ece6da; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:36px 20px; background:linear-gradient(180deg, #ece6da 0%, #f5efe3 100%);">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:24px; overflow:hidden; border:1px solid rgba(28,76,48,0.12); box-shadow:0 18px 60px rgba(53,38,17,0.14);">
          <tr>
            <td style="padding:28px 36px; background:linear-gradient(135deg, #102a18 0%, #1c4c30 100%);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" style="width:72px; padding-right:16px;">
                    <img src="${logoUrl}" alt="Kasem App logo" width="60" height="60" style="display:block; border:0; outline:none; text-decoration:none;" />
                  </td>
                  <td valign="middle">
                    <div style="color:#f2d38a; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:700; margin-bottom:6px;">Signup alert</div>
                    <div style="color:#ffffff; font-size:26px; line-height:1.15; font-weight:800;">A new user just joined Kasem App</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:34px 36px 18px 36px;">
              <p style="margin:0 0 20px 0; color:#4f4538; font-size:15px; line-height:1.8;">
                A new account was created. Use the details below to follow up and decide whether any onboarding or role adjustment is needed.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:linear-gradient(180deg, #fbf7ef 0%, #f3ead7 100%); border-radius:18px; padding:20px 22px; border:1px solid rgba(201,106,45,0.14);">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700; width:150px;">Name</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px;">${userName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700;">Email</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px;">${userEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700;">UID</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px; word-break:break-all;">${uid}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700;">Role</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px;">${currentRole}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700;">Status</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px;">${status}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700;">Joined</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px;">${joinedAt}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700;">Community</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px;">${community}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700;">Dialect</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px;">${dialect}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700;">Phone</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px;">${phone}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700;">Bio</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px;">${bio}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700;">Contribution focus</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px;">${contributionFocus}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700;">Staff rank</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px;">${staffRank}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#1c4c30; font-size:14px; font-weight:700;">Profile photo</td>
                        <td style="padding:6px 0; color:#4f4538; font-size:14px; word-break:break-all;">${profilePhoto}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#163922; border-radius:18px; padding:22px;">
                    <div style="color:#f2d38a; font-size:16px; font-weight:700; margin-bottom:12px;">Recommended actions</div>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${recommendedActions
                        .map(
                          (action, index) => `
                      <tr>
                        <td style="padding:7px 0; color:#e7efe8; font-size:14px; line-height:1.65;">${index + 1}. ${action}</td>
                      </tr>`,
                        )
                        .join('')}
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td style="background:#fbf7ef; border-radius:18px; padding:20px 22px; border:1px solid rgba(201,106,45,0.14);">
                    <div style="color:#1c4c30; font-size:15px; font-weight:700; margin-bottom:10px;">Missing profile signals</div>
                    <div style="color:#4f4538; font-size:14px; line-height:1.7;">${accountFlags.length > 0 ? accountFlags.join('; ') : 'No obvious gaps detected yet.'}</div>
                  </td>
                </tr>
              </table>

              <p style="margin:0; color:#4f4538; font-size:14px; line-height:1.7;">
                Review the account in the app if needed: <a href="${appUrl}" style="color:#1c4c30; text-decoration:none; font-weight:700;">${appUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:linear-gradient(135deg, #102a18 0%, #163922 100%); padding:20px 36px; text-align:center;">
              <p style="margin:0; color:#c3d3c5; font-size:11px; line-height:1.6;">This alert is sent automatically for every new signup.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}