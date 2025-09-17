interface LLMConfig {
  apiKey: string;
  model: string;
  apiUrl: string;
}

class LLMClient {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async generateTaskSchedule(tasks: any[], preferences: any) {
    const prompt = `
      You are an AI task scheduling assistant. Analyze the following tasks and create an optimized schedule.
      
      Tasks:
      ${JSON.stringify(tasks, null, 2)}
      
      User Preferences:
      ${JSON.stringify(preferences, null, 2)}
      
      Please provide:
      1. Prioritized task order
      2. Estimated time for each task
      3. Scheduling recommendations
      4. Potential blockers or dependencies
      
      Format your response as JSON.
    `;

    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.statusText}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('LLM API call failed:', error);
      throw error;
    }
  }
}

// Initialize with default config (can be overridden)
export const llmClient = new LLMClient({
  apiKey: import.meta.env.VITE_LLM_API_KEY || '',
  model: import.meta.env.VITE_LLM_MODEL || 'gpt-3.5-turbo',
  apiUrl: import.meta.env.VITE_LLM_API_URL || 'https://api.openai.com/v1/chat/completions'
});