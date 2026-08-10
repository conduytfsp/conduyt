import React from 'react';
import { NavLink } from "react-router-dom";
import logo from "@public/assets/Conduyt-blue.png"; // Keep your logo path

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 w-full pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">

                {/* Main Footer Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">

                    {/* Col 1: Logo & Mission */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <img src={logo} alt="Conduyt Logo" className="w-32 object-contain" />
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Bridging the gap between ambitious businesses and elite technical talent through AI.
                        </p>
                    </div>

                    {/* Col 2: Marketplace */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Marketplace</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><NavLink to="/jobs" className="hover:text-[#09D66D]">Browse Jobs</NavLink></li>
                            <li><NavLink to="/freelancers" className="hover:text-[#09D66D]">Find Talent</NavLink></li>
                            <li><NavLink to="/how-it-works" className="hover:text-[#09D66D]">How it Works</NavLink></li>
                        </ul>
                    </div>

                    {/* Col 3: Company */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><NavLink to="/About" className="hover:text-[#1798D7]">About Us</NavLink></li>
                            <li><NavLink to="/Careers" className="hover:text-[#1798D7]">Careers</NavLink></li>
                            <li><NavLink to="/Contact" className="hover:text-[#1798D7]">Contact</NavLink></li>
                        </ul>
                    </div>

                    {/* Col 4: Resources */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><NavLink to="/Help" className="hover:text-[#1798D7]">Help Center</NavLink></li>
                            <li><NavLink to="/Privacy" className="hover:text-[#1798D7]">Privacy</NavLink></li>
                            <li><NavLink to="/Terms" className="hover:text-[#1798D7]">Terms</NavLink></li>
                        </ul>
                    </div>

                    {/* Col 5: Office Info */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Office</h4>
                        <address className="not-italic text-sm text-slate-500 space-y-2">
                            <p>123 Tech Park, Sector 5</p>
                            <p>Kolkata, WB 700091</p>
                            <p className="pt-2 font-semibold text-[#09D66D]">hello@conduyt.com</p>
                        </address>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                    <p>&copy; {new Date().getFullYear()} Conduyt Technologies. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-[#1798D7] cursor-pointer transition-colors">LinkedIn</span>
                        <span className="hover:text-[#1798D7] cursor-pointer transition-colors">Twitter</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}