import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { JobStatus, JobPriority } from '@/types/job';
import { Filter, X } from 'lucide-react';

interface JobsFilterProps {
  status: JobStatus | undefined;
  priority: JobPriority | undefined;
  onStatusChange: (status: JobStatus | undefined) => void;
  onPriorityChange: (priority: JobPriority | undefined) => void;
}

export function JobsFilter({ status, priority, onStatusChange, onPriorityChange }: JobsFilterProps) {
  const hasFilters = status || priority;

  const clearFilters = () => {
    onStatusChange(undefined);
    onPriorityChange(undefined);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span>Filter:</span>
      </div>

      <Select value={status || 'all'} onValueChange={(v) => onStatusChange(v === 'all' ? undefined : v as JobStatus)}>
        <SelectTrigger className="w-[140px] bg-card border-border">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="running">Running</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priority || 'all'} onValueChange={(v) => onPriorityChange(v === 'all' ? undefined : v as JobPriority)}>
        <SelectTrigger className="w-[140px] bg-card border-border">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground gap-1.5">
          <X className="w-3.5 h-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
