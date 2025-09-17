# Welcome to your Dyad app

## Getting Started

This application includes advanced features that require external service integrations:

### 1. Supabase Setup
The app uses Supabase for database operations and serverless functions. After adding Supabase integration:
1. Set up the database schema using the provided migrations
2. Configure authentication
3. Deploy the Supabase functions

### 2. AI Service Configuration
To enable AI features:
1. Obtain an API key from your preferred AI provider (OpenAI, Anthropic, etc.)
2. Add the following environment variables:
   - `VITE_LLM_API_KEY` - Your AI service API key
   - `VITE_LLM_MODEL` - Model to use (e.g., gpt-3.5-turbo)
   - `VITE_LLM_API_URL` - API endpoint URL

### 3. Calendar Integration Setup
To enable calendar synchronization:
1. For Google Calendar:
   - Create a Google Cloud project
   - Enable the Google Calendar API
   - Create OAuth2 credentials
   - Add `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_API_KEY` to environment variables

2. For Outlook Calendar:
   - Register an application in Azure AD
   - Configure API permissions
   - Add `VITE_OUTLOOK_CLIENT_ID` to environment variables

### 4. Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Service
VITE_LLM_API_KEY=your_ai_api_key
VITE_LLM_MODEL=gpt-3.5-turbo
VITE_LLM_API_URL=https://api.openai.com/v1/chat/completions

# Google Calendar
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_API_KEY=your_google_api_key

# Outlook Calendar
VITE_OUTLOOK_CLIENT_ID=your_outlook_client_id
```

### 5. Database Migrations
Run the provided SQL migrations to set up the required database tables:
1. `supabase/migrations/001_ai_calendar_schema.sql`

### 6. Function Deployment
Deploy the Supabase functions:
1. `supabase/functions/ai-task-scheduler/index.ts`
2. `supabase/functions/calendar-sync/index.ts`

After completing these steps, the application will have:
- AI-powered task scheduling
- Calendar synchronization with Google and Outlook
- Full database integration
- Serverless function support