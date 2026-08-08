import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ArrowRightLeft, Plus, CircleUserRound, ArrowLeft } from "lucide-react";
import Button from "./ui/Button.jsx";

// Import both logos
import logoBlue from "@public/assets/Conduyt-blue.png";
import logoGreen from "@public/assets/Conduyt-green.png";

// Helper function to read our visible UI cookies
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

// Helper function to update the mode cookie globally
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

    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Profile State
    const [activeMode, setActiveMode] = useState(null);
    const [availableProfiles, setAvailableProfiles] = useState("");

    // Re-run this check whenever the route changes
    useEffect(() => {
        const profilesCookie = getCookie("available_profiles") || "";
        const modeCookie = getCookie("active_mode");

        if (profilesCookie) {
            setIsLoggedIn(true);
            setActiveMode(modeCookie);
            setAvailableProfiles(profilesCookie);
        } else {
            setIsLoggedIn(false);
        }
    }, [location]);

    // ================= BOOLEAN LOGIC STATES =================
    const hasClient = availableProfiles.includes("CLIENT");
    const hasFreelancer = availableProfiles.includes("FREELANCER");
    const hasBothProfiles = hasClient && hasFreelancer;

    // Determine current logo based on active mode
    const currentLogo = activeMode === "client" ? logoGreen : logoBlue;

    // Dynamic styling for the normal "Switch" button based on current mode
    const switchBtnStyle = activeMode === "client"
        ? "text-[#00628e] bg-[#1798D7]/10 border-[#1798D7]/20 hover:bg-[#1798D7]/20" // Blue Theme
        : "text-[#06934A] bg-[#09D66D]/10 border-[#09D66D]/20 hover:bg-[#09D66D]/20"; // Green Theme

    // ================= UNIFIED MODE CHANGER =================
    const handleTargetModeChange = (targetMode) => {
        setCookie("active_mode", targetMode, 7);
        setActiveMode(targetMode);

        window.dispatchEvent(new Event("modeChanged"));
        navigate("/dashboard");
        setMenuOpen(false);
    };

    // ================= RENDER HELPERS FOR BUTTONS =================
    const renderActionButtons = (isMobile = false) => {
        const baseClass = isMobile
            ? "flex justify-center items-center w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm"
            : "flex items-center cursor-pointer px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-300 shadow-sm hover:shadow active:scale-95";

        if (hasBothProfiles) {
            return (
                <button onClick={() => handleTargetModeChange(activeMode === "freelancer" ? "client" : "freelancer")} className={`${baseClass} ${switchBtnStyle}`}>
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Switch to {activeMode === "freelancer" ? "Client" : "Freelancer"}
                </button>
            );
        }

        if (activeMode === "client" && !hasClient && hasFreelancer) {
            return (
                <button onClick={() => handleTargetModeChange("freelancer")} className={`${baseClass} text-gray-600 bg-gray-100 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200`}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Cancel Setup
                </button>
            );
        }

        if (activeMode === "freelancer" && !hasFreelancer && hasClient) {
            return (
                <button onClick={() => handleTargetModeChange("client")} className={`${baseClass} text-gray-600 bg-gray-100 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200`}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Cancel Setup
                </button>
            );
        }

        if (activeMode === "client" && hasClient && !hasFreelancer) {
            return (
                <button onClick={() => handleTargetModeChange("freelancer")} className={`${baseClass} text-white bg-[#1798D7] border-transparent hover:bg-[#00628e]`}>
                    <Plus className="w-4 h-4 mr-1" /> Join as Freelancer
                </button>
            );
        }

        if (activeMode === "freelancer" && hasFreelancer && !hasClient) {
            return (
                <button onClick={() => handleTargetModeChange("client")} className={`${baseClass} text-white bg-[#09D66D] border-transparent hover:bg-[#06934A]`}>
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
                {/* Increased size from h-7 to h-10/h-11 for a much bolder look */}
                <img
                    src={currentLogo}
                    alt="Conduyt Logo"
                    className="h-10 md:h-11 w-auto object-contain"
                />
            </NavLink>
        </div>

        {/* ================= DESKTOP MENU ================= */}
        <ul className="hidden md:flex gap-8 items-center font-medium text-gray-700 text-sm">
            <li className="hover:text-[#1798D7] transition cursor-pointer">
                <NavLink to={"/FindWork"} className={({isActive}) => isActive ? "text-[#1798D7] font-semibold" : ""}>
                    Find Work
                </NavLink>
            </li>
            <li className="hover:text-[#1798D7] transition cursor-pointer">
                <NavLink to={"/AIFeatures"} className={({isActive}) => isActive ? "text-[#1798D7] font-semibold" : ""}>
                    AI Features
                </NavLink>
            </li>
            <li className="hover:text-[#1798D7] transition cursor-pointer">
                <NavLink to={"/About"} className={({isActive}) => isActive ? "text-[#1798D7] font-semibold" : ""}>
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
                <div className="flex items-center space-x-4">
                    {renderActionButtons(false)}

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
                <NavLink to={"/FindWork"} onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-[#1798D7] font-medium transition-colors">Find Work</NavLink>
                <NavLink to={"/AIFeatures"} onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-[#1798D7] font-medium transition-colors">AI Features</NavLink>
                <NavLink to={"/About"} onClick={() => setMenuOpen(false)} className="block text-gray-700 hover:text-[#1798D7] font-medium transition-colors">About</NavLink>

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