import { supabaseService } from '../lib/supabase';
import { generateWorkflowProfile } from '../lib/workflows';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', [
    'https://dashboard.digitallydefined.online',
    'https://www.digitallydefined.online',
  ]);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, quiz_id, score, answers_json } = req.body;

    // Validate required fields
    if (!user_id || !quiz_id || score === undefined || !answers_json) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['user_id', 'quiz_id', 'score', 'answers_json'],
      });
    }

    // Validate score is a number
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({
        error: 'Invalid score. Must be a number between 0 and 100',
      });
    }

    // Insert quiz result
    const { data: quizResult, error: quizError } = await supabaseService
      .from('quiz_results')
      .insert({
        user_id,
        quiz_id,
        score,
        answers_json,
      })
      .select()
      .single();

    if (quizError) {
      console.error('Error inserting quiz result:', quizError);
      return res.status(500).json({
        error: 'Failed to save quiz result',
        details: quizError.message,
      });
    }

    // Generate workflow profile
    let workflow;
    try {
      workflow = await generateWorkflowProfile(user_id, quizResult);
    } catch (workflowError) {
      console.error('Error generating workflow:', workflowError);
      // Don't fail the request if workflow generation fails
      // The quiz result is still saved
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        quizResult,
        workflow: workflow || null,
      },
    });
  } catch (error) {
    console.error('Unexpected error in submit-quiz:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}