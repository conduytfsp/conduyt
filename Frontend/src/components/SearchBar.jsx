import React from "react";
import { Search, Sparkles } from "lucide-react";

export default function SearchBar({ searchQuery, onSearchChange, onApply }) {

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onApply();
        }
    };

    return (
        <div className="text-center w-full flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100/50 text-slate-700 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 shadow-sm">
                <Sparkles size={14} className="text-[#09D66D]" /> Discover <span className="text-[#1798D7]">Opportunities</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                Find your next big project
            </h1>

            <p className="text-slate-500 text-[15px] md:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
                Discover verified freelance projects from trusted clients. Search by keywords, skills, or specific companies to find the perfect fit.
            </p>

            <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1798D7] transition-colors">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search by job title, keyword, or client... (Press Enter to search)"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="block w-full pl-12 pr-6 py-4 border border-slate-200 rounded-2xl bg-white text-slate-900 text-base font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#1798D7] focus:ring-4 focus:ring-[#1798D7]/10 transition-all shadow-sm"
                />
            </div>
        </div>
    );
}