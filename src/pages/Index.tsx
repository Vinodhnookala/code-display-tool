import { useState, useEffect } from 'react';
import { useJobs, useJobsRealtime } from '@/hooks/useJobs';
import { JobStatus, JobPriority } from '@/types/job';
import { CreateJobDialog } from '@/components/jobs/CreateJobDialog';
import { JobsTable } from '@/components/jobs/JobsTable';
import { JobsFilter } from '@/components/jobs/JobsFilter';
import { JobDetailSheet } from '@/components/jobs/JobDetailSheet';
import { StatsCards } from '@/components/jobs/StatsCards';
import { Zap, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [statusFilter, setStatusFilter] = useState<JobStatus | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<JobPriority | undefined>();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { data: jobs = [], isLoading, refetch, isRefetching } = useJobs({
    status: statusFilter,
    priority: priorityFilter,
  });

  const { data: allJobs = [] } = useJobs(); // For stats

  // Subscribe to realtime updates
  useJobsRealtime();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Job Scheduler</h1>
                <p className="text-sm text-muted-foreground">Automation Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isRefetching}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <CreateJobDialog />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <section className="mb-8">
          <StatsCards jobs={allJobs} />
        </section>

        {/* Filters */}
        <section className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-lg font-semibold">Jobs</h2>
          <JobsFilter
            status={statusFilter}
            priority={priorityFilter}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
          />
        </section>

        {/* Table */}
        <section>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <JobsTable jobs={jobs} onViewJob={setSelectedJobId} />
          )}
        </section>
      </main>

      {/* Job Detail Sheet */}
      <JobDetailSheet jobId={selectedJobId} onClose={() => setSelectedJobId(null)} />
    </div>
  );
};

export default Index;
