import { google } from "googleapis";

let sheetsClient;

export function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  const jwt = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  sheetsClient = google.sheets({ version: "v4", auth: jwt });
  return sheetsClient;
}
