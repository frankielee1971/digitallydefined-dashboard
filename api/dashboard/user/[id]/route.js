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

    // Fetch user profile
    const { data: user, error: userError } = await supabaseService
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch aggregated stats
    const { data: quizResults, error: quizError } = await supabaseService
      .from('quiz_results')
      .select('score, created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    const { data: workflows, error: workflowError } = await supabaseService
      .from('workflows')
      .select('status, created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    const { data: events, error: eventsError } = await supabaseService
      .from('events')
      .select('event_type, created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Calculate aggregated stats
    const stats = {
      totalQuizzes: quizResults?.length || 0,
      averageScore: quizResults?.length 
        ? Math.round(quizResults.reduce((sum, q) => sum + q.score, 0) / quizResults.length)
        : 0,
      totalWorkflows: workflows?.length || 0,
      activeWorkflows: workflows?.filter(w => w.status === 'active').length || 0,
      completedWorkflows: workflows?.filter(w => w.status === 'completed').length || 0,
      recentEvents: events?.length || 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        user,
        stats,
        recentQuizzes: quizResults?.slice(0, 5) || [],
        recentWorkflows: workflows?.slice(0, 5) || [],
        recentEvents: events?.slice(0, 10) || [],
      },
    });
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}