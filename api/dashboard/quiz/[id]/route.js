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

    // Fetch all quiz results for the user
    const { data: quizResults, error } = await supabaseService
      .from('quiz_results')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quiz results:', error);
      return res.status(500).json({
        error: 'Failed to fetch quiz results',
        details: error.message,
      });
    }

    // Calculate quiz statistics
    const stats = {
      totalQuizzes: quizResults?.length || 0,
      averageScore: quizResults?.length 
        ? Math.round(quizResults.reduce((sum, q) => sum + q.score, 0) / quizResults.length)
        : 0,
      highestScore: quizResults?.length 
        ? Math.max(...quizResults.map(q => q.score))
        : 0,
      lowestScore: quizResults?.length 
        ? Math.min(...quizResults.map(q => q.score))
        : 0,
      recentTrend: calculateTrend(quizResults || []),
    };

    return res.status(200).json({
      success: true,
      data: {
        quizResults: quizResults || [],
        stats,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

/**
 * Calculate score trend (improving, declining, or stable)
 */
function calculateTrend(quizResults) {
  if (quizResults.length < 2) {
    return { direction: 'insufficient_data', change: 0 };
  }

  // Get last 5 quiz scores
  const recentScores = quizResults.slice(0, 5).map(q => q.score);
  const olderScores = quizResults.slice(5, 10).map(q => q.score);

  if (olderScores.length === 0) {
    return { direction: 'insufficient_data', change: 0 };
  }

  const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
  const change = Math.round(recentAvg - olderAvg);

  if (change > 5) {
    return { direction: 'improving', change };
  } else if (change < -5) {
    return { direction: 'declining', change };
  } else {
    return { direction: 'stable', change };
  }
}