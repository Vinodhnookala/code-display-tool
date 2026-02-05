import { JobPriority } from '@/types/job';
import { ArrowDown, Minus, ArrowUp } from 'lucide-react';

interface PriorityBadgeProps {
  priority: JobPriority;
}

const priorityConfig: Record<JobPriority, { icon: typeof ArrowDown; label: string; className: string }> = {
  low: {
    icon: ArrowDown,
    label: 'Low',
    className: 'priority-badge priority-low',
  },
  medium: {
    icon: Minus,
    label: 'Medium',
    className: 'priority-badge priority-medium',
  },
  high: {
    icon: ArrowUp,
    label: 'High',
    className: 'priority-badge priority-high',
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <span className={config.className}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
