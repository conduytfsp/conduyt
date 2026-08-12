import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    CircleDollarSign,
    FileText,
    Phone,
    Send,
    Tags,
    X,
    Building2,
    Sparkles,
    RefreshCcw,
    Save
} from "lucide-react";
import { useAxiosInstance } from "@/config/axiosConfig";
import { useAppStore } from "@/store/useAppStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer.jsx";
import toast from "react-hot-toast";

export default function PostJob() {
    const navigate = useNavigate();
    const { jobId } = useParams(); // If present, we are in EDIT mode
    const isEditMode = Boolean(jobId);

    const axios = useAxiosInstance();
    const { mode, toggleMode } = useAppStore(); // Access global mode

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingJob, setIsLoadingJob] = useState(isEditMode);

    // ================= FORM DATA =================
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        fixedBudget: "",
        contactNo: "",
    });

    // ================= SKILL TAGS STATE =================
    const [availableSkills, setAvailableSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // ================= INITIAL LOAD =================
    useEffect(() => {
        window.scrollTo(0, 0);

        // 1. Fetch available skills for the dropdown
        const fetchSkills = async () => {
            try {
                const response = await axios.get("/api/skills");
                const fetchedData = response.data?.data || response.data?.payload || response.data;
                if (Array.isArray(fetchedData)) {
                    setAvailableSkills(fetchedData.map(s => ({ id: s.id, name: s.name || s.label })));
                }
            } catch (error) {
                console.error("Failed to fetch skills.", error);
            }
        };

        // 2. If Edit mode, fetch the existing job details
        const fetchJobForEdit = async () => {
            try {
                const res = await axios.get(`/api/jobs/${jobId}`);
                const job = res.data?.data || res.data;

                setFormData({
                    title: job.title || "",
                    description: job.description || "",
                    fixedBudget: job.fixedBudget || "",
                    contactNo: job.contactNo || "",
                });

                // Assuming backend returns an array of skill objects. Adjust if it only returns strings.
                if (job.skills || job.requiredSkills) {
                    const jobSkills = job.skills || job.requiredSkills;
                    // Format to match our {id, name} structure
                    setSelectedSkills(jobSkills.map(s => typeof s === 'string' ? { id: s, name: s } : { id: s.id, name: s.name }));
                }
            } catch (err) {
                toast.error("Failed to load job details.");
                navigate('/dashboard'); // Kick them back if job not found
            } finally {
                setIsLoadingJob(false);
            }
        };

        fetchSkills();
        if (isEditMode) {
            fetchJobForEdit();
        }
    }, [axios, jobId, isEditMode, navigate]);

    // ================= HANDLERS =================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectSkill = (skillObj) => {
        if (!selectedSkills.some(s => s.id === skillObj.id)) {
            setSelectedSkills([...selectedSkills, skillObj]);
        }
        setSkillInput("");
        setShowSuggestions(false);
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSelectedSkills(selectedSkills.filter((skill) => skill.id !== skillToRemove.id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                fixedBudget: parseFloat(formData.fixedBudget),
                contactNo: formData.contactNo || null,
                skillIds: selectedSkills.map(s => s.id),
            };

            let res;
            if (isEditMode) {
                res = await axios.put(`/api/jobs/${jobId}`, payload);
                toast.success("Job updated successfully!");
            } else {
                res = await axios.post("/api/jobs", payload);
                toast.success("Job posted successfully!");
            }

            // Navigate to the newly created/updated job page
            const updatedJobId = res.data?.data?.id || jobId;
            if (updatedJobId) {
                navigate(`/jobs/${updatedJobId}`);
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Failed to save job:", error);
            toast.error(error.response?.data?.message || "Something went wrong while saving the job.");
            setIsSubmitting(false);
        }
    };

    // ================= GUARD: MUST BE IN CLIENT MODE =================
    if (mode !== 'client') {
        return (
            <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm max-w-md w-full"
                    >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#09D66D] mb-5 shadow-sm">
                            <RefreshCcw size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Switch to Client Mode</h2>
                        <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                            You are currently viewing Conduyt as a freelancer. To {isEditMode ? "edit this job" : "post a new job"}, you need to switch to your Client profile.
                        </p>
                        <button
                            onClick={toggleMode}
                            className="flex w-full items-center justify-center gap-2 bg-[#09D66D] text-white py-3.5 rounded-xl font-bold hover:bg-[#07B85D] transition-colors active:scale-95 shadow-sm"
                        >
                            Switch to Client Mode
                        </button>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    // ================= STYLES =================
    const inputStyles = "w-full rounded-xl border border-slate-200 bg-slate-50 px-11 py-3.5 text-sm text-slate-900 focus:border-[#09D66D] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#09D66D]/10 transition-all placeholder:text-slate-400";
    const labelStyles = "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500";

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex flex-col selection:bg-[#09D66D]/20">
            <Navbar />

            <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col">

                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#09D66D] shadow-sm">
                        <Building2 size={32} />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                            {isEditMode ? "Edit Job Post" : "Post a New Job"}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {isEditMode ? "Update your requirements to attract the perfect freelancer." : "Find the perfect freelancer for your next project."}
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm relative"
                >
                    {isLoadingJob && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 rounded-3xl backdrop-blur-sm">
                            <RefreshCcw className="animate-spin text-[#09D66D]" size={32} />
                        </div>
                    )}

                    {/* AI Banner (Only show on new posts since edits might not re-trigger AI) */}
                    {!isEditMode && (
                        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                            <Sparkles className="mt-0.5 text-[#09D66D]" size={20} shrink-0 />
                            <div>
                                <h4 className="text-sm font-bold text-emerald-900">AI Summary Automation</h4>
                                <p className="text-xs font-medium text-emerald-700/80 leading-relaxed mt-1">
                                    Just write your full description below. Our AI matching engine will automatically generate a crisp, 2-sentence summary for the job feed to attract the best talent.
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Title & Budget Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 relative">
                                <label className={labelStyles}>Job Title *</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        name="title"
                                        type="text"
                                        required
                                        placeholder="e.g. Senior Java Backend Developer"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={inputStyles}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className={labelStyles}>Fixed Budget (₹) *</label>
                                <div className="relative">
                                    <CircleDollarSign className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        name="fixedBudget"
                                        type="number"
                                        min="1"
                                        required
                                        placeholder="85000"
                                        value={formData.fixedBudget}
                                        onChange={handleChange}
                                        className={inputStyles}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="relative">
                            <label className={labelStyles}>Detailed Description *</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                                <textarea
                                    name="description"
                                    required
                                    rows="6"
                                    placeholder="Describe the project scope, timeline, and what you expect from the freelancer..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`${inputStyles} px-11 py-4 resize-none`}
                                />
                            </div>
                        </div>

                        {/* Skills & Contact Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Skill Autocomplete */}
                            <div className="relative z-50">
                                <label className={labelStyles}>Required Skills *</label>
                                <div className="relative">
                                    <Tags className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search skills (e.g. React, Java)..."
                                        value={skillInput}
                                        onChange={(e) => {
                                            setSkillInput(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        className={inputStyles}
                                    />
                                </div>

                                <AnimatePresence>
                                    {showSuggestions && skillInput.trim().length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                            className="absolute top-[76px] left-0 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl max-h-48 overflow-y-auto"
                                        >
                                            {availableSkills
                                                .filter((s) => s.name.toLowerCase().includes(skillInput.toLowerCase()) && !selectedSkills.some(selected => selected.id === s.id))
                                                .map((skill) => (
                                                    <div
                                                        key={skill.id}
                                                        className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-[#09D66D]"
                                                        onClick={() => handleSelectSkill(skill)}
                                                    >
                                                        {skill.name}
                                                    </div>
                                                ))}
                                            {!availableSkills.some(s => s.name.toLowerCase().includes(skillInput.toLowerCase())) && (
                                                <div className="px-4 py-2.5 text-sm font-medium text-slate-400 italic">
                                                    No matching skills found in the database.
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Selected Skill Chips */}
                                <div className="flex flex-wrap gap-2 pt-3">
                                    {selectedSkills.length === 0 ? (
                                        <span className="text-xs text-slate-400 italic pl-1">No skills selected yet.</span>
                                    ) : (
                                        selectedSkills.map((skill) => (
                                            <span key={skill.id} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                                                {skill.name}
                                                <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-emerald-400 hover:text-emerald-700 transition-colors">
                                                  <X size={14} />
                                                </button>
                                              </span>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Contact Number */}
                            <div className="relative">
                                <label className={labelStyles}>Direct Contact No (Optional)</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        name="contactNo"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        className={inputStyles}
                                    />
                                </div>
                                <p className="mt-2 text-[11px] font-medium text-slate-400 pl-1">
                                    Only visible to the freelancer you actively hire.
                                </p>
                            </div>

                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={isSubmitting || selectedSkills.length === 0}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#09D66D] py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-[#07B85D] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    "Processing..."
                                ) : isEditMode ? (
                                    <>Save Changes <Save size={18} /></>
                                ) : (
                                    <>Publish Job Post <Send size={18} /></>
                                )}
                            </button>
                            {selectedSkills.length === 0 && (
                                <p className="text-center text-xs text-rose-500 font-medium mt-3">
                                    * You must select at least one skill to {isEditMode ? "update" : "post"} this job.
                                </p>
                            )}
                        </div>

                    </form>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}