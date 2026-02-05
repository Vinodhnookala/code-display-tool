-- Create enum for job status
CREATE TYPE public.job_status AS ENUM ('pending', 'running', 'completed', 'failed');

-- Create enum for job priority
CREATE TYPE public.job_priority AS ENUM ('low', 'medium', 'high');

-- Create jobs table
CREATE TABLE public.jobs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_name TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    priority job_priority NOT NULL DEFAULT 'medium',
    status job_status NOT NULL DEFAULT 'pending',
    webhook_url TEXT,
    webhook_response JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for this demo)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (this is a demo/internal tool)
CREATE POLICY "Anyone can view jobs" 
ON public.jobs 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update jobs" 
ON public.jobs 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete jobs" 
ON public.jobs 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for jobs table
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;