import { Job } from '@/types/job';
import { Clock, Play, CheckCircle2, XCircle } from 'lucide-react';

interface StatsCardsProps {
  jobs: Job[];
}

export function StatsCards({ jobs }: StatsCardsProps) {
  const stats = {
    pending: jobs.filter((j) => j.status === 'pending').length,
    running: jobs.filter((j) => j.status === 'running').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
  };

  const cards = [
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      className: 'text-status-pending bg-[hsl(var(--status-pending-bg))]',
      iconBg: 'bg-[hsl(var(--status-pending-bg))]',
    },
    {
      label: 'Running',
      value: stats.running,
      icon: Play,
      className: 'text-status-running bg-[hsl(var(--status-running-bg))]',
      iconBg: 'bg-[hsl(var(--status-running-bg))]',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      className: 'text-status-completed bg-[hsl(var(--status-completed-bg))]',
      iconBg: 'bg-[hsl(var(--status-completed-bg))]',
    },
    {
      label: 'Failed',
      value: stats.failed,
      icon: XCircle,
      className: 'text-status-failed bg-[hsl(var(--status-failed-bg))]',
      iconBg: 'bg-[hsl(var(--status-failed-bg))]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="glass-card p-5 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.iconBg}`}>
              <card.icon className={`w-6 h-6 ${card.className.split(' ')[0]}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
