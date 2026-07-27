import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useAxiosInstance } from "../config/axiosConfig";

function Login() {
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();

  // Form inputs & UI state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Workflow controls
  const [showRoleOptions, setShowRoleOptions] = useState(false);
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = async () => {
    setErrorMessage("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google Login Successful:", user.email);
      // Show role selection after successful Google login
      setShowRoleOptions(true);
    } catch (error) {
      console.error("Google Login Error:", error);
      setErrorMessage("Google login failed. Please try again.");
    }
  };

  // ================= NORMAL LOGIN / OTP VERIFY =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (!requiresOtp) {
        // STEP 1: LOGIN REQUEST
        // -------------------------------------------------------------
        // TEMPORARY MOCK DELAY (Simulates network delay while backend is offline)
        await new Promise((resolve) => setTimeout(resolve, 600));

        /* 
        // REAL AXIOS CALL (Uncomment when backend API is live):
        const response = await axiosInstance.post("/auth/login", { email, password });
        
        // If backend flags that 2FA is enabled for this account
        if (response.data?.requiresOtp) {
          setRequiresOtp(true);
          setIsSubmitting(false);
          return;
        }
        */
        // -------------------------------------------------------------

        // Proceed to role selection if 2FA is not triggered
        setShowRoleOptions(true);
      } else {
        // STEP 2: 2FA OTP VERIFICATION
        // -------------------------------------------------------------
        await new Promise((resolve) => setTimeout(resolve, 600));

        /* 
        // REAL AXIOS CALL (Uncomment when backend API is live):
        await axiosInstance.post("/auth/verify-otp", { email, otp });
        */
        // -------------------------------------------------------------

        setShowRoleOptions(true);
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
              {!requiresOtp ? (
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
                </>
              ) : (
                /* 2FA OTP STEP */
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-2 text-center"
                  >
                    Enter 6-digit 2FA Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="block w-full py-2.5 px-3 border border-gray-200 rounded-lg bg-white text-gray-900 text-center tracking-widest text-lg font-mono focus:outline-none focus:border-[#00628e] focus:ring-2 focus:ring-[#00628e]/20"
                  />
                  <p className="mt-2 text-xs text-center text-gray-500">
                    Check your authenticator app or email for the verification code.
                  </p>
                </div>
              )}

              {/* ACTION BUTTONS */}
              {!showRoleOptions ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2.5 px-4 rounded-lg text-white bg-gradient-to-r from-[#1798D7] to-[#4AB7B2] hover:from-[#0F7BB5] hover:to-[#32938F] font-semibold transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Verifying..."
                    : requiresOtp
                    ? "Verify Code"
                    : "Sign In"}
                </button>
              ) : (
                /* ROLE SELECTION */
                <div className="space-y-3">
                  <p className="text-center text-sm font-medium text-gray-700">
                    Sign in as
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

              {/* DIVIDER */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 text-xs font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* GOOGLE LOGIN */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 rounded-lg bg-white text-gray-800 hover:bg-gray-900 hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  <span className="font-bold text-lg">G</span>
                  Continue with Google
                </button>
              </div>
            </form>

            {/* SIGN UP */}
            <p className="mt-5 text-center text-sm text-gray-600">
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