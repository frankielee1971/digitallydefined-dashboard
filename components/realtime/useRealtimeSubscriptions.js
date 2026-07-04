import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * Custom hook for subscribing to Supabase Realtime changes
 */
export function useRealtimeSubscription(tableName, userId, callback) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Create channel name
    const channelName = `${tableName}:${userId}`;

    // Subscribe to changes
    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log(`Realtime update on ${tableName}:`, payload);
          if (callback) {
            callback(payload);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setError(null);
        } else if (status === 'CHANNEL_ERROR') {
          setError('Subscription error');
          setIsConnected(false);
        }
      });

    subscriptionRef.current = subscription;

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [tableName, userId, callback]);

  return { isConnected, error };
}

/**
 * Hook for quiz results realtime updates
 */
export function useQuizResultsRealtime(userId, onUpdate) {
  return useRealtimeSubscription('quiz_results', userId, onUpdate);
}

/**
 * Hook for workflows realtime updates
 */
export function useWorkflowsRealtime(userId, onUpdate) {
  return useRealtimeSubscription('workflows', userId, onUpdate);
}

/**
 * Hook for events realtime updates
 */
export function useEventsRealtime(userId, onUpdate) {
  return useRealtimeSubscription('events', userId, onUpdate);
}

/**
 * Hook for all realtime subscriptions
 */
export function useAllRealtimeSubscriptions(userId, callbacks = {}) {
  const quizResults = useQuizResultsRealtime(userId, callbacks.onQuizResultUpdate);
  const workflows = useWorkflowsRealtime(userId, callbacks.onWorkflowUpdate);
  const events = useEventsRealtime(userId, callbacks.onEventUpdate);

  return {
    quizResults,
    workflows,
    events,
    isAnyConnected: quizResults.isConnected || workflows.isConnected || events.isConnected,
    errors: [quizResults.error, workflows.error, events.error].filter(Boolean),
  };
}