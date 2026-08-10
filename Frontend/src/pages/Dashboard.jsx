import React from "react";
import { useAppStore } from "@/store/useAppStore";
import ClientDashboard from "./ClientDashboard"; // Adjust path if needed
import FreelancerDashboard from "./FreelancerDashboard"; // Adjust path if needed

export default function Dashboard() {
    // We subscribe directly to the Zustand store.
    // If 'mode' changes anywhere in the app, this component instantly re-renders.
    const mode = useAppStore((state) => state.mode);

    // ================= THE TRAFFIC CONTROLLER =================

    if (mode === "client") {
        return <ClientDashboard />;
    }

    if (mode === "freelancer") {
        return <FreelancerDashboard />;
    }

    // Fallback if mode is somehow undefined or loading
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1798D7]"></div>
        </div>
    );
}