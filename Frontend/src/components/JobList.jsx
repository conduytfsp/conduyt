import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Clock, Building2, UserCircle, ArrowRight, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function JobList({ jobs = [], totalFilteredJobs = 0, isLoading, currentPage, totalPages, setCurrentPage }) {
    const navigate = useNavigate();

    const safeJobs = Array.isArray(jobs) ? jobs : [];

    if (isLoading && safeJobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full text-slate-400">
                <Loader2 size={40} className="animate-spin text-[#1798D7] mb-4" />
                <p className="font-medium">Loading opportunities...</p>
            </div>
        );
    }

    if (totalFilteredJobs === 0 || safeJobs.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm w-full flex flex-col items-center mt-6">
                <Search size={48} className="text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800">No Active Jobs</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                    We couldn't find any projects matching your criteria right now. Try clearing your filters or check back later.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full pt-2">
            <div className="mb-4">
                <p className="text-sm font-medium text-slate-500">
                    Showing <span className="text-slate-800 font-bold">{totalFilteredJobs}</span> opportunities
                </p>
            </div>

            <div className="space-y-5">
                <AnimatePresence>
                    {safeJobs.map((job) => (
                        <motion.div
                            key={job?.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => job?.id && navigate(`/jobs/${job.id}`)}
                            className="group bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                        >

                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                                <div className="flex-1 min-w-0">
                                    <h2 className="text-[19px] font-extrabold text-slate-900 group-hover:text-[#1798D7] transition-colors truncate pr-4">
                                        {job?.title || "Untitled Job"}
                                    </h2>

                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2.5 text-[13px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          {job?.clientPfpUrl ? (
                              <img src={job.clientPfpUrl} alt="Client" className="w-4 h-4 rounded-full object-cover border border-slate-200" />
                          ) : (
                              <UserCircle size={14} className="text-slate-400" />
                          )}
                            {job?.clientName || "Anonymous Client"}
                        </span>
                                        <span className="flex items-center gap-1.5">
                          <Building2 size={13} className="text-slate-400" />
                                            {job?.clientType === "COMPANY" ? "Enterprise" : "Individual"}
                        </span>
                                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-400" />
                                            {job?.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : "Recently"}
                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center sm:items-start shrink-0">
                                    <div className="text-[15px] font-extrabold text-slate-900 flex items-center gap-1.5 bg-emerald-50/80 px-3 py-1.5 rounded-[10px] border border-emerald-100">
                                        <Wallet size={16} className="text-[#09D66D]" />
                                        ₹{job?.fixedBudget ? job.fixedBudget.toLocaleString("en-IN") : "0"}
                                    </div>
                                </div>
                            </div>

                            <p className="mt-5 text-[14.5px] text-slate-600 leading-relaxed line-clamp-2">
                                {job?.aiGenSummary || job?.description || "No description provided."}
                            </p>

                            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                <div className="flex flex-wrap gap-2">
                                    {job?.requiredSkills?.slice(0, 4).map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-[#F8FAFC] text-slate-600 text-[12px] font-medium rounded-lg">
                            {skill?.name || skill}
                          </span>
                                    ))}
                                    {job?.requiredSkills?.length > 4 && (
                                        <span className="px-3 py-1 bg-[#F8FAFC] text-slate-400 text-[12px] font-medium rounded-lg">
                            +{job.requiredSkills.length - 4}
                          </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#1798D7] group-hover:text-[#00628e] transition-colors shrink-0">
                                    View details <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Server-Side Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10 mb-4">
                    <button
                        onClick={() => {
                            setCurrentPage(currentPage - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-[13px] uppercase tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-600 hover:text-[#1798D7] hover:border-[#1798D7]/30 shadow-sm"
                    >
                        <ChevronLeft size={16} /> Prev
                    </button>

                    <span className="font-semibold text-[14px] text-slate-500 bg-slate-100 px-4 py-2 rounded-xl">
                <span className="text-slate-800">{currentPage}</span> / {totalPages}
              </span>

                    <button
                        onClick={() => {
                            setCurrentPage(currentPage + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-[13px] uppercase tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-600 hover:text-[#1798D7] hover:border-[#1798D7]/30 shadow-sm"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}