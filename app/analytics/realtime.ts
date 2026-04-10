import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { getGoogleAuth } from '../_utils/googleAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!propertyId) {
      return res.status(500).json({ error: 'GA_PROPERTY_ID not set' });
    }

    const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];
    const auth = getGoogleAuth(scopes);

    const analyticsData = google.analyticsdata({ version: 'v1beta', auth });

    const response = await analyticsData.properties.runRealtimeReport({
      property: `properties/${propertyId}`,
      requestBody: {
        metrics: [{ name: 'activeUsers' }],
        dimensions: [{ name: 'country' }],
      },
    });

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Analytics realtime error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
