import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateJob } from '@/hooks/useJobs';
import { JobPriority } from '@/types/job';
import { Plus, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function CreateJobDialog() {
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [payload, setPayload] = useState('{\n  \n}');
  const [priority, setPriority] = useState<JobPriority>('medium');
  const [webhookUrl, setWebhookUrl] = useState('');

  const createJob = useCreateJob();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate JSON
    let parsedPayload: Record<string, unknown>;
    try {
      parsedPayload = JSON.parse(payload);
    } catch {
      toast.error('Invalid JSON payload');
      return;
    }

    await createJob.mutateAsync({
      task_name: taskName,
      payload: parsedPayload,
      priority,
      webhook_url: webhookUrl || undefined,
    });

    // Reset form
    setTaskName('');
    setPayload('{\n  \n}');
    setPriority('medium');
    setWebhookUrl('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-gradient gap-2">
          <Plus className="w-4 h-4" />
          Create Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Zap className="w-5 h-5 text-primary" />
            Create New Job
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="taskName" className="text-sm font-medium">
              Task Name
            </Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Send Welcome Email"
              required
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payload" className="text-sm font-medium">
              Payload (JSON)
            </Label>
            <Textarea
              id="payload"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              placeholder='{"key": "value"}'
              className="font-mono text-sm min-h-[120px] bg-background border-border focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">
              Priority
            </Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as JobPriority)}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookUrl" className="text-sm font-medium">
              Webhook URL <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="webhookUrl"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://webhook.site/your-id"
              type="url"
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createJob.isPending} className="btn-gradient gap-2">
              {createJob.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
