import { supabaseService } from './supabase';
import type { Database } from './types/Database';

type WorkflowType = Database['public']['Tables']['workflows']['Row'];
type EventType = Database['public']['Tables']['events']['Row'];

export interface WorkflowProfile {
  userId: string;
  quizResultId: string;
  workflowType: string;
  workflowData: Record<string, any>;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface EventData {
  userId: string;
  workflowId?: string;
  eventType: string;
  eventData: Record<string, any>;
}

/**
 * Generate a workflow profile based on quiz results
 */
export async function generateWorkflowProfile(
  userId: string,
  quizResult: Database['public']['Tables']['quiz_results']['Row']
): Promise<WorkflowProfile> {
  try {
    // Analyze quiz results to determine workflow type
    const workflowType = determineWorkflowType(quizResult);
    
    // Generate workflow data based on quiz answers
    const workflowData = generateWorkflowData(quizResult);

    // Insert workflow into database
    const { data: workflow, error: workflowError } = await supabaseService
      .from('workflows')
      .insert({
        user_id: userId,
        quiz_result_id: quizResult.id,
        workflow_type: workflowType,
        workflow_data: workflowData,
        status: 'pending',
      })
      .select()
      .single();

    if (workflowError) {
      console.error('Error creating workflow:', workflowError);
      throw workflowError;
    }

    // Create initial event
    await insertEvent({
      userId,
      workflowId: workflow.id,
      eventType: 'workflow_created',
      eventData: {
        workflowType,
        quizScore: quizResult.score,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      userId: workflow.user_id,
      quizResultId: workflow.quiz_result_id!,
      workflowType: workflow.workflow_type,
      workflowData: workflow.workflow_data as Record<string, any>,
      status: workflow.status,
    };
  } catch (error) {
    console.error('Error generating workflow profile:', error);
    throw error;
  }
}

/**
 * Insert an event into the events table
 */
export async function insertEvent(eventData: EventData): Promise<EventType> {
  try {
    const { data: event, error } = await supabaseService
      .from('events')
      .insert({
        user_id: eventData.userId,
        workflow_id: eventData.workflowId,
        event_type: eventData.eventType,
        event_data: eventData.eventData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting event:', error);
      throw error;
    }

    return event;
  } catch (error) {
    console.error('Error inserting event:', error);
    throw error;
  }
}

/**
 * Determine workflow type based on quiz results
 */
function determineWorkflowType(quizResult: Database['public']['Tables']['quiz_results']['Row']): string {
  const answers = quizResult.answers_json as Record<string, any>;
  const score = quizResult.score;

  // Example logic - customize based on your quiz structure
  if (score >= 80) {
    return 'advanced_reputation_management';
  } else if (score >= 50) {
    return 'standard_reputation_management';
  } else {
    return 'basic_reputation_management';
  }
}

/**
 * Generate workflow data based on quiz answers
 */
function generateWorkflowData(quizResult: Database['public']['Tables']['quiz_results']['Row']): Record<string, any> {
  const answers = quizResult.answers_json as Record<string, any>;
  
  // Transform quiz answers into workflow configuration
  return {
    quizScore: quizResult.score,
    answers: answers,
    generatedAt: new Date().toISOString(),
    configuration: {
      // Add workflow-specific configuration based on answers
      priority: quizResult.score >= 70 ? 'high' : 'normal',
      automationLevel: answers.automation_preference || 'standard',
      notificationFrequency: answers.notification_frequency || 'weekly',
    },
    steps: [
      {
        id: 'step_1',
        name: 'Initial Assessment',
        status: 'pending',
        order: 1,
      },
      {
        id: 'step_2',
        name: 'Strategy Development',
        status: 'pending',
        order: 2,
      },
      {
        id: 'step_3',
        name: 'Implementation',
        status: 'pending',
        order: 3,
      },
      {
        id: 'step_4',
        name: 'Monitoring & Optimization',
        status: 'pending',
        order: 4,
      },
    ],
  };
}

/**
 * Update workflow status
 */
export async function updateWorkflowStatus(
  workflowId: string,
  status: WorkflowType['status']
): Promise<WorkflowType> {
  try {
    const { data: workflow, error } = await supabaseService
      .from('workflows')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', workflowId)
      .select()
      .single();

    if (error) {
      console.error('Error updating workflow status:', error);
      throw error;
    }

    // Log status change event
    await insertEvent({
      userId: workflow.user_id,
      workflowId: workflow.id,
      eventType: 'workflow_status_changed',
      eventData: {
        newStatus: status,
        timestamp: new Date().toISOString(),
      },
    });

    return workflow;
  } catch (error) {
    console.error('Error updating workflow status:', error);
    throw error;
  }
}

/**
 * Get all workflows for a user
 */
export async function getUserWorkflows(userId: string): Promise<WorkflowType[]> {
  try {
    const { data: workflows, error } = await supabaseService
      .from('workflows')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workflows:', error);
      throw error;
    }

    return workflows || [];
  } catch (error) {
    console.error('Error getting user workflows:', error);
    throw error;
  }
}

/**
 * Get all events for a user
 */
export async function getUserEvents(userId: string, limit: number = 100): Promise<EventType[]> {
  try {
    const { data: events, error } = await supabaseService
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    return events || [];
  } catch (error) {
    console.error('Error getting user events:', error);
    throw error;
  }
}