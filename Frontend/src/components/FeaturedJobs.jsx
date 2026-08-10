import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Wallet, Clock, ArrowRight, Building2 } from "lucide-react";
import { useAxiosInstance } from "@/config/axiosConfig";

export default function FeaturedJobs() {
    const navigate = useNavigate();
    const axiosInstance = useAxiosInstance();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axiosInstance.get("/api/jobs/public/featured");
                const raw = response.data;
                const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);

                const mapped = list.map(j => ({
                    ...j,
                    budget: j.fixedBudget,
                    postedDate: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Recently"
                }));
                setJobs(mapped);
            } catch (error) {
                console.error("Failed to fetch featured jobs", error);
                setJobs([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, [axiosInstance]);

    if (isLoading) return <div className="py-16 text-center text-slate-500 font-medium">Loading opportunities...</div>;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
                            Latest <span className="text-[#09D66D]">Opportunities</span>
                        </h2>
                        <p className="text-slate-500 font-medium max-w-xl">Browse new freelance jobs posted by verified clients.</p>
                    </div>
                    <button
                        onClick={() => navigate("/jobs")}
                        className="flex items-center gap-2 text-[#09D66D] font-bold hover:text-[#07B85D] transition-colors whitespace-nowrap cursor-pointer"
                    >
                        Explore all jobs <ArrowRight size={18} />
                    </button>
                </div>

                {jobs.length === 0 ? (
                    <div className="p-12 rounded-3xl border border-slate-100 bg-slate-50/60 text-center max-w-md mx-auto shadow-sm">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#09D66D]">
                            <Briefcase size={26} />
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 mb-1">No jobs posted yet</h3>
                        <p className="text-xs text-slate-500 mb-6">There are no featured opportunities right now. Check back soon!</p>
                        <button
                            onClick={() => navigate("/jobs")}
                            className="px-5 py-2.5 rounded-xl bg-[#09D66D] text-white text-xs font-bold hover:bg-[#07B85D] transition-all cursor-pointer shadow-sm"
                        >
                            Browse All Jobs
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => navigate(`/jobs/${job.id}`)}
                                className="group bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col justify-between cursor-pointer"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-emerald-50 text-[#09D66D] rounded-xl group-hover:bg-[#09D66D] group-hover:text-white transition-colors">
                                            <Briefcase size={24} />
                                        </div>
                                        <span className="bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                            <Wallet size={12} className="text-[#09D66D]" /> ₹{job.budget?.toLocaleString("en-IN") || 0}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-[#09D66D] transition-colors">{job.title}</h3>
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 mb-6">
                                        <Building2 size={16} /> {job.clientName}
                                    </div>
                                </div>
                                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5"><Clock size={14} /> {job.postedDate}</span>
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-[#09D66D]">View Details →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}