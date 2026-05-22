import { getSheetsClient } from "./googleSheetsClient";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

export async function writeReviewSheet(data) {
  const sheets = getSheetsClient();

  const row = [
    data.prospect_name || data["Customer Name"] || "",
    data.rating || data["Star Rating"] || "",
    data.review_text || data["Review Text"] || "",
    data.sentiment || "",
    data.status || "new",
    data.draft_response || "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Reviews!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

export async function writeCommunitySheet(data) {
  const sheets = getSheetsClient();

  const row = [
    data.member_name || data["Member name"] || "",
    data.joined_date || data["Joined date"] || new Date().toISOString(),
    data.email || "",
    data.answered_questions || data["Answered questions"] || "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Community!A:D",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

export async function writeLeadSheet(data) {
  const sheets = getSheetsClient();

  const row = [
    data.prospect_name || "",
    data.asset_downloaded || "",
    data.source || "",
    data.email || "",
    data.nurture_level || "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Lead Magnets!A:E",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DigitallyDefined | Reputation & Revenue Engine</title>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-SQGCJN9WG3"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-SQGCJN9WG3');
    </script>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>

