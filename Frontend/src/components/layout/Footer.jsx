import React from 'react';
import { NavLink } from "react-router-dom";
import logo from "../../../public/assets/Conduyt-blue.png";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 w-full mt-auto shrink-0">
            {/*
              Widened to max-w-[1440px] to perfectly align with the new expansive feed layouts.
            */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">

                {/* Top Section: Logo & Navigation */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">

                    {/* Brand/Logo Area */}
                    <div className="flex flex-col items-center md:items-start">
                        <img
                            src={logo}
                            alt="Conduyt Logo"
                            className="w-32 object-contain mb-4"
                        />
                        <p className="text-slate-500 text-sm text-center md:text-left max-w-xs leading-relaxed">
                            Empowering top freelance talent and innovative clients to build incredible projects together.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <nav className="mt-4 md:mt-0">
                        <ul className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm font-semibold text-slate-600">
                            <li>
                                <NavLink
                                    to="/About"
                                    className="hover:text-[#1798D7] transition-colors"
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/Help"
                                    className="hover:text-[#1798D7] transition-colors"
                                >
                                    Help
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/Contact"
                                    className="hover:text-[#1798D7] transition-colors"
                                >
                                    Contact
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/TermsofService"
                                    className="hover:text-[#1798D7] transition-colors"
                                >
                                    Terms of Service
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/Privacy"
                                    className="hover:text-[#1798D7] transition-colors"
                                >
                                    Privacy Policy
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Bottom Section: Copyright Line */}
                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} Conduyt. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
                        <span>Made with precision</span>
                        {/* You can add social media icons (Twitter, LinkedIn, etc.) here later! */}
                    </div>
                </div>

            </div>
        </footer>
    );
}