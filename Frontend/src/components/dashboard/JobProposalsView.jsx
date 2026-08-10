import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Sparkles, Star, CheckCircle, XCircle,
    Loader2, FileText, UserCircle, Ban
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { useAxiosInstance } from "@/config/axiosConfig";

export default function JobProposalsView({ jobId: propJobId, onBack }) {
    const { id: urlJobId } = useParams();
    const jobId = propJobId || urlJobId;
    const navigate = useNavigate();
    const axiosInstance = useAxiosInstance();

    const [job, setJob] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchProposals = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/api/jobs/${jobId}`);

                if (isMounted && response.data?.data) {
                    const jobData = response.data.data;

                    setJob({
                        id: jobData.id,
                        title: jobData.title,
                        budget: jobData.fixedBudget
                    });

                    const mappedProposals = (jobData.applications || []).map(app => ({
                        id: app.id,
                        freelancer: {
                            id: app.freelancerId,
                            name: app.freelancerName || "Unknown Applicant",
                            slug: app.freelancerSlug,
                            pfpUrl: app.freelancerProfilePicture,
                        },
                        pitch: app.pitch,
                        aiCompatibilityScore: app.aiCompatibilityScore,
                        status: app.status,
                        appliedAt: app.appliedAt
                    }));

                    mappedProposals.sort((a, b) => (b.aiCompatibilityScore || 0) - (a.aiCompatibilityScore || 0));
                    setProposals(mappedProposals);
                }
            } catch (err) {
                console.error("Failed to fetch proposals:", err);
                toast.error("Could not load proposals. Please try again.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        if (jobId) fetchProposals();
        return () => { isMounted = false; };
    }, [jobId, axiosInstance]);

    const handleUpdateStatus = async (proposalId, newStatus) => {
        // Optimistic UI Update
        setProposals(prev =>
            prev.map(p => p.id === proposalId ? { ...p, status: newStatus } : p)
        );

        try {
            // 1. Target the NEW, dedicated proposal action endpoint
            await axiosInstance.patch(`/api/clients/proposals/${proposalId}/action`, { status: newStatus });

            // 2. If Hiring, chain the second API call to update the Job Status
            if (newStatus === "ACCEPTED") {
                await axiosInstance.patch(`/api/jobs/${jobId}/status`, { status: "IN_PROGRESS" });

                toast.success("Candidate Hired! Job is now In Progress.");

                // Smoothly redirect back to jobs list after 2 seconds
                setTimeout(() => navigate("/dashboard/jobs"), 2000);
            } else {
                toast.success(`Proposal marked as ${newStatus}`);
            }

        } catch (err) {
            console.error("Status update failed:", err);
            toast.error("Failed to sync status with server.");
            // Revert on failure by refreshing the page data
            window.location.reload();
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-4 bg-white rounded-xl border border-slate-200">
                <Loader2 className="h-8 w-8 animate-spin text-[#1798D7]" />
                <p className="text-sm font-medium text-slate-500">Loading candidate proposals...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <Toaster position="top-right" />

            {/* Back Navigation */}
            <button
                onClick={onBack || (() => navigate("/dashboard/jobs"))}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1798D7] transition-colors cursor-pointer w-fit"
            >
                <ArrowLeft size={16} /> Back to Jobs Management
            </button>

            {/* Header Info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Proposals for: <span className="text-[#1798D7]">{job?.title || "Job Listing"}</span>
                </h1>
                <p className="mt-2 text-sm text-slate-500 font-medium">
                    Review incoming freelancer pitches, AI compatibility ratings, and manage your pipeline.
                </p>
            </div>

            {/* Proposals List */}
            <div className="space-y-5">
                {proposals.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-800">No proposals received yet</h3>
                        <p className="text-sm text-slate-500 mt-1">Check back later or promote your job posting.</p>
                    </div>
                ) : (
                    proposals.map((proposal) => (
                        <div key={proposal.id} className={`rounded-2xl border bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-md ${proposal.status === 'WITHDRAWN' ? 'border-slate-100 opacity-80' : 'border-slate-200 hover:border-slate-300'}`}>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-slate-100">

                                {/* Freelancer Identity */}
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold border-2 border-slate-100 overflow-hidden flex-shrink-0">
                                        {proposal.freelancer.pfpUrl ? (
                                            <img src={proposal.freelancer.pfpUrl} alt={proposal.freelancer.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCircle size={32} />
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => navigate(`/freelancer/${proposal.freelancer.slug || proposal.freelancer.id}`)}
                                            className="text-lg font-bold text-slate-900 hover:text-[#1798D7] transition-colors text-left cursor-pointer"
                                        >
                                            {proposal.freelancer.name}
                                        </button>
                                        <p className="text-xs font-semibold text-slate-400 mt-0.5">
                                            Applied {proposal.appliedAt ? formatDistanceToNow(new Date(proposal.appliedAt), { addSuffix: true }) : "recently"}
                                        </p>
                                    </div>
                                </div>

                                {/* AI Match Badge & Status */}
                                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                                    {proposal.aiCompatibilityScore && (
                                        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-[#06934A] px-3.5 py-1.5 rounded-xl text-sm font-extrabold shrink-0">
                                            <Sparkles size={16} /> {proposal.aiCompatibilityScore}% AI Match
                                        </div>
                                    )}
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                                        proposal.status === "ACCEPTED" ? "bg-emerald-50 text-[#09D66D] border-emerald-200" :
                                            proposal.status === "SHORTLISTED" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                proposal.status === "REJECTED" ? "bg-rose-50 text-rose-600 border-rose-200" :
                                                    proposal.status === "WITHDRAWN" ? "bg-slate-50 text-slate-500 border-slate-200" :
                                                        "bg-blue-50 text-[#1798D7] border-blue-100"
                                    }`}>
                                        {proposal.status}
                                    </span>
                                </div>
                            </div>

                            {/* Pitch Content */}
                            <div className="py-5">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Cover Pitch / Proposal</p>
                                <p className="text-sm text-slate-700 bg-slate-50 p-5 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                                    {proposal.pitch}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-slate-100">
                                <button
                                    onClick={() => navigate(`/freelancer/${proposal.freelancer.slug || proposal.freelancer.id}`)}
                                    className="text-sm font-bold text-[#1798D7] hover:text-[#1280B8] transition-colors cursor-pointer"
                                >
                                    View Full Profile & Portfolio →
                                </button>

                                {proposal.status === "WITHDRAWN" ? (
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                                        <Ban size={16} /> Candidate Withdrew Application
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleUpdateStatus(proposal.id, "SHORTLISTED")}
                                            disabled={proposal.status === "SHORTLISTED" || proposal.status === "ACCEPTED"}
                                            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Star size={16} /> Shortlist
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(proposal.id, "ACCEPTED")}
                                            disabled={proposal.status === "ACCEPTED"}
                                            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-[#09D66D] text-white shadow-sm hover:bg-[#07B85D] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CheckCircle size={16} /> Hire Candidate
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(proposal.id, "REJECTED")}
                                            disabled={proposal.status === "REJECTED" || proposal.status === "ACCEPTED"}
                                            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <XCircle size={16} /> Decline
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}