import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Sparkles, Star, CheckCircle, XCircle,
    Mail, Loader2, FileText
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAxiosInstance } from "../../config/axiosConfig";

export default function JobProposalsView({ jobId: propJobId, onBack }) {
    const { id: urlJobId } = useParams();
    const jobId = propJobId || urlJobId;
    const navigate = useNavigate();
    const axiosInstance = useAxiosInstance();

    const [job, setJob] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProposals = async () => {
            setIsLoading(true);
            try {
                // Standardized Spring Boot RESTful endpoint
                const response = await axiosInstance.get(`/api/jobs/${jobId}/proposals`);
                setJob(response.data?.job || null);
                setProposals(response.data?.proposals || []);
            } catch (err) {
                console.warn("Backend proposals API offline. Using preview mock data.");
                // Mock data fallback
                setJob({ id: jobId, title: "Senior React Developer", budget: "₹60,000" });
                setProposals([
                    {
                        id: 101,
                        freelancer: { id: 1, name: "Rahul Sharma", email: "rahul@example.com", slug: "rahul-sharma", pfpUrl: null },
                        pitch: "I have 4 years of experience building high-performance React and Spring Boot applications. Ready to start immediately.",
                        aiCompatibilityScore: 94,
                        status: "SUBMITTED",
                        appliedAt: "2 days ago"
                    },
                    {
                        id: 102,
                        freelancer: { id: 2, name: "Priya Das", email: "priya@example.com", slug: "priya-das", pfpUrl: null },
                        pitch: "Specialized in UI/UX and React ecosystem. Built 15+ SaaS dashboards with Tailwind CSS.",
                        aiCompatibilityScore: 88,
                        status: "SHORTLISTED",
                        appliedAt: "3 days ago"
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        if (jobId) fetchProposals();
    }, [jobId, axiosInstance]);

    const handleUpdateStatus = async (proposalId, newStatus) => {
        setProposals(prev =>
            prev.map(p => p.id === proposalId ? { ...p, status: newStatus } : p)
        );
        try {
            await axiosInstance.patch(`/api/applications/${proposalId}/status`, { status: newStatus });
            toast.success(`Proposal status updated to ${newStatus}`);
        } catch (err) {
            toast.error("Failed to sync status with server.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-4 bg-white rounded-xl border border-gray-200">
                <Loader2 className="h-8 w-8 animate-spin text-[#09D66D]" />
                <p className="text-sm font-medium text-gray-500">Loading candidate proposals...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <Toaster position="top-right" />

            {/* Back Navigation */}
            <button
                // Safely go back via prop callback, or absolutely to the jobs tab if accessed via URL
                onClick={onBack || (() => navigate("/dashboard/jobs"))}
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
                <ArrowLeft size={16} /> Back to Jobs Management
            </button>

            {/* Header Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">
                    Proposals for: <span className="text-[#1798D7]">{job?.title || "Job Listing"}</span>
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Review incoming freelancer pitches, AI compatibility ratings, and manage your pipeline.
                </p>
            </div>

            {/* Proposals List */}
            <div className="space-y-4">
                {proposals.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                        <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                        <h3 className="text-base font-bold text-gray-800">No proposals received yet</h3>
                        <p className="text-xs text-gray-500 mt-1">Check back later or promote your job posting.</p>
                    </div>
                ) : (
                    proposals.map((proposal) => (
                        <div key={proposal.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">

                                {/* Freelancer Identity (Clickable Profile Link) */}
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-emerald-100 text-[#09D66D] flex items-center justify-center font-bold text-lg border border-emerald-200 overflow-hidden flex-shrink-0">
                                        {proposal.freelancer.pfpUrl ? (
                                            <img src={proposal.freelancer.pfpUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            proposal.freelancer.name.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => navigate(`/freelancer/${proposal.freelancer.slug || proposal.freelancer.id}`)}
                                            className="text-base font-bold text-gray-900 hover:text-[#1798D7] hover:underline transition-colors text-left cursor-pointer"
                                        >
                                            {proposal.freelancer.name}
                                        </button>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                            <Mail size={12} /> {proposal.freelancer.email}
                                        </p>
                                    </div>
                                </div>

                                {/* AI Match Badge & Status */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-[#09D66D] px-3 py-1.5 rounded-lg text-xs font-bold">
                                        <Sparkles size={14} /> AI Match: {proposal.aiCompatibilityScore}%
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                                        proposal.status === "ACCEPTED" ? "bg-emerald-50 text-[#09D66D] border-emerald-200" :
                                            proposal.status === "SHORTLISTED" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                "bg-blue-50 text-blue-700 border-blue-100"
                                    }`}>
                                        {proposal.status}
                                    </span>
                                </div>
                            </div>

                            {/* Pitch Content */}
                            <div className="py-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Cover Pitch / Proposal</p>
                                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed">
                                    "{proposal.pitch}"
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => navigate(`/freelancer/${proposal.freelancer.slug || proposal.freelancer.id}`)}
                                    className="text-xs font-bold text-[#1798D7] hover:underline cursor-pointer"
                                >
                                    View Full Profile & Portfolio →
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleUpdateStatus(proposal.id, "SHORTLISTED")}
                                        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-amber-400 hover:text-amber-600 transition-all cursor-pointer"
                                    >
                                        <Star size={14} /> Shortlist
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(proposal.id, "ACCEPTED")}
                                        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#09D66D] text-white shadow-sm hover:bg-[#06934A] transition-all cursor-pointer"
                                    >
                                        <CheckCircle size={14} /> Hire Candidate
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(proposal.id, "REJECTED")}
                                        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                                    >
                                        <XCircle size={14} /> Decline
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}