import { supabaseService } from '../supabase';
import type { Database } from '../types/Database';

type User = Database['public']['Tables']['users']['Row'];
type QuizResult = Database['public']['Tables']['quiz_results']['Row'];
type Workflow = Database['public']['Tables']['workflows']['Row'];
type Event = Database['public']['Tables']['events']['Row'];

/**
 * Get user by ID
 */
export async function getUser(id: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseService
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseService
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: {
  id: string;
  email: string;
  full_name?: string | null;
}): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseService
      .from('users')
      .insert({
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

/**
 * Get quiz results for a user
 */
export async function getQuizResults(userId: string, limit: number = 50): Promise<QuizResult[]> {
  try {
    const { data: quizResults, error } = await supabaseService
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching quiz results:', error);
      return [];
    }

    return quizResults || [];
  } catch (error) {
    console.error('Error getting quiz results:', error);
    return [];
  }
}

/**
 * Get a single quiz result by ID
 */
export async function getQuizResultById(id: string): Promise<QuizResult | null> {
  try {
    const { data: quizResult, error } = await supabaseService
      .from('quiz_results')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching quiz result:', error);
      return null;
    }

    return quizResult;
  } catch (error) {
    console.error('Error getting quiz result:', error);
    return null;
  }
}

/**
 * Get workflows for a user
 */
export async function getWorkflows(userId: string, limit: number = 50): Promise<Workflow[]> {
  try {
    const { data: workflows, error } = await supabaseService
      .from('workflows')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching workflows:', error);
      return [];
    }

    return workflows || [];
  } catch (error) {
    console.error('Error getting workflows:', error);
    return [];
  }
}

/**
 * Get a single workflow by ID
 */
export async function getWorkflowById(id: string): Promise<Workflow | null> {
  try {
    const { data: workflow, error } = await supabaseService
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching workflow:', error);
      return null;
    }

    return workflow;
  } catch (error) {
    console.error('Error getting workflow:', error);
    return null;
  }
}

/**
 * Get events for a user
 */
export async function getEvents(userId: string, limit: number = 100): Promise<Event[]> {
  try {
    const { data: events, error } = await supabaseService
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    return events || [];
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
}

/**
 * Get events for a specific workflow
 */
export async function getEventsByWorkflow(workflowId: string, limit: number = 50): Promise<Event[]> {
  try {
    const { data: events, error } = await supabaseService
      .from('events')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching workflow events:', error);
      return [];
    }

    return events || [];
  } catch (error) {
    console.error('Error getting workflow events:', error);
    return [];
  }
}

/**
 * Get dashboard statistics for a user
 */
export async function getDashboardStats(userId: string) {
  try {
    const [quizResults, workflows, events] = await Promise.all([
      getQuizResults(userId, 100),
      getWorkflows(userId, 100),
      getEvents(userId, 100),
    ]);

    const stats = {
      quizzes: {
        total: quizResults.length,
        averageScore: quizResults.length 
          ? Math.round(quizResults.reduce((sum, q) => sum + q.score, 0) / quizResults.length)
          : 0,
        recentTrend: calculateScoreTrend(quizResults),
      },
      workflows: {
        total: workflows.length,
        active: workflows.filter(w => w.status === 'active').length,
        pending: workflows.filter(w => w.status === 'pending').length,
        completed: workflows.filter(w => w.status === 'completed').length,
        failed: workflows.filter(w => w.status === 'failed').length,
        completionRate: workflows.length 
          ? Math.round((workflows.filter(w => w.status === 'completed').length / workflows.length) * 100)
          : 0,
      },
      events: {
        total: events.length,
        recentCount: events.filter(e => {
          const eventDate = new Date(e.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return eventDate >= weekAgo;
        }).length,
        eventTypes: events.reduce((acc, event) => {
          acc[event.event_type] = (acc[event.event_type] || 0) + 1;
          return acc;
        }, {}),
      },
    };

    return stats;
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return null;
  }
}

/**
 * Calculate score trend
 */
function calculateScoreTrend(quizResults: QuizResult[]) {
  if (quizResults.length < 2) {
    return { direction: 'insufficient_data', change: 0 };
  }

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