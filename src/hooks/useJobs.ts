import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Job, CreateJobInput, JobStatus, JobPriority } from '@/types/job';
import type { Json } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export function useJobs(filters?: { status?: JobStatus; priority?: JobPriority }) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Job[];
    },
  });
}

export function useJob(id: string | null) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Job;
    },
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateJobInput) => {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          task_name: input.task_name,
          payload: input.payload as Json,
          priority: input.priority,
          webhook_url: input.webhook_url,
          status: 'pending' as const,
        }])
        .select()
        .single();
      if (error) throw error;
      return data as Job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create job: ' + error.message);
    },
  });
}

export function useRunJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      // Call the edge function to run the job
      const { data, error } = await supabase.functions.invoke('run-job', {
        body: { jobId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job started successfully');
    },
    onError: (error) => {
      toast.error('Failed to run job: ' + error.message);
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase.from('jobs').delete().eq('id', jobId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete job: ' + error.message);
    },
  });
}

export function useJobsRealtime() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['jobs-realtime-subscription'],
    queryFn: () => {
      const channel = supabase
        .channel('jobs-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'jobs' },
          () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
          }
        )
        .subscribe();

      return channel;
    },
    staleTime: Infinity,
  });
}
