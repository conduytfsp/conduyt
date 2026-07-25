import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [step, setStep] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState("");

  const navigate = useNavigate();

  // ================= FORM DATA =================
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ================= HANDLE INPUT CHANGES =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ================= CONTINUE TO STEP 2 =================
  const handleContinue = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setStep(2);
  };

  // ================= GO BACK TO STEP 1 =================
  const handleBack = () => {
    setStep(1);
  };

  // ================= SELECT FREELANCER OR CLIENT =================
  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);

    console.log("Selected Persona:", persona);
    console.log("User Data:", formData);

    setTimeout(() => {
      alert(
        `Registration complete! Entering ${
          persona === "freelancer" ? "Freelancer" : "Client"
        } mode...`
      );
    }, 300);
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-[#f9f9ff] font-sans text-[#141b2b] antialiased">
      {/* ================= BACKGROUND IMAGE ================= */}
      <div
        className="fixed inset-0 z-0 scale-105 bg-cover bg-center bg-no-repeat blur-[2px]"
        style={{
          backgroundImage: "url('/register.png')",
        }}
      />

      {/* ================= HAZY WHITE OVERLAY ================= */}
      <div className="fixed inset-0 z-0 bg-white/10" />

      {/* ================= TOP BLUE GLOW ================= */}
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] z-0 h-[40%] w-[40%] rounded-full bg-[#1798D7]/10 blur-[100px]" />

      {/* ================= BOTTOM GREEN GLOW ================= */}
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] z-0 h-[40%] w-[40%] rounded-full bg-[#09D66D]/10 blur-[100px]" />

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start px-4 pt-2 pb-8 md:pt-3">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center">
          
          {/* ================= LOGO HEADER ================= */}
          <div className="mb-2 flex flex-col items-center text-center">
            <Link
              to="/"
              className="inline-flex h-14 items-center justify-center overflow-hidden md:h-16"
            >
              <img
                src="/logo1.png"
                alt="Conduyt"
                className="h-28 w-auto max-w-none translate-y-3 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.95)] md:h-32"
              />
            </Link>

            <p className="mt-1 text-xs font-semibold tracking-wide text-[#111827] md:text-sm">
              The intelligent network for exceptional talent.
            </p>
          </div>

          {/* ================= REGISTRATION CARD ================= */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/40 bg-white/80 p-5 shadow-xl backdrop-blur-xl md:p-6">
            
            {/* ================= PROGRESS INDICATOR ================= */}
            <div className="mb-4 flex items-center justify-center">
              <div className="flex items-center space-x-3">
                {/* Step 1 Dot */}
                <div className="h-2.5 w-2.5 rounded-full bg-[#00628e]" />

                {/* Progress Bar */}
                <div className="h-1 w-10 overflow-hidden rounded-full bg-[#dce2f7]">
                  <div
                    className="h-full bg-[#00628e] transition-all duration-500 ease-out"
                    style={{
                      width: step === 2 ? "100%" : "0%",
                    }}
                  />
                </div>

                {/* Step 2 Dot */}
                <div
                  className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                    step === 2 ? "bg-[#00628e]" : "bg-[#dce2f7]"
                  }`}
                />
              </div>
            </div>

            {/* ==================================================
                STEP 1
            ================================================== */}
            {step === 1 && (
              <div className="mx-auto w-full max-w-sm">
                {/* Heading */}
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-bold text-[#141b2b] md:text-2xl">
                    Create Your Account
                  </h2>
                  <p className="mt-0.5 text-xs text-[#3f4850] md:text-sm">
                    Enter your details to get started.
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-1 block text-xs font-semibold text-[#141b2b] md:text-sm"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs transition-all duration-200 focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20 md:text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-xs font-semibold text-[#141b2b] md:text-sm"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs transition-all duration-200 focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20 md:text-sm"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1 block text-xs font-semibold text-[#141b2b] md:text-sm"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs transition-all duration-200 focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20 md:text-sm"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-1 block text-xs font-semibold text-[#141b2b] md:text-sm"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs transition-all duration-200 focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20 md:text-sm"
                    />
                  </div>
                </div>

                {/* Continue Button (Updated with cursor-pointer and dark blue hover effect) */}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1798D7] to-[#4AB7B2] py-2.5 text-xs font-bold text-white shadow-md shadow-[#1798D7]/20 transition-all duration-300 hover:from-[#004f73] hover:to-[#1798D7] hover:shadow-lg active:from-[#003852] active:to-[#0f77aa] md:text-sm"
                  >
                    Continue
                    <span className="text-base">→</span>
                  </button>
                </div>

                {/* Login Link */}
                <div className="mt-3 text-center">
                  <p className="text-xs text-[#3f4850] md:text-sm">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-[#00628e] hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* ==================================================
                STEP 2
            ================================================== */}
            {step === 2 && (
              <div className="w-full">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="mb-3 flex cursor-pointer items-center gap-1 text-xs font-medium text-[#3f4850] transition-colors hover:text-[#00628e]"
                >
                  ← Back
                </button>

                {/* Heading */}
                <div className="mb-4 text-center">
                  <h2 className="mb-1 text-xl font-bold md:text-2xl">
                    Choose Your Path
                  </h2>
                  <p className="mx-auto max-w-sm text-xs text-[#3f4850] md:text-sm">
                    Select how you want to use Conduyt.
                  </p>
                </div>

                {/* Persona Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* ================= FREELANCER CARD ================= */}
                  <div
                    onClick={() => handlePersonaSelect("freelancer")}
                    className={`relative cursor-pointer rounded-xl ${
                      selectedPersona === "freelancer"
                        ? "ring-2 ring-[#1798D7]"
                        : ""
                    }`}
                  >
                    <div className="group flex h-full flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1798D7] hover:shadow-md">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#e9edff] text-xl text-[#1798D7]">
                        💻
                      </div>
                      <h3 className="mb-1 text-sm font-bold text-[#141b2b]">
                        Freelancer Mode
                      </h3>
                      <p className="mb-3 flex-grow text-xs text-[#3f4850]">
                        Find projects, leverage AI matching, and present your skills.
                      </p>
                      <div className="mb-3 flex flex-wrap justify-center gap-1">
                        <span className="rounded-full bg-[#1798D7]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#1798D7]">
                          AI Matching
                        </span>
                        <span className="rounded-full bg-[#1798D7]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#1798D7]">
                          Smart Profile
                        </span>
                      </div>
                      <div className="w-full rounded-md border border-gray-200 py-1.5 text-xs font-semibold text-[#00628e] transition-colors duration-300 group-hover:border-transparent group-hover:bg-[#1798D7] group-hover:text-white">
                        Select Freelancer
                      </div>
                    </div>
                  </div>

                  {/* ================= CLIENT CARD ================= */}
                  <div
                    onClick={() => handlePersonaSelect("client")}
                    className={`relative cursor-pointer rounded-xl ${
                      selectedPersona === "client"
                        ? "ring-2 ring-[#09D66D]"
                        : ""
                    }`}
                  >
                    <div className="group flex h-full flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[#09D66D] hover:shadow-md">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#e9edff] text-xl text-[#09D66D]">
                        🏢
                      </div>
                      <h3 className="mb-1 text-sm font-bold text-[#141b2b]">
                        Client Mode
                      </h3>
                      <p className="mb-3 flex-grow text-xs text-[#3f4850]">
                        Hire top-tier talent quickly, manage teams, and scale.
                      </p>
                      <div className="mb-3 flex flex-wrap justify-center gap-1">
                        <span className="rounded-full bg-[#09D66D]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#09D66D]">
                          Team Mgmt
                        </span>
                        <span className="rounded-full bg-[#09D66D]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#09D66D]">
                          Fast Hiring
                        </span>
                      </div>
                      <div className="w-full rounded-md border border-gray-200 py-1.5 text-xs font-semibold text-[#00628e] transition-colors duration-300 group-hover:border-transparent group-hover:bg-[#09D66D] group-hover:text-white">
                        Select Client
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;