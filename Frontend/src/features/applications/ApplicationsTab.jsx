import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Calendar, Copy, Mail, MessageSquareText, Wallet, X } from 'lucide-react';
import { useAxiosInstance } from '@/config/axiosConfig';
import { freelancerApi } from '@/api/freelancerApi';
import { seedApplications } from '@/lib/mockData';
import { useAppStore } from '@/store/useAppStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'active', label: 'Active Contracts' },
  { key: 'completed', label: 'Completed' },
];

const STATUS_META = {
  applied: { label: 'Applied', variant: 'default' },
  shortlisted: { label: 'Shortlisted', variant: 'warning' },
  hired: { label: 'Active Contract', variant: 'success' },
  completed: { label: 'Completed', variant: 'secondary' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  withdrawn: { label: 'Withdrawn', variant: 'secondary' },
};

function matchesFilter(status, filter) {
  if (filter === 'all') return true;
  if (filter === 'pending') return status === 'applied' || status === 'shortlisted';
  if (filter === 'active') return status === 'hired';
  if (filter === 'completed') return status === 'completed';
  return true;
}

export default function ApplicationsTab() {
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();
  const filter = useAppStore((s) => s.applicationFilter);
  const setFilter = useAppStore((s) => s.setApplicationFilter);
  const [coverLetterApp, setCoverLetterApp] = useState(null);
  const [withdrawApp, setWithdrawApp] = useState(null);

  const { data: applications, isLoading } = useQuery({
    queryKey: ['freelancer', 'applications'],
    queryFn: () => freelancerApi.getApplications(axios),
    placeholderData: seedApplications,
  });

  const withdrawMutation = useMutation({
    mutationFn: (id) => freelancerApi.withdrawApplication(axios, id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData(['freelancer', 'applications'], (prev) =>
        (prev ?? []).map((a) => (a.id === id ? { ...a, status: 'withdrawn' } : a)),
      );
      setWithdrawApp(null);
    },
  });

  const list = applications ?? seedApplications;
  const filtered = useMemo(() => list.filter((a) => matchesFilter(a.status, filter)), [list, filter]);

  const counts = useMemo(
    () => ({
      all: list.length,
      pending: list.filter((a) => matchesFilter(a.status, 'pending')).length,
      active: list.filter((a) => matchesFilter(a.status, 'active')).length,
      completed: list.filter((a) => matchesFilter(a.status, 'completed')).length,
    }),
    [list],
  );

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Tab 3 · Job history"
        title="My Applications"
        description="Every proposal you've sent, and where it stands."
      />

      {/* Pill filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              filter === f.key ? 'text-white' : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {filter === f.key && (
              <motion.div layoutId="filter-pill" className="absolute inset-0 rounded-full [background-image:var(--mode-gradient)]" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
            )}
            <span className="relative z-10">
              {f.label} <span className="opacity-80">· {counts[f.key]}</span>
            </span>
          </button>
        ))}
      </div>

      {isLoading && !applications ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((app) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ApplicationCard
                  app={app}
                  onViewCoverLetter={() => setCoverLetterApp(app)}
                  onWithdraw={() => setWithdrawApp(app)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Cover letter dialog */}
      <Dialog open={!!coverLetterApp} onOpenChange={(open) => !open && setCoverLetterApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{coverLetterApp?.jobTitle}</DialogTitle>
            <DialogDescription>Your cover letter for {coverLetterApp?.clientName}</DialogDescription>
          </DialogHeader>
          <p className="rounded-lg bg-muted p-4 text-sm leading-relaxed text-foreground">{coverLetterApp?.coverLetter}</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw confirmation dialog */}
      <Dialog open={!!withdrawApp} onOpenChange={(open) => !open && setWithdrawApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw application?</DialogTitle>
            <DialogDescription>
              You're about to withdraw your proposal for "{withdrawApp?.jobTitle}". The client won't be able to consider it further, and this cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep application</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={withdrawMutation.isPending}
              onClick={() => withdrawApp && withdrawMutation.mutate(withdrawApp.id)}
            >
              {withdrawMutation.isPending ? 'Withdrawing…' : 'Withdraw application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ApplicationCard({ app, onViewCoverLetter, onWithdraw }) {
  const meta = STATUS_META[app.status];
  const isPending = app.status === 'applied' || app.status === 'shortlisted';
  const isHired = app.status === 'hired';
  const isCompleted = app.status === 'completed';

  return (
    <Card className={cn(isHired && 'border-primary/40 ring-1 ring-primary/20')}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <Badge variant={meta.variant}>{meta.label}</Badge>
              {app.status === 'rejected' && <span className="text-xs text-muted-foreground">No feedback provided</span>}
            </div>
            <h3 className="truncate font-display text-base font-bold text-foreground">{app.jobTitle}</h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Wallet className="h-3.5 w-3.5" /> {formatCurrency(app.fixedBudget)} fixed
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> {app.clientName} · {app.clientType}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Applied {formatDate(app.appliedDate)}
              </span>
            </div>
          </div>
        </div>

        {isHired && (
          <ClientEmailReveal email={app.clientEmail} label="You're hired — contact your client to get started" />
        )}
        {isCompleted && <ClientEmailReveal email={app.clientEmail} label="Job completed — reach out for future work" muted />}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onViewCoverLetter}>
            <MessageSquareText className="h-3.5 w-3.5" /> View cover letter
          </Button>
          {isPending && (
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-red-50" onClick={onWithdraw}>
              <X className="h-3.5 w-3.5" /> Withdraw application
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ClientEmailReveal({ email, label, muted = false }) {
  const [copied, setCopied] = useState(false);
  if (!email) return null;

  return (
    <div className={cn('mt-4 flex items-center justify-between rounded-lg border p-3', muted ? 'border-border bg-muted/40' : 'border-primary/30 bg-primary-soft')}>
      <div className="flex items-center gap-3">
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-full', muted ? 'bg-muted text-muted-foreground' : 'bg-primary text-white')}>
          <Mail className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{email}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition hover:bg-white/70 hover:text-foreground"
      >
        <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

function EmptyState({ filter }) {
  const copy = {
    all: "You haven't sent any applications yet. Once you apply to a job, it'll show up here.",
    pending: 'No pending applications right now.',
    active: 'No active contracts yet. Applications move here once a client hires you.',
    completed: "You haven't completed a job yet.",
  };
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-2 py-14 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
          <MessageSquareText className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-foreground">Nothing here yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">{copy[filter]}</p>
      </CardContent>
    </Card>
  );
}
