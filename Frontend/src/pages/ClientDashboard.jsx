import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAxiosInstance } from "../config/axiosConfig";

import PersonalDetailsView from "../components/dashboard/PersonalDetailsView";
import CompanyDetailsView from "../components/dashboard/CompanyDetailsView";
import JobManagementView from "../components/dashboard/JobManagementView";
import AnalyticsView from "../components/dashboard/AnalyticsView";
import SecurityView from "../components/dashboard/SecurityView";
import ClientProfile from "../components/dashboard/ClientProfile";

import {
  LayoutDashboard,
  Briefcase,
  CircleHelp,
  BriefcaseBusiness,
  FileText,
  Star,
  BadgeCheck,
  Sparkles,
  User,
  Building2,
  BarChart3,
  ShieldCheck,
  PlusCircle,
  Loader2,
} from "lucide-react";

const allMenuItems = [
  { icon: LayoutDashboard, name: "Overview", id: "overview" },
  { icon: User, name: "Personal Details", id: "personal" },
  { icon: Building2, name: "Company Details", id: "company" },
  { icon: Briefcase, name: "Jobs Management", id: "jobs" },
  { icon: BarChart3, name: "Analytics", id: "analytics" },
  { icon: ShieldCheck, name: "Security & Privacy", id: "security" },
];

function ClientDashboard() {
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();

  // Navigation & View States
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Dynamic States
  const [stats, setStats] = useState([
    { title: "Active Jobs", value: "0", icon: BriefcaseBusiness },
    { title: "Applications", value: "0", icon: FileText },
    { title: "Shortlisted", value: "0", icon: Star },
    { title: "Hired", value: "0", icon: BadgeCheck },
  ]);

  const [candidates, setCandidates] = useState([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // User Profile & Company States
  const [clientType, setClientType] = useState(() => {
    return localStorage.getItem("conduyt_clientType") || "company";
  });

  const [profileData, setProfileData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    profilePic: null,
  });

  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyRole: "",
    companyWebsite: "",
    contactNumber: "",
    gstin: "",
    companyAddress: "",
  });

  // Sync LocalStorage for local form edits
  useEffect(() => {
    localStorage.setItem("conduyt_clientType", clientType);
  }, [clientType]);

  useEffect(() => {
    localStorage.setItem("conduyt_profileData", JSON.stringify(profileData));
  }, [profileData]);

  useEffect(() => {
    localStorage.setItem("conduyt_companyData", JSON.stringify(companyData));
  }, [companyData]);

  // ================= AXIOS: FETCH USER PROFILE & DASHBOARD STATS =================
  useEffect(() => {
    const fetchUserDataAndStats = async () => {
      setIsLoadingStats(true);
      try {
        const userRes = await axiosInstance.get("/user/profile");
        if (userRes.data?.profile) setProfileData(userRes.data.profile);
        if (userRes.data?.company) setCompanyData(userRes.data.company);
        if (userRes.data?.clientType) setClientType(userRes.data.clientType);

        const statsRes = await axiosInstance.get("/dashboard/stats");
        if (statsRes.data?.stats) {
          setStats([
            { title: "Active Jobs", value: String(statsRes.data.stats.activeJobs ?? 0), icon: BriefcaseBusiness },
            { title: "Applications", value: String(statsRes.data.stats.applications ?? 0), icon: FileText },
            { title: "Shortlisted", value: String(statsRes.data.stats.shortlisted ?? 0), icon: Star },
            { title: "Hired", value: String(statsRes.data.stats.hired ?? 0), icon: BadgeCheck },
          ]);
        }
      } catch (err) {
        console.error("Error loading user profile or dashboard metrics:", err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchUserDataAndStats();
  }, [axiosInstance]);

  // ================= AXIOS: FETCH DYNAMIC CANDIDATES =================
  useEffect(() => {
    const fetchCandidateRankings = async () => {
      setIsLoadingCandidates(true);
      setErrorMsg("");
      try {
        const response = await axiosInstance.get("/candidates/rankings");
        setCandidates(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch AI candidate rankings:", err);
        setErrorMsg("Unable to load candidate rankings at this moment.");
        setCandidates([]);
      } finally {
        setIsLoadingCandidates(false);
      }
    };

    if (activeTab === "overview") {
      fetchCandidateRankings();
    }
  }, [activeTab, axiosInstance]);

  // ================= AXIOS: TRIGGER AI MATCH =================
  const handleSimulateNewCandidate = async () => {
    try {
      const response = await axiosInstance.post("/candidates/ai-match");
      if (response.data?.candidate) {
        setCandidates((prev) => [response.data.candidate, ...prev]);
      }
    } catch (err) {
      console.warn("Backend /candidates/ai-match route is not implemented yet.");

      const tempCandidate = {
        id: `cand-${Date.now()}`,
        name: `New AI Candidate ${candidates.length + 1}`,
        role: "AI Matched Specialist",
        match: Math.floor(Math.random() * 15) + 85,
        status: "new",
        skills: ["React", "Express", "Node.js"],
        experience: "3+ years",
      };

      setCandidates((prev) => [tempCandidate, ...prev]);
    }
  };

  // ================= AXIOS: TOGGLE SHORTLIST STATUS =================
  const handleStatusChange = async (candidateId, currentStatus) => {
    const nextStatus = currentStatus === "shortlisted" ? "new" : "shortlisted";

    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: nextStatus } : c))
    );

    try {
      await axiosInstance.patch(`/candidates/${candidateId}/status`, {
        status: nextStatus,
      });
    } catch (err) {
      console.error("Failed to update candidate status on backend:", err);
    }
  };

  const filteredMenuItems = allMenuItems.filter((item) => {
    if (clientType === "individual" && item.id === "company") {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f2fcf6] text-[#141b2b] font-sans antialiased">
      {/* ================= TOP NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-xl shadow-sm border-b border-[#09D66D]/20 flex items-center justify-between px-4 md:px-10">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex justify-center items-center cursor-pointer">
            <img src="/logo1.png" alt="Conduyt" className="h-28 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/find-work"
              className="text-[#09D66D] font-bold hover:text-[#07b059] transition-colors cursor-pointer"
            >
              Find Work
            </Link>
            <Link
              to="/ai-features"
              className="text-gray-600 hover:text-[#09D66D] transition-colors cursor-pointer"
            >
              AI Features
            </Link>
            <Link
              to="/pricing"
              className="text-gray-600 hover:text-[#09D66D] transition-colors cursor-pointer"
            >
              Pricing
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* NAVBAR AVATAR BUTTON */}
          <button
            onClick={() => {
              setSelectedCandidate(null);
              setActiveTab("profile");
            }}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#09D66D] focus:outline-none focus:ring-2 focus:ring-[#09D66D]/50 cursor-pointer bg-[#09D66D]/10 flex items-center justify-center font-bold text-[#09D66D]"
            title="View Profile"
          >
            {profileData.profilePic ? (
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src={profileData.profilePic}
              />
            ) : (
              <span>{profileData.firstName?.[0] || "U"}</span>
            )}
          </button>
        </div>
      </nav>

      {/* ================= PAGE LAYOUT ================= */}
      <div className="flex flex-1 pt-16">
        {/* SIDEBAR */}
        <aside className="hidden md:flex flex-col p-4 gap-2 bg-[#e6fbf2] fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r border-[#09D66D]/20 z-40">
          <div
            className="mb-6 px-2 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity select-none"
            onClick={() => {
              setSelectedCandidate(null);
              setActiveTab("profile");
            }}
            title="View Profile"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#09D66D] bg-white flex-shrink-0">
              {profileData.profilePic ? (
                <img
                  src={profileData.profilePic}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#09D66D]/10 text-[#09D66D] flex items-center justify-center font-bold text-sm">
                  {profileData.firstName?.[0] || "U"}
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-gray-900 truncate">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-xs text-[#09D66D] font-medium truncate">
                {clientType === "individual"
                  ? "Individual Client"
                  : companyData.companyName || "Company Client"}
              </p>
            </div>
          </div>

          <nav className="flex-1 flex flex-col gap-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !selectedCandidate;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedCandidate(null);
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#09D66D] to-[#4AB7B2] text-white font-bold shadow-sm"
                      : "text-gray-700 hover:bg-[#09D66D]/10 hover:text-[#09D66D]"
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto">
            <Link
              to="/help"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#09D66D]/10 hover:text-[#09D66D] rounded-lg transition-colors cursor-pointer"
            >
              <CircleHelp size={20} strokeWidth={2} />
              <span>Help Center</span>
            </Link>
          </div>
        </aside>

        {/* MAIN VIEW AREA */}
        <main className="flex-1 md:ml-64 p-6 md:p-10 flex flex-col justify-between">
          <div className="flex-1">
            {selectedCandidate ? (
              <CandidateProfileView
                candidate={selectedCandidate}
                onBack={() => setSelectedCandidate(null)}
              />
            ) : (
              <>
                {activeTab === "overview" && (
                  <div>
                    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-[#141b2b] mb-2">
                          Welcome back{profileData.firstName ? `, ${profileData.firstName}` : ""}!
                        </h1>
                        <p className="text-base text-gray-500">
                          Managing postings as{" "}
                          <strong className="text-gray-800">
                            {clientType === "individual"
                              ? "an Individual Client"
                              : companyData.companyName || "Your Organization"}
                          </strong>
                          .
                        </p>
                      </div>

                      <button
                        onClick={handleSimulateNewCandidate}
                        className="flex items-center gap-2 bg-white border border-[#09D66D] text-[#09D66D] hover:bg-[#09D66D]/10 font-medium px-4 py-2 rounded-lg text-sm transition-colors self-start md:self-auto cursor-pointer"
                      >
                        <PlusCircle size={18} /> Simulate AI Match
                      </button>
                    </header>

                    {/* METRIC CARDS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                      {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                          <div
                            key={stat.title}
                            className="bg-white p-6 rounded-xl border border-[#09D66D]/20 shadow-sm flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm text-gray-500">
                                {stat.title}
                              </span>
                              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#09D66D]/10">
                                <Icon
                                  size={24}
                                  strokeWidth={2}
                                  className="text-[#09D66D]"
                                />
                              </div>
                            </div>
                            <span className="text-3xl font-semibold text-[#141b2b]">
                              {isLoadingStats ? "..." : stat.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* AI CANDIDATE RANKING CARD */}
                    <div className="bg-white rounded-xl border border-[#09D66D]/40 p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-[#141b2b] flex items-center gap-3">
                          AI Candidate Ranking{" "}
                          <Sparkles
                            size={24}
                            strokeWidth={2}
                            className="text-[#09D66D]"
                          />
                        </h2>
                        <button
                          onClick={() => setActiveTab("jobs")}
                          className="text-sm text-[#09D66D] hover:underline font-medium cursor-pointer"
                        >
                          View All Jobs
                        </button>
                      </div>

                      {/* DYNAMIC CANDIDATES LIST / LOADING STATE */}
                      {isLoadingCandidates ? (
                        <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
                          <Loader2 className="animate-spin text-[#09D66D]" size={24} />
                          <span>Loading AI Candidate Rankings...</span>
                        </div>
                      ) : errorMsg ? (
                        <p className="text-center py-8 text-sm text-red-500">{errorMsg}</p>
                      ) : candidates.length === 0 ? (
                        <p className="text-center py-10 text-gray-500 text-sm">
                          No AI candidate matches found for your active job postings.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {candidates.map((candidate) => (
                            <div
                              key={candidate.id || candidate.email || candidate.name}
                              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#09D66D]/40 hover:bg-[#e6fbf2]/40 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#09D66D]/10 overflow-hidden flex-shrink-0">
                                  {candidate.image ? (
                                    <img
                                      className="w-full h-full object-cover"
                                      src={candidate.image}
                                      alt={candidate.name}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-[#09D66D]">
                                      {candidate.name?.[0] || "C"}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-900">
                                      {candidate.name}
                                    </h3>
                                    {candidate.status === "shortlisted" && (
                                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                                        Shortlisted
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {candidate.role}{" "}
                                    {candidate.experience ? `• ${candidate.experience}` : ""}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                                {/* MATCH BADGE */}
                                <div className="flex items-center gap-2">
                                  <div className="w-9 h-9 rounded-full border-2 border-[#09D66D] flex items-center justify-center text-sm text-[#09D66D] font-semibold">
                                    {candidate.match || candidate.matchScore || 0}%
                                  </div>
                                  <span className="text-sm text-gray-500 hidden md:inline">
                                    Match
                                  </span>
                                </div>

                                {/* ACTIONS */}
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedCandidate(candidate)}
                                    className="bg-gradient-to-r from-[#09D66D] to-[#4AB7B2] text-white text-sm font-semibold px-5 py-2 rounded-full cursor-pointer hover:opacity-95 transition-opacity"
                                  >
                                    Review Profile
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        candidate.id,
                                        candidate.status
                                      )
                                    }
                                    title={
                                      candidate.status === "shortlisted"
                                        ? "Remove from Shortlist"
                                        : "Shortlist Candidate"
                                    }
                                    className={`p-2 rounded-full border transition-colors cursor-pointer ${
                                      candidate.status === "shortlisted"
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                                        : "border-gray-300 text-gray-400 hover:text-emerald-600 hover:border-emerald-500"
                                    }`}
                                  >
                                    <Star
                                      size={18}
                                      fill={
                                        candidate.status === "shortlisted"
                                          ? "currentColor"
                                          : "none"
                                      }
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* OTHER TABS */}
                {activeTab === "profile" && (
                  <ClientProfile
                    profileData={profileData}
                    companyData={companyData}
                    clientType={clientType}
                    onEditProfile={() => setActiveTab("personal")}
                  />
                )}

                {activeTab === "personal" && (
                  <PersonalDetailsView
                    clientType={clientType}
                    setClientType={setClientType}
                    profileData={profileData}
                    setProfileData={setProfileData}
                  />
                )}
                {activeTab === "company" && (
                  <CompanyDetailsView
                    companyData={companyData}
                    setCompanyData={setCompanyData}
                  />
                )}
                {activeTab === "jobs" && <JobManagementView />}
                {activeTab === "analytics" && <AnalyticsView />}
                {activeTab === "security" && <SecurityView />}
              </>
            )}
          </div>

          {/* ================= UNIFIED SINGLE FOOTER ================= */}
          <footer className="mt-12 pt-6 border-t border-[#09D66D]/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <img src="/logo1.png" alt="Conduyt Logo" className="h-28 w-auto object-contain" />
              <span>&copy; 2026 Conduyt. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6 font-medium">
              <Link to="/privacy" className="hover:text-[#09D66D] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-[#09D66D] transition-colors">
                Terms of Service
              </Link>
              <Link to="/help" className="hover:text-[#09D66D] transition-colors">
                Support
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

// CANDIDATE PROFILE REVIEW VIEW
function CandidateProfileView({ candidate, onBack }) {
  return (
    <div className="bg-white rounded-xl border border-[#09D66D]/30 p-6 shadow-sm">
      <button
        onClick={onBack}
        className="text-sm font-semibold text-gray-600 hover:text-[#09D66D] mb-6 flex items-center gap-2 cursor-pointer"
      >
        ← Back to Overview
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <img
            src={
              candidate.image ||
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256"
            }
            alt={candidate.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#09D66D]"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
            <p className="text-gray-500">{candidate.role}</p>
            <p className="text-xs text-[#09D66D] font-semibold mt-1">
              AI Match Score: {candidate.match || candidate.matchScore || 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Key Skills</h3>
          <div className="flex flex-wrap gap-2">
            {(candidate.skills && candidate.skills.length > 0
              ? candidate.skills
              : ["Not specified"]
            ).map((skill) => (
              <span
                key={skill}
                className="bg-[#e6fbf2] text-[#09D66D] text-xs font-semibold px-3 py-1 rounded-full border border-[#09D66D]/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-800 mb-2">Experience</h3>
          <p className="text-sm text-gray-600">
            {candidate.experience || "Experience details pending update."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;