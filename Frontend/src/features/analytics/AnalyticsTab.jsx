import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Ban, Briefcase, CheckCircle2, ClipboardList, TrendingUp, Wallet, Sparkles } from 'lucide-react';
import { useAxiosInstance } from '@/config/axiosConfig';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, cn } from '@/lib/utils';

// Fallback for new users or if the endpoint fails
const ZERO_STATE_ANALYTICS = {
  totalApplications: 0,
  activeContracts: 0,
  completedJobs: 0,
  totalEarned: 0,
  winRate: 0,
  rejectedOrGhosted: 0,
  monthlyApplications: [
    { month: 'Jan', applications: 0, hires: 0 },
    { month: 'Feb', applications: 0, hires: 0 },
    { month: 'Mar', applications: 0, hires: 0 },
    { month: 'Apr', applications: 0, hires: 0 },
    { month: 'May', applications: 0, hires: 0 },
    { month: 'Jun', applications: 0, hires: 0 },
  ],
};

export default function AnalyticsTab() {
  const axios = useAxiosInstance();

  // ================= FETCH ANALYTICS =================
  const { data, isLoading } = useQuery({
    queryKey: ['freelancer', 'analytics'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/freelancers/analytics');
        return res.data?.data || res.data || ZERO_STATE_ANALYTICS;
      } catch (err) {
        // Return zeros if missing profile or network error
        return ZERO_STATE_ANALYTICS;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const a = data || ZERO_STATE_ANALYTICS;
  const maxApplications = Math.max(...(a.monthlyApplications?.map((m) => m.applications) || [1]), 1);

  if (isLoading) {
    return (
        <div className="mx-auto max-w-6xl w-full space-y-8">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
    );
  }

  return (
      <div className="mx-auto max-w-6xl w-full">
        <PageHeader
            title="Analytics"
            description="Track how your proposals are converting so you can improve where it counts."
        />

        {/* Top Stat Cards */}
        <div className="mb-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          <StatCard icon={ClipboardList} label="Total Applications" value={a.totalApplications || 0} delay={0} />
          <StatCard icon={Briefcase} label="Active Contracts" value={a.activeContracts || 0} delay={0.05} accent />
          <StatCard icon={CheckCircle2} label="Completed Jobs" value={a.completedJobs || 0} delay={0.1} />
          <StatCard icon={Wallet} label="Total Earned" value={formatCurrency(a.totalEarned || 0)} delay={0.15} accent />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">

          {/* Left Side: Conversion Funnel */}
          <Card className="lg:col-span-2 border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Conversion funnel</CardTitle>
              <CardDescription>How proposals turn into paid work.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <TrendingUp className="h-4 w-4 text-[#09D66D]" /> Win rate
                </span>
                  <span className="font-display text-lg font-extrabold text-[#09D66D]">{a.winRate || 0}%</span>
                </div>
                <Progress value={a.winRate || 0} className="h-2.5 bg-emerald-100 [&>div]:bg-[#09D66D]" />
                <p className="mt-2.5 text-xs font-medium text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{a.winRate || 0}%</strong> of your applications resulted in a hire.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/50 p-4 transition-colors hover:bg-rose-50">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 shadow-sm">
                    <Ban className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-rose-900">Rejected / Ghosted</p>
                    <p className="text-xs font-medium text-rose-600/70">Closed without a hire</p>
                  </div>
                </div>
                <span className="font-display text-xl font-extrabold text-rose-700">{a.rejectedOrGhosted || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Right Side: Monthly Applications Bar Chart */}
          <Card className="lg:col-span-3 border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Applications over time</CardTitle>
                  <CardDescription>Proposals sent vs. hires won, last 6 months.</CardDescription>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-primary-soft text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={14} /> Insights
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex h-[240px] items-end justify-between gap-2 sm:gap-4 pt-6">
                {a.monthlyApplications?.map((m, i) => (
                    <div key={m.month || i} className="flex flex-1 flex-col items-center gap-3">
                      <div className="relative flex h-full w-full max-w-[48px] items-end justify-center group">
                        {/* Background Bar (Total Applications) */}
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${((m.applications || 0) / maxApplications) * 100}%` }}
                            transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
                            className="w-full rounded-t-lg bg-muted/60 group-hover:bg-muted transition-colors relative"
                        >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {m.applications || 0}
                      </span>
                        </motion.div>

                        {/* Foreground Bar (Hires) */}
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${((m.hires || 0) / maxApplications) * 100}%` }}
                            transition={{ delay: i * 0.06 + 0.1, duration: 0.5, ease: 'easeOut' }}
                            className="absolute bottom-0 w-full rounded-t-lg bg-primary shadow-sm"
                        />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{m.month}</span>
                    </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 text-xs font-medium text-muted-foreground border-t border-border/50 pt-4">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-muted/80 border border-border" /> Applications
              </span>
                <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-primary shadow-sm" /> Hires
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
        <Card className={cn("overflow-hidden transition-all hover:shadow-md", accent ? 'border-primary/30 bg-primary-soft/20' : 'border-border/60')}>
          <CardContent className="p-6">
            <div className={cn(
                "mb-4 flex h-11 w-11 items-center justify-center rounded-xl shadow-sm",
                accent ? 'bg-primary text-white' : 'bg-muted text-foreground'
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="font-display text-3xl font-extrabold text-foreground tracking-tight">{value}</p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
          </CardContent>
        </Card>
      </motion.div>
  );
}