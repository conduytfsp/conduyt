
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleOptions, setShowRoleOptions] = useState(false);

  const navigate = useNavigate();

  // ================= GOOGLE LOGIN =================

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      console.log("Google Login Successful!");
      console.log("Name:", user.displayName);
      console.log("Email:", user.email);

      // Show role selection after successful Google login
      setShowRoleOptions(true);
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google login failed. Please try again.");
    }
  };

  // ================= NORMAL LOGIN =================

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show role selection
    setShowRoleOptions(true);
  };

  // ================= ROLE SELECTION =================

  const handleRoleSelect = (role) => {
    if (role === "client") {
      navigate("/client-dashboard");
    } else {
      navigate("/freelancer-dashboard");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ==================================================
          BLURRED BACKGROUND IMAGE
      ================================================== */}

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 blur-[2px]"
        style={{
          backgroundImage: "url('/login.png')",
        }}
      ></div>

      {/* ==================================================
          SLIGHT HAZY / WHITE OVERLAY
      ================================================== */}

      <div className="absolute inset-0 bg-white/10"></div>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="relative min-h-screen flex flex-col items-center justify-start pt-1 pb-4 px-4">

        {/* ================= MAIN CONTENT ================= */}

        <main className="w-full max-w-md mx-auto">

          {/* ==================================================
              BRAND / HEADER
          ================================================== */}

          {/* Reduced gap between heading and form */}
    
{/* ================= BRAND / HEADER ================= */}

<div className="text-center mb-2">

  {/* ================= LOGO ================= */}

  <Link
    to="/"
    className="flex justify-center items-center"
  >
    <img
      src="/logo1.png"
      alt="Conduyt"
      className="h-34 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.95)]"
    />
  </Link>

  {/* ================= WELCOME TEXT ================= */}
{/* 
 <p className="text-lg font-bold text-white -mt-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
  Welcome back to the intelligent marketplace...
</p> */}
<p className="text-lg font-bold text-white -mt-3 drop-shadow-[1px_1px_0_#000]">
  Welcome back to the intelligent marketplace...
</p>

</div>


          {/* ==================================================
              LOGIN CARD
          ================================================== */}

          {/* Reduced top padding of form card */}
          <div className="bg-white/95 backdrop-blur-xl shadow-xl border border-gray-200 rounded-2xl p-7 pt-5 w-full">

            {/* ================= LOGIN FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* ================= EMAIL FIELD ================= */}

              <div>

                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>

                <div className="relative">

                  {/* Email Icon */}

                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">
                      ✉
                    </span>
                  </div>

                  {/* Email Input */}

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-[#00628e] focus:ring-2 focus:ring-[#00628e]/20 transition-all duration-200"
                  />

                </div>

              </div>

              {/* ================= PASSWORD FIELD ================= */}

              <div>

                {/* Password Label + Forgot Password */}

                <div className="flex items-center justify-between mb-2">

                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>

                  {/* Forgot Password */}

                  <a
                    href="#"
                    className="text-sm font-medium text-[#00628e] hover:text-[#004c6e] transition-colors"
                  >
                    Forgot Password?
                  </a>

                </div>

                {/* Password Input Container */}

                <div className="relative">

                  {/* Lock Icon */}

                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">
                      🔒
                    </span>
                  </div>

                  {/* Password Input */}

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    minLength={5}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-[#00628e] focus:ring-2 focus:ring-[#00628e]/20 transition-all duration-200"
                  />

                  {/* Show / Hide Password */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>

                </div>

              </div>

              {/* ================= REMEMBER ME ================= */}

              <div className="flex items-center">

                <input
                  id="remember-me"
                  name="remember-me"
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

              {/* ==================================================
                  SIGN IN / ROLE SELECTION
              ================================================== */}

              {!showRoleOptions ? (

                /* ================= SIGN IN BUTTON ================= */

                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 rounded-lg text-white bg-gradient-to-r from-[#1798D7] to-[#4AB7B2] hover:from-[#0F7BB5] hover:to-[#32938F] font-semibold transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm cursor-pointer"
                >
                  Sign In
                </button>

              ) : (

                /* ================= ROLE SELECTION ================= */

                <div className="space-y-3">

                  <p className="text-center text-sm font-medium text-gray-700">
                    Sign in as
                  </p>

                  {/* Client Button */}

                  <button
                    type="button"
                    onClick={() =>
                      handleRoleSelect("client")
                    }
                    className="cursor-pointer w-full py-2.5 px-4 rounded-lg text-white bg-[#00628e] hover:bg-[#004c6e] font-semibold transition-all duration-200"
                  >
                    Sign in as Client
                  </button>

                  {/* Freelancer Button */}

                  <button
                    type="button"
                    onClick={() =>
                      handleRoleSelect("freelancer")
                    }
                    className="cursor-pointer w-full py-2.5 px-4 rounded-lg text-[#00628e] bg-white border border-[#00628e] hover:bg-gray-50 font-semibold transition-all duration-200"
                  >
                    Sign in as Freelancer
                  </button>

                </div>

              )}

              {/* ================= DIVIDER ================= */}

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

              {/* ================= GOOGLE LOGIN ================= */}

              <div>

                
                <button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 rounded-lg bg-white text-gray-800 hover:bg-gray-900 hover:text-white font-semibold transition-colors cursor-pointer"
>
  {/* Google G */}
  <span className="font-bold text-lg">
    G
  </span>

  Continue with Google
</button>

              </div>

            </form>

            {/* ================= SIGN UP ================= */}

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

        {/* ==================================================
            FOOTER
        ================================================== */}

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

