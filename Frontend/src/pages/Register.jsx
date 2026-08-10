import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Briefcase, Building2, User, ChevronRight, MailCheck, X, CheckCircle2, BadgeCheck } from "lucide-react";
import { useAxiosInstance } from "../config/axiosConfig";

function Register() {
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();

  const [step, setStep] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false); // Controls the success UI delay

  // ================= SKILL TAGS STATE =================
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axiosInstance.get("/api/skills");
        const fetchedData = response.data.data || response.data.payload || response.data;
        if (Array.isArray(fetchedData)) {
          const normalizedSkills = fetchedData.map(s => ({
            id: s.id,
            name: s.name || s.label
          }));
          setAvailableSkills(normalizedSkills);
        }
      } catch (error) {
        console.error("Failed to fetch skills.", error);
      }
    };
    fetchSkills();
  }, [axiosInstance]);

  const [profilePreview, setProfilePreview] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [otp, setOtp] = useState("");

  // ================= FORM DATA =================
  const [formData, setFormData] = useState({
    profileImage: null,
    firstName: "",
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
    websiteUrl: "", // FIX: Matches DTO
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
  const handleAddCustomSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, { id: null, name: trimmed }]);
      setSkillInput("");
      setShowSuggestions(false);
    }
  };

  const handleSelectSkill = (skillObj) => {
    if (!skills.some(s => s.id === skillObj.id)) {
      setSkills([...skills, skillObj]);
    }
    setSkillInput("");
    setShowSuggestions(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill.name !== skillToRemove.name));
  };

  // ================= NAVIGATION =================
  const handleStep1Continue = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.profileImage) {
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
      // Create Payload matching UserRegisterRequestDTO exactly
      const requestData = {
        firstName: formData.firstName,
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

        // FIX: Changed "skills" to "skillNames" to perfectly match your Spring Boot DTO
        requestData.skillNames = skills.map(s => s.name);
      } else {
        requestData.clientType = formData.clientType;
        requestData.contactNumber = formData.contactNumber;
        if (formData.clientType === "COMPANY") {
          requestData.companyName = formData.companyName;
          requestData.websiteUrl = formData.websiteUrl; // FIX: Matches DTO
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

      setStep(4);
    } catch (error) {
      console.error("Registration failed:", error);

      // Better error extraction for Spring Validation messages
      let errorMsg = "An error occurred during registration. Please try again.";
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // If Spring returns a list of validation errors
        errorMsg = Object.values(error.response.data.errors).join(", ");
      }
      alert(errorMsg);
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

      // UX FIX: Show success UI, wait 2.5 seconds, then redirect
      setVerificationSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (error) {
      console.error("OTP Verification failed:", error);
      alert(error.response?.data?.message || "Invalid or expired OTP. Please try again.");
      setIsSubmitting(false);
    }
  };

  const inputStyles = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#1798D7] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1798D7]/10 transition-all placeholder:text-slate-400";
  const labelStyles = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500";

  return (
      <div className="relative min-h-screen w-full bg-[#F8FAFC] font-sans text-slate-900 antialiased selection:bg-[#1798D7]/20">

        <div className="fixed inset-0 z-0 bg-[url('/register.png')] bg-cover bg-center bg-no-repeat opacity-40 blur-sm" />
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-white/60 to-white/95" />

        <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-10">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center">

            <div className="mb-8 flex flex-col items-center text-center">
              <Link to="/" className="inline-flex cursor-pointer items-center justify-center mb-2">
                <img src="/logo1.png" alt="Conduyt" className="h-12 w-auto object-contain drop-shadow-sm" />
              </Link>
              <p className="text-sm font-medium text-slate-500">
                The intelligent network for exceptional talent.
              </p>
            </div>

            <div className="relative w-full rounded-3xl border border-white bg-white/70 p-6 shadow-xl backdrop-blur-xl md:p-10">

              {step < 4 && (
                  <div className="mb-10 flex items-center justify-center gap-3">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${step >= num ? "bg-[#1798D7] text-white" : "bg-slate-200 text-slate-400"}`}>
                            {step > num ? <CheckCircle2 size={16} /> : num}
                          </div>
                          {num !== 3 && (
                              <div className="h-1 w-12 rounded-full bg-slate-200 overflow-hidden">
                                <div className="h-full bg-[#1798D7] transition-all duration-500" style={{ width: step > num ? "100%" : "0%" }} />
                              </div>
                          )}
                        </div>
                    ))}
                  </div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mx-auto w-full">
                      <div className="mb-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Create Your Account</h2>
                        <p className="mt-2 text-sm text-slate-500">Let's start with the basics.</p>
                      </div>

                      <div className="space-y-5">
                        <div className="flex flex-col items-center justify-center mb-2">
                          <div className="relative group flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-[#1798D7] hover:bg-blue-50">
                            {profilePreview ? (
                                <img src={profilePreview} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-slate-400 group-hover:text-[#1798D7]">
                                  <Camera size={24} className="mb-1" />
                                  <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                                </div>
                            )}
                            <input type="file" name="profileImage" accept="image/*" onChange={handleChange} className="absolute inset-0 cursor-pointer opacity-0" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className={labelStyles}>First Name *</label>
                            <input name="firstName" type="text" placeholder="Jane" value={formData.firstName} onChange={handleChange} className={inputStyles} />
                          </div>
                          <div>
                            <label className={labelStyles}>Last Name *</label>
                            <input name="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={handleChange} className={inputStyles} />
                          </div>
                        </div>

                        <div>
                          <label className={labelStyles}>Email Address *</label>
                          <input name="email" type="email" placeholder="jane@example.com" value={formData.email} onChange={handleChange} className={inputStyles} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className={labelStyles}>Password *</label>
                            <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className={inputStyles} />
                          </div>
                          <div>
                            <label className={labelStyles}>Confirm Password *</label>
                            <input name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className={inputStyles} />
                          </div>
                        </div>
                      </div>

                      <button type="button" onClick={handleStep1Continue} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1798D7] py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1280B8]">
                        Continue <ChevronRight size={18} />
                      </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                      <button type="button" onClick={() => setStep(1)} className="mb-6 flex items-center text-sm font-bold text-slate-400 hover:text-[#1798D7] transition-colors">
                        ← Back to basics
                      </button>
                      <div className="mb-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Choose Your Path</h2>
                        <p className="mt-2 text-sm text-slate-500">How do you want to use Conduyt?</p>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div onClick={() => handlePersonaSelect("freelancer")} className="group cursor-pointer rounded-3xl border-2 border-slate-100 bg-white p-8 text-center transition-all hover:border-[#1798D7] hover:shadow-lg">
                          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#1798D7] transition-transform group-hover:scale-110">
                            <Briefcase size={32} />
                          </div>
                          <h3 className="mb-2 text-xl font-bold text-slate-900">I'm a Freelancer</h3>
                          <p className="mb-6 text-sm text-slate-500">I'm looking for projects and want to showcase my skills to top clients.</p>
                          <div className="w-full rounded-xl bg-slate-50 py-3 text-sm font-bold text-slate-600 transition-colors group-hover:bg-[#1798D7] group-hover:text-white">
                            Join as Freelancer
                          </div>
                        </div>

                        <div onClick={() => handlePersonaSelect("client")} className="group cursor-pointer rounded-3xl border-2 border-slate-100 bg-white p-8 text-center transition-all hover:border-[#09D66D] hover:shadow-lg">
                          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#09D66D] transition-transform group-hover:scale-110">
                            <Building2 size={32} />
                          </div>
                          <h3 className="mb-2 text-xl font-bold text-slate-900">I'm a Client</h3>
                          <p className="mb-6 text-sm text-slate-500">I want to post jobs, review AI summaries, and hire top-tier talent quickly.</p>
                          <div className="w-full rounded-xl bg-slate-50 py-3 text-sm font-bold text-slate-600 transition-colors group-hover:bg-[#09D66D] group-hover:text-white">
                            Join as Client
                          </div>
                        </div>
                      </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mx-auto w-full">
                      <button type="button" onClick={() => setStep(2)} className="mb-6 flex items-center text-sm font-bold text-slate-400 hover:text-[#1798D7] transition-colors">
                        ← Change role
                      </button>

                      <div className="mb-8">
                        <h2 className="text-2xl font-extrabold tracking-tight">
                          {selectedPersona === "freelancer" ? "Freelancer Profile" : "Client Profile"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">Almost there. Complete your professional details.</p>
                      </div>

                      <form onSubmit={handleRegistrationSubmit} className="space-y-5">

                        {selectedPersona === "freelancer" && (
                            <div className="space-y-4">
                              <div>
                                <label className={labelStyles}>Professional Title *</label>
                                <input name="title" type="text" required placeholder="e.g. Senior Full Stack Developer" value={formData.title} onChange={handleChange} className={inputStyles} />
                              </div>
                              <div>
                                <label className={labelStyles}>Bio / Introduction *</label>
                                <textarea name="bio" required rows="3" placeholder="Tell clients about your experience..." value={formData.bio} onChange={handleChange} className={`${inputStyles} resize-none`} />
                              </div>

                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                  <label className={labelStyles}>GitHub URL *</label>
                                  <input name="githubUrl" type="url" required placeholder="https://github.com/..." value={formData.githubUrl} onChange={handleChange} className={inputStyles} />
                                </div>
                                <div>
                                  <label className={labelStyles}>LinkedIn URL *</label>
                                  <input name="linkedinUrl" type="url" required placeholder="https://linkedin.com/in/..." value={formData.linkedinUrl} onChange={handleChange} className={inputStyles} />
                                </div>
                              </div>

                              <div>
                                <label className={labelStyles}>Portfolio URL</label>
                                <input name="portfolioUrl" type="url" placeholder="https://yourwebsite.com (Optional)" value={formData.portfolioUrl} onChange={handleChange} className={inputStyles} />
                              </div>

                              <div>
                                <label className={labelStyles}>CV / Resume (PDF) *</label>
                                <input name="cvFile" type="file" accept=".pdf" required onChange={handleChange} className="w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#1798D7] hover:file:bg-blue-100" />
                              </div>

                              <div className="relative pt-2">
                                <label className={labelStyles}>Top Skills</label>
                                <div className="flex gap-3 mb-3">
                                  <input
                                      type="text"
                                      placeholder="Type a skill (e.g. React, Java)..."
                                      value={skillInput}
                                      onChange={(e) => {
                                        setSkillInput(e.target.value);
                                        setShowSuggestions(true);
                                      }}
                                      onFocus={() => setShowSuggestions(true)}
                                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                      className={inputStyles}
                                  />
                                  <button type="button" onClick={handleAddCustomSkill} className="shrink-0 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800">
                                    Add
                                  </button>
                                </div>

                                {showSuggestions && skillInput.trim().length > 0 && (
                                    <div className="absolute top-[84px] left-0 z-50 w-full md:w-[calc(100%-100px)] rounded-xl border border-slate-200 bg-white p-2 shadow-xl max-h-60 overflow-y-auto">
                                      {availableSkills
                                          .filter((s) => s.name.toLowerCase().includes(skillInput.toLowerCase()) && !skills.some(selected => selected.id === s.id))
                                          .map((skill) => (
                                              <div key={skill.id} className="cursor-pointer rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#1798D7]" onClick={() => handleSelectSkill(skill)}>
                                                {skill.name}
                                              </div>
                                          ))}
                                      {!availableSkills.some(s => s.name.toLowerCase() === skillInput.toLowerCase()) && (
                                          <div className="cursor-pointer rounded-lg px-4 py-3 text-sm font-bold text-[#1798D7] transition-colors hover:bg-blue-50" onClick={handleAddCustomSkill}>
                                            + Add "{skillInput}"
                                          </div>
                                      )}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 pt-1">
                                  {skills.length === 0 ? (
                                      <span className="text-sm text-slate-400 italic">Add skills to boost your AI match score.</span>
                                  ) : (
                                      skills.map((skill, idx) => (
                                          <span key={idx} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700 border border-slate-200">
                                  {skill.name}
                                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={14} /></button>
                                </span>
                                      ))
                                  )}
                                </div>
                              </div>
                            </div>
                        )}

                        {selectedPersona === "client" && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3 mb-6">
                                <button type="button" onClick={() => setFormData(prev => ({...prev, clientType: "INDIVIDUAL"}))} className={`cursor-pointer rounded-xl py-3 text-sm font-bold transition-all ${formData.clientType === "INDIVIDUAL" ? "bg-emerald-50 text-[#09D66D] border-2 border-emerald-200" : "bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-200"}`}>
                                  <User size={20} className="mx-auto mb-1" /> Individual
                                </button>
                                <button type="button" onClick={() => setFormData(prev => ({...prev, clientType: "COMPANY"}))} className={`cursor-pointer rounded-xl py-3 text-sm font-bold transition-all ${formData.clientType === "COMPANY" ? "bg-emerald-50 text-[#09D66D] border-2 border-emerald-200" : "bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-200"}`}>
                                  <Building2 size={20} className="mx-auto mb-1" /> Company
                                </button>
                              </div>

                              <div>
                                <label className={labelStyles}>Contact Number *</label>
                                <input name="contactNumber" type="tel" required placeholder="+1 (555) 000-0000" value={formData.contactNumber} onChange={handleChange} className={inputStyles} />
                              </div>

                              {formData.clientType === "COMPANY" && (
                                  <div className="mt-6 space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                                    <div>
                                      <label className={labelStyles}>Company Logo</label>
                                      <input name="companyLogo" type="file" accept="image/*" onChange={handleChange} className="w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#09D66D] hover:file:bg-emerald-100" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                      <div>
                                        <label className={labelStyles}>Company Name *</label>
                                        <input name="companyName" type="text" required placeholder="Acme Corp" value={formData.companyName} onChange={handleChange} className={inputStyles} />
                                      </div>
                                      <div>
                                        <label className={labelStyles}>Your Role *</label>
                                        <input name="companyRole" type="text" required placeholder="Hiring Manager" value={formData.companyRole} onChange={handleChange} className={inputStyles} />
                                      </div>
                                    </div>
                                    <div>
                                      <label className={labelStyles}>Website URL *</label>
                                      <input name="websiteUrl" type="url" required placeholder="https://acme.com" value={formData.websiteUrl} onChange={handleChange} className={inputStyles} />
                                    </div>
                                    <div>
                                      <label className={labelStyles}>Company Address *</label>
                                      <input name="companyAddress" type="text" required placeholder="123 Business St, NY" value={formData.companyAddress} onChange={handleChange} className={inputStyles} />
                                    </div>
                                    <div>
                                      <label className={labelStyles}>GSTIN / Tax ID *</label>
                                      <input name="gstin" type="text" required placeholder="Required for billing" value={formData.gstin} onChange={handleChange} className={inputStyles} />
                                    </div>
                                  </div>
                              )}
                            </div>
                        )}

                        <button type="submit" disabled={isSubmitting} className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white shadow-sm transition-all disabled:opacity-50 ${selectedPersona === 'client' ? 'bg-[#09D66D] hover:bg-[#07B85D]' : 'bg-[#1798D7] hover:bg-[#1280B8]'}`}>
                          {isSubmitting ? "Creating Account..." : "Create Account"}
                        </button>
                      </form>
                    </motion.div>
                )}

                {step === 4 && !verificationSuccess && (
                    <motion.div key="step4-form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto w-full max-w-sm text-center py-8">
                      <div className="mb-8">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-[#1798D7]">
                          <MailCheck size={40} />
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Check your inbox</h2>
                        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                          We sent a 6-digit verification code to <br/>
                          <span className="font-bold text-slate-800">{formData.email}</span>
                        </p>
                      </div>

                      <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <input id="otp" type="text" maxLength={6} placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} required className="block w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-4 text-center font-mono text-3xl font-bold tracking-[0.5em] text-slate-900 transition-all focus:border-[#1798D7] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1798D7]/10" />
                        <button type="submit" disabled={isSubmitting || otp.length < 6} className="w-full rounded-xl bg-slate-900 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-slate-800 disabled:opacity-50">
                          {isSubmitting ? "Verifying..." : "Verify Account"}
                        </button>
                      </form>
                    </motion.div>
                )}

                {step === 4 && verificationSuccess && (
                    <motion.div key="step4-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto w-full max-w-sm text-center py-10">
                      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-[#09D66D]">
                        <BadgeCheck size={50} />
                      </div>
                      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Email Verified!</h2>
                      <p className="mt-4 text-sm text-slate-500 leading-relaxed font-medium">
                        Your account has been successfully created. Redirecting you to login...
                      </p>

                      <div className="mt-8 flex justify-center">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                          <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 2.5, ease: "linear" }}
                              className="h-full bg-[#09D66D]"
                          />
                        </div>
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
  );
}

export default Register;