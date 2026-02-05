import { Job } from '@/types/job';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Button } from '@/components/ui/button';
import { useRunJob } from '@/hooks/useJobs';
import { Play, Loader2, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface JobsTableProps {
  jobs: Job[];
  onViewJob: (jobId: string) => void;
}

export function JobsTable({ jobs, onViewJob }: JobsTableProps) {
  const runJob = useRunJob();

  const handleRun = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    await runJob.mutateAsync(jobId);
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <Play className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-lg">No jobs found</p>
        <p className="text-sm text-muted-foreground mt-1">Create a new job to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card/50">
      <table className="data-table">
        <thead>
          <tr className="bg-muted/30">
            <th>Task Name</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr
              key={job.id}
              onClick={() => onViewJob(job.id)}
              className="cursor-pointer transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <td className="font-medium">{job.task_name}</td>
              <td>
                <StatusBadge status={job.status} />
              </td>
              <td>
                <PriorityBadge priority={job.priority} />
              </td>
              <td className="text-muted-foreground">
                {format(new Date(job.created_at), 'MMM d, HH:mm')}
              </td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {job.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={(e) => handleRun(e, job.id)}
                      disabled={runJob.isPending}
                      className="btn-gradient gap-1.5"
                    >
                      {runJob.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      Run
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewJob(job.id);
                    }}
                    className="gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
