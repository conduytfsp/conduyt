import React, { useState, useEffect } from "react";
import {
  ArrowLeft, Loader2, User as UserIcon, BadgeCheck,
  Globe, FileText, ArrowRightLeft, Code2, FileUser,
  Briefcase, Banknote, Trophy
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAxiosInstance } from "@/config/axiosConfig";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FreelancerProfile() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const axiosInstance = useAxiosInstance();

  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(`/api/freelancers/public/${slug}`);
        setFreelancer(response.data);
      } catch (err) {
        console.error("Failed to load freelancer profile:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProfile();
    } else {
      setLoading(false);
      setError(true);
    }
  }, [slug, axiosInstance]);

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
          <Navbar />
          <div className="flex-grow flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#1798D7] animate-spin mb-4" />
            <p className="text-slate-500 font-medium tracking-wide animate-pulse">Loading talent profile...</p>
          </div>
          <Footer />
        </div>
    );
  }

  if (error || !freelancer) {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
          <Navbar />
          <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <UserIcon size={32} className="text-slate-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800">Profile Not Found</h2>
            <p className="text-slate-500 mt-3 max-w-md">This freelancer profile may have been removed, made private, or does not exist.</p>
            <button
                onClick={() => navigate("/freelancers")}
                className="mt-8 bg-[#1798D7] hover:bg-[#1280B8] transition-all active:scale-95 text-white px-8 py-3 rounded-xl font-bold shadow-sm flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Directory
            </button>
          </div>
          <Footer />
        </div>
    );
  }

  const hasExternalLinks = freelancer.githubUrl || freelancer.linkedinUrl || freelancer.portfolioUrl || freelancer.cvUrl;

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans antialiased">
        <Navbar />

        <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-8">

          {/* Navigation Row */}
          <div>
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1798D7] transition-colors w-fit bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:border-blue-200"
            >
              <ArrowLeft size={16} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
          </div>

          {/* ================= HERO CARD ================= */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden relative">

            {/* Blue Theme Banner */}
            <div className="h-40 md:h-52 bg-gradient-to-br from-[#1798D7] via-[#1280B8] to-[#0D5D86] relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
              <div className="absolute bottom-0 left-20 w-40 h-40 rounded-full bg-black opacity-10 blur-2xl"></div>
            </div>

            <div className="px-6 md:px-12 pb-10 relative">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 -mt-16 md:-mt-20 mb-6">

                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-xl shadow-slate-900/10 relative z-10">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden border-2 border-blue-100/50 flex items-center justify-center">
                    {freelancer.pfpUrl ? (
                        <img
                            src={freelancer.pfpUrl}
                            alt={freelancer.displayName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-5xl md:text-6xl font-black text-[#1798D7]">
                      {freelancer.displayName ? freelancer.displayName.charAt(0).toUpperCase() : "U"}
                    </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md border border-slate-100" title="Verified Talent">
                    <BadgeCheck className="text-[#1798D7] fill-blue-50" size={28} />
                  </div>
                </div>

                {/* Dual Account Client Button - FIXED ROUTE */}
                {freelancer.hasClientProfile && (
                    <button
                        onClick={() => navigate(`/client/${slug}`)}
                        className="flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 hover:border-[#1798D7] hover:text-[#1798D7] px-6 py-3 rounded-2xl font-bold shadow-sm transition-all active:scale-95 sm:mb-2 w-full sm:w-auto"
                    >
                      <ArrowRightLeft size={18} strokeWidth={2.5} />
                      <span>View Client Profile</span>
                    </button>
                )}
              </div>

              <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                  {freelancer.displayName}
                </h1>

                <p className="text-lg md:text-xl font-bold text-[#1798D7] mb-6">
                  {freelancer.title || "Independent Professional"}
                </p>
              </div>

            </div>
          </div>

          {/* ================= CONTENT GRID ================= */}
          <div className={`grid grid-cols-1 ${hasExternalLinks ? 'lg:grid-cols-3' : 'max-w-3xl mx-auto w-full'} gap-8`}>

            {/* Main Content Column */}
            <div className={`flex flex-col gap-8 ${hasExternalLinks ? 'lg:col-span-2' : ''}`}>

              {/* Platform Activity Analytics */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                  <Trophy className="text-[#1798D7]" size={22} />
                  Platform Activity
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Jobs Completed */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400 border border-slate-100">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800">
                        {freelancer.totalJobsDone || 0}
                      </h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Jobs Completed</p>
                    </div>
                  </div>

                  {/* Total Earned */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-[#1798D7] border border-blue-100">
                      <Banknote size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-blue-900">
                        {formatCurrency(freelancer.totalEarnings)}
                      </h3>
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Total Earned</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              {freelancer.bio && (
                  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
                    <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                      <FileUser className="text-[#1798D7]" size={22} />
                      About
                    </h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {freelancer.bio}
                    </p>
                  </div>
              )}

              {/* Skills Section */}
              {freelancer.skills && freelancer.skills.length > 0 && (
                  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
                    <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                      <Code2 className="text-[#1798D7]" size={22} />
                      Technical Skills
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                      {freelancer.skills.map((skill, index) => (
                          <span
                              key={index}
                              className="px-4 py-2 bg-blue-50 text-blue-800 border border-blue-100 rounded-xl text-sm font-bold shadow-sm"
                          >
                      {skill}
                    </span>
                      ))}
                    </div>
                  </div>
              )}
            </div>

            {/* Sidebar Column (Links & Resume) */}
            {hasExternalLinks && (
                <div className="flex flex-col gap-6">
                  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
                    <h2 className="text-xl font-extrabold text-slate-900 mb-6">
                      Portfolio & Links
                    </h2>

                    <div className="space-y-4">
                      {freelancer.portfolioUrl && (
                          <a
                              href={freelancer.portfolioUrl.startsWith('http') ? freelancer.portfolioUrl : `https://${freelancer.portfolioUrl}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50 hover:bg-blue-50/50 transition-colors group"
                          >
                            <Globe className="text-slate-400 group-hover:text-[#1798D7] shrink-0" size={24} />
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-slate-900">Personal Portfolio</p>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{freelancer.portfolioUrl.replace(/^https?:\/\//, '')}</p>
                            </div>
                          </a>
                      )}

                      {freelancer.githubUrl && (
                          <a
                              href={freelancer.githubUrl.startsWith('http') ? freelancer.githubUrl : `https://${freelancer.githubUrl}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors group"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-900 shrink-0">
                              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                              <path d="M9 18c-4.51 2-5-2-7-2"/>
                            </svg>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-slate-900">GitHub Profile</p>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{freelancer.githubUrl.replace(/^https?:\/\//, '')}</p>
                            </div>
                          </a>
                      )}

                      {freelancer.linkedinUrl && (
                          <a
                              href={freelancer.linkedinUrl.startsWith('http') ? freelancer.linkedinUrl : `https://${freelancer.linkedinUrl}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50 hover:bg-blue-50/50 transition-colors group"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-[#0A66C2] shrink-0">
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                              <rect width="4" height="12" x="2" y="9"/>
                              <circle cx="4" cy="4" r="2"/>
                            </svg>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-slate-900">LinkedIn Profile</p>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{freelancer.linkedinUrl.replace(/^https?:\/\//, '')}</p>
                            </div>
                          </a>
                      )}

                      {freelancer.cvUrl && (
                          <a
                              href={freelancer.cvUrl}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-4 p-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-[#1798D7] text-blue-800 hover:text-white transition-colors group mt-6"
                          >
                            <FileText className="shrink-0" size={24} />
                            <div>
                              <p className="text-sm font-bold">View Resume / CV</p>
                            </div>
                          </a>
                      )}
                    </div>
                  </div>
                </div>
            )}

          </div>
        </main>

        <Footer />
      </div>
  );
}