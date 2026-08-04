import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Ban, Briefcase, CheckCircle2, ClipboardList, TrendingUp, Wallet } from 'lucide-react';
import { useAxiosInstance } from '@/config/axiosConfig';
import { freelancerApi } from '@/api/freelancerApi';
import { seedAnalytics } from '@/lib/mockData';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsTab() {
  const axios = useAxiosInstance();
  const { data, isLoading } = useQuery({
    queryKey: ['freelancer', 'analytics'],
    queryFn: () => freelancerApi.getAnalytics(axios),
    placeholderData: seedAnalytics,
  });

  const a = data ?? seedAnalytics;
  const maxApplications = Math.max(...a.monthlyApplications.map((m) => m.applications), 1);

  if (isLoading && !data) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Tab 4 · Performance"
        title="Analytics"
        description="Track how your proposals are converting so you can improve where it counts."
      />

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total Applications" value={a.totalApplications} delay={0} />
        <StatCard icon={Briefcase} label="Active Contracts" value={a.activeContracts} delay={0.05} accent />
        <StatCard icon={CheckCircle2} label="Completed Jobs" value={a.completedJobs} delay={0.1} />
        <StatCard icon={Wallet} label="Total Earned" value={formatCurrency(a.totalEarned)} delay={0.15} accent />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Conversion funnel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Conversion funnel</CardTitle>
            <CardDescription>How proposals turn into paid work.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" /> Win rate
                </span>
                <span className="font-display text-sm font-bold text-primary">{a.winRate}%</span>
              </div>
              <Progress value={a.winRate} />
              <p className="mt-1.5 text-xs text-muted-foreground">
                {a.winRate}% of your applications resulted in a hire.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <Ban className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Rejected / Ghosted</p>
                  <p className="text-xs text-muted-foreground">Closed without a hire</p>
                </div>
              </div>
              <span className="font-display text-lg font-bold text-foreground">{a.rejectedOrGhosted}</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly applications bar chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Applications over time</CardTitle>
            <CardDescription>Proposals sent vs. hires won, last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-52 items-end justify-between gap-3">
              {a.monthlyApplications.map((m, i) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex h-full w-full max-w-10 items-end justify-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(m.applications / maxApplications) * 100}%` }}
                      transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
                      className="w-full rounded-t-md bg-muted"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(m.hires / maxApplications) * 100}%` }}
                      transition={{ delay: i * 0.06 + 0.1, duration: 0.5, ease: 'easeOut' }}
                      className="absolute bottom-0 w-full max-w-10 rounded-t-md [background-image:var(--mode-gradient)]"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{m.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-muted" /> Applications
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm [background-image:var(--mode-gradient)]" /> Hires
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, delay, accent }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.35 }}>
      <Card className={accent ? 'border-primary/30' : undefined}>
        <CardContent className="p-5">
          <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${accent ? 'bg-primary text-white' : 'bg-primary-soft text-primary'}`}>
            <Icon className="h-4 w-4" />
          </div>
          <p className="font-display text-2xl font-extrabold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
