import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    BriefcaseBusiness,
    FileText,
    Star,
    BadgeCheck,
    Sparkles,
    Loader2,
    PlusCircle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAxiosInstance } from "../../config/axiosConfig";

export default function OverviewTab() {
    const axiosInstance = useAxiosInstance();
    const navigate = useNavigate();

    // Grab shared header/profile data from the Dashboard Layout Wrapper!
    const { profileData, clientType, companyData } = useOutletContext();

    const [stats, setStats] = useState([
        { title: "Active Jobs", value: "0", icon: BriefcaseBusiness },
        { title: "Applications", value: "0", icon: FileText },
        { title: "Shortlisted", value: "0", icon: Star },
        { title: "Hired", value: "0", icon: BadgeCheck },
    ]);
    const [candidates, setCandidates] = useState([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);

    // ================= FETCH METRICS & AI RANKINGS =================
    useEffect(() => {
        let isMounted = true;

        const fetchOverviewData = async () => {
            setIsLoadingStats(true);
            setIsLoadingCandidates(true);
            try {
                const statsRes = await axiosInstance.get("/api/clients/stats");
                if (statsRes.data?.stats && isMounted) {
                    setStats([
                        { title: "Active Jobs", value: String(statsRes.data.stats.activeJobs ?? 0), icon: BriefcaseBusiness },
                        { title: "Applications", value: String(statsRes.data.stats.applications ?? 0), icon: FileText },
                        { title: "Shortlisted", value: String(statsRes.data.stats.shortlisted ?? 0), icon: Star },
                        { title: "Hired", value: String(statsRes.data.stats.hired ?? 0), icon: BadgeCheck },
                    ]);
                }

                const rankRes = await axiosInstance.get("/api/clients/candidates/rankings");
                if (isMounted) {
                    setCandidates(Array.isArray(rankRes.data) ? rankRes.data : []);
                }
            } catch (err) {
                console.warn("Backend metrics offline. Using UI mock data.");
                if (isMounted) {
                    // Developer Fallback Mock Data
                    setStats([
                        { title: "Active Jobs", value: "3", icon: BriefcaseBusiness },
                        { title: "Applications", value: "14", icon: FileText },
                        { title: "Shortlisted", value: "2", icon: Star },
                        { title: "Hired", value: "1", icon: BadgeCheck },
                    ]);
                    setCandidates([
                        { id: 101, name: "Rahul Sharma", role: "React Expert", match: 94, status: "shortlisted", experience: "4+ years", skills: ["React", "Spring Boot"] },
                        { id: 102, name: "Priya Das", role: "UI Designer", match: 88, status: "new", experience: "3+ years", skills: ["Figma", "Tailwind"] }
                    ]);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingStats(false);
                    setIsLoadingCandidates(false);
                }
            }
        };

        fetchOverviewData();

        return () => {
            isMounted = false;
        };
    }, [axiosInstance]);

    // ================= STATUS TOGGLE =================
    const handleStatusChange = async (candidateId, currentStatus) => {
        const nextStatus = currentStatus === "shortlisted" ? "new" : "shortlisted";

        // Optimistic UI update
        setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, status: nextStatus } : c)));

        try {
            await axiosInstance.patch(`/api/clients/candidates/${candidateId}/status`, { status: nextStatus });
            toast.success(nextStatus === "shortlisted" ? "Candidate Shortlisted!" : "Removed from Shortlist");
        } catch (err) {
            toast.error("Failed to update status on server.");
        }
    };

    return (
        <div className="flex-1 space-y-8">
            <Toaster position="top-right" />

            {/* ================= HEADER ================= */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Welcome back{profileData?.firstName ? `, ${profileData.firstName}` : ""}!
                    </h1>
                    <p className="text-sm text-gray-500">
                        Managing postings as <strong className="text-gray-700">{clientType === "individual" ? "an Individual Client" : companyData?.companyName || "Your Organization"}</strong>.
                    </p>
                </div>
                <button
                    onClick={() => toast("AI Match Simulation Triggered!", { icon: '🤖' })}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:border-[#09D66D] hover:text-[#09D66D] font-semibold px-4 py-2 rounded-lg text-sm transition-all shadow-sm active:scale-95"
                >
                    <PlusCircle size={16} /> Simulate AI Match
                </button>
            </header>

            {/* ================= METRIC CARDS ================= */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 transition-all hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs uppercase tracking-wider text-gray-500">{stat.title}</span>
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border border-gray-100">
                                    <Icon size={18} className="text-gray-600" />
                                </div>
                            </div>
                            <span className="text-3xl font-extrabold text-gray-900">
                {isLoadingStats ? "..." : stat.value}
              </span>
                        </div>
                    );
                })}
            </div>

            {/* ================= AI CANDIDATE RANKING CARD ================= */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        AI Candidate Ranking <Sparkles size={18} className="text-[#09D66D]" />
                    </h2>
                    <button
                        onClick={() => navigate("/dashboard/jobs")}
                        className="text-sm font-bold text-[#1798D7] hover:text-[#004f70] hover:underline transition-colors"
                    >
                        View All Jobs &rarr;
                    </button>
                </div>

                {/* LOADING STATE */}
                {isLoadingCandidates ? (
                    <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
                        <Loader2 className="animate-spin text-[#09D66D]" size={20} />
                        <span className="text-sm font-medium">Loading AI Matches...</span>
                    </div>
                ) : candidates.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-gray-500 text-sm font-medium">No AI matches found for your active jobs right now.</p>
                    </div>
                ) : (
                    /* POPULATED LIST */
                    <div className="flex flex-col gap-3">
                        {candidates.map((candidate) => (
                            <div key={candidate.id} className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#09D66D]/30 hover:shadow-md transition-all bg-white">

                                {/* Candidate Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-[#09D66D] text-lg">
                                        {candidate.image ? (
                                            <img className="w-full h-full object-cover" src={candidate.image} alt={candidate.name} />
                                        ) : (
                                            candidate.name?.[0] || "C"
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                                            {candidate.status === "shortlisted" && (
                                                <span className="text-[10px] uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                          Shortlisted
                        </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {candidate.role} {candidate.experience ? `• ${candidate.experience}` : ""}
                                        </p>
                                    </div>
                                </div>

                                {/* Score & Actions */}
                                <div className="flex items-center gap-3 md:gap-5 flex-wrap">

                                    {/* Match Score */}
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-lg font-bold text-gray-900">{candidate.match || candidate.matchScore || 0}</span>
                                            <span className="text-xs font-semibold text-gray-500">%</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#09D66D] uppercase tracking-wider">Match</span>
                                    </div>

                                    <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                                    {/* Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => navigate(`/freelancer/${candidate.slug || candidate.id}`)}
                                            className="bg-white border border-gray-200 text-gray-700 hover:border-[#1798D7] hover:text-[#1798D7] hover:bg-blue-50 text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm"
                                        >
                                            Review Profile
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(candidate.id, candidate.status)}
                                            title={candidate.status === "shortlisted" ? "Remove from Shortlist" : "Shortlist Candidate"}
                                            className={`p-2 rounded-lg border transition-all shadow-sm ${
                                                candidate.status === "shortlisted"
                                                    ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                                                    : "bg-white border-gray-200 text-gray-400 hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50"
                                            }`}
                                        >
                                            <Star size={16} fill={candidate.status === "shortlisted" ? "currentColor" : "none"} strokeWidth={candidate.status === "shortlisted" ? 1 : 2} />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}