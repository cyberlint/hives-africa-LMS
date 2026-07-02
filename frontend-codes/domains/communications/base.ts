export function baseEmailLayout(
  content: string,
  preheader: string = "NextHive Notification"
) {
  const brandColor = "#FDB606";
  const textColor = "#0f172a";
  const mutedColor = "#64748b";
  const bgColor = "#f3f5f9";
  const cardColor = "#ffffff";
  const borderColor = "#e2e8f0";
  const softAccent = "#fef3c7";

  const logoUrl = "https://nexthive-lms.t3.tigrisfiles.io/Brand%20Identity/NextHive%20Logo%20Dark.png";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>NextHive</title>

<style>
  body, table, td, a {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  table { border-collapse: collapse; }
  img { border: 0; display: block; }

  body {
    margin: 0;
    padding: 0;
    width: 100% !important;
    background-color: ${bgColor};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  }

  @media screen and (max-width: 600px) {
    .container { width: 100% !important; }
    .body-padding { padding: 28px 24px 24px 24px !important; }
    .footer-padding { padding: 0 24px 28px 24px !important; }
  }
</style>
</head>

<body>

<!-- PREHEADER -->
<div style="display:none; max-height:0; overflow:hidden; opacity:0;">
  ${preheader}
</div>

<table width="100%" role="presentation" style="padding:32px 12px; background-color:${bgColor};">
<tr>
<td align="center">

  <table width="640" class="container" role="presentation" style="max-width:640px; background:${cardColor}; border:1px solid ${borderColor}; border-radius:24px; overflow:hidden; box-shadow:0 16px 40px rgba(15,23,42,0.06);">

    <!-- HERO -->
    <tr>
      <td style="background:linear-gradient(135deg, ${softAccent} 0%, #ffffff 100%); padding:32px 36px 22px 36px; border-bottom:1px solid ${borderColor};">
        <div style="font-size:12px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:#b45309; margin:0 0 10px 0;">
          NextHive
        </div>
        <img 
          src="${logoUrl}" 
          alt="NextHive"
          width="124"
          style="margin:0;"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        />
        <div style="
          display:none;
          font-size:18px;
          font-weight:800;
          color:${textColor};
        ">
          Next<span style="color:${brandColor};">Hive</span>
        </div>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td class="body-padding" style="padding:32px 36px 24px 36px;">
        ${content}
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td class="footer-padding" style="padding:0 36px 30px 36px; border-top:1px solid ${borderColor};">
        <p style="
          margin:16px 0 0 0;
          font-size:12.5px;
          color:${mutedColor};
          line-height:1.6;
        ">
          You’re receiving this because you’re part of the NextHive ecosystem.
        </p>

        <p style="
          margin:8px 0 0 0;
          font-size:12px;
          color:${mutedColor};
        ">
          © ${new Date().getFullYear()} NextHive. All rights reserved.
        </p>
      </td>
    </tr>

  </table>

</td>
</tr>
</table>

</body>
</html>
`;
}