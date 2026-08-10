import React, { useState, useEffect, useCallback } from "react";
import { useAxiosInstance } from "@/config/axiosConfig";
import Navbar from "@/components/Navbar";
import { MapPin, ChevronLeft, ChevronRight, Loader2, RefreshCw, Users, Sparkles, ArrowUpRight } from "lucide-react";

export default function Freelancers() {
  const axiosInstance = useAxiosInstance();

  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed for Spring Data
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 6;

  // Memoized fetch function so it can be called on page change or manually via Refresh
  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/freelancers?page=${currentPage}&size=${pageSize}`
      );

      if (response.data?.content) {
        // Standard Spring Data Page object structure
        setFreelancers(response.data.content);
        setTotalPages(response.data.totalPages);
      } else if (Array.isArray(response.data)) {
        // Plain array response fallback
        setFreelancers(response.data);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } else {
        setFreelancers([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Failed to fetch freelancers from backend:", err);
      setFreelancers([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, currentPage, pageSize]);

  useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  const handleRefresh = () => {
    if (currentPage === 0) {
      fetchFreelancers();
    } else {
      setCurrentPage(0); // Switching to page 0 automatically triggers useEffect
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  // Helper function to safely parse skills from array or comma-separated string
  const parseSkills = (skills) => {
    if (Array.isArray(skills)) return skills;
    if (typeof skills === "string" && skills.trim() !== "") {
      return skills.split(",").map((s) => s.trim());
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#141b2b] font-sans antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* ================= REDESIGNED HEADING & COMPACT TOP-RIGHT REFRESH ================= */}
        <div className="relative mb-10 p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm overflow-hidden flex items-center justify-between">
          
          {/* Subtle Background Aesthetic Light */}
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#09D66D] animate-pulse" />
              <span>Verified Talent Network</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Hire Elite <span className="text-[#09D66D] underline decoration-emerald-200 decoration-wavy decoration-2">Freelancers</span>
            </h1>
            
            <p className="text-gray-500 text-sm sm:text-base mt-2 leading-relaxed">
              Discover top-tier developers, designers, and domain experts ready to build your next project.
            </p>
          </div>

          {/* Small Compact Refresh Button on Top Right Side */}
          <div className="relative z-10 flex-shrink-0">
            <button
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh freelancer list"
              className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-[#09D66D]" : "text-gray-500"} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[350px]">
            <Loader2 className="w-9 h-9 text-[#09D66D] animate-spin mb-3" />
            <p className="text-sm text-gray-500 font-medium">Fetching active freelancers from server...</p>
          </div>
        ) : freelancers.length === 0 ? (
          /* Empty State when Backend has no items */
          <div className="text-center py-20 px-4 bg-white rounded-2xl border border-dashed border-gray-300 max-w-xl mx-auto shadow-xs">
            <div className="w-14 h-14 bg-emerald-50 text-[#09D66D] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={28} />
            </div>
            <h3 className="text-gray-900 font-bold text-xl">No freelancers available</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              Once new profile entries are added through the backend database, they will appear here dynamically.
            </p>
            <button
              onClick={handleRefresh}
              className="cursor-pointer mt-6 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#09D66D] hover:bg-[#07be60] rounded-xl shadow-xs transition-all duration-200 active:scale-95"
            >
              <RefreshCw size={14} />
              <span>Check Again</span>
            </button>
          </div>
        ) : (
          <>
            {/* ================= FREELANCER CARDS GRID WITH HOVER ZOOM ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {freelancers.map((item) => {
                const name = item.firstName
                  ? `${item.firstName} ${item.lastName || ""}`.trim()
                  : item.name || "Freelancer";

                const skillsList = parseSkills(item.skills);

                return (
                  <div
                    key={item.id || item.email || Math.random()}
                    className="cursor-pointer group relative bg-white rounded-2xl border border-gray-200/90 p-6 flex flex-col justify-between shadow-xs transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-200/50 hover:border-emerald-300/80"
                  >
                    <div>
                      {/* Avatar & Title Header */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full border-2 border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center group-hover:border-emerald-200 transition-colors">
                          {item.profilePic ? (
                            <img
                              src={item.profilePic}
                              alt={name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <span className="text-xl font-black text-gray-400 group-hover:text-[#09D66D] transition-colors">
                              {name[0] ? name[0].toUpperCase() : "U"}
                            </span>
                          )}
                        </div>
                        <div className="overflow-hidden flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight truncate group-hover:text-[#09D66D] transition-colors">
                              {name}
                            </h3>
                            <ArrowUpRight size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-[#09D66D] transition-all -translate-x-1 group-hover:translate-x-0" />
                          </div>
                          <p className="text-xs text-[#09D66D] font-semibold truncate mt-0.5 tracking-wide">
                            {item.title || "Freelance Specialist"}
                          </p>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-gray-500 mt-4 line-clamp-3 leading-relaxed">
                        {item.bio || "No description provided."}
                      </p>

                      {/* Skill Badges */}
                      {skillsList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-5">
                          {skillsList.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-gray-100/80 text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <MapPin size={14} className="text-gray-400 group-hover:text-[#09D66D] transition-colors" />
                        <span>{item.location || "Remote"}</span>
                      </div>
                      <div className="font-extrabold text-gray-900 text-base">
                        ${item.hourlyRate || 0}
                        <span className="text-xs font-medium text-gray-400">/hr</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================= PAGINATION CONTROLS ================= */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="cursor-pointer flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all"
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <div className="flex items-center gap-1.5 px-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`cursor-pointer w-8 h-8 text-xs font-bold rounded-xl transition-all duration-200 active:scale-95 ${
                        currentPage === index
                          ? "bg-[#09D66D] text-white shadow-md shadow-emerald-200"
                          : "text-gray-600 hover:bg-gray-200/60"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                  className="cursor-pointer flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}