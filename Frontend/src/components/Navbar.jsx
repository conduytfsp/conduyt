import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    Menu, X, ArrowRightLeft, Plus, CircleUserRound,
    ArrowLeft, Bell, Sparkles, Briefcase, CheckCircle2, ChevronRight, Users
} from "lucide-react";
import Button from "./ui/Button.jsx";
import { useAppStore } from "@/store/useAppStore";
import { useAxiosInstance } from "@/config/axiosConfig";
import { formatDistanceToNow } from "date-fns";

// Import both logos
import logoBlue from "@public/assets/Conduyt-blue.png";
import logoGreen from "@public/assets/Conduyt-green.png";

// Helper function to read cookies
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

// Helper function to update cookies
const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
};

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosInstance = useAxiosInstance();

    // ================= GLOBAL STATE =================
    const mode = useAppStore((state) => state.mode);
    const setMode = useAppStore((state) => state.setMode);

    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [availableProfiles, setAvailableProfiles] = useState("");

    // ================= NOTIFICATION STATES =================
    const [notifications, setNotifications] = useState([]);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef(null);

    // Re-run authentication check whenever the route changes
    useEffect(() => {
        const profilesCookie = getCookie("available_profiles") || "";

        if (profilesCookie) {
            setIsLoggedIn(true);
            setAvailableProfiles(profilesCookie);

            const modeCookie = getCookie("active_mode");
            if (modeCookie && modeCookie !== mode && setMode) {
                setMode(modeCookie);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, [location, mode, setMode]);

    // Fetch Notification History & Listen to SSE when logged in
    useEffect(() => {
        if (!isLoggedIn) return;

        let eventSource;
        const fetchHistory = async () => {
            try {
                const res = await axiosInstance.get("/api/notifications");
                setNotifications(res.data || []);
            } catch (err) {
                console.warn("Could not fetch notification history.");
            }
        };

        fetchHistory();

        try {
            const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
            eventSource = new EventSource(`${backendUrl}/api/notifications/stream`, { withCredentials: true });
            eventSource.addEventListener("notification", (event) => {
                const newAlert = JSON.parse(event.data);
                setNotifications((prev) => [newAlert, ...prev]);
            });
        } catch (err) {
            console.warn("SSE connection error:", err);
        }

        return () => {
            if (eventSource) eventSource.close();
        };
    }, [isLoggedIn, axiosInstance]);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.isRead) {
                await axiosInstance.patch(`/api/notifications/${notification.id}/read`);
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
                );
            }
        } catch (err) {
            console.error("Failed to mark notification read", err);
        }

        setNotifOpen(false);
        if (notification.targetUrl) {
            navigate(notification.targetUrl);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "AI_CANDIDATE": return <Sparkles size={16} className="text-[#09D66D]" />;
            case "JOB_MATCH": return <Briefcase size={16} className="text-[#1798D7]" />;
            default: return <CheckCircle2 size={16} className="text-slate-500" />;
        }
    };

    // ================= BOOLEAN LOGIC STATES =================
    const hasClient = availableProfiles.includes("CLIENT");
    const hasFreelancer = availableProfiles.includes("FREELANCER");
    const hasBothProfiles = hasClient && hasFreelancer;

    const currentLogo = mode === "client" ? logoGreen : logoBlue;

    const switchBtnStyle = mode === "client"
        ? "text-[#00628e] bg-[#1798D7]/10 border-[#1798D7]/20 hover:bg-[#1798D7]/20"
        : "text-[#06934A] bg-[#09D66D]/10 border-[#09D66D]/20 hover:bg-[#09D66D]/20";

    const handleModeChange = (targetMode, shouldRedirectToDashboard) => {
        setCookie("active_mode", targetMode, 7);
        if (setMode) setMode(targetMode);
        if (shouldRedirectToDashboard) navigate("/dashboard");
        setMenuOpen(false);
    };

    const renderActionButtons = (isMobile = false) => {
        const baseClass = isMobile
            ? "flex justify-center items-center w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm"
            : "flex items-center cursor-pointer px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-300 shadow-sm hover:shadow active:scale-95";

        if (hasBothProfiles) {
            const targetMode = mode === "freelancer" ? "client" : "freelancer";
            return (
                <button onClick={() => handleModeChange(targetMode, false)} className={`${baseClass} ${switchBtnStyle}`}>
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Switch to {mode === "freelancer" ? "Client" : "Freelancer"}
                </button>
            );
        }

        if (mode === "client" && !hasClient && hasFreelancer) {
            return (
                <button onClick={() => handleModeChange("freelancer", false)} className={`${baseClass} text-gray-600 bg-gray-100 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200`}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Cancel Setup
                </button>
            );
        }

        if (mode === "freelancer" && !hasFreelancer && hasClient) {
            return (
                <button onClick={() => handleModeChange("client", false)} className={`${baseClass} text-gray-600 bg-gray-100 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200`}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Cancel Setup
                </button>
            );
        }

        if (mode === "client" && hasClient && !hasFreelancer) {
            return (
                <button onClick={() => handleModeChange("freelancer", true)} className={`${baseClass} text-white bg-[#1798D7] border-transparent hover:bg-[#00628e]`}>
                    <Plus className="w-4 h-4 mr-1" /> Join as Freelancer
                </button>
            );
        }

        if (mode === "freelancer" && hasFreelancer && !hasClient) {
            return (
                <button onClick={() => handleModeChange("client", true)} className={`${baseClass} text-white bg-[#09D66D] border-transparent hover:bg-[#06934A]`}>
                    <Plus className="w-4 h-4 mr-1" /> Join as Client
                </button>
            );
        }

        return null;
    };

    return (
        <nav className="flex items-center justify-between w-full bg-white border-b border-gray-200 sticky top-0 z-50 px-4 md:px-8 h-16">

            {/* ================= LOGO ================= */}
            <div className="flex items-center">
                <NavLink to={"/"}>
                    <img
                        src={currentLogo}
                        alt="Conduyt Logo"
                        className="h-10 md:h-11 w-auto object-contain"
                    />
                </NavLink>
            </div>

            {/* ================= DESKTOP MENU ================= */}
            <ul className="hidden md:flex gap-8 items-center font-medium text-gray-700 text-sm">
                <li>
                    <NavLink to={"/jobs"} className={({isActive}) => isActive ? "text-[#1798D7] font-semibold" : "hover:text-[#1798D7] transition"}>
                        Find Work
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"/freelancers"} className={({isActive}) => isActive ? "text-[#1798D7] font-semibold" : "hover:text-[#1798D7] transition"}>
                        Find Talent
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"/about"} className={({isActive}) => isActive ? "text-[#1798D7] font-semibold" : "hover:text-[#1798D7] transition"}>
                        About
                    </NavLink>
                </li>
            </ul>

            {/* ================= RIGHT SIDE ACTIONS (Desktop) ================= */}
            <div className="hidden md:flex items-center space-x-4">
                {!isLoggedIn ? (
                    <Button as={NavLink} to="/login" className="px-6 py-2 text-sm">
                        SignUp / Login
                    </Button>
                ) : (
                    <div className="flex items-center space-x-3">
                        {renderActionButtons(false)}

                        {/* NOTIFICATION BELL & DROPDOWN */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer text-slate-600"
                                aria-label="Notifications"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                                        <span className="text-xs font-semibold text-slate-400">
                                            {unreadCount} unread
                                        </span>
                                    </div>

                                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-slate-400 text-xs font-medium">
                                                No notifications yet.
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => handleNotificationClick(n)}
                                                    className={`p-4 transition-colors cursor-pointer flex gap-3 items-start hover:bg-slate-50 ${
                                                        !n.isRead ? "bg-blue-50/30" : "bg-white"
                                                    }`}
                                                >
                                                    <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                                                        {getNotificationIcon(n.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className={`text-xs font-bold truncate ${!n.isRead ? "text-slate-900" : "text-slate-700"}`}>
                                                                {n.title}
                                                            </p>
                                                            {!n.isRead && (
                                                                <span className="h-2 w-2 rounded-full bg-[#1798D7] shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                            {n.message}
                                                        </p>
                                                        <p className="text-[10px] font-medium text-slate-400 mt-1.5">
                                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                    <ChevronRight size={14} className="text-slate-300 self-center shrink-0" />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* DASHBOARD PROFILE LINK */}
                        <NavLink
                            to="/dashboard"
                            className="relative group transition-transform active:scale-95"
                            title="Go to Dashboard"
                        >
                            <div className="h-9 w-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-500 group-hover:text-[#1798D7] group-hover:border-[#1798D7] shadow-sm transition-all duration-200">
                                <CircleUserRound className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                        </NavLink>
                    </div>
                )}
            </div>

            {/* ================= MOBILE MENU TOGGLE ================= */}
            <div className="md:hidden flex items-center">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-[#1798D7] transition-colors">
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* ================= MOBILE DROPDOWN MENU ================= */}
            {menuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-b shadow-lg md:hidden flex flex-col px-6 py-4 space-y-4">
                    <NavLink to={"/jobs"} onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-[#1798D7] font-medium transition-colors">Find Work</NavLink>
                    <NavLink to={"/freelancers"} onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-[#1798D7] font-medium transition-colors">Find Talent</NavLink>
                    <NavLink to={"/about"} onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-[#1798D7] font-medium transition-colors">About</NavLink>

                    <hr className="border-gray-100" />

                    {!isLoggedIn ? (
                        <Button as={NavLink} to="/login" onClick={() => setMenuOpen(false)} className="w-full justify-center">SignUp / Login</Button>
                    ) : (
                        <div className="flex flex-col space-y-3">
                            {renderActionButtons(true)}
                            <Button as={NavLink} to="/dashboard" onClick={() => setMenuOpen(false)} className="w-full justify-center bg-gray-800 text-white border-none">
                                Go to Dashboard
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}