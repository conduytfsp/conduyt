import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // <-- Added Router imports
import {
  Plus, Eye, FileText, CheckCircle, XCircle,
  BriefcaseBusiness, CalendarDays, Users, Mail,
  Loader2, AlertCircle, Sparkles,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAxiosInstance } from "../../config/axiosConfig";
import JobProposalsView from "./JobProposalsView";

const INITIAL_MOCK_JOBS = [
  {
    id: 1,
    title: "Senior React Developer",
    budget: "₹60,000",
    budgetType: "Fixed",
    postedDate: "01 Aug 2026",
    status: "Open",
    proposals: 42,
    freelancer: null,
    description: "Looking for an experienced React developer to build an enterprise dashboard with real-time analytics charts and Tailwind CSS integration.",
    aiGenSummary: "Build enterprise React dashboard with Tailwind and chart libraries. Requires strong state management skills."
  },
  {
    id: 2,
    title: "UI/UX Designer",
    budget: "₹40,000",
    budgetType: "Fixed",
    postedDate: "28 Jul 2026",
    status: "In Progress",
    proposals: 18,
    freelancer: { id: 101, name: "Rahul Sharma", email: "rahul@example.com", slug: "rahul-sharma" },
    description: "Need a creative UI/UX designer to redesign our core mobile application onboarding flow using Figma.",
    aiGenSummary: "Redesign mobile app onboarding flow in Figma. Focus on modern SaaS aesthetics and user retention."
  },
  {
    id: 3,
    title: "Backend API Development",
    budget: "₹75,000",
    budgetType: "Fixed",
    postedDate: "20 Jul 2026",
    status: "Completed",
    proposals: 27,
    freelancer: { id: 102, name: "Priya Das", email: "priya@example.com", slug: "priya-das" },
    description: "Develop secure RESTful microservices using Spring Boot, Spring Security, and PostgreSQL with JWT authentication.",
    aiGenSummary: "Develop secure Spring Boot REST APIs with PostgreSQL backend and JWT security filters."
  },
];

// ================= 1. ROUTER WRAPPER =================
// This handles the nested URLs (/dashboard/jobs AND /dashboard/jobs/:id/proposals)
export default function JobManagementRouter() {
  return (
      <Routes>
        <Route index element={<JobManagementList />} />
        <Route path=":id/proposals" element={<JobProposalsView />} />
      </Routes>
  );
}

// ================= 2. MAIN LIST COMPONENT =================
function JobManagementList() {
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState(null);

  const [newJob, setNewJob] = useState({
    title: "",
    budget: "",
    budgetType: "Fixed",
    description: "",
  });

  // Fetch Jobs
  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/api/jobs/client");
        if (response.data && isMounted) {
          const rawData = response.data.data || response.data;
          const fetchedJobs = Array.isArray(rawData) ? rawData : rawData.content || [];
          const mappedJobs = fetchedJobs.map((job) => ({
            id: job.id,
            title: job.title,
            budget: job.fixedBudget ? `₹${job.fixedBudget}` : job.budget || "₹0",
            budgetType: job.budgetType || "Fixed",
            postedDate: job.postedDate || "Recently",
            status: job.status ? job.status.charAt(0) + job.status.slice(1).toLowerCase().replace("_", " ") : "Open",
            proposals: job.applications ? job.applications.length : job.proposals || 0,
            freelancer: job.freelancer || null,
            description: job.description || "No description provided for this project.",
            aiGenSummary: job.aiGenSummary || null
          }));
          setJobs(mappedJobs.length > 0 ? mappedJobs : INITIAL_MOCK_JOBS);
        }
      } catch (err) {
        console.warn("Backend /api/jobs/client offline. Falling back to local/mock data.");
        if (isMounted) {
          setError("Offline mode: Managing jobs locally.");
          const savedJobs = localStorage.getItem("clientJobs");
          setJobs(savedJobs ? JSON.parse(savedJobs) : INITIAL_MOCK_JOBS);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchJobs();
    return () => { isMounted = false; };
  }, [axiosInstance]);

  useEffect(() => {
    if (jobs.length > 0) localStorage.setItem("clientJobs", JSON.stringify(jobs));
  }, [jobs]);

  // Post Job
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.budget || !newJob.description) {
      toast.error("Please fill in all required fields including description.");
      return;
    }
    setIsSubmitting(true);
    const jobPayload = {
      title: newJob.title,
      fixedBudget: parseFloat(newJob.budget),
      budgetType: newJob.budgetType,
      description: newJob.description,
    };
    try {
      await axiosInstance.post("/api/jobs", jobPayload);
      toast.success("Job posted successfully!");
      setShowPostForm(false);
      setNewJob({ title: "", budget: "", budgetType: "Fixed", description: "" });
      const res = await axiosInstance.get("/api/jobs/client");
      const rawData = res.data.data || res.data;
      setJobs(Array.isArray(rawData) ? rawData : rawData.content || INITIAL_MOCK_JOBS);
    } catch (err) {
      toast.error("Backend sync failed. Added locally.");
      const localJob = {
        id: Date.now(),
        title: newJob.title,
        budget: `₹${newJob.budget}`,
        budgetType: newJob.budgetType,
        postedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        status: "Open",
        proposals: 0,
        freelancer: null,
        description: newJob.description,
        aiGenSummary: "AI summary pending generation."
      };
      setJobs([localJob, ...jobs]);
      setShowPostForm(false);
      setNewJob({ title: "", budget: "", budgetType: "Fixed", description: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateJobStatus = async (id, newStatus) => {
    setJobs(jobs.map((job) => (job.id === id ? { ...job, status: newStatus } : job)));
    try {
      await axiosInstance.patch(`/api/jobs/${id}/status`, { status: newStatus.toUpperCase().replace(" ", "_") });
      toast.success(`Job status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to sync status change with server.");
    }
  };

  const toggleExpandJob = (id) => setExpandedJobId(prev => prev === id ? null : id);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Open": return "bg-blue-50 text-blue-700 border-blue-100";
      case "In Progress": return "bg-amber-50 text-amber-700 border-amber-100";
      case "Completed": return "bg-emerald-50 text-[#09D66D] border-emerald-100";
      case "Cancelled": return "bg-rose-50 text-rose-700 border-rose-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  if (isLoading) {
    return (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-xl bg-white p-8 border border-gray-200 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#09D66D]" />
          <p className="text-sm font-medium text-gray-500">Loading your job postings...</p>
        </div>
    );
  }

  return (
      <div className="w-full space-y-6">
        <Toaster position="top-right" />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your hiring pipeline, view incoming proposals, and track active work.
            </p>
          </div>
          <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#09D66D] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#06934A] active:scale-95 self-start md:self-auto"
          >
            <Plus size={18} /> Post New Job
          </button>
        </div>

        {error && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-700 border border-amber-200 shadow-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
        )}

        {/* POST JOB FORM */}
        {showPostForm && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Post a New Job Opening</h3>
              <form onSubmit={handlePostJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Senior React Developer"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#09D66D] focus:ring-4 focus:ring-[#09D66D]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                      Budget (INR) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        placeholder="e.g. 50000"
                        value={newJob.budget}
                        onChange={(e) => setNewJob({ ...newJob, budget: e.target.value })}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#09D66D] focus:ring-4 focus:ring-[#09D66D]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                      Budget Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={newJob.budgetType}
                        onChange={(e) => setNewJob({ ...newJob, budgetType: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#09D66D] focus:ring-4 focus:ring-[#09D66D]/10"
                    >
                      <option value="Fixed">Fixed Price</option>
                      <option value="Hourly">Hourly Rate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                      rows="4"
                      placeholder="Explain the project scope, requirements, deliverables..."
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#09D66D] focus:ring-4 focus:ring-[#09D66D]/10 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                      type="button"
                      onClick={() => setShowPostForm(false)}
                      className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#09D66D] px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#06934A]"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    Publish Job
                  </button>
                </div>
              </form>
            </div>
        )}

        {/* JOB CARDS LIST */}
        <div className="space-y-4">
          {jobs.map((job) => (
              <div key={job.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getStatusStyle(job.status)}`}>
                    {job.status}
                  </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-gray-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <BriefcaseBusiness size={14} className="text-gray-400" />
                        <span className="font-semibold text-gray-700">{job.budget}</span> ({job.budgetType})
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-gray-400" />
                        Posted on {job.postedDate}
                      </div>
                      {job.status === "Open" && (
                          <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-gray-400" />
                            <span className="font-semibold text-gray-700">{job.proposals}</span> proposals
                          </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION & AI SUMMARY ACCORDION */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                      onClick={() => toggleExpandJob(job.id)}
                      className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText size={14} className="text-[#1798D7]" />
                    {expandedJobId === job.id ? "Hide Job Description" : "View Job Description & AI Summary"}
                  </button>

                  {expandedJobId === job.id && (
                      <div className="mt-3 space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
                        {job.aiGenSummary && (
                            <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-lg">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-[#09D66D] uppercase tracking-wider mb-1">
                                <Sparkles size={14} /> AI-Generated Scope Summary
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed">{job.aiGenSummary}</p>
                            </div>
                        )}
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Full Description</p>
                          <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
                        </div>
                      </div>
                  )}
                </div>

                {/* Hired Freelancer Box */}
                {(job.status === "In Progress" || job.status === "Completed") && job.freelancer && (
                    <div className="mt-5 rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">Assigned Freelancer</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-emerald-100 text-[#09D66D] flex items-center justify-center font-bold text-sm border border-emerald-200">
                            {job.freelancer.name.charAt(0)}
                          </div>
                          <div>
                            <button
                                onClick={() => navigate(`/freelancer/${job.freelancer.slug || job.freelancer.id}`)}
                                className="text-sm font-bold text-gray-900 hover:text-[#1798D7] hover:underline cursor-pointer text-left"
                            >
                              {job.freelancer.name}
                            </button>
                            <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {job.freelancer.email}</p>
                          </div>
                        </div>
                        {job.status === "Completed" && (
                            <button
                                onClick={() => navigate(`/freelancer/${job.freelancer.slug || job.freelancer.id}`)}
                                className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full hover:bg-emerald-200 transition-colors cursor-pointer"
                            >
                              View Verified Contact Details →
                            </button>
                        )}
                      </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                  {job.status === "Open" && (
                      <>
                        <button
                            // 🚀 ROUTER FIX: Now uses URL Navigation!
                            onClick={() => navigate(`/dashboard/jobs/${job.id}/proposals`)}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#1798D7] hover:text-[#004f70] transition-colors cursor-pointer bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                        >
                          <Eye size={14} /> View Proposals ({job.proposals})
                        </button>
                        <button
                            onClick={() => updateJobStatus(job.id, "Cancelled")}
                            className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100"
                        >
                          <XCircle size={14} /> Close Job
                        </button>
                      </>
                  )}

                  {job.status === "In Progress" && (
                      <button
                          onClick={() => updateJobStatus(job.id, "Completed")}
                          className="flex items-center gap-1.5 text-xs font-bold text-[#09D66D] hover:text-[#06934A] transition-colors cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100"
                      >
                        <CheckCircle size={14} /> Mark as Completed
                      </button>
                  )}

                  {job.status === "Completed" && (
                      <button
                          onClick={() => navigate(`/freelancer/${job.freelancer?.slug || job.freelancer?.id}`)}
                          className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 transition-colors cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200"
                      >
                        <FileText size={14} /> View Contract & Contact Info
                      </button>
                  )}

                  {job.status === "Cancelled" && (
                      <span className="text-xs font-medium text-gray-400 italic">This job posting has been cancelled.</span>
                  )}
                </div>
              </div>
          ))}
        </div>

        {jobs.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <BriefcaseBusiness size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-800">No jobs posted yet</h3>
              <p className="text-xs text-gray-500 mt-1">Click "Post New Job" to create your first listing.</p>
            </div>
        )}
      </div>
  );
}