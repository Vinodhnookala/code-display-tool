export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';
export type JobPriority = 'low' | 'medium' | 'high';

export interface Job {
  id: string;
  task_name: string;
  payload: Record<string, unknown>;
  priority: JobPriority;
  status: JobStatus;
  webhook_url?: string;
  webhook_response?: Record<string, unknown>;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJobInput {
  task_name: string;
  payload: Record<string, unknown>;
  priority: JobPriority;
  webhook_url?: string;
}
