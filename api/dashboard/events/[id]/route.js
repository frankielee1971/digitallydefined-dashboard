import { supabaseService } from '../../lib/supabase';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', [
    'https://dashboard.digitallydefined.online',
    'https://www.digitallydefined.online',
  ]);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Fetch all events for the user
    const { data: events, error: eventsError } = await supabaseService
      .from('events')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return res.status(500).json({
        error: 'Failed to fetch events',
        details: eventsError.message,
      });
    }

    // Fetch related workflow information
    const workflowIds = [...new Set(events?.map(e => e.workflow_id).filter(Boolean))] || [];
    let workflowsMap = {};

    if (workflowIds.length > 0) {
      const { data: workflows, error: workflowsError } = await supabaseService
        .from('workflows')
        .select('id, workflow_type, status')
        .in('id', workflowIds);

      if (!workflowsError && workflows) {
        workflows.forEach(workflow => {
          workflowsMap[workflow.id] = workflow;
        });
      }
    }

    // Enrich events with workflow information
    const enrichedEvents = events?.map(event => ({
      ...event,
      workflow: event.workflow_id ? workflowsMap[event.workflow_id] : null,
    })) || [];

    // Calculate event statistics
    const stats = {
      totalEvents: events?.length || 0,
      eventTypes: events?.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {}) || {},
      recentEvents: events?.filter(e => {
        const eventDate = new Date(e.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return eventDate >= weekAgo;
      }).length || 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        events: enrichedEvents,
        stats,
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}