import { JobStatus } from '@/types/job';
import { Clock, Play, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  status: JobStatus;
}

const statusConfig: Record<JobStatus, { icon: typeof Clock; label: string; className: string }> = {
  pending: {
    icon: Clock,
    label: 'Pending',
    className: 'status-badge status-pending',
  },
  running: {
    icon: Loader2,
    label: 'Running',
    className: 'status-badge status-running',
  },
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    className: 'status-badge status-completed',
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    className: 'status-badge status-failed',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={config.className}>
      <Icon className={`w-3.5 h-3.5 ${status === 'running' ? 'animate-spin' : ''}`} />
      {config.label}
    </span>
  );
}
