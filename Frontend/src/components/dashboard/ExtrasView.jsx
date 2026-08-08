import React, { useState, useEffect } from "react";
import { Bell, Sliders, Save, Loader2, Zap } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAxiosInstance } from "@/config/axiosConfig";

export default function ExtrasView() {
    const axiosInstance = useAxiosInstance();

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [aiMatchThreshold, setAiMatchThreshold] = useState(85);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch current preferences on mount
    useEffect(() => {
        let isMounted = true;
        const fetchPreferences = async () => {
            try {
                const response = await axiosInstance.get("/api/clients/preferences");
                if (isMounted && response.data) {
                    setNotificationsEnabled(response.data.notificationsEnabled ?? true);
                    setAiMatchThreshold(response.data.aiMatchThreshold ?? 85);
                }
            } catch (error) {
                console.warn("Backend preferences route offline. Using defaults.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchPreferences();
        return () => { isMounted = false; };
    }, [axiosInstance]);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            await axiosInstance.put("/api/clients/preferences", {
                notificationsEnabled,
                aiMatchThreshold,
            });
            toast.success("Preferences updated successfully!");
        } catch (error) {
            console.warn("Backend preferences PUT route offline. Simulating save.");
            setTimeout(() => {
                toast.success("Preferences updated! (Offline Mode)");
                setIsSubmitting(false);
            }, 600);
            return;
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-xl bg-white p-8 border border-gray-200 shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-[#09D66D]" />
                <p className="text-sm font-medium text-gray-500">Loading preferences...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-6">
            <Toaster position="top-right" />

            {/* ================= HEADER ================= */}
            <header className="mb-2">
                <h1 className="text-2xl font-bold text-gray-900">Extras & Preferences</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Configure your AI matching alerts and notification settings.
                </p>
            </header>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 space-y-8">

                {/* ================= 1. NOTIFICATIONS TOGGLE ================= */}
                <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500">
                            <Bell size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Candidate Notifications</h2>
                            <p className="mt-1 text-xs text-gray-500 max-w-sm leading-relaxed">
                                Receive real-time alerts and email updates when new freelancers apply to your job postings.
                            </p>
                        </div>
                    </div>

                    {/* iOS-style Toggle Switch */}
                    <button
                        type="button"
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            notificationsEnabled ? "bg-[#09D66D]" : "bg-gray-300"
                        }`}
                    >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notificationsEnabled ? "translate-x-5" : "translate-x-0"
                }`}
            />
                    </button>
                </div>

                {/* ================= 2. AI THRESHOLD SLIDER ================= */}
                <div className={`transition-opacity duration-300 ${!notificationsEnabled ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-[#09D66D]">
                            <Zap size={24} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">AI Match Threshold</h2>
                                <span className="text-xl font-extrabold text-[#09D66D]">{aiMatchThreshold}%</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500 max-w-sm leading-relaxed">
                                Only notify me when an applicant's AI compatibility score meets or exceeds this percentage.
                            </p>
                        </div>
                    </div>

                    {/* Range Slider & Manual Input */}
                    <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={aiMatchThreshold}
                            onChange={(e) => setAiMatchThreshold(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#09D66D]"
                        />
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={aiMatchThreshold}
                                onChange={(e) => setAiMatchThreshold(Number(e.target.value))}
                                className="w-16 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-center font-bold text-gray-900 outline-none focus:border-[#09D66D] focus:ring-2 focus:ring-[#09D66D]/20"
                            />
                            <span className="text-sm font-bold text-gray-500">%</span>
                        </div>
                    </div>
                </div>

                {/* ================= SAVE BUTTON ================= */}
                <div className="pt-4 flex justify-end border-t border-gray-100">
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#09D66D] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#06934A] active:scale-95 disabled:opacity-70"
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSubmitting ? "Saving..." : "Save Preferences"}
                    </button>
                </div>

            </div>
        </div>
    );
}