import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Import the custom hook from your config directory
import { useAxiosInstance } from "../config/axiosConfig";

function Register() {
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();

  const [step, setStep] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState(""); // "freelancer" or "client"
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Skill Tags state for Freelancer
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  // Preview URL for Profile Picture
  const [profilePreview, setProfilePreview] = useState(null);

  // ================= FORM DATA =================
  const [formData, setFormData] = useState({
    // Personal Details
    profilePicture: null,
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Freelancer Specific Details
    title: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    resumeFile: null,

    // Client Specific Details
    clientType: "INDIVIDUAL", // "INDIVIDUAL" or "COMPANY"
    companyName: "",
    companyRole: "",
    companyWebsite: "",
    companyAddress: "",
    contactNumber: "",
    gstin: "",
  });

  // ================= HANDLE INPUT CHANGES =================
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const selectedFile = files[0];
      setFormData((prev) => ({ ...prev, [name]: selectedFile }));

      // Generate preview if it's the profile picture
      if (name === "profilePicture" && selectedFile) {
        setProfilePreview(URL.createObjectURL(selectedFile));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ================= SKILL TAG HANDLERS =================
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // ================= NAVIGATION HANDLERS =================
  const handleStep1Continue = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setStep(2);
  };

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    setStep(3);
  };

  // ================= SUBMIT FORM WITH AXIOS =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build FormData for file upload & backend processing
      const data = new FormData();
      
      // Personal Details
      if (formData.profilePicture) {
        data.append("profilePicture", formData.profilePicture);
      }
      data.append("firstName", formData.firstName);
      data.append("middleName", formData.middleName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("persona", selectedPersona);

      // Role Specific Details
      if (selectedPersona === "freelancer") {
        data.append("title", formData.title);
        data.append("bio", formData.bio);
        data.append("githubUrl", formData.githubUrl);
        data.append("linkedinUrl", formData.linkedinUrl);
        data.append("portfolioUrl", formData.portfolioUrl);
        if (formData.resumeFile) {
          data.append("resumeFile", formData.resumeFile);
        }
        data.append("skills", JSON.stringify(skills));
      } else if (selectedPersona === "client") {
        data.append("clientType", formData.clientType);
        if (formData.clientType === "COMPANY") {
          data.append("companyName", formData.companyName);
          data.append("companyRole", formData.companyRole);
          data.append("companyWebsite", formData.companyWebsite);
          data.append("companyAddress", formData.companyAddress);
          data.append("contactNumber", formData.contactNumber);
          data.append("gstin", formData.gstin);
        }
      }

      // API Call using configured axiosInstance
      const response = await axiosInstance.post("/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(
        `Registration complete as ${
          selectedPersona === "freelancer" ? "Freelancer" : "Client"
        }!`
      );
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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
              className="inline-flex h-14 cursor-pointer items-center justify-center overflow-hidden md:h-16"
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
              <div className="flex items-center space-x-2 md:space-x-3">
                {/* Step 1 Dot */}
                <div className="h-2.5 w-2.5 rounded-full bg-[#00628e]" />

                {/* Progress Bar 1 */}
                <div className="h-1 w-8 overflow-hidden rounded-full bg-[#dce2f7] md:w-10">
                  <div
                    className="h-full bg-[#00628e] transition-all duration-500 ease-out"
                    style={{ width: step >= 2 ? "100%" : "0%" }}
                  />
                </div>

                {/* Step 2 Dot */}
                <div
                  className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                    step >= 2 ? "bg-[#00628e]" : "bg-[#dce2f7]"
                  }`}
                />

                {/* Progress Bar 2 */}
                <div className="h-1 w-8 overflow-hidden rounded-full bg-[#dce2f7] md:w-10">
                  <div
                    className="h-full bg-[#00628e] transition-all duration-500 ease-out"
                    style={{ width: step === 3 ? "100%" : "0%" }}
                  />
                </div>

                {/* Step 3 Dot */}
                <div
                  className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                    step === 3 ? "bg-[#00628e]" : "bg-[#dce2f7]"
                  }`}
                />
              </div>
            </div>

            {/* ==================================================
                STEP 1: PERSONAL DETAILS
            ================================================== */}
            {step === 1 && (
              <div className="mx-auto w-full max-w-md">
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-bold text-[#141b2b] md:text-2xl">
                    Create Your Account
                  </h2>
                  <p className="mt-0.5 text-xs text-[#3f4850] md:text-sm">
                    Enter your contact & account details to get started.
                  </p>
                </div>

                <div className="space-y-3">

                  {/* PROFILE PICTURE UPLOAD */}
                  <div className="flex flex-col items-center justify-center">
                    <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                      Profile Picture
                    </label>
                    <div className="relative group flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-white transition-all hover:border-[#00628e]">
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                          <span className="text-xl">📷</span>
                          <span className="text-[10px] text-gray-500">Upload</span>
                        </div>
                      )}
                      <input
                        type="file"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleChange}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </div>
                  </div>

                  {/* Name Grid */}
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <div>
                      <label htmlFor="firstName" className="mb-1 block text-xs font-semibold text-[#141b2b]">
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs transition-all focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="middleName" className="mb-1 block text-xs font-semibold text-[#141b2b]">
                        Middle Name
                      </label>
                      <input
                        id="middleName"
                        name="middleName"
                        type="text"
                        placeholder="M."
                        value={formData.middleName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs transition-all focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="mb-1 block text-xs font-semibold text-[#141b2b]">
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs transition-all focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="mb-1 block text-xs font-semibold text-[#141b2b] md:text-sm">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs transition-all focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20 md:text-sm"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="mb-1 block text-xs font-semibold text-[#141b2b] md:text-sm">
                      Password *
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs transition-all focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20 md:text-sm"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="mb-1 block text-xs font-semibold text-[#141b2b] md:text-sm">
                      Re-enter Password *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs transition-all focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20 md:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleStep1Continue}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1798D7] to-[#4AB7B2] py-2.5 text-xs font-bold text-white shadow-md shadow-[#1798D7]/20 transition-all duration-300 hover:from-[#004f73] hover:to-[#1798D7] hover:shadow-lg active:scale-[0.99] md:text-sm"
                  >
                    Continue
                    <span className="text-base">→</span>
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <p className="text-xs text-[#3f4850] md:text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="cursor-pointer font-semibold text-[#00628e] hover:underline">
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* ==================================================
                STEP 2: MODE SELECTION
            ================================================== */}
            {step === 2 && (
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mb-3 flex cursor-pointer items-center gap-1 text-xs font-medium text-[#3f4850] transition-colors hover:text-[#00628e]"
                >
                  ← Back
                </button>

                <div className="mb-4 text-center">
                  <h2 className="mb-1 text-xl font-bold md:text-2xl">Choose Your Path</h2>
                  <p className="mx-auto max-w-sm text-xs text-[#3f4850] md:text-sm">
                    Select how you want to use Conduyt.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* FREELANCER CARD */}
                  <div
                    onClick={() => handlePersonaSelect("freelancer")}
                    className={`relative cursor-pointer rounded-xl ${
                      selectedPersona === "freelancer" ? "ring-2 ring-[#1798D7]" : ""
                    }`}
                  >
                    <div className="group flex h-full flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1798D7] hover:shadow-md">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#e9edff] text-xl text-[#1798D7]">
                        💻
                      </div>
                      <h3 className="mb-1 text-sm font-bold text-[#141b2b]">Freelancer Mode</h3>
                      <p className="mb-3 flex-grow text-xs text-[#3f4850]">
                        Find projects, leverage AI matching, and showcase your developer profile.
                      </p>
                      <div className="w-full cursor-pointer rounded-md border border-gray-200 py-1.5 text-xs font-semibold text-[#00628e] transition-colors duration-300 group-hover:border-transparent group-hover:bg-[#1798D7] group-hover:text-white">
                        Select Freelancer
                      </div>
                    </div>
                  </div>

                  {/* CLIENT CARD */}
                  <div
                    onClick={() => handlePersonaSelect("client")}
                    className={`relative cursor-pointer rounded-xl ${
                      selectedPersona === "client" ? "ring-2 ring-[#09D66D]" : ""
                    }`}
                  >
                    <div className="group flex h-full flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[#09D66D] hover:shadow-md">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#e9edff] text-xl text-[#09D66D]">
                        🏢
                      </div>
                      <h3 className="mb-1 text-sm font-bold text-[#141b2b]">Client Mode</h3>
                      <p className="mb-3 flex-grow text-xs text-[#3f4850]">
                        Hire top-tier talent quickly as an individual or scale up with your company.
                      </p>
                      <div className="w-full cursor-pointer rounded-md border border-gray-200 py-1.5 text-xs font-semibold text-[#00628e] transition-colors duration-300 group-hover:border-transparent group-hover:bg-[#09D66D] group-hover:text-white">
                        Select Client
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                STEP 3: PROFILE / ROLE DETAILS
            ================================================== */}
            {step === 3 && (
              <div className="mx-auto w-full max-w-md">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mb-3 flex cursor-pointer items-center gap-1 text-xs font-medium text-[#3f4850] transition-colors hover:text-[#00628e]"
                >
                  ← Back to Mode Selection
                </button>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* FREELANCER SPECIFIC FIELDS */}
                  {selectedPersona === "freelancer" && (
                    <>
                      <div className="mb-2 text-center">
                        <h2 className="text-xl font-bold text-[#141b2b]">Freelancer Profile Details</h2>
                        <p className="text-xs text-[#3f4850]">Highlight your expertise for top clients.</p>
                      </div>

                      {/* Professional Title */}
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                          Professional Title *
                        </label>
                        <input
                          name="title"
                          type="text"
                          required
                          placeholder='e.g. "Full-Stack Java & React Developer"'
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs transition-all focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                          Bio / Introduction *
                        </label>
                        <textarea
                          name="bio"
                          required
                          rows="3"
                          placeholder="Tell clients about your background, strengths, and experience..."
                          value={formData.bio}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs transition-all focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                        />
                      </div>

                      {/* Links */}
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                            GitHub Link *
                          </label>
                          <input
                            name="githubUrl"
                            type="url"
                            required
                            placeholder="https://github.com/username"
                            value={formData.githubUrl}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs transition-all focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                            LinkedIn Link *
                          </label>
                          <input
                            name="linkedinUrl"
                            type="url"
                            required
                            placeholder="https://linkedin.com/in/username"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs transition-all focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                          Portfolio Website (Optional)
                        </label>
                        <input
                          name="portfolioUrl"
                          type="url"
                          placeholder="https://yourportfolio.com"
                          value={formData.portfolioUrl}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs transition-all focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                        />
                      </div>

                      {/* Resume PDF */}
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                          CV or Resume (PDF Format) *
                        </label>
                        <input
                          name="resumeFile"
                          type="file"
                          accept=".pdf"
                          required
                          onChange={handleChange}
                          className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs file:cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-[#1798D7]/10 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-[#1798D7] hover:file:bg-[#1798D7]/20"
                        />
                      </div>

                      {/* Skill Tags */}
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                          Skill Tags
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder='Add a skill (e.g. "React", "Java", "NextJs")'
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs focus:border-[#00628e] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddSkill}
                            className="cursor-pointer rounded-lg bg-[#00628e] px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#004f73]"
                          >
                            Add
                          </button>
                        </div>
                        
                        {/* Display Added Skill Tags */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {skills.length === 0 ? (
                            <p className="text-[11px] italic text-[#6c757d]">
                              No skills added yet. Type a skill above and click Add.
                            </p>
                          ) : (
                            skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded-full bg-[#1798D7]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#00628e]"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(skill)}
                                  className="ml-0.5 cursor-pointer text-xs text-gray-500 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* CLIENT SPECIFIC FIELDS */}
                  {selectedPersona === "client" && (
                    <>
                      <div className="mb-2 text-center">
                        <h2 className="text-xl font-bold text-[#141b2b]">Client Details</h2>
                        <p className="text-xs text-[#3f4850]">Select client type and provide details.</p>
                      </div>

                      {/* Client Type Selector */}
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                          Client Type *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, clientType: "INDIVIDUAL" }))
                            }
                            className={`cursor-pointer rounded-lg py-2 text-xs font-semibold transition-all ${
                              formData.clientType === "INDIVIDUAL"
                                ? "bg-[#09D66D] text-white shadow-sm"
                                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            Individual Client
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, clientType: "COMPANY" }))
                            }
                            className={`cursor-pointer rounded-lg py-2 text-xs font-semibold transition-all ${
                              formData.clientType === "COMPANY"
                                ? "bg-[#09D66D] text-white shadow-sm"
                                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            Organization
                          </button>
                        </div>
                      </div>

                      {/* Conditional Company Details */}
                      {formData.clientType === "COMPANY" && (
                        <div className="mt-3 space-y-2 rounded-xl border border-gray-200/80 bg-white/50 p-3">
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                              Company Name *
                            </label>
                            <input
                              name="companyName"
                              type="text"
                              required
                              placeholder="Acme Technologies Inc."
                              value={formData.companyName}
                              onChange={handleChange}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs transition-all focus:border-[#09D66D] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                              Your Role in Company *
                            </label>
                            <input
                              name="companyRole"
                              type="text"
                              required
                              placeholder="e.g. HR Manager, Tech Lead, Founder"
                              value={formData.companyRole}
                              onChange={handleChange}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs transition-all focus:border-[#09D66D] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                              Company Website URL *
                            </label>
                            <input
                              name="companyWebsite"
                              type="url"
                              required
                              placeholder="https://company.com"
                              value={formData.companyWebsite}
                              onChange={handleChange}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs transition-all focus:border-[#09D66D] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                              Company Address *
                            </label>
                            <input
                              name="companyAddress"
                              type="text"
                              required
                              placeholder="123 Corporate Blvd, Suite 100"
                              value={formData.companyAddress}
                              onChange={handleChange}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs transition-all focus:border-[#09D66D] focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                                Contact Number *
                              </label>
                              <input
                                name="contactNumber"
                                type="tel"
                                required
                                placeholder="+1 (555) 000-0000"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs transition-all focus:border-[#09D66D] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-[#141b2b]">
                                GSTIN *
                              </label>
                              <input
                                name="gstin"
                                type="text"
                                required
                                placeholder="22AAAAA0000A1Z5"
                                value={formData.gstin}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs transition-all focus:border-[#09D66D] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Submit Button */}
                  <div className="mt-5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1798D7] to-[#09D66D] py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      {isSubmitting ? "Registering..." : "Complete Registration"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;