import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Building2, Calendar, Clock, Phone, Sparkles,
    Users, Wallet, CheckCircle2, ShieldCheck, FileText, Send, UserCircle, X, Edit3, Ban
} from "lucide-react";
import { useAxiosInstance } from "@/config/axiosConfig";
import { useAppStore } from "@/store/useAppStore";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import { formatDistanceToNow } from "date-fns";

export default function JobDetail() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const axios = useAxiosInstance();
    const queryClient = useQueryClient();

    // Aggressively track mode from global store
    const mode = useAppStore((state) => state.mode);
    const toggleMode = useAppStore((state) => state.toggleMode);

    // Application Modal State
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [pitch, setPitch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // ================= FETCH JOB DETAILS =================
    const { data: job, isLoading, isError } = useQuery({
        queryKey: ["job", jobId],
        queryFn: async () => {
            const res = await axios.get(`/api/jobs/${jobId}`);
            return res.data?.data || res.data;
        },
        staleTime: 1000 * 60 * 2,
    });

    // ================= SUBMIT APPLICATION =================
    const handleApply = async (e) => {
        e.preventDefault();
        if (pitch.length < 20) {
            alert("Pitch must be at least 20 characters long.");
            return;
        }
        setIsSubmitting(true);
        try {
            await axios.post(`/api/jobs/${jobId}/apply`, { pitch });
            queryClient.invalidateQueries(["job", jobId]);
            setIsApplyModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to submit application.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && !job) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <div className="animate-spin h-10 w-10 border-4 border-[#1798D7] border-t-transparent rounded-full mb-4"></div>
                    <p className="font-medium">Loading job details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (isError || !job) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Job not found</h2>
                    <p className="text-slate-500 mb-6">This job post may have been removed or doesn't exist.</p>
                    <button onClick={() => navigate("/jobs")} className="px-6 py-2 bg-[#1798D7] text-white font-bold rounded-xl hover:bg-[#1280B8] transition-colors">
                        Back to Jobs
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const isOwner = job.isOwner ?? job.owner;
    const isApplied = job.isApplied ?? job.applied;
    const isClosed = job.status !== "OPEN";

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex flex-col relative">
            <Navbar />

            <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1798D7] transition-colors w-fit mb-8"
                >
                    <ArrowLeft size={16} /> Back to Search
                </button>

                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-8 items-start">

                    <div className="w-full space-y-6">

                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${
                                    job.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                        job.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                            'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}>
                                    {job.status.replace("_", " ")}
                                </span>
                                <span className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                                    <Clock size={14} /> Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
                                {job.title}
                            </h1>

                            <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                                {isOwner && mode !== 'client' ? (
                                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 px-5 py-4 rounded-xl w-full">
                                        <ShieldCheck size={20} className="shrink-0" />
                                        <span className="font-bold text-sm">
                                            You posted this job.
                                            {/* FIX: Interactive Mode Switcher */}
                                            <button
                                                onClick={() => {
                                                    toggleMode(); // Flips mode to client instantly
                                                }}
                                                className="underline decoration-2 underline-offset-2 ml-1 hover:text-amber-900 transition-colors cursor-pointer"
                                            >
                                                Switch to Client Mode
                                            </button> to manage or edit it.
                                        </span>
                                    </div>
                                ) : isOwner && mode === 'client' ? (
                                    <div className="flex items-center gap-3 w-full">
                                        <button
                                            onClick={() => navigate(`/dashboard/jobs/${jobId}/edit`)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                                        >
                                            <Edit3 size={18} /> Edit Job Post
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors">
                                            <Ban size={18} /> Close Job
                                        </button>
                                    </div>
                                ) : isApplied ? (
                                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-[#09D66D] px-5 py-4 rounded-xl w-full">
                                        <CheckCircle2 size={24} className="shrink-0" />
                                        <span className="font-bold text-sm">Application submitted successfully. The client is reviewing your profile.</span>
                                    </div>
                                ) : (
                                    <button
                                        disabled={isClosed}
                                        onClick={() => setIsApplyModalOpen(true)}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1798D7] text-white font-bold py-3.5 px-10 rounded-xl hover:bg-[#1280B8] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isClosed ? 'Job Closed' : 'Apply Now'} <Send size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {job.aiGenSummary && (
                            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-100/50 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                                    <Sparkles size={100} className="text-[#1798D7]" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-[#1798D7] font-bold text-xs uppercase tracking-wider mb-3">
                                        <Sparkles size={16} /> AI Scope Summary
                                    </div>
                                    <p className="text-slate-700 text-lg leading-relaxed font-medium max-w-2xl">
                                        {job.aiGenSummary}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                                <FileText size={20} className="text-[#1798D7]" /> Job Description
                            </h3>
                            <div className="text-slate-600 leading-loose text-[15px] whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-5">Required Skills</h3>
                            <div className="flex flex-wrap gap-2.5">
                                {job.requiredSkills?.map((skill, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200/60">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {(isOwner || isApplied) && job.applications && job.applications.length > 0 && (
                            <div className="mt-10">
                                <h3 className="text-xl font-extrabold text-slate-900 mb-6">
                                    {isOwner ? `Applications (${job.applications.length})` : "Your Application"}
                                </h3>

                                <div className="space-y-4">
                                    {job.applications.map((app) => (
                                        <div key={app.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-5">

                                                <div className="flex items-center gap-4">
                                                    {/* FIX: Routing dynamic based on slug OR id */}
                                                    <Link to={`/freelancer/${app.freelancerSlug || app.freelancerId}`} className="shrink-0">
                                                        {app.freelancerProfilePicture ? (
                                                            <img src={app.freelancerProfilePicture} alt={app.freelancerName} className="h-12 w-12 rounded-full object-cover border-2 border-slate-100 hover:border-[#1798D7] transition-colors" />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:text-[#1798D7] transition-colors">
                                                                <UserCircle size={28} />
                                                            </div>
                                                        )}
                                                    </Link>
                                                    <div>
                                                        <Link to={`/freelancer/${app.freelancerSlug || app.freelancerId}`} className="font-bold text-slate-900 hover:text-[#1798D7] transition-colors">
                                                            {app.freelancerName || "Applicant"}
                                                        </Link>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                                                                app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600' :
                                                                    app.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' :
                                                                        'bg-blue-50 text-blue-600'
                                                            }`}>
                                                                {app.status}
                                                            </span>
                                                            <span className="text-xs text-slate-400 font-medium">
                                                                {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {app.aiCompatibilityScore && (
                                                    <div className="flex items-center gap-1.5 bg-emerald-50/50 text-[#06934A] border border-emerald-100 px-3 py-1.5 rounded-xl text-sm font-extrabold shrink-0">
                                                        <Sparkles size={16} /> {app.aiCompatibilityScore}% AI Match
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Pitch / Cover Letter</p>
                                                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                                    {app.pitch}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full space-y-6 lg:sticky lg:top-24">
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
                            <div className="h-14 w-14 bg-emerald-50 text-[#09D66D] rounded-2xl flex items-center justify-center mb-4">
                                <Wallet size={28} />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Fixed Budget</p>
                            <h2 className="text-3xl font-extrabold text-slate-900">
                                ₹{job.fixedBudget?.toLocaleString("en-IN")}
                            </h2>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-5">About the Client</h3>

                            <div className="flex items-center gap-4 mb-6">
                                {/* FIX: Routing dynamic based on slug OR id */}
                                <Link to={`/client/${job.clientSlug || job.clientId}`} className="shrink-0">
                                    {job.clientProfilePicture ? (
                                        <img src={job.clientProfilePicture} alt={job.clientName} className="h-14 w-14 rounded-full object-cover border-2 border-slate-100 hover:border-[#1798D7] transition-colors" />
                                    ) : (
                                        <div className="h-14 w-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:text-[#1798D7] transition-colors">
                                            <UserCircle size={32} />
                                        </div>
                                    )}
                                </Link>
                                <div>
                                    <Link to={`/client/${job.clientSlug || job.clientId}`} className="font-bold text-slate-900 text-lg hover:text-[#1798D7] transition-colors">
                                        {job.clientName}
                                    </Link>
                                    <div className="flex items-center gap-1 text-xs font-bold text-[#1798D7] mt-0.5">
                                        <ShieldCheck size={14} /> Identity Verified
                                    </div>
                                </div>
                            </div>

                            {job.contactNo ? (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                                    <div className="text-[#09D66D] mt-0.5"><Phone size={18} /></div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase text-emerald-700/70 mb-1">Direct Contact</p>
                                        <p className="font-bold text-emerald-900">{job.contactNo}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                                    <p className="text-xs font-medium text-slate-500">Contact details are hidden until you are hired.</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-5">Job Activity</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                        <Users size={16} className="text-slate-400" /> Proposals
                                    </span>
                                    <span className="font-bold text-slate-900">{job.totalApplicationsCount}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                        <Calendar size={16} className="text-slate-400" /> Last Updated
                                    </span>
                                    <span className="font-bold text-slate-900 text-sm">Today</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* ================= APPLY MODAL ================= */}
            <AnimatePresence>
                {isApplyModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsApplyModalOpen(false)}
                            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
                        />
                        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col"
                            >
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h3 className="text-lg font-bold text-slate-900">Submit Application</h3>
                                    <button onClick={() => setIsApplyModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50">
                                        <X size={20} />
                                    </button>
                                </div>
                                <form onSubmit={handleApply} className="p-6">
                                    <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                                        <Sparkles className="mt-0.5 text-[#09D66D]" size={16} shrink-0 />
                                        <p className="text-xs font-medium text-emerald-800 leading-relaxed">
                                            Our AI will review this pitch alongside your PDF resume and skills to generate a compatibility score for the client.
                                        </p>
                                    </div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Your Pitch</label>
                                    <textarea
                                        autoFocus
                                        required
                                        minLength={20}
                                        rows="6"
                                        placeholder="Hi there! I am the perfect fit for this job because..."
                                        value={pitch}
                                        onChange={(e) => setPitch(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#1798D7] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1798D7]/10 transition-all placeholder:text-slate-400 resize-none mb-6"
                                    />
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setIsApplyModalOpen(false)} className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={isSubmitting || pitch.length < 20} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-[#1798D7] hover:bg-[#1280B8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                                            {isSubmitting ? "Sending..." : "Submit Pitch"} <Send size={16} />
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}