import React, { useState, useEffect } from "react";
import {
  Building2, Briefcase, ArrowLeft, Loader2,
  User as UserIcon, BadgeCheck, Globe, MapPin, Phone, ExternalLink,
  Users, Banknote, ArrowRightLeft
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAxiosInstance } from "@/config/axiosConfig";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientProfile() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const axiosInstance = useAxiosInstance();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        const response = await axiosInstance.get(`/api/clients/public/${slug}`);
        setClient(response.data);
      } catch (err) {
        console.error("Failed to load client profile:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchClientProfile();
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
            <Loader2 className="w-10 h-10 text-[#09D66D] animate-spin mb-4" />
            <p className="text-slate-500 font-medium tracking-wide animate-pulse">Loading client profile...</p>
          </div>
          <Footer />
        </div>
    );
  }

  if (error || !client) {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
          <Navbar />
          <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <UserIcon size={32} className="text-slate-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800">Client Not Found</h2>
            <p className="text-slate-500 mt-3 max-w-md">This profile may have been removed, made private, or does not exist.</p>
            <button
                onClick={() => navigate("/jobs")}
                className="mt-8 bg-[#09D66D] hover:bg-[#07B85D] transition-all active:scale-95 text-white px-8 py-3 rounded-xl font-bold shadow-sm flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Find Work
            </button>
          </div>
          <Footer />
        </div>
    );
  }

  const hasBusinessDetails = client.websiteUrl || client.address || client.contactNumber;

  // Format currency securely
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
                className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#09D66D] transition-colors w-fit bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:border-emerald-200"
            >
              <ArrowLeft size={16} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
          </div>

          {/* ================= HERO CARD ================= */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden relative">

            <div className="h-40 md:h-52 bg-gradient-to-br from-[#09D66D] via-[#12a356] to-[#04753c] relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
              <div className="absolute bottom-0 left-20 w-40 h-40 rounded-full bg-black opacity-10 blur-2xl"></div>
            </div>

            <div className="px-6 md:px-12 pb-10 relative">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 -mt-16 md:-mt-20 mb-6">

                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-xl shadow-slate-900/10 relative z-10">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-50 to-green-100 overflow-hidden border-2 border-emerald-100/50 flex items-center justify-center">
                    {client.pfpUrl ? (
                        <img
                            src={client.pfpUrl}
                            alt={client.displayName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-5xl md:text-6xl font-black text-[#09D66D]">
                      {client.displayName ? client.displayName.charAt(0).toUpperCase() : "C"}
                    </span>
                    )}
                  </div>
                  {client.verified && (
                      <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md border border-slate-100" title="Verified Company">
                        <BadgeCheck className="text-blue-500 fill-blue-50" size={28} />
                      </div>
                  )}
                </div>

                {/* Dual Account Freelancer Button */}
                {client.hasFreelancerProfile && (
                    <button
                        onClick={() => navigate(`/freelancer/${slug}`)}
                        className="flex items-center justify-center gap-2 bg-white text-[#09D66D] border-2 border-[#09D66D] hover:bg-emerald-50 px-6 py-3 rounded-2xl font-bold shadow-sm transition-all active:scale-95 sm:mb-2 w-full sm:w-auto"
                    >
                      <ArrowRightLeft size={18} strokeWidth={2.5} />
                      <span>View Freelancer Profile</span>
                    </button>
                )}
              </div>

              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    {client.displayName}
                  </h1>
                  {client.verified && (
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-blue-100">
                    <BadgeCheck size={14} /> Verified Business
                  </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100">
                  {client.clientType === "COMPANY" ? (
                      <><Building2 size={16} className="text-[#09D66D]" /> Company Account</>
                  ) : (
                      <><UserIcon size={16} className="text-[#09D66D]" /> Individual Client</>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* ================= PLATFORM ACTIVITY WIDGET ================= */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <Briefcase className="text-[#09D66D]" size={22} />
              Platform Activity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Total Jobs */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-white rounded-full shadow-sm text-slate-400 border border-slate-100 mb-4">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-4xl font-black text-slate-800 mb-1">
                  {client.totalJobsPosted || 0}
                </h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Jobs Posted</p>
              </div>

              {/* Total Hires */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-white rounded-full shadow-sm text-[#09D66D] border border-emerald-100 mb-4">
                  <Users size={20} />
                </div>
                <h3 className="text-4xl font-black text-emerald-900 mb-1">
                  {client.totalHires || 0}
                </h3>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Total Hires</p>
              </div>

              {/* Total Spent */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-white rounded-full shadow-sm text-slate-400 border border-slate-100 mb-4">
                  <Banknote size={20} />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-2 mt-1">
                  {formatCurrency(client.totalSpent)}
                </h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Spent</p>
              </div>

            </div>
          </div>

          {/* ================= BUSINESS DETAILS WIDGET ================= */}
          {hasBusinessDetails && (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                  <Building2 className="text-[#09D66D]" size={22} />
                  Business Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                  {client.websiteUrl && (
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-start gap-4 hover:border-emerald-200 transition-colors group">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:text-[#09D66D] transition-colors shrink-0">
                          <Globe size={20} />
                        </div>
                        <div className="overflow-hidden min-w-0">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Website</p>
                          <a
                              href={client.websiteUrl.startsWith('http') ? client.websiteUrl : `https://${client.websiteUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-bold text-slate-700 hover:text-[#09D66D] truncate block w-full transition-colors flex items-center gap-1.5"
                          >
                            <span className="truncate">{client.websiteUrl.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink size={14} className="opacity-50 shrink-0" />
                          </a>
                        </div>
                      </div>
                  )}

                  {client.contactNumber && (
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-start gap-4 hover:border-emerald-200 transition-colors group">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:text-[#09D66D] transition-colors shrink-0">
                          <Phone size={20} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Phone</p>
                          <p className="text-sm font-bold text-slate-700 truncate block w-full">
                            {client.contactNumber}
                          </p>
                        </div>
                      </div>
                  )}

                  {client.address && (
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-start gap-4 hover:border-emerald-200 transition-colors group sm:col-span-2 lg:col-span-1">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:text-[#09D66D] transition-colors shrink-0">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Headquarters</p>
                          <p className="text-sm font-bold text-slate-700 leading-relaxed">
                            {client.address}
                          </p>
                        </div>
                      </div>
                  )}

                </div>
              </div>
          )}

        </main>

        <Footer />
      </div>
  );
}