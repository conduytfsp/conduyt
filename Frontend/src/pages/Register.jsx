import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAxiosInstance } from "../config/axiosConfig";

function Register() {
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();

  const [step, setStep] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================= SKILL TAGS STATE =================
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch available skills on component mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        console.log("Attempting to fetch skills...");
        const response = await axiosInstance.get("/api/skills");
        console.log("Skills fetch response:", response.data);

        // Handle variations in your ApiResponse wrapper (data vs payload)
        const fetchedData = response.data.data || response.data.payload || response.data;

        if (Array.isArray(fetchedData)) {
          setAvailableSkills(fetchedData);
        } else {
          console.error("Expected an array of skills, but got:", fetchedData);
        }
      } catch (error) {
        console.error("Failed to fetch skills. Check Spring Security Config!", error);
      }
    };
    fetchSkills();
  }, [axiosInstance]);

  // Preview URLs
  const [profilePreview, setProfilePreview] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);

  // OTP
  const [otp, setOtp] = useState("");

  // ================= FORM DATA =================
  const [formData, setFormData] = useState({
    profileImage: null,
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",

    title: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    cvFile: null,

    clientType: "INDIVIDUAL",
    companyName: "",
    companyRole: "",
    companyWebsite: "",
    companyAddress: "",
    contactNumber: "",
    gstin: "",
    companyLogo: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const selectedFile = files[0];
      setFormData((prev) => ({ ...prev, [name]: selectedFile }));

      if (name === "profileImage" && selectedFile) {
        setProfilePreview(URL.createObjectURL(selectedFile));
      }
      if (name === "companyLogo" && selectedFile) {
        setCompanyLogoPreview(URL.createObjectURL(selectedFile));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ================= SKILL HANDLERS =================
  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
      setShowSuggestions(false);
    }
  };

  const handleSelectSkill = (skillLabel) => {
    if (!skills.includes(skillLabel)) {
      setSkills([...skills, skillLabel]);
    }
    setSkillInput("");
    setShowSuggestions(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // ================= NAVIGATION =================
  const handleStep1Continue = () => {
    if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.profileImage
    ) {
      alert("Please fill in all required fields and upload a profile picture.");
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

  // ================= SUBMISSION =================
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        targetRole: selectedPersona === "freelancer" ? "FREELANCER" : "CLIENT",
      };

      if (selectedPersona === "freelancer") {
        requestData.title = formData.title;
        requestData.bio = formData.bio;
        requestData.githubUrl = formData.githubUrl;
        requestData.linkedinUrl = formData.linkedinUrl;
        requestData.portfolioUrl = formData.portfolioUrl;
        requestData.skills = skills;
      } else {
        requestData.clientType = formData.clientType;
        requestData.contactNumber = formData.contactNumber;
        if (formData.clientType === "COMPANY") {
          requestData.companyName = formData.companyName;
          requestData.companyRole = formData.companyRole;
          requestData.companyWebsite = formData.companyWebsite;
          requestData.companyAddress = formData.companyAddress;
          requestData.gstin = formData.gstin;
        }
      }

      const data = new FormData();
      data.append("data", new Blob([JSON.stringify(requestData)], { type: "application/json" }));

      if (formData.profileImage) data.append("profileImage", formData.profileImage);
      if (selectedPersona === "freelancer" && formData.cvFile) data.append("cv", formData.cvFile);
      if (selectedPersona === "client" && formData.clientType === "COMPANY" && formData.companyLogo) {
        data.append("companyLogo", formData.companyLogo);
      }

      await axiosInstance.post("/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Registration successful! Please check your email for the OTP.");
      setStep(4);
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.message || "An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const params = new URLSearchParams({ email: formData.email, otp: otp });
      await axiosInstance.post(`/api/auth/verify-user?${params.toString()}`);
      alert("Account verified successfully! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error("OTP Verification failed:", error);
      alert(error.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="relative min-h-screen w-full overflow-y-auto bg-[#f9f9ff] font-sans text-[#141b2b] antialiased">
        <div className="fixed inset-0 z-0 scale-105 bg-cover bg-center bg-no-repeat blur-[2px]" style={{ backgroundImage: "url('/register.png')" }} />
        <div className="fixed inset-0 z-0 bg-white/10" />
        <div className="pointer-events-none fixed left-[-10%] top-[-10%] z-0 h-[40%] w-[40%] rounded-full bg-[#1798D7]/10 blur-[100px]" />
        <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] z-0 h-[40%] w-[40%] rounded-full bg-[#09D66D]/10 blur-[100px]" />

        <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start px-4 pt-2 pb-8 md:pt-3">
          <div className="mx-auto flex w-full max-w-xl flex-col items-center">

            {/* HEADER */}
            <div className="mb-2 flex flex-col items-center text-center">
              <Link to="/" className="inline-flex h-14 cursor-pointer items-center justify-center overflow-hidden md:h-16">
                <img src="/logo1.png" alt="Conduyt" className="h-28 w-auto max-w-none translate-y-3 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.95)] md:h-32" />
              </Link>
              <p className="mt-1 text-xs font-semibold tracking-wide text-[#111827] md:text-sm">
                The intelligent network for exceptional talent.
              </p>
            </div>

            <div className="relative w-full overflow-visible rounded-2xl border border-white/40 bg-white/80 p-5 shadow-xl backdrop-blur-xl md:p-6">

              {/* PROGRESS BARS */}
              {step < 4 && (
                  <div className="mb-4 flex items-center justify-center">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#00628e]" />
                      <div className="h-1 w-8 overflow-hidden rounded-full bg-[#dce2f7] md:w-10">
                        <div className="h-full bg-[#00628e] transition-all duration-500 ease-out" style={{ width: step >= 2 ? "100%" : "0%" }} />
                      </div>
                      <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${step >= 2 ? "bg-[#00628e]" : "bg-[#dce2f7]"}`} />
                      <div className="h-1 w-8 overflow-hidden rounded-full bg-[#dce2f7] md:w-10">
                        <div className="h-full bg-[#00628e] transition-all duration-500 ease-out" style={{ width: step === 3 ? "100%" : "0%" }} />
                      </div>
                      <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${step === 3 ? "bg-[#00628e]" : "bg-[#dce2f7]"}`} />
                    </div>
                  </div>
              )}

              {/* STEP 1: PERSONAL DETAILS */}
              {step === 1 && (
                  <div className="mx-auto w-full max-w-md">
                    <div className="mb-4 text-center">
                      <h2 className="text-xl font-bold text-[#141b2b] md:text-2xl">Create Your Account</h2>
                      <p className="mt-0.5 text-xs text-[#3f4850] md:text-sm">Enter your details to get started.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-col items-center justify-center">
                        <label className="mb-1 block text-xs font-semibold text-[#141b2b]">Profile Picture *</label>
                        <div className="relative group flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-white transition-all hover:border-[#00628e]">
                          {profilePreview ? (
                              <img src={profilePreview} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                              <div className="flex flex-col items-center justify-center text-center">
                                <span className="text-xl">📷</span>
                                <span className="text-[10px] text-gray-500">Upload</span>
                              </div>
                          )}
                          <input
                              type="file"
                              name="profileImage"
                              accept="image/*"
                              onChange={handleChange}
                              className="absolute inset-0 cursor-pointer opacity-0"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[#141b2b]">First Name *</label>
                          <input
                              name="firstName"
                              type="text"
                              placeholder="John"
                              value={formData.firstName}
                              onChange={handleChange}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[#141b2b]">Middle Name</label>
                          <input
                              name="middleName"
                              type="text"
                              placeholder="M."
                              value={formData.middleName}
                              onChange={handleChange}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[#141b2b]">Last Name *</label>
                          <input
                              name="lastName"
                              type="text"
                              placeholder="Doe"
                              value={formData.lastName}
                              onChange={handleChange}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[#141b2b]">Email Address *</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[#141b2b]">Password *</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[#141b2b]">Re-enter Password *</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs focus:border-[#00628e] focus:outline-none focus:ring-2 focus:ring-[#00628e]/20"
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <button
                          type="button"
                          onClick={handleStep1Continue}
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1798D7] to-[#4AB7B2] py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90 md:text-sm"
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
              )}

              {/* STEP 2: MODE SELECTION */}
              {step === 2 && (
                  <div className="w-full">
                    <button type="button" onClick={() => setStep(1)} className="mb-3 flex cursor-pointer text-xs font-medium text-[#3f4850] hover:text-[#00628e]">
                      ← Back
                    </button>
                    <div className="mb-4 text-center">
                      <h2 className="mb-1 text-xl font-bold md:text-2xl">Choose Your Path</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div onClick={() => handlePersonaSelect("freelancer")} className="cursor-pointer">
                        <div className="group flex h-full flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-[#1798D7] hover:shadow-md">
                          <div className="mb-2 text-3xl">💻</div>
                          <h3 className="mb-1 text-sm font-bold">Freelancer Mode</h3>
                          <p className="text-xs text-[#3f4850] mb-3">Find projects and showcase your skills.</p>
                          <div className="w-full rounded-md border border-gray-200 py-1.5 text-xs font-semibold text-[#00628e] group-hover:bg-[#1798D7] group-hover:text-white">
                            Select Freelancer
                          </div>
                        </div>
                      </div>

                      <div onClick={() => handlePersonaSelect("client")} className="cursor-pointer">
                        <div className="group flex h-full flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-[#09D66D] hover:shadow-md">
                          <div className="mb-2 text-3xl">🏢</div>
                          <h3 className="mb-1 text-sm font-bold">Client Mode</h3>
                          <p className="text-xs text-[#3f4850] mb-3">Hire top-tier talent quickly.</p>
                          <div className="w-full rounded-md border border-gray-200 py-1.5 text-xs font-semibold text-[#00628e] group-hover:bg-[#09D66D] group-hover:text-white">
                            Select Client
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {/* STEP 3: ROLE DETAILS */}
              {step === 3 && (
                  <div className="mx-auto w-full max-w-md">
                    <button type="button" onClick={() => setStep(2)} className="mb-3 flex cursor-pointer text-xs font-medium text-[#3f4850] hover:text-[#00628e]">
                      ← Back
                    </button>

                    <form onSubmit={handleRegistrationSubmit} className="space-y-3">

                      {/* FREELANCER FIELDS */}
                      {selectedPersona === "freelancer" && (
                          <>
                            <h2 className="text-xl font-bold text-center mb-4">Freelancer Details</h2>

                            <input name="title" type="text" required placeholder="Professional Title *" value={formData.title} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs" />
                            <textarea name="bio" required rows="3" placeholder="Bio / Introduction *" value={formData.bio} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs" />

                            <div className="grid grid-cols-2 gap-2">
                              <input name="githubUrl" type="url" required placeholder="GitHub URL *" value={formData.githubUrl} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs" />
                              <input name="linkedinUrl" type="url" required placeholder="LinkedIn URL *" value={formData.linkedinUrl} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs" />
                            </div>

                            <input name="portfolioUrl" type="url" placeholder="Portfolio Website (Optional)" value={formData.portfolioUrl} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs" />

                            <div>
                              <label className="mb-1 block text-xs font-semibold">CV / Resume (PDF) *</label>
                              <input name="cvFile" type="file" accept=".pdf" required onChange={handleChange} className="w-full text-xs" />
                            </div>

                            {/* ========================================================= */}
                            {/* FIXED SKILLS AUTOCOMPLETE WIDGET                          */}
                            {/* ========================================================= */}
                            <div className="relative pb-2">
                              <label className="mb-1 block text-xs font-semibold">Skills</label>
                              <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Type to search or add a skill..."
                                    value={skillInput}
                                    onChange={(e) => {
                                      setSkillInput(e.target.value);
                                      setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    className="w-full rounded-lg border border-gray-200 px-3.5 py-1.5 text-xs focus:border-[#00628e] focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="cursor-pointer rounded-lg bg-[#00628e] px-4 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#004f73]"
                                >
                                  Add
                                </button>
                              </div>

                              {/* DROPDOWN MENU */}
                              {showSuggestions && skillInput.trim().length > 0 && (
                                  <div className="absolute top-14 left-0 z-[100] w-[calc(100%-80px)] bg-white border border-gray-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">

                                    {/* Filtered DB Skills */}
                                    {availableSkills
                                        .filter((s) => s.label.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s.label))
                                        .map((skill) => (
                                            <div
                                                key={skill.id}
                                                className="px-4 py-2.5 text-xs font-medium cursor-pointer border-b border-gray-100 hover:bg-[#1798D7]/10 hover:text-[#00628e] transition-colors"
                                                onClick={() => handleSelectSkill(skill.label)}
                                            >
                                              {skill.label}
                                            </div>
                                        ))}

                                    {/* Add Custom Skill Option */}
                                    {!availableSkills.some(s => s.label.toLowerCase() === skillInput.toLowerCase()) && (
                                        <div
                                            className="px-4 py-2.5 text-xs font-bold cursor-pointer text-[#00628e] bg-gray-50 hover:bg-[#1798D7]/10 transition-colors"
                                            onClick={handleAddSkill}
                                        >
                                          + Add "{skillInput}" as custom skill
                                        </div>
                                    )}
                                  </div>
                              )}

                              {/* SKILL CHIPS */}
                              <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                                {skills.length === 0 ? (
                                    <span className="text-[11px] text-gray-400 italic">No skills added yet.</span>
                                ) : (
                                    skills.map((skill, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1.5 rounded-full bg-[#1798D7]/10 pl-3 pr-2 py-1 text-xs font-semibold text-[#00628e] border border-[#1798D7]/20">
                                {skill}
                                          <button type="button" onClick={() => handleRemoveSkill(skill)} className="cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full h-4 w-4 flex items-center justify-center">×</button>
                              </span>
                                    ))
                                )}
                              </div>
                            </div>
                          </>
                      )}

                      {/* CLIENT FIELDS */}
                      {selectedPersona === "client" && (
                          <>
                            <h2 className="text-xl font-bold text-center mb-4">Client Details</h2>

                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <button type="button" onClick={() => setFormData(prev => ({...prev, clientType: "INDIVIDUAL"}))} className={`cursor-pointer py-2 text-xs font-bold rounded-lg ${formData.clientType === "INDIVIDUAL" ? "bg-[#09D66D] text-white" : "border"}`}>Individual</button>
                              <button type="button" onClick={() => setFormData(prev => ({...prev, clientType: "COMPANY"}))} className={`cursor-pointer py-2 text-xs font-bold rounded-lg ${formData.clientType === "COMPANY" ? "bg-[#09D66D] text-white" : "border"}`}>Company</button>
                            </div>

                            <input name="contactNumber" type="tel" required placeholder="Contact Number *" value={formData.contactNumber} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-xs" />

                            {formData.clientType === "COMPANY" && (
                                <div className="space-y-2 mt-2 p-3 bg-gray-50 rounded-lg border">
                                  <div className="mb-2">
                                    <label className="mb-1 block text-xs font-semibold">Company Logo (Optional)</label>
                                    <input name="companyLogo" type="file" accept="image/*" onChange={handleChange} className="w-full text-xs" />
                                  </div>
                                  <input name="companyName" type="text" required placeholder="Company Name *" value={formData.companyName} onChange={handleChange} className="w-full rounded-lg border px-3 py-1.5 text-xs" />
                                  <input name="companyRole" type="text" required placeholder="Your Role *" value={formData.companyRole} onChange={handleChange} className="w-full rounded-lg border px-3 py-1.5 text-xs" />
                                  <input name="companyWebsite" type="url" required placeholder="Website URL *" value={formData.companyWebsite} onChange={handleChange} className="w-full rounded-lg border px-3 py-1.5 text-xs" />
                                  <input name="companyAddress" type="text" required placeholder="Address *" value={formData.companyAddress} onChange={handleChange} className="w-full rounded-lg border px-3 py-1.5 text-xs" />
                                  <input name="gstin" type="text" required placeholder="GSTIN *" value={formData.gstin} onChange={handleChange} className="w-full rounded-lg border px-3 py-1.5 text-xs" />
                                </div>
                            )}
                          </>
                      )}

                      <button type="submit" disabled={isSubmitting} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1798D7] to-[#09D66D] py-3 mt-4 text-sm font-bold text-white shadow-md disabled:opacity-50">
                        {isSubmitting ? "Registering..." : "Complete Registration"}
                      </button>
                    </form>
                  </div>
              )}

              {/* STEP 4: OTP VERIFICATION */}
              {step === 4 && (
                  <div className="mx-auto w-full max-w-md text-center py-4">
                    <div className="mb-6">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1798D7]/10 text-3xl mb-3">✉️</div>
                      <h2 className="text-xl font-bold text-[#141b2b] md:text-2xl">Verify Your Email</h2>
                      <p className="mt-2 text-xs text-[#3f4850] md:text-sm">We've sent a 6-digit code to <span className="font-bold text-[#00628e]">{formData.email}</span>.</p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <input id="otp" type="text" maxLength={6} placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required className="block w-full py-3 px-4 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 text-center tracking-[0.5em] text-lg font-mono focus:outline-none focus:border-[#00628e] focus:ring-2 focus:ring-[#00628e]/20 focus:bg-white transition-all" />
                      </div>
                      <button type="submit" disabled={isSubmitting || otp.length < 6} className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-gradient-to-r from-[#1798D7] to-[#4AB7B2] hover:opacity-90 font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md">
                        {isSubmitting ? "Verifying..." : "Verify & Activate Account"}
                      </button>
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