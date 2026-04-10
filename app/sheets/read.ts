import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { getGoogleAuth } from '../_utils/googleAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { spreadsheetId, range } = req.query;

    if (!spreadsheetId || !range || typeof spreadsheetId !== 'string' || typeof range !== 'string') {
      return res.status(400).json({ error: 'Missing spreadsheetId or range' });
    }

    const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    const auth = getGoogleAuth(scopes);

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Sheets read error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
