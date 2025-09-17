-- Create table for AI configuration
create table user_ai_config (
  id uuid references auth.users primary key,
  api_key text not null,
  model text default 'gpt-3.5-turbo',
  api_url text default 'https://api.openai.com/v1/chat/completions',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create table for calendar connections
create table calendar_connections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  calendar_type text not null check (calendar_type in ('google', 'outlook')),
  access_token text,
  refresh_token text,
  expires_at timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, calendar_type)
);

-- Create table for calendar events
create table calendar_events (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references tasks not null,
  user_id uuid references auth.users not null,
  calendar_type text not null check (calendar_type in ('google', 'outlook')),
  external_id text not null,
  title text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  last_synced timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(task_id, calendar_type)
);

-- Create table for task recommendations
create table task_recommendations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  task_id uuid references tasks not null,
  recommended_order integer not null,
  estimated_start_time text,
  estimated_end_time text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index idx_calendar_events_task_id on calendar_events(task_id);
create index idx_calendar_events_user_id on calendar_events(user_id);
create index idx_task_recommendations_user_id on task_recommendations(user_id);
create index idx_task_recommendations_task_id on task_recommendations(task_id);