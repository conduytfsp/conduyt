import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    Menu, X, ArrowRightLeft, Plus, CircleUserRound,
    ArrowLeft, Bell, Sparkles, Briefcase, CheckCircle2, ChevronRight, LayoutDashboard
} from "lucide-react";
import Button from "./ui/Button.jsx";
import { useAppStore } from "@/store/useAppStore";
import { useAxiosInstance } from "@/config/axiosConfig";
import { formatDistanceToNow } from "date-fns";

import logoBlue from "@public/assets/Conduyt-blue.png";
import logoGreen from "@public/assets/Conduyt-green.png";

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

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

    const mode = useAppStore((state) => state.mode);
    const setMode = useAppStore((state) => state.setMode);

    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [availableProfiles, setAvailableProfiles] = useState("");

    const [notifications, setNotifications] = useState([]);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef(null);

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

    // SSE Connection Setup
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
            const token = getCookie("accessToken");
            const streamUrl = token
                ? `/backend_url/api/notifications/stream?token=${token}`
                : `/backend_url/api/notifications/stream`;

            eventSource = new EventSource(streamUrl, { withCredentials: true });

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

    const hasClient = availableProfiles.includes("CLIENT");
    const hasFreelancer = availableProfiles.includes("FREELANCER");
    const hasBothProfiles = hasClient && hasFreelancer;
    const currentLogo = mode === "client" ? logoGreen : logoBlue;

    // Modern pill styling for mode switching / user actions
    const switchBtnStyle = mode === "client"
        ? "text-[#00628e] bg-blue-50/80 border-blue-200/60 hover:bg-blue-100/80"
        : "text-[#06934A] bg-emerald-50/80 border-emerald-200/60 hover:bg-emerald-100/80";

    const handleModeChange = (targetMode, shouldRedirectToDashboard) => {
        setCookie("active_mode", targetMode, 7);
        if (setMode) setMode(targetMode);
        if (shouldRedirectToDashboard) navigate("/dashboard");
        setMenuOpen(false);
    };

    const renderActionButtons = (isMobile = false) => {
        const baseClass = isMobile
            ? "flex justify-center items-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm"
            : "flex items-center cursor-pointer px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-200 shadow-sm hover:shadow active:scale-95";

        if (hasBothProfiles) {
            const targetMode = mode === "freelancer" ? "client" : "freelancer";
            return (
                <button onClick={() => handleModeChange(targetMode, false)} className={`${baseClass} ${switchBtnStyle}`}>
                    <ArrowRightLeft className="w-3.5 h-3.5 mr-2" />
                    Switch to {mode === "freelancer" ? "Client" : "Freelancer"}
                </button>
            );
        }
        if (mode === "client" && !hasClient && hasFreelancer) {
            return (
                <button onClick={() => handleModeChange("freelancer", false)} className={`${baseClass} text-slate-600 bg-slate-100 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200`}>
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Cancel Setup
                </button>
            );
        }
        if (mode === "freelancer" && !hasFreelancer && hasClient) {
            return (
                <button onClick={() => handleModeChange("client", false)} className={`${baseClass} text-slate-600 bg-slate-100 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200`}>
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Cancel Setup
                </button>
            );
        }
        if (mode === "client" && hasClient && !hasFreelancer) {
            return (
                <button onClick={() => handleModeChange("freelancer", true)} className={`${baseClass} text-white bg-[#1798D7] border-transparent hover:bg-[#1280B8] shadow-blue-500/10`}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Join as Freelancer
                </button>
            );
        }
        if (mode === "freelancer" && hasFreelancer && !hasClient) {
            return (
                <button onClick={() => handleModeChange("client", true)} className={`${baseClass} text-white bg-[#09D66D] border-transparent hover:bg-[#07B85D] shadow-emerald-500/10`}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Join as Client
                </button>
            );
        }
        return null;
    };

    return (
        <nav className="flex items-center justify-between w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 px-4 md:px-8 h-18 transition-all">
            <div className="flex items-center">
                <NavLink to={"/"} className="focus:outline-none">
                    <img src={currentLogo} alt="Conduyt Logo" className="h-9 md:h-10 w-auto object-contain" />
                </NavLink>
            </div>

            <ul className="hidden md:flex gap-8 items-center font-semibold text-slate-600 text-sm">
                <li><NavLink to={"/jobs"} className={({isActive}) => isActive ? "text-[#1798D7]" : "hover:text-[#1798D7] transition-colors"}>Find Work</NavLink></li>
                <li><NavLink to={"/freelancers"} className={({isActive}) => isActive ? "text-[#1798D7]" : "hover:text-[#1798D7] transition-colors"}>Find Talent</NavLink></li>
                <li><NavLink to={"/about"} className={({isActive}) => isActive ? "text-[#1798D7]" : "hover:text-[#1798D7] transition-colors"}>About</NavLink></li>
            </ul>

            <div className="hidden md:flex items-center space-x-3">
                {!isLoggedIn ? (
                    <Button as={NavLink} to="/login" className="px-6 py-2 text-sm font-bold rounded-xl shadow-sm">SignUp / Login</Button>
                ) : (
                    <div className="flex items-center space-x-3">
                        {renderActionButtons(false)}

                        {/* Notifications Bell */}
                        <div className="relative" ref={notifRef}>
                            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer text-slate-600 border border-slate-200/60 shadow-xs bg-slate-50/50">
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>
                            {notifOpen && (
                                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
                                        <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                                        <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{unreadCount} unread</span>
                                    </div>
                                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-slate-400 text-xs font-medium">No notifications yet.</div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div key={n.id} onClick={() => handleNotificationClick(n)} className={`p-4 transition-colors cursor-pointer flex gap-3 items-start hover:bg-slate-50 ${!n.isRead ? "bg-blue-50/30" : "bg-white"}`}>
                                                    <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                                                        {getNotificationIcon(n.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className={`text-xs font-bold truncate ${!n.isRead ? "text-slate-900" : "text-slate-750"}`}>{n.title}</p>
                                                            {!n.isRead && <span className="h-2 w-2 rounded-full bg-[#1798D7] shrink-0" />}
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 mt-1.5">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                                                    </div>
                                                    <ChevronRight size={14} className="text-slate-300 self-center shrink-0" />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modernized User Profile Button */}
                        <NavLink
                            to="/dashboard"
                            className="group flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full border border-slate-200/80 bg-white hover:border-[#1798D7] hover:shadow-md transition-all duration-200 cursor-pointer"
                            title="Go to Dashboard"
                        >
                            <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-[#1798D7] transition-colors">
                                <CircleUserRound className="w-4 h-4" strokeWidth={2} />
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 group-hover:text-[#1798D7]">
                                <LayoutDashboard size={13} className="text-slate-400 group-hover:text-[#1798D7]" />
                                <span>Dashboard</span>
                            </div>
                        </NavLink>
                    </div>
                )}
            </div>

            <div className="md:hidden flex items-center">
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-slate-700 hover:text-[#1798D7] transition-colors rounded-xl bg-slate-50 border border-slate-200/60">
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {menuOpen && (
                <div className="absolute top-18 left-0 w-full bg-white border-b border-slate-200 shadow-xl md:hidden flex flex-col px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <NavLink to={"/jobs"} onClick={() => setMenuOpen(false)} className="block text-slate-700 hover:text-[#1798D7] font-semibold text-base transition-colors">Find Work</NavLink>
                    <NavLink to={"/freelancers"} onClick={() => setMenuOpen(false)} className="block text-slate-700 hover:text-[#1798D7] font-semibold text-base transition-colors">Find Talent</NavLink>
                    <NavLink to={"/about"} onClick={() => setMenuOpen(false)} className="block text-slate-700 hover:text-[#1798D7] font-semibold text-base transition-colors">About</NavLink>
                    <hr className="border-slate-100 my-2" />
                    {!isLoggedIn ? (
                        <Button as={NavLink} to="/login" onClick={() => setMenuOpen(false)} className="w-full justify-center py-3 rounded-xl">SignUp / Login</Button>
                    ) : (
                        <div className="flex flex-col space-y-3">
                            {renderActionButtons(true)}
                            <Button as={NavLink} to="/dashboard" onClick={() => setMenuOpen(false)} className="w-full justify-center bg-slate-900 text-white border-none py-3 rounded-xl">
                                Go to Dashboard
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}