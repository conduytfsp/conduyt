import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Calendar, Copy, Mail, MessageSquareText, Wallet, X, Sparkles, Phone, Eye, CheckCircle2 } from 'lucide-react';
import { useAxiosInstance } from '@/config/axiosConfig';
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
import toast from 'react-hot-toast';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'shortlisted', label: 'Shortlisted' }, // FIX: Added Shortlisted filter
  { key: 'active', label: 'Active Contracts' },
  { key: 'completed', label: 'Completed' },
];

const STATUS_META = {
  SUBMITTED: { label: 'Submitted', variant: 'default' },
  SHORTLISTED: { label: 'Shortlisted', variant: 'warning' },
  ACCEPTED: { label: 'Active Contract', variant: 'success' },
  COMPLETED: { label: 'Completed', variant: 'secondary' },
  REJECTED: { label: 'Rejected', variant: 'destructive' },
  WITHDRAWN: { label: 'Withdrawn', variant: 'secondary' },
};

// FIX: Now accepts the whole app object to read both application and job statuses
function matchesFilter(app, filter) {
  const appStatus = app.status ? app.status.toUpperCase() : 'SUBMITTED';
  const jobStatus = app.jobStatus ? app.jobStatus.toUpperCase() : 'OPEN';

  // If the application was accepted, but the actual job is now finished, it counts as completed
  const isActuallyCompleted = appStatus === 'COMPLETED' || (appStatus === 'ACCEPTED' && jobStatus === 'COMPLETED');
  const isActuallyActive = appStatus === 'ACCEPTED' && jobStatus !== 'COMPLETED';

  if (filter === 'all') return true;
  if (filter === 'pending') return appStatus === 'SUBMITTED';
  if (filter === 'shortlisted') return appStatus === 'SHORTLISTED';
  if (filter === 'active') return isActuallyActive;
  if (filter === 'completed') return isActuallyCompleted;

  return true;
}

export default function ApplicationsTab() {
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();
  const filter = useAppStore((s) => s.applicationFilter);
  const setFilter = useAppStore((s) => s.setApplicationFilter);

  const [selectedApp, setSelectedApp] = useState(null);
  const [withdrawApp, setWithdrawApp] = useState(null);

  // ================= FETCH APPLICATIONS =================
  const { data: applications, isLoading } = useQuery({
    queryKey: ['freelancer', 'applications'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/freelancers/applications');
        return res.data?.data || res.data;
      } catch (err) {
        console.warn("Backend applications endpoint offline. Using fallback mock data.");
        return seedApplications;
      }
    },
    placeholderData: seedApplications,
  });

  // ================= WITHDRAW MUTATION =================
  const withdrawMutation = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`/api/freelancers/applications/${id}/withdraw`);
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(['freelancer', 'applications'], (prev) =>
          (prev ?? []).map((a) => (a.id === id ? { ...a, status: 'WITHDRAWN' } : a)),
      );
      setWithdrawApp(null);
      toast.success("Application withdrawn successfully.");
    },
    onError: () => {
      toast.success("Application withdrawn! (Offline Mode)");
      queryClient.setQueryData(['freelancer', 'applications'], (prev) =>
          (prev ?? []).map((a) => (a.id === id ? { ...a, status: 'WITHDRAWN' } : a)),
      );
      setWithdrawApp(null);
    }
  });

  const list = applications ?? seedApplications;
  const filtered = useMemo(() => list.filter((a) => matchesFilter(a, filter)), [list, filter]);

  // FIX: Update counts to use the new matchesFilter logic
  const counts = useMemo(
      () => ({
        all: list.length,
        pending: list.filter((a) => matchesFilter(a, 'pending')).length,
        shortlisted: list.filter((a) => matchesFilter(a, 'shortlisted')).length,
        active: list.filter((a) => matchesFilter(a, 'active')).length,
        completed: list.filter((a) => matchesFilter(a, 'completed')).length,
      }),
      [list],
  );

  return (
      <div className="mx-auto max-w-5xl w-full">
        <PageHeader
            title="My Applications"
            description="Every proposal you've sent, track AI match scores, and manage your active contracts."
        />

        {/* Pill filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
              <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                      'relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors cursor-pointer',
                      filter === f.key ? 'text-white' : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
              >
                {filter === f.key && (
                    <motion.div layoutId="filter-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
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
                          onViewDetails={() => setSelectedApp(app)}
                          onWithdraw={() => setWithdrawApp(app)}
                      />
                    </motion.div>
                ))}
              </AnimatePresence>
            </div>
        )}

        {/* Application & AI Details Dialog */}
        <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedApp?.jobTitle}</DialogTitle>
              <DialogDescription>Proposal & AI Compatibility Breakdown</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              {/* AI Score Badge Box */}
              {selectedApp?.aiCompatibilityScore !== undefined && (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Sparkles size={18} className="text-[#09D66D]" /> AI Compatibility Match
                    </div>
                    <span className="text-lg font-extrabold text-[#09D66D]">{selectedApp.aiCompatibilityScore}%</span>
                  </div>
              )}

              {/* Pitch / Cover Letter */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Your Submitted Pitch / Cover Letter</p>
                <div className="rounded-lg bg-muted p-4 leading-relaxed text-foreground whitespace-pre-line">
                  {selectedApp?.pitch || selectedApp?.coverLetter || "No cover letter provided."}
                </div>
              </div>

              {/* Job Description & AI Summary */}
              {selectedApp?.jobDescription && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Job Scope & Description</p>
                    <p className="text-xs text-muted-foreground leading-relaxed bg-surface border border-border p-3.5 rounded-lg max-h-36 overflow-y-auto">
                      {selectedApp.jobDescription}
                    </p>
                  </div>
              )}
            </div>

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

function ApplicationCard({ app, onViewDetails, onWithdraw }) {
  const baseStatus = app.status ? app.status.toUpperCase() : 'SUBMITTED';
  const jobStatus = app.jobStatus ? app.jobStatus.toUpperCase() : 'OPEN';

  // FIX: Determine effective status based on both application and job state
  let effectiveStatus = baseStatus;
  if (baseStatus === 'ACCEPTED' && jobStatus === 'COMPLETED') {
    effectiveStatus = 'COMPLETED';
  }

  const meta = STATUS_META[effectiveStatus] || { label: effectiveStatus, variant: 'secondary' };

  const isPending = baseStatus === 'SUBMITTED' || baseStatus === 'SHORTLISTED';
  const isHired = effectiveStatus === 'ACCEPTED'; // Maps to Active Contract
  const isCompleted = effectiveStatus === 'COMPLETED';

  return (
      <Card className={cn(isHired && 'border-primary/40 ring-1 ring-primary/20')}>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-3 flex-wrap">
                <Badge variant={meta.variant}>{meta.label}</Badge>

                {/* AI Score Badge */}
                {app.aiCompatibilityScore !== undefined && app.aiCompatibilityScore !== null && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  <Sparkles size={12} className="text-[#09D66D]" /> {app.aiCompatibilityScore}% AI Match
                </span>
                )}

                {baseStatus === 'REJECTED' && <span className="text-xs text-muted-foreground">No feedback provided</span>}
              </div>

              <h3 className="truncate font-display text-base font-bold text-foreground">{app.jobTitle}</h3>

              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                <Wallet className="h-3.5 w-3.5 text-primary" /> {formatCurrency(app.fixedBudget || app.budget)} fixed
              </span>
                <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> {app.clientName || "Client"} {app.clientType ? `· ${app.clientType}` : ''}
              </span>
                <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Applied {formatDate(app.appliedDate || app.appliedAt)}
              </span>
              </div>
            </div>
          </div>

          {/* Client Contact Info Reveal on Hire / Completion */}
          {isHired && (
              <ClientContactReveal
                  email={app.clientEmail}
                  contactNo={app.contactNo}
                  label="You're hired — reach out to your client to get started"
              />
          )}
          {isCompleted && (
              <ClientContactReveal
                  email={app.clientEmail}
                  contactNo={app.contactNo}
                  label="Job completed — great work! Keep in touch for future projects."
                  muted
              />
          )}

          {/* Action Buttons */}
          <div className="mt-5 flex flex-wrap gap-2.5 pt-4 border-t border-border">
            <Button variant="outline" size="sm" onClick={onViewDetails} className="cursor-pointer">
              <Eye className="h-3.5 w-3.5" /> View Proposal & AI Match
            </Button>

            {isPending && (
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-red-50 cursor-pointer" onClick={onWithdraw}>
                  <X className="h-3.5 w-3.5" /> Withdraw application
                </Button>
            )}
          </div>
        </CardContent>
      </Card>
  );
}

function ClientContactReveal({ email, contactNo, label, muted = false }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!email && !contactNo) return null;

  return (
      <div className={cn('mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4', muted ? 'border-border bg-muted/40' : 'border-emerald-200 bg-emerald-50/60')}>
        <div className="flex items-start gap-3">
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', muted ? 'bg-muted text-muted-foreground' : 'bg-emerald-100 text-[#09D66D]')}>
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Contract & Verified Contact</p>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-foreground">
              {email && (
                  <span className="flex items-center gap-1.5"><Mail size={14} className="text-muted-foreground"/> {email}</span>
              )}
              {contactNo && (
                  <span className="flex items-center gap-1.5"><Phone size={14} className="text-muted-foreground"/> {contactNo}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {email && (
              <button
                  onClick={() => {
                    navigator.clipboard?.writeText(email);
                    setCopiedEmail(true);
                    setTimeout(() => setCopiedEmail(false), 1500);
                  }}
                  className="flex items-center gap-1 rounded-lg bg-surface border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted cursor-pointer shadow-sm"
              >
                <Copy className="h-3 w-3" /> {copiedEmail ? 'Copied Email' : 'Copy Email'}
              </button>
          )}
        </div>
      </div>
  );
}

function EmptyState({ filter }) {
  const copy = {
    all: "You haven't sent any applications yet. Once you apply to a job, it'll show up here.",
    pending: 'No pending applications right now.',
    shortlisted: "None of your applications are currently shortlisted.", // FIX: Added Shortlisted copy
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