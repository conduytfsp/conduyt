import React, { useEffect, useState } from "react";
import ClientDashboard from "./ClientDashboard";
import FreelancerDashboard from "./FreelancerDashboard";

// Helper function to read cookies
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

export default function Dashboard() {
    // Initialize state directly from the cookie for zero-delay rendering
    const [activeMode, setActiveMode] = useState(getCookie("active_mode"));

    const syncDashboardMode = () => {
        setActiveMode(getCookie("active_mode"));
    };

    useEffect(() => {
        // Listen for the "modeChanged" event dispatched by the Navbar
        window.addEventListener("modeChanged", syncDashboardMode);
        return () => window.removeEventListener("modeChanged", syncDashboardMode);
    }, []);

    // ================= THE TRAFFIC CONTROLLER =================

    if (activeMode === "client") {
        return <ClientDashboard />;
    }

    if (activeMode === "freelancer") {
        return <FreelancerDashboard />;
    }

    // Fallback while Axios potentially redirects them, or if cookie is loading
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f9f9ff]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#00628e]"></div>
        </div>
    );
}