import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAxiosInstance } from "@/config/axiosConfig";
import {
    LayoutDashboard, User, Building2, Briefcase,
    BarChart3, ShieldCheck, CircleHelp, Sliders
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ClientDashboardLayout() {
    const axiosInstance = useAxiosInstance();
    const navigate = useNavigate();

    // Core User Data needed for Sidebar & Navbar
    const [clientType, setClientType] = useState(localStorage.getItem("conduyt_clientType") || "company");
    const [profileData, setProfileData] = useState({ firstName: "", lastName: "", profilePic: null });
    const [companyData, setCompanyData] = useState({ companyName: "" });

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                const userRes = await axiosInstance.get("/api/clients/me");
                if (userRes.data?.profile) setProfileData(userRes.data.profile);
                if (userRes.data?.company) setCompanyData(userRes.data.company);
                if (userRes.data?.clientType) setClientType(userRes.data.clientType);
            } catch (err) {
                console.warn("Using offline mode for header data.");
            }
        };
        fetchHeaderData();
    }, [axiosInstance]);

    const menuItems = [
        { icon: LayoutDashboard, name: "Overview", path: "/dashboard/overview" },
        { icon: User, name: "Personal Details", path: "/dashboard/personal" },
        ...(clientType !== "individual"
            ? [{ icon: Building2, name: "Company Details", path: "/dashboard/company" }]
            : []),
        { icon: Briefcase, name: "Jobs Management", path: "/dashboard/jobs" },
        { icon: BarChart3, name: "Analytics", path: "/dashboard/analytics" },
        { icon: ShieldCheck, name: "Security & Privacy", path: "/dashboard/security" },
        { icon: Sliders, name: "Extras", path: "/dashboard/extras" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#141b2b] font-sans antialiased">

            {/* ================= TOP NAVBAR ================= */}
            <Navbar />

            {/* ================= PAGE LAYOUT ================= */}
            <div className="flex flex-1 pt-16">

                {/* SIDEBAR */}
                <aside className="hidden md:flex flex-col p-4 bg-white fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r border-gray-200 z-40">

                    {/* User Widget */}
                    <div onClick={() => navigate("profile")} className="mb-6 p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 bg-white flex-shrink-0">
                            {profileData.profilePic ? <img src={profileData.profilePic} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full text-gray-500 flex items-center justify-center font-bold text-sm">{profileData.firstName?.[0] || "U"}</div>}
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-sm font-bold text-gray-900 truncate">{profileData.firstName || "Client User"}</h2>
                            <p className="text-xs text-gray-500 font-medium truncate">{clientType === "individual" ? "Individual Client" : companyData.companyName || "Company Client"}</p>
                        </div>
                    </div>

                    {/* Navigation Links using NavLink */}
                    <nav className="flex-1 flex flex-col gap-1.5">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full ${
                                        isActive ? "bg-emerald-50 text-[#09D66D]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                            <span>{item.name}</span>
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="mt-auto border-t border-gray-100 pt-4">
                        <Link to="/help" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <CircleHelp size={18} strokeWidth={2} />
                            <span>Help Center</span>
                        </Link>
                    </div>
                </aside>

                {/* MAIN VIEW AREA */}
                <main className="flex-1 md:ml-64 p-6 md:p-10 flex flex-col">
                    <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">

                        {/* THIS IS WHERE THE MAGIC HAPPENS. The active tab is injected here. */}
                        <Outlet context={{ profileData, companyData, clientType, setProfileData, setCompanyData, setClientType }} />

                        {/* FOOTER */}
                        <footer className="mt-auto pt-8 pb-2 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
                            <span>&copy; 2026 Conduyt. All rights reserved.</span>
                            <div className="flex items-center gap-6">
                                <Link to="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
                                <Link to="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
}