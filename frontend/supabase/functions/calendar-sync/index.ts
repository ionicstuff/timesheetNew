// Import the Supabase client
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  attendees?: string[];
  calendar_type: 'google' | 'outlook';
  external_id?: string;
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

    // Extract user ID from auth header
    const userId = authHeader.split(' ')[1];

    // Fetch user's calendar connections
    const { data: connections, error: connError } = await supabase
      .from('calendar_connections')
      .select('*')
      .eq('user_id', userId);

    if (connError) {
      throw new Error(`Database error: ${connError.message}`);
    }

    // Fetch user's tasks that need to be synced
    const { data: tasks, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false)
      .not('due_date', 'is', null);

    if (taskError) {
      throw new Error(`Task fetch error: ${taskError.message}`);
    }

    const syncedEvents: CalendarEvent[] = [];

    // Process each calendar connection
    for (const connection of connections) {
      if (!connection.is_active) continue;

      // Sync tasks to this calendar
      for (const task of tasks) {
        // Check if event already exists
        const { data: existingEvent, error: existError } = await supabase
          .from('calendar_events')
          .select('*')
          .eq('task_id', task.id)
          .eq('calendar_type', connection.calendar_type)
          .single();

        if (existError && existError.code !== 'PGRST116') {
          console.error('Error checking existing event:', existError);
          continue;
        }

        // Create or update calendar event
        const event: CalendarEvent = {
          title: task.title,
          description: task.description || '',
          start_time: task.due_date,
          end_time: new Date(new Date(task.due_date).getTime() + 3600000).toISOString(), // +1 hour
          calendar_type: connection.calendar_type,
          external_id: existingEvent?.external_id
        };

        // In a real implementation, we would:
        // 1. Call the appropriate calendar API (Google/Outlook)
        // 2. Create/update the event
        // 3. Save the external event ID

        // For now, we'll simulate the sync
        const externalId = `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Save to our database
        const { error: saveError } = await supabase
          .from('calendar_events')
          .upsert({
            task_id: task.id,
            user_id: userId,
            calendar_type: connection.calendar_type,
            external_id: externalId,
            title: event.title,
            start_time: event.start_time,
            end_time: event.end_time,
            last_synced: new Date().toISOString()
          }, {
            onConflict: 'task_id,calendar_type'
          });

        if (saveError) {
          console.error('Error saving calendar event:', saveError);
          continue;
        }

        syncedEvents.push({ ...event, id: externalId });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Calendar sync completed successfully',
        events_synced: syncedEvents.length,
        events: syncedEvents
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