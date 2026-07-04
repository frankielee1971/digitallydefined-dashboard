# Supabase Backend Integration Setup Guide

## Overview
This guide covers the DigitallyDefined OS backend integration using Supabase for the reputation dashboard.

## Prerequisites
- Supabase account (https://supabase.com)
- Supabase project created
- Database tables created (see SQL below)

## 1. Supabase Database Setup

Run this SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Quiz results table
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  answers_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Workflows table
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quiz_result_id UUID REFERENCES public.quiz_results(id) ON DELETE SET NULL,
  workflow_type TEXT NOT NULL,
  workflow_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON public.quiz_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON public.workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON public.workflows(status);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_workflow_id ON public.events(workflow_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users: Users can read their own data, service role can do everything
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Service role can manage users" ON public.users
  FOR ALL USING (auth.role() = 'service_role');

-- Quiz results: Users can view their own quiz results
CREATE POLICY "Users can view own quiz results" ON public.quiz_results
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage quiz results" ON public.quiz_results
  FOR ALL USING (auth.role() = 'service_role');

-- Workflows: Users can view their own workflows
CREATE POLICY "Users can view own workflows" ON public.workflows
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage workflows" ON public.workflows
  FOR ALL USING (auth.role() = 'service_role');

-- Events: Users can view their own events
CREATE POLICY "Users can view own events" ON public.events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage events" ON public.events
  FOR ALL USING (auth.role() = 'service_role');

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_results;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workflows;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
```

## 2. Get Supabase Credentials

1. Go to https://app.supabase.com/project/_/settings/api
2. Copy the following values:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## 3. Configure Environment Variables

Update `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Vercel Configuration (already configured)
VERCEL_OIDC_TOKEN=...
AI_GATEWAY_API_KEY=...
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## 4. Generate Supabase Types (Optional but Recommended)

To get full TypeScript support, generate types from your Supabase schema:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Generate types
supabase gen types typescript --project-id your-project-id > lib/types/Database.ts
```

This will update `lib/types/Database.ts` with your actual schema.

## 5. Deploy to Vercel

### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy
vercel --prod
```

### Option B: Deploy via Git

1. Push your code to GitHub
2. Go to https://vercel.com/frankielee1971/digitallydefined-reputation-dashboard
3. Click "Import Project"
4. Vercel will auto-detect the Vite framework
5. Add environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Click "Deploy"

## 6. Configure Vercel Environment Variables

In your Vercel project settings:

1. Go to https://vercel.com/frankielee1971/digitallydefined-reputation-dashboard/settings/environment-variables
2. Add the following variables:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_ANON_KEY` = your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key

## 7. Test the Integration

### Test Submit Quiz Endpoint

```bash
curl -X POST https://dashboard.digitallydefined.online/api/submit-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid-here",
    "quiz_id": "quiz-001",
    "score": 85,
    "answers_json": {
      "q1": "answer1",
      "q2": "answer2"
    }
  }'
```

### Test Dashboard Endpoints

```bash
# Get user dashboard
curl https://dashboard.digitallydefined.online/api/dashboard/user/USER_ID

# Get quiz results
curl https://dashboard.digitallydefined.online/api/dashboard/quiz/USER_ID

# Get workflows
curl https://dashboard.digitallydefined.online/api/dashboard/workflows/USER_ID

# Get events
curl https://dashboard.digitallydefined.online/api/dashboard/events/USER_ID
```

## 8. Enable Realtime in Supabase

1. Go to https://app.supabase.com/project/_/database/replication
2. Enable replication for:
   - `quiz_results`
   - `workflows`
   - `events`

## 9. File Structure

```
digitallydefined-reputation-dashboard/
├── .env.local                          # Environment variables (NOT committed)
├── .gitignore                          # Git ignore rules
├── lib/
│   ├── supabase.ts                     # Supabase client configuration
│   ├── types/
│   │   └── Database.ts                 # TypeScript database types
│   ├── workflows.ts                    # Workflow engine logic
│   └── utils/
│       └── supabaseQueries.ts          # Reusable Supabase queries
├── api/
│   ├── submit-quiz.js                  # Quiz submission endpoint
│   └── dashboard/
│       ├── user/[id]/route.js          # User dashboard data
│       ├── quiz/[id]/route.js          # Quiz results
│       ├── workflows/[id]/route.js     # Workflow data
│       └── events/[id]/route.js        # Event data
└── components/
    └── realtime/
        └── useRealtimeSubscriptions.js # React hooks for realtime updates
```

## 10. Usage in React Components

### Example: Using Realtime Subscriptions

```jsx
import { useAllRealtimeSubscriptions } from '../components/realtime/useRealtimeSubscriptions';

function Dashboard({ userId }) {
  const { isAnyConnected, errors } = useAllRealtimeSubscriptions(userId, {
    onQuizResultUpdate: (payload) => {
      console.log('New quiz result:', payload);
      // Update your state here
    },
    onWorkflowUpdate: (payload) => {
      console.log('Workflow updated:', payload);
      // Update your state here
    },
    onEventUpdate: (payload) => {
      console.log('New event:', payload);
      // Update your state here
    },
  });

  return (
    <div>
      <p>Realtime connected: {isAnyConnected ? 'Yes' : 'No'}</p>
      {errors.map((error, i) => (
        <p key={i} style={{ color: 'red' }}>Error: {error}</p>
      ))}
    </div>
  );
}
```

### Example: Fetching Dashboard Data

```jsx
import { useState, useEffect } from 'react';

function Dashboard({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/dashboard/user/${userId}`)
      .then(res => res.json())
      .then(setData);
  }, [userId]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {data.data.user.full_name}</h1>
      <p>Average Score: {data.data.stats.averageScore}</p>
      <p>Total Workflows: {data.data.stats.totalWorkflows}</p>
    </div>
  );
}
```

## 11. Security Notes

- **Never expose** `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Always use the service role key only in serverless functions (`api/` directory)
- Use the anon key for client-side operations
- RLS policies are configured to restrict data access
- CORS is configured to only allow your domains

## 12. Troubleshooting

### CORS Errors
Ensure your Vercel deployment has the correct environment variables set.

### Realtime Not Working
1. Check that Realtime is enabled in Supabase dashboard
2. Verify RLS policies allow access
3. Check browser console for errors

### Type Errors
Run `supabase gen types` to regenerate types from your schema.

## 13. Next Steps

- Customize workflow generation logic in `lib/workflows.ts`
- Add authentication (Supabase Auth or your existing auth)
- Implement error handling and retries
- Add rate limiting to API routes
- Set up monitoring and logging
- Create additional workflow types as needed

## Support

For issues or questions, contact the DigitallyDefined team or check the Supabase documentation: https://supabase.com/docs