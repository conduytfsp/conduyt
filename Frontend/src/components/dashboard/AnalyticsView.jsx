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

import { useAxiosInstance } from "../../config/axiosConfig";

export default function AnalyticsView() {
  const axiosInstance = useAxiosInstance();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Stats State (Initialized empty)
  const [statsData, setStatsData] = useState({
    jobsPosted: 0,
    jobsPostedChange: "0 this month",
    totalHires: 0,
    conversionRate: "0% conversion rate",
    proposalsReceived: 0,
    avgProposalsPerJob: "Avg. 0 per job",
  });

  // Monthly Trend Chart State (Initialized empty)
  const [monthlyData, setMonthlyData] = useState([]);

  // Proposal Distribution State (Initialized empty)
  const [proposalStatusData, setProposalStatusData] = useState([]);

  // Job Metrics Breakdown Table State (Initialized empty)
  const [jobMetrics, setJobMetrics] = useState([]);

  // FETCH ANALYTICS DATA FROM BACKEND VIA AXIOS
  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/client/analytics");
        if (response.data && isMounted) {
          if (response.data.stats) setStatsData(response.data.stats);
          if (response.data.monthlyTrends) setMonthlyData(response.data.monthlyTrends);
          if (response.data.proposalDistribution) setProposalStatusData(response.data.proposalDistribution);
          if (response.data.jobMetrics) setJobMetrics(response.data.jobMetrics);
        }
      } catch (err) {
        console.error("Failed to load analytics data:", err);
        if (isMounted) {
          setError("Failed to fetch real-time analytics from server.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, [axiosInstance]);

  // Format cards structure from state
  const analyticsStats = [
    {
      title: "Jobs Posted",
      value: statsData.jobsPosted,
      change: statsData.jobsPostedChange,
      icon: BriefcaseBusiness,
      color: "text-[#00628e]",
      bgColor: "bg-[#00628e]/10",
    },
    {
      title: "Total Hirings Done",
      value: statsData.totalHires,
      change: statsData.conversionRate,
      icon: UserCheck,
      color: "text-[#09D66D]",
      bgColor: "bg-[#09D66D]/10",
    },
    {
      title: "Proposals Received",
      value: statsData.proposalsReceived,
      change: statsData.avgProposalsPerJob,
      icon: FileText,
      color: "text-[#4AB7B2]",
      bgColor: "bg-[#4AB7B2]/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl bg-white p-8 border border-gray-100 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-[#09D66D]" />
        <p className="text-sm font-medium text-gray-500">
          Loading recruitment analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[#141b2b]">Recruitment Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track job posting performance, hiring rates, and incoming freelancer proposals.
        </p>
      </header>

      {/* ERROR BANNER */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-700 border border-amber-200">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* ================= 3 CORE METRIC CARDS ================= */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {analyticsStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  {stat.title}
                </span>
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <Icon size={22} className={stat.color} />
                </div>
              </div>

              <div>
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-500">
                  <TrendingUp size={14} className="text-[#09D66D]" />
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= CHARTS SECTION ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Trend Bar Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-1 text-lg font-bold text-[#141b2b]">Monthly Recruitment Trend</h2>
          <p className="mb-6 text-xs text-gray-500">
            Compare proposals received and hires completed over recent months.
          </p>

          <div className="h-72 w-full">
            {monthlyData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                No monthly trend data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
                  <Bar dataKey="proposals" name="Proposals" fill="#4AB7B2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="hires" name="Hires" fill="#09D66D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Proposal Distribution Pie Chart */}
        <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="mb-1 text-lg font-bold text-[#141b2b]">Proposal Status</h2>
            <p className="mb-4 text-xs text-gray-500">
              Breakdown of all {statsData.proposalsReceived} proposals received.
            </p>
          </div>

          <div className="relative flex h-52 w-full items-center justify-center">
            {proposalStatusData.length === 0 ? (
              <span className="text-xs text-gray-400">No proposal status data.</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={proposalStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {proposalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || "#09D66D"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
            {proposalStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: item.color || "#09D66D" }}
                />
                <span className="truncate text-xs font-medium text-gray-600">
                  {item.name}: <strong className="text-gray-900">{item.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= JOB PROPOSALS & HIRING BREAKDOWN TABLE ================= */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#141b2b]">Per-Job Proposal Breakdown</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Detailed breakdown of proposals received and hires made per job posting.
          </p>
        </div>

        <div className="overflow-x-auto">
          {jobMetrics.length === 0 ? (
            <p className="p-6 text-center text-xs text-gray-400">
              No job metrics data recorded yet.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Job Title</th>
                  <th className="p-4 font-semibold text-gray-600">Posted Date</th>
                  <th className="p-4 font-semibold text-gray-600">Proposals Received</th>
                  <th className="p-4 font-semibold text-gray-600">Hires Made</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobMetrics.map((job, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-gray-50/50">
                    <td className="p-4 font-medium text-gray-900">{job.title}</td>
                    <td className="p-4 text-gray-500">{job.postedDate}</td>
                    <td className="p-4 font-semibold text-gray-700">{job.proposals} proposals</td>
                    <td className="p-4 font-semibold text-[#09D66D]">{job.hires} hired</td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          job.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
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