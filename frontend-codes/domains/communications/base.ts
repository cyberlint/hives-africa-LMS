export function baseEmailLayout(
  content: string,
  preheader: string = "NextHive Notification"
) {
  const brandColor = "#FDB606";
  const textColor = "#18181b";
  const mutedColor = "#71717a";
  const bgColor = "#f4f4f5";
  const cardColor = "#ffffff";
  const borderColor = "#e5e7eb";

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
    .padding { padding: 24px 20px !important; }
  }
</style>
</head>

<body>

<!-- PREHEADER -->
<div style="display:none; max-height:0; overflow:hidden; opacity:0;">
  ${preheader}
</div>

<table width="100%" role="presentation" style="padding:48px 0;">
<tr>
<td align="center">

  <table width="600" class="container" role="presentation" style="max-width:600px;">

    <!-- LOGO -->
    <tr>
      <td align="center" style="padding:0 0 18px 0;">
        <img 
          src="${logoUrl}" 
          alt="NextHive"
          width="140"
          style="margin:0 auto;"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        />
        <!-- fallback -->
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

    <!-- CARD -->
    <tr>
      <td style="
        background:${cardColor};
        border:1px solid ${borderColor};
        border-radius:16px;
        overflow:hidden;
      ">

        <!-- BODY -->
        <table width="100%" role="presentation">
          <tr>
            <td class="padding" style="padding:36px 34px;">
              ${content}
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td align="center" style="padding:22px 16px 0 16px;">
        <p style="
          margin:0;
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