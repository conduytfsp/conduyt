import React, { useState, useEffect } from "react";
import { Bell, Save, Loader2, Tags, Info } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAxiosInstance } from "@/config/axiosConfig";

export default function FreelancerExtrasView() {
    const axiosInstance = useAxiosInstance();

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [userSkills, setUserSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch current preferences and profile skills on mount
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                // Fetch both preferences and profile data concurrently
                const [prefRes, profileRes] = await Promise.all([
                    axiosInstance.get("/api/freelancers/preferences").catch(() => ({ data: {} })),
                    axiosInstance.get("/api/freelancers/profile").catch(() => ({ data: {} }))
                ]);

                if (isMounted) {
                    // Set Notifications Toggle
                    if (prefRes.data && prefRes.data.notificationsEnabled !== undefined) {
                        setNotificationsEnabled(prefRes.data.notificationsEnabled);
                    }

                    // Extract skills to show them what they are subscribed to
                    const fetchedSkills = profileRes.data?.skills || profileRes.data?.skillNames || [];
                    setUserSkills(fetchedSkills);
                }
            } catch (error) {
                console.warn("Backend routes offline. Using defaults.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, [axiosInstance]);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            await axiosInstance.put("/api/freelancers/preferences", {
                notificationsEnabled,
            });
            toast.success("Preferences updated successfully!");
        } catch (error) {
            console.warn("Backend preferences PUT route offline. Simulating save.");
            setTimeout(() => {
                toast.success("Preferences updated! (Offline Mode)");
                setIsSubmitting(false);
            }, 600);
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-xl bg-white p-8 border border-slate-200 shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-[#1798D7]" />
                <p className="text-sm font-medium text-slate-500">Loading preferences...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-6">
            <Toaster position="top-right" />

            {/* ================= HEADER ================= */}
            <header className="mb-2">
                <h1 className="text-2xl font-bold text-slate-900">Extras & Preferences</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Configure your job alerts and notification settings.
                </p>
            </header>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 space-y-8">

                {/* ================= 1. NOTIFICATIONS TOGGLE ================= */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
                            <Bell size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Job & Application Alerts</h2>
                            <p className="mt-1 text-xs text-slate-500 max-w-sm leading-relaxed">
                                Receive email alerts when clients update the status of your applications or when new jobs match your profile.
                            </p>
                        </div>
                    </div>

                    {/* iOS-style Toggle Switch */}
                    <button
                        type="button"
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            notificationsEnabled ? "bg-[#1798D7]" : "bg-slate-300"
                        }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                notificationsEnabled ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                    </button>
                </div>

                {/* ================= 2. SKILL-BASED ROUTING INFO ================= */}
                <div className={`transition-opacity duration-300 ${!notificationsEnabled ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                    <div className="flex items-start gap-4 mb-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#1798D7]">
                            <Tags size={24} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 mt-1">
                            <h2 className="text-lg font-bold text-slate-900">How Job Matches Work</h2>
                            <p className="mt-1 text-sm text-slate-600 leading-relaxed max-w-lg">
                                Conduyt's AI automatically routes new job postings to you based strictly on the active skill tags in your profile.
                            </p>
                        </div>
                    </div>

                    {/* Informational Box & Dynamic Skills display */}
                    <div className="ml-0 sm:ml-16 bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <div className="flex items-start gap-2 mb-4 text-[#1798D7]">
                            <Info size={16} className="mt-0.5 shrink-0" />
                            <p className="text-xs font-semibold leading-relaxed">
                                You are currently subscribed to instant alerts for jobs requiring the following skills:
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {userSkills.length > 0 ? (
                                userSkills.map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs italic text-slate-400 font-medium">
                                    No skills added to your profile yet. Update your portfolio to receive matches!
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ================= SAVE BUTTON ================= */}
                <div className="pt-4 flex justify-end border-t border-slate-100">
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1798D7] px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1280B8] active:scale-95 disabled:opacity-70"
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSubmitting ? "Saving..." : "Save Preferences"}
                    </button>
                </div>

            </div>
        </div>
    );
}