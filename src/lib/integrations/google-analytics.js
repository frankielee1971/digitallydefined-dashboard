// Google Analytics integration service
// Requires VITE_GA_MEASUREMENT_ID / VITE_GA_PROPERTY_ID and OAuth credentials in a real backend context.

export async function fetchGoogleAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const propertyId = import.meta.env.VITE_GA_PROPERTY_ID;

  if (!measurementId || !propertyId) {
    return {
      connected: false,
      propertyId: null,
      users30d: null,
      sessions30d: null,
      bounceRate: null,
      topPages: [],
      goalConversions: null,
      revenue30d: null,
      lastUpdated: null,
      error: 'Missing Google Analytics configuration',
    };
  }

  try {
    const response = await fetch('/api/integrations/ga', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ measurementId, propertyId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Google Analytics request failed: ${response.status}`);
    }

    const payload = await response.json();
    return {
      connected: true,
      propertyId,
      users30d: payload.users30d ?? null,
      sessions30d: payload.sessions30d ?? null,
      bounceRate: payload.bounceRate ?? null,
      topPages: Array.isArray(payload.topPages) ? payload.topPages.slice(0, 5) : [],
      goalConversions: payload.goalConversions ?? null,
      revenue30d: payload.revenue30d ?? null,
      lastUpdated: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      propertyId,
      users30d: null,
      sessions30d: null,
      bounceRate: null,
      topPages: [],
      goalConversions: null,
      revenue30d: null,
      lastUpdated: null,
      error: error.message || 'Failed to fetch Google Analytics data',
    };
  }
}

export default { fetchGoogleAnalytics };
