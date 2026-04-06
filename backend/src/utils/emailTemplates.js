/**
 * emailTemplates.js
 *
 * Reusable email template generators for Greeny –
 * Sustainable Product Rating System.
 *
 * All templates use table-based, inline-CSS HTML for maximum
 * compatibility across email clients (Gmail, Outlook, Apple Mail, etc.).
 */

// ---------------------------------------------------------------------------
// OTP Email Template
// ---------------------------------------------------------------------------

/**
 * Generates a production-ready HTML email for OTP verification.
 *
 * @param {string|number} otp           - The 6-digit OTP code to display.
 * @param {number}        [expiryMins]  - Minutes until the OTP expires.
 *                                        Defaults to OTP_EXPIRY_MINUTES env var or 5.
 * @returns {string} Full HTML string ready to be sent as an email body.
 */
export function generateOtpEmailTemplate(otp, expiryMins) {
    const expiry = expiryMins
        ?? (parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 5);

    const appName      = process.env.APP_NAME    || 'Greeny';
    const appTagline   = 'Sustainable Product Rating System';
    const supportEmail = process.env.SUPPORT_EMAIL || process.env.EMAIL_USER || 'support@greeny.app';
    const currentYear  = new Date().getFullYear();

    // ── Colour palette — SDG-12 aligned green theme ──────────────────────────
    const c = {
        brandGreen:      '#2E7D32',   // deep forest green
        brandGreenMid:   '#388E3C',
        brandGreenLight: '#43A047',
        accentGreen:     '#66BB6A',   // softer accent
        otpBg:           '#F1F8E9',   // very light green tint
        otpBorder:       '#A5D6A7',
        bodyBg:          '#EEF3EE',
        cardBg:          '#FFFFFF',
        textPrimary:     '#1B2A1C',
        textSecondary:   '#4A5E4B',
        textMuted:       '#7A8C7B',
        danger:          '#C62828',
        warningBg:       '#FFF8E1',
        footerBg:        '#E8F5E9',
    };

    // ── Cloudinary logo URL (optimised: 200×200, fill crop) ──────────────────
    const logoUrl = 'https://res.cloudinary.com/dojnvag3a/image/upload/c_fill,h_200,w_200/app_logo_pkmzzp.png';

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Email Verification – ${appName}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: ${c.bodyBg};
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
">

<!-- ════════════════════════════════════════════════════════════════════════ -->
<!--  OUTER WRAPPER                                                          -->
<!-- ════════════════════════════════════════════════════════════════════════ -->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
  style="background-color: ${c.bodyBg};">
  <tr>
    <td align="center" style="padding: 48px 16px 48px;">

      <!-- ╔══════════════════════════════════════════════════════════════╗ -->
      <!--  EMAIL CARD  (max 600 px)                                      -->
      <!-- ╚══════════════════════════════════════════════════════════════╝ -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
        style="max-width: 600px;
               background-color: ${c.cardBg};
               border-radius: 20px;
               overflow: hidden;
               box-shadow: 0 8px 32px rgba(46,125,50,0.13);">


        <!-- ── HEADER BANNER ──────────────────────────────────────────── -->
        <tr>
          <td align="center"
            style="background: linear-gradient(150deg, ${c.brandGreen} 0%, ${c.brandGreenLight} 100%);
                   padding: 44px 40px 36px;">

            <!-- Logo image -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center">
                  <!--[if mso]>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr><td align="center" style="background-color:#ffffff; border-radius:16px; padding:6px;">
                  <![endif]-->
                  <img
                    src="${logoUrl}"
                    alt="Greeny Logo"
                    width="96"
                    height="96"
                    style="
                      display: block;
                      width: 96px;
                      height: 96px;
                      border-radius: 16px;
                      background-color: #ffffff;
                      object-fit: cover;
                      outline: none;
                      border: none;
                      text-decoration: none;
                      -ms-interpolation-mode: bicubic;
                      box-shadow: 0 4px 16px rgba(0,0,0,0.18);
                    "
                  />
                  <!--[if mso]>
                    </td></tr>
                  </table>
                  <![endif]-->
                </td>
              </tr>
            </table>

            <!-- App name -->
            <p style="
              margin: 20px 0 4px;
              font-size: 30px;
              font-weight: 800;
              color: #FFFFFF;
              letter-spacing: -0.5px;
              line-height: 1.1;
            ">${appName}</p>

            <!-- Tagline -->
            <p style="
              margin: 0;
              font-size: 11px;
              font-weight: 500;
              color: rgba(255,255,255,0.78);
              letter-spacing: 1.8px;
              text-transform: uppercase;
            ">${appTagline}</p>

          </td>
        </tr>


        <!-- ── THIN ACCENT STRIPE ──────────────────────────────────────── -->
        <tr>
          <td style="height: 4px;
                     background: linear-gradient(90deg, ${c.accentGreen}, ${c.brandGreenLight}, ${c.accentGreen});
                     font-size: 0; line-height: 0;">
            &nbsp;
          </td>
        </tr>


        <!-- ── BODY ───────────────────────────────────────────────────── -->
        <tr>
          <td style="padding: 44px 44px 36px;">

            <!-- Section heading -->
            <h1 style="
              margin: 0 0 10px;
              font-size: 23px;
              font-weight: 700;
              color: ${c.textPrimary};
              line-height: 1.3;
            ">Verify Your Email Address</h1>

            <!-- Greeting paragraph -->
            <p style="
              margin: 0 0 32px;
              font-size: 15px;
              color: ${c.textSecondary};
              line-height: 1.7;
            ">
              Hi there 👋,<br/>
              We received a request to verify the email address linked to your
              <strong style="color: ${c.textPrimary};">${appName}</strong> account.
              Use the one-time passcode below to complete your verification.
            </p>


            <!-- ── OTP BOX ─────────────────────────────────────────────── -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                    style="
                      background-color: ${c.otpBg};
                      border: 2px solid ${c.otpBorder};
                      border-radius: 16px;
                      width: 100%;
                      max-width: 420px;
                    ">
                    <tr>
                      <td align="center" style="padding: 32px 40px 28px;">

                        <!-- Label -->
                        <p style="
                          margin: 0 0 12px;
                          font-size: 10.5px;
                          font-weight: 700;
                          color: ${c.brandGreen};
                          letter-spacing: 2.5px;
                          text-transform: uppercase;
                        ">Your One-Time Passcode</p>

                        <!-- OTP digits -->
                        <p style="
                          margin: 0;
                          font-size: 52px;
                          font-weight: 900;
                          color: ${c.brandGreen};
                          letter-spacing: 12px;
                          line-height: 1.1;
                          font-variant-numeric: tabular-nums;
                        ">${otp}</p>

                        <!-- Expiry notice -->
                        <p style="
                          margin: 14px 0 0;
                          font-size: 13px;
                          color: ${c.textMuted};
                          line-height: 1.5;
                        ">
                          ⏱&nbsp; Expires in
                          <strong style="color: ${c.textSecondary};">${expiry}&nbsp;minute${expiry !== 1 ? 's' : ''}</strong>
                          &nbsp;·&nbsp; Do not share this code
                        </p>

                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <!-- /OTP BOX -->


            <!-- ── SEPARATOR ──────────────────────────────────────────── -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
              style="margin: 38px 0 32px;">
              <tr>
                <td style="border-top: 1px solid #DDE8DD; font-size: 0; line-height: 0;">&nbsp;</td>
              </tr>
            </table>


            <!-- ── SECURITY NOTICE ────────────────────────────────────── -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
              style="background-color: ${c.warningBg};
                     border-radius: 12px;
                     border-left: 4px solid #F9A825;">
              <tr>
                <!-- Shield icon cell -->
                <td width="48" valign="top" style="padding: 16px 0 16px 18px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td align="center" valign="middle"
                        style="width: 34px; height: 34px;
                               background-color: #FFF3CD;
                               border-radius: 50%;
                               font-size: 17px;
                               line-height: 34px;
                               text-align: center;">
                        🔒
                      </td>
                    </tr>
                  </table>
                </td>
                <!-- Text cell -->
                <td valign="top" style="padding: 16px 18px 16px 12px;">
                  <p style="margin: 0 0 3px; font-size: 13px; font-weight: 700;
                             color: ${c.danger}; line-height: 1.4;">
                    Never share this code with anyone
                  </p>
                  <p style="margin: 0; font-size: 13px; color: ${c.textSecondary};
                             line-height: 1.6;">
                    ${appName} will <em>never</em> ask for your OTP via phone, chat,
                    or email. If you didn't request this, please ignore this email —
                    your account remains fully secure.
                  </p>
                </td>
              </tr>
            </table>
            <!-- /SECURITY NOTICE -->


            <!-- ── ECO MESSAGE ────────────────────────────────────────── -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
              style="margin-top: 24px;
                     background-color: ${c.otpBg};
                     border-radius: 12px;
                     border-left: 4px solid ${c.accentGreen};">
              <tr>
                <td style="padding: 16px 20px;">
                  <p style="margin: 0; font-size: 13px; color: ${c.textSecondary};
                             line-height: 1.7;">
                    🌱&nbsp;<em>Every verified account helps us build a more transparent,
                    sustainable marketplace aligned with
                    <strong style="color: ${c.brandGreen};">UN&nbsp;SDG&nbsp;12 –
                    Responsible Consumption &amp; Production</strong>.
                    Thank you for choosing greener alternatives!</em>
                  </p>
                </td>
              </tr>
            </table>
            <!-- /ECO MESSAGE -->

          </td>
        </tr>


        <!-- ── FOOTER ─────────────────────────────────────────────────── -->
        <tr>
          <td style="
            background-color: ${c.footerBg};
            padding: 26px 44px 28px;
            border-top: 1px solid ${c.otpBorder};
          ">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center">

                  <!-- Footer brand line -->
                  <p style="
                    margin: 0 0 8px;
                    font-size: 13px;
                    font-weight: 700;
                    color: ${c.brandGreenMid};
                    letter-spacing: 0.3px;
                  ">${appName} &nbsp;·&nbsp; ${appTagline}</p>

                  <!-- Support link -->
                  <p style="
                    margin: 0 0 12px;
                    font-size: 12px;
                    color: ${c.textMuted};
                    line-height: 1.6;
                  ">
                    Need help? Contact us at&nbsp;
                    <a href="mailto:${supportEmail}"
                      style="color: ${c.brandGreenMid};
                             text-decoration: underline;
                             font-weight: 600;">
                      ${supportEmail}
                    </a>
                  </p>

                  <!-- Legal line -->
                  <p style="
                    margin: 0;
                    font-size: 11px;
                    color: ${c.textMuted};
                    line-height: 1.7;
                  ">
                    &copy; ${currentYear} ${appName}. All rights reserved.<br/>
                    This is an automated message &mdash; please do not reply directly.
                  </p>

                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
      <!-- /EMAIL CARD -->

    </td>
  </tr>
</table>
<!-- /OUTER WRAPPER -->

</body>
</html>`;
}
