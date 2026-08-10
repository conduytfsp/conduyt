import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, UserRound, BriefcaseBusiness } from "lucide-react";
import { useAxiosInstance } from "../config/axiosConfig";

// Helper function to read non-HttpOnly cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Helper function to set the mode cookie globally
const setCookie = (name, value, days = 7) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
};

function Login() {
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();

  // Form inputs & UI state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Workflow controls
  const [showRoleOptions, setShowRoleOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ================= NORMAL LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // 1. Send Login Request
      await axiosInstance.post("/api/auth/login", { email, password });

      // 2. Read cookies set by the backend
      const availableProfiles = getCookie("available_profiles") || "";
      const activeMode = getCookie("active_mode") || "";

      const hasClient = availableProfiles.includes("CLIENT");
      const hasFreelancer = availableProfiles.includes("FREELANCER");

      // 3. Smart Routing
      if (activeMode === "admin" || availableProfiles.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else if (hasClient && hasFreelancer) {
        // User has both, ask them which dashboard they want to view right now
        setShowRoleOptions(true);
      } else if (hasFreelancer) {
        // Force cookie to freelancer, then navigate
        setCookie("active_mode", "freelancer");
        window.dispatchEvent(new Event("modeChanged"));
        navigate("/dashboard");
      } else if (hasClient) {
        // Force cookie to client, then navigate
        setCookie("active_mode", "client");
        window.dispatchEvent(new Event("modeChanged"));
        navigate("/dashboard");
      } else {
        // Has no profiles setup yet
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(
          error.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= ROLE SELECTION =================
  const handleRoleSelect = (role) => {
    setCookie("active_mode", role);
    window.dispatchEvent(new Event("modeChanged"));
    navigate("/dashboard");
  };

  return (
      <div className="relative min-h-screen bg-slate-50 overflow-hidden flex flex-col justify-center font-sans">

        {/* ================= PREMIUM MODERN BACKGROUND ================= */}
        {/* Ambient glowing blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#1798D7] opacity-20 blur-[120px] pointer-events-none mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#09D66D] opacity-20 blur-[120px] pointer-events-none mix-blend-multiply"></div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6">

          {/* BRAND / HEADER */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
              <img
                  src="/logo1.png"
                  alt="Conduyt"
                  className="h-10 w-auto object-contain mx-auto drop-shadow-sm"
              />
            </Link>
            <h2 className="mt-6 text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Sign in to the intelligent freelance marketplace
            </p>
          </div>

          {/* LOGIN CARD */}
          <div className="bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 rounded-3xl p-8 w-full transition-all">

            {/* ERROR FEEDBACK */}
            {errorMessage && (
                <div className="mb-6 p-3 bg-rose-50 border border-rose-100 rounded-xl text-sm font-semibold text-rose-600 text-center flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              {!showRoleOptions ? (
                  <>
                    {/* EMAIL FIELD */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Email address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1798D7] transition-colors">
                          <Mail size={18} />
                        </div>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white/50 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#1798D7] focus:ring-4 focus:ring-[#1798D7]/10 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* PASSWORD FIELD */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                          Password
                        </label>
                        <a href="#" className="text-xs font-bold text-[#1798D7] hover:text-[#00628e] transition-colors">
                          Forgot Password?
                        </a>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1798D7] transition-colors">
                          <Lock size={18} />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl bg-white/50 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#1798D7] focus:ring-4 focus:ring-[#1798D7]/10 transition-all duration-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* REMEMBER ME */}
                    <div className="flex items-center pt-1">
                      <input
                          id="remember-me"
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-[#1798D7] focus:ring-[#1798D7] cursor-pointer"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-600 cursor-pointer">
                        Remember me
                      </label>
                    </div>

                    {/* ACTION BUTTON */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-4 rounded-xl text-white bg-slate-900 hover:bg-slate-800 font-semibold text-sm transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Verifying Credentials..." : "Sign In"}
                      {!isSubmitting && <ArrowRight size={16} />}
                    </button>
                  </>
              ) : (
                  /* ================= ROLE SELECTION UI ================= */
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <UserRound size={24} className="text-[#09D66D]" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Choose your workspace</h3>
                      <p className="text-sm text-slate-500 mt-1">Select how you want to use Conduyt today.</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleRoleSelect("client")}
                        className="group w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 bg-white hover:border-[#1798D7] hover:bg-blue-50/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#1798D7] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BriefcaseBusiness size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900">Client Dashboard</p>
                          <p className="text-xs font-medium text-slate-500">Hire talent and manage jobs</p>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-slate-300 group-hover:text-[#1798D7] group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleRoleSelect("freelancer")}
                        className="group w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 bg-white hover:border-[#09D66D] hover:bg-emerald-50/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#09D66D] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <UserRound size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900">Freelancer Dashboard</p>
                          <p className="text-xs font-medium text-slate-500">Find work and view analytics</p>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-slate-300 group-hover:text-[#09D66D] group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
              )}
            </form>

            {/* SIGN UP LINK */}
            {!showRoleOptions && (
                <p className="mt-8 text-center text-sm font-medium text-slate-600">
                  Don't have an account?{" "}
                  <Link to="/register" className="font-bold text-[#1798D7] hover:text-[#00628e] hover:underline transition-all">
                    Sign up today
                  </Link>
                </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-6 left-0 right-0 text-center z-10">
          <p className="text-xs font-semibold text-slate-400">
            © 2026 Conduyt AI. All rights reserved.
          </p>
        </div>
      </div>
  );
}

export default Login;