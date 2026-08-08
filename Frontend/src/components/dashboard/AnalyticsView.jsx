import React, { useState, useEffect } from "react";
import {
  BriefcaseBusiness,
  UserCheck,
  FileText,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useOutletContext } from "react-router-dom"; // <-- Added Router Context
import { useAxiosInstance } from "../../config/axiosConfig";

// Default Brand Colors for the Pie Chart fallback
const PIE_COLORS = ["#09D66D", "#1798D7", "#4AB7B2", "#F5A623", "#8B5CF6"];

export default function AnalyticsView() {
  const axiosInstance = useAxiosInstance();

  // Grab the globally fetched profile/company data from the dashboard layout!
  const { profileData, companyData, clientType } = useOutletContext();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Stats State
  const [statsData, setStatsData] = useState({
    jobsPosted: 0,
    jobsPostedChange: "0 this month",
    totalHires: 0,
    conversionRate: "0% conversion rate",
    proposalsReceived: 0,
    avgProposalsPerJob: "Avg. 0 per job",
  });

  // Chart & Table States
  const [monthlyData, setMonthlyData] = useState([]);
  const [proposalStatusData, setProposalStatusData] = useState([]);
  const [jobMetrics, setJobMetrics] = useState([]);

  // ================= AXIOS: FETCH ANALYTICS DATA =================
  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/api/clients/analytics");

        if (response.data && isMounted) {
          if (response.data.stats) setStatsData(response.data.stats);
          if (response.data.monthlyTrends) setMonthlyData(response.data.monthlyTrends);
          if (response.data.proposalDistribution) setProposalStatusData(response.data.proposalDistribution);
          if (response.data.jobMetrics) setJobMetrics(response.data.jobMetrics);
        }
      } catch (err) {
        console.warn("Backend /api/clients/analytics not implemented yet. Using mock data for UI preview.");

        if (isMounted) {
          setError("Viewing in Offline/Preview Mode. Live analytics unavailable.");

          // Developer Mock Data
          setStatsData({
            jobsPosted: 12,
            jobsPostedChange: "+2 this month",
            totalHires: 8,
            conversionRate: "66% conversion rate",
            proposalsReceived: 145,
            avgProposalsPerJob: "Avg. 12 per job",
          });
          setMonthlyData([
            { month: "Jan", proposals: 20, hires: 1 },
            { month: "Feb", proposals: 35, hires: 2 },
            { month: "Mar", proposals: 45, hires: 3 },
            { month: "Apr", proposals: 45, hires: 2 },
          ]);
          setProposalStatusData([
            { name: "Under Review", value: 45, color: "#1798D7" },
            { name: "Shortlisted", value: 25, color: "#4AB7B2" },
            { name: "Hired", value: 8, color: "#09D66D" },
            { name: "Rejected", value: 67, color: "#F43F5E" },
          ]);
          setJobMetrics([
            { title: "Senior React Developer", postedDate: "Apr 12, 2026", proposals: 42, hires: 1, status: "Active" },
            { title: "Backend Java Engineer", postedDate: "Mar 28, 2026", proposals: 65, hires: 2, status: "Closed" },
            { title: "UI/UX Designer", postedDate: "Mar 15, 2026", proposals: 38, hires: 1, status: "Closed" },
          ]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAnalytics();
    return () => { isMounted = false; };
  }, [axiosInstance]);

  const analyticsStats = [
    {
      title: "Jobs Posted",
      value: statsData.jobsPosted,
      change: statsData.jobsPostedChange,
      icon: BriefcaseBusiness,
      iconColor: "text-[#1798D7]",
      bgSubtle: "bg-blue-50 border-blue-100",
      trendColor: "text-[#1798D7]",
    },
    {
      title: "Total Hirings",
      value: statsData.totalHires,
      change: statsData.conversionRate,
      icon: UserCheck,
      iconColor: "text-[#09D66D]",
      bgSubtle: "bg-emerald-50 border-emerald-100",
      trendColor: "text-[#09D66D]",
    },
    {
      title: "Proposals Received",
      value: statsData.proposalsReceived,
      change: statsData.avgProposalsPerJob,
      icon: FileText,
      iconColor: "text-[#4AB7B2]",
      bgSubtle: "bg-teal-50 border-teal-100",
      trendColor: "text-[#4AB7B2]",
    },
  ];

  if (isLoading) {
    return (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-xl bg-white p-8 border border-gray-200 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#09D66D]" />
          <p className="text-sm font-medium text-gray-500">
            Gathering your recruitment analytics...
          </p>
        </div>
    );
  }

  // Determine the display name for the personalized header
  const displayName = clientType === "company"
      ? (companyData?.companyName || "your company")
      : (profileData?.firstName || "your account");

  return (
      <div className="w-full space-y-6">

        {/* HEADER WITH PERSONALIZATION */}
        <header className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Recruitment Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's a breakdown of how postings for <strong className="text-gray-700">{displayName}</strong> are performing.
          </p>
        </header>

        {error && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-700 border border-amber-200 shadow-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
        )}

        {/* 3 CORE METRIC CARDS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {analyticsStats.map((stat) => {
            const Icon = stat.icon;
            return (
                <div key={stat.title} className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{stat.title}</span>
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full border ${stat.bgSubtle}`}>
                      <Icon size={20} className={stat.iconColor} />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-gray-900">{stat.value}</span>
                    <p className={`mt-1.5 flex items-center gap-1.5 text-xs font-semibold ${stat.trendColor}`}>
                      <TrendingUp size={14} /> {stat.change}
                    </p>
                  </div>
                </div>
            );
          })}
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2 flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Monthly Recruitment Trend</h2>
            <p className="text-xs text-gray-500 mb-6">Compare proposals received versus actual hires.</p>
            <div className="h-72 w-full flex-1">
              {monthlyData.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm font-medium text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                    No monthly trend data available.
                  </div>
              ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} />
                      <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px", fontWeight: 500 }} />
                      <Bar dataKey="proposals" name="Proposals Received" fill="#1798D7" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="hires" name="Candidates Hired" fill="#09D66D" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Proposal Status</h2>
              <p className="text-xs text-gray-500 mb-4">Breakdown of all {statsData.proposalsReceived} proposals.</p>
            </div>
            <div className="relative flex h-52 w-full items-center justify-center flex-1">
              {proposalStatusData.length === 0 ? (
                  <span className="text-sm font-medium text-gray-400">No proposal data.</span>
              ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={proposalStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                        {proposalStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} itemStyle={{ color: '#141b2b', fontWeight: 600 }} />
                    </PieChart>
                  </ResponsiveContainer>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-2 border-t border-gray-100 pt-5">
              {proposalStatusData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: item.color || PIE_COLORS[index % PIE_COLORS.length] }} />
                    <span className="truncate text-xs font-medium text-gray-600">{item.name}: <strong className="text-gray-900 ml-0.5">{item.value}</strong></span>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* JOB PROPOSALS & HIRING BREAKDOWN TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-5 bg-white">
            <h2 className="text-lg font-bold text-gray-900">Per-Job Metrics</h2>
            <p className="mt-1 text-xs text-gray-500">Detailed breakdown of engagement across your specific job postings.</p>
          </div>
          <div className="overflow-x-auto">
            {jobMetrics.length === 0 ? (
                <p className="p-8 text-center text-sm font-medium text-gray-400 bg-gray-50/50">No job metrics recorded yet.</p>
            ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/80 border-b border-gray-200">
                  <tr>
                    <th className="p-4 px-5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Job Title</th>
                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Posted Date</th>
                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Proposals</th>
                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Hires</th>
                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                  {jobMetrics.map((job, idx) => (
                      <tr key={idx} className="transition-colors hover:bg-gray-50/50">
                        <td className="p-4 px-5 font-bold text-gray-900">{job.title}</td>
                        <td className="p-4 text-gray-500 text-xs font-medium">{job.postedDate}</td>
                        <td className="p-4 font-semibold text-[#1798D7]">{job.proposals}</td>
                        <td className="p-4 font-semibold text-[#09D66D]">{job.hires}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${job.status === "Active" ? "bg-emerald-50 text-[#09D66D] border-emerald-100" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                            {job.status}
                          </span>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>
        </div>
      </div>
  );
}