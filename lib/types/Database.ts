export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_results: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          score: number;
          answers_json: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          score: number;
          answers_json: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_id?: string;
          score?: number;
          answers_json?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      workflows: {
        Row: {
          id: string;
          user_id: string;
          quiz_result_id: string | null;
          workflow_type: string;
          workflow_data: Json;
          status: 'pending' | 'active' | 'completed' | 'failed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_result_id?: string | null;
          workflow_type: string;
          workflow_data: Json;
          status?: 'pending' | 'active' | 'completed' | 'failed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_result_id?: string | null;
          workflow_type?: string;
          workflow_data?: Json;
          status?: 'pending' | 'active' | 'completed' | 'failed';
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          user_id: string;
          workflow_id: string | null;
          event_type: string;
          event_data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workflow_id?: string | null;
          event_type: string;
          event_data: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workflow_id?: string | null;
          event_type?: string;
          event_data?: Json;
          created_at?: string;
        };
      };
    };
  };
}