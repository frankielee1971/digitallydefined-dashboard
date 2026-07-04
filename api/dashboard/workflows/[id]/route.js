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

    // Fetch all workflows for the user
    const { data: workflows, error: workflowsError } = await supabaseService
      .from('workflows')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (workflowsError) {
      console.error('Error fetching workflows:', workflowsError);
      return res.status(500).json({
        error: 'Failed to fetch workflows',
        details: workflowsError.message,
      });
    }

    // Fetch related events for each workflow
    const workflowIds = workflows?.map(w => w.id) || [];
    let eventsMap = {};

    if (workflowIds.length > 0) {
      const { data: events, error: eventsError } = await supabaseService
        .from('events')
        .select('*')
        .in('workflow_id', workflowIds)
        .order('created_at', { ascending: false });

      if (!eventsError && events) {
        // Group events by workflow_id
        events.forEach(event => {
          if (!eventsMap[event.workflow_id]) {
            eventsMap[event.workflow_id] = [];
          }
          eventsMap[event.workflow_id].push(event);
        });
      }
    }

    // Calculate workflow statistics
    const stats = {
      totalWorkflows: workflows?.length || 0,
      activeWorkflows: workflows?.filter(w => w.status === 'active').length || 0,
      pendingWorkflows: workflows?.filter(w => w.status === 'pending').length || 0,
      completedWorkflows: workflows?.filter(w => w.status === 'completed').length || 0,
      failedWorkflows: workflows?.filter(w => w.status === 'failed').length || 0,
      completionRate: workflows?.length 
        ? Math.round((workflows.filter(w => w.status === 'completed').length / workflows.length) * 100)
        : 0,
    };

    // Enrich workflows with their events
    const enrichedWorkflows = workflows?.map(workflow => ({
      ...workflow,
      events: eventsMap[workflow.id] || [],
    })) || [];

    return res.status(200).json({
      success: true,
      data: {
        workflows: enrichedWorkflows,
        stats,
      },
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}