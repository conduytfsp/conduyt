import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAxiosInstance } from "../config/axiosConfig";

// Helper function to read non-HttpOnly cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
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
      // Note: Make sure your proxy or base URL maps this to the Spring Boot /api/auth/login
      await axiosInstance.post("/api/auth/login", { email, password });

      // 2. Read cookies set by the backend
      const availableProfiles = getCookie("available_profiles") || "";
      const activeMode = getCookie("active_mode") || "";

      const hasClient = availableProfiles.includes("CLIENT");
      const hasFreelancer = availableProfiles.includes("FREELANCER");

      // 3. Smart Routing
      if (activeMode === "admin") {
        navigate("/admin/dashboard");
      } else if (hasClient && hasFreelancer) {
        // User has both, ask them which dashboard they want to view right now
        setShowRoleOptions(true);
      } else if (hasFreelancer) {
        // Only has Freelancer profile
        navigate("/freelancer/dashboard");
      } else if (hasClient) {
        // Only has Client profile
        navigate("/client/dashboard");
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

  // ================= ROLE SELECTION (For Dual-Profile Users) =================
  const handleRoleSelect = (role) => {
    if (role === "client") {
      navigate("/client/dashboard");
    } else {
      navigate("/freelancer/dashboard");
    }
  };

  return (
      <div className="relative min-h-screen overflow-hidden">
        {/* BLURRED BACKGROUND IMAGE */}
        <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 blur-[2px]"
            style={{ backgroundImage: "url('/login.png')" }}
        ></div>

        {/* SLIGHT OVERLAY */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* MAIN CONTENT */}
        <div className="relative min-h-screen flex flex-col items-center justify-start pt-1 pb-4 px-4">
          <main className="w-full max-w-md mx-auto">
            {/* BRAND / HEADER */}
            <div className="text-center mb-2">
              <Link to="/" className="flex justify-center items-center">
                <img
                    src="/logo1.png"
                    alt="Conduyt"
                    className="h-34 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.95)]"
                />
              </Link>
              <p className="text-lg font-bold text-white -mt-3 drop-shadow-[1px_1px_0_#000]">
                Welcome back to the intelligent marketplace...
              </p>
            </div>

            {/* LOGIN CARD */}
            <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-gray-200 rounded-2xl p-7 pt-5 w-full">

              {/* ERROR FEEDBACK */}
              {errorMessage && (
                  <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600 text-center">
                    {errorMessage}
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                {!showRoleOptions ? (
                    <>
                      {/* EMAIL FIELD */}
                      <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">✉</span>
                          </div>
                          <input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-[#00628e] focus:ring-2 focus:ring-[#00628e]/20 transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* PASSWORD FIELD */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label
                              htmlFor="password"
                              className="block text-sm font-medium text-gray-700"
                          >
                            Password
                          </label>
                          <a
                              href="#"
                              className="text-sm font-medium text-[#00628e] hover:text-[#004c6e] transition-colors"
                          >
                            Forgot Password?
                          </a>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">🔒</span>
                          </div>
                          <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-[#00628e] focus:ring-2 focus:ring-[#00628e]/20 transition-all duration-200"
                          />
                          <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                          >
                            {showPassword ? "👁️" : "🙈"}
                          </button>
                        </div>
                      </div>

                      {/* REMEMBER ME */}
                      <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            className="h-4 w-4 accent-[#00628e] rounded cursor-pointer"
                        />
                        <label
                            htmlFor="remember-me"
                            className="ml-2 text-sm text-gray-700 cursor-pointer"
                        >
                          Remember Me
                        </label>
                      </div>

                      {/* ACTION BUTTON */}
                      <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex justify-center py-2.5 px-4 mt-2 rounded-lg text-white bg-gradient-to-r from-[#1798D7] to-[#4AB7B2] hover:from-[#0F7BB5] hover:to-[#32938F] font-semibold transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Verifying..." : "Sign In"}
                      </button>
                    </>
                ) : (
                    /* ROLE SELECTION (Only visible if they have both profiles) */
                    <div className="space-y-3">
                      <p className="text-center text-sm font-medium text-gray-700">
                        Welcome back! How would you like to continue?
                      </p>
                      <button
                          type="button"
                          onClick={() => handleRoleSelect("client")}
                          className="cursor-pointer w-full py-2.5 px-4 rounded-lg text-white bg-[#00628e] hover:bg-[#004c6e] font-semibold transition-all duration-200"
                      >
                        Sign in as Client
                      </button>
                      <button
                          type="button"
                          onClick={() => handleRoleSelect("freelancer")}
                          className="cursor-pointer w-full py-2.5 px-4 rounded-lg text-[#00628e] bg-white border border-[#00628e] hover:bg-gray-50 font-semibold transition-all duration-200"
                      >
                        Sign in as Freelancer
                      </button>
                    </div>
                )}
              </form>

              {/* SIGN UP */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                    to="/register"
                    className="font-semibold text-[#00628e] hover:text-[#004c6e] transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </main>

          {/* FOOTER */}
          <footer className="w-full flex justify-center mt-3 pb-1">
            <p className="text-xs text-white-600 font-medium opacity-80">
              © 2026 Conduyt AI. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
  );
}

export default Login;