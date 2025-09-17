// Import the Supabase client
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface Task {
  id: number;
  title: string;
  description: string;
  project_id: number;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  estimated_time: number;
  dependencies: number[];
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface ScheduleRecommendation {
  task_id: number;
  recommended_order: number;
  estimated_start_time?: string;
  estimated_end_time?: string;
  notes?: string;
}

serve(async (_req) => {
  try {
    // Get user ID from request headers
    const authHeader = _req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { headers: { 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Extract user ID from auth header (in real implementation, verify JWT)
    const userId = authHeader.split(' ')[1];

    // Fetch user's incomplete tasks
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false)
      .order('due_date', { ascending: true });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Get AI service configuration for the user
    const { data: aiConfig, error: configError } = await supabase
      .from('user_ai_config')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (configError) {
      throw new Error(`AI config error: ${configError.message}`);
    }

    if (!aiConfig || !aiConfig.api_key) {
      throw new Error('AI configuration not found for user');
    }

    // Prepare prompt for AI
    const prompt = `
      You are an AI task scheduling assistant. Analyze the following tasks and create an optimized schedule.
      
      Tasks:
      ${JSON.stringify(tasks, null, 2)}
      
      User Preferences:
      - Work hours: 9:00 AM to 5:00 PM
      - Prefer to complete high priority tasks first
      - Try to group similar tasks together
      
      Please provide:
      1. Prioritized task order (as recommended_order)
      2. Estimated start and end times for each task
      3. Scheduling recommendations
      4. Potential blockers or dependencies
      
      Format your response as JSON array of ScheduleRecommendation objects.
    `;

    // Call AI service
    const aiResponse = await fetch(aiConfig.api_url || 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiConfig.api_key}`
      },
      body: JSON.stringify({
        model: aiConfig.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`AI service error: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    const recommendations: ScheduleRecommendation[] = JSON.parse(
      aiData.choices[0].message.content
    );

    // Save recommendations to database
    const { error: saveError } = await supabase
      .from('task_recommendations')
      .insert(
        recommendations.map(rec => ({
          user_id: userId,
          task_id: rec.task_id,
          recommended_order: rec.recommended_order,
          estimated_start_time: rec.estimated_start_time,
          estimated_end_time: rec.estimated_end_time,
          notes: rec.notes,
          created_at: new Date().toISOString()
        }))
      );

    if (saveError) {
      throw new Error(`Failed to save recommendations: ${saveError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        message: 'Task schedule generated successfully',
        recommendations 
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});