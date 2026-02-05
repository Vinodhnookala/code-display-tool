import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useJob, useRunJob, useDeleteJob } from '@/hooks/useJobs';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Play, Trash2, Loader2, Calendar, Clock, Webhook, FileJson } from 'lucide-react';
import { format } from 'date-fns';

interface JobDetailSheetProps {
  jobId: string | null;
  onClose: () => void;
}

export function JobDetailSheet({ jobId, onClose }: JobDetailSheetProps) {
  const { data: job, isLoading } = useJob(jobId);
  const runJob = useRunJob();
  const deleteJob = useDeleteJob();

  const handleRun = async () => {
    if (!job) return;
    await runJob.mutateAsync(job.id);
  };

  const handleDelete = async () => {
    if (!job) return;
    await deleteJob.mutateAsync(job.id);
    onClose();
  };

  return (
    <Sheet open={!!jobId} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg glass-card border-l-border overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : job ? (
          <div className="animate-fade-in">
            <SheetHeader className="space-y-3">
              <SheetTitle className="text-xl font-semibold">{job.task_name}</SheetTitle>
              <div className="flex items-center gap-3">
                <StatusBadge status={job.status} />
                <PriorityBadge priority={job.priority} />
              </div>
            </SheetHeader>

            <div className="mt-8 space-y-6">
              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Created
                  </p>
                  <p className="text-sm font-medium">
                    {format(new Date(job.created_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                {job.completed_at && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Completed
                    </p>
                    <p className="text-sm font-medium">
                      {format(new Date(job.completed_at), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                )}
              </div>

              {/* Payload */}
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <FileJson className="w-4 h-4 text-primary" />
                  Payload
                </p>
                <pre className="p-4 rounded-lg bg-muted/50 border border-border overflow-x-auto text-xs font-mono">
                  {JSON.stringify(job.payload, null, 2)}
                </pre>
              </div>

              {/* Webhook URL */}
              {job.webhook_url && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Webhook className="w-4 h-4 text-primary" />
                    Webhook URL
                  </p>
                  <p className="text-sm text-muted-foreground break-all bg-muted/50 p-3 rounded-lg border border-border">
                    {job.webhook_url}
                  </p>
                </div>
              )}

              {/* Webhook Response */}
              {job.webhook_response && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Webhook className="w-4 h-4 text-status-completed" />
                    Webhook Response
                  </p>
                  <pre className="p-4 rounded-lg bg-muted/50 border border-border overflow-x-auto text-xs font-mono">
                    {JSON.stringify(job.webhook_response, null, 2)}
                  </pre>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                {job.status === 'pending' && (
                  <Button
                    onClick={handleRun}
                    disabled={runJob.isPending}
                    className="btn-gradient flex-1 gap-2"
                  >
                    {runJob.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    Run Job
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={deleteJob.isPending}
                  className="text-destructive hover:bg-destructive/10 gap-2"
                >
                  {deleteJob.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
