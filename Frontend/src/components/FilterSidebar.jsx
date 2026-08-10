import React from "react";
import { SlidersHorizontal } from "lucide-react";

export default function FilterSidebar({
                                          skills,
                                          draftFilters,
                                          updateDraftFilter,
                                          onApply,
                                          onClear
                                      }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-8 text-slate-900">
                <SlidersHorizontal size={20} className="text-[#1798D7]" />
                <h3 className="font-bold text-lg">Filters</h3>
            </div>

            {/* Skill Filter */}
            <div className="mb-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Required Skill</label>
                <select
                    value={draftFilters.selectedSkillId}
                    onChange={(e) => updateDraftFilter("selectedSkillId", e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1798D7] focus:ring-2 focus:ring-[#1798D7]/10 transition-all cursor-pointer appearance-none"
                >
                    <option value="">Any Skill</option>
                    {skills.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                            {skill.label || skill.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Budget Min/Max */}
            <div className="mb-6 grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Min Budget</label>
                    <input
                        type="number"
                        placeholder="₹ 0"
                        value={draftFilters.budgetMin}
                        onChange={(e) => updateDraftFilter("budgetMin", e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#09D66D] focus:ring-2 focus:ring-[#09D66D]/10 transition-all placeholder:text-slate-400"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Max Budget</label>
                    <input
                        type="number"
                        placeholder="₹ Max"
                        value={draftFilters.budgetMax}
                        onChange={(e) => updateDraftFilter("budgetMax", e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#09D66D] focus:ring-2 focus:ring-[#09D66D]/10 transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Sort Options */}
            <div className="mb-8">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Sort By</label>
                <select
                    value={draftFilters.sortBy}
                    onChange={(e) => updateDraftFilter("sortBy", e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-[#1798D7] focus:ring-2 focus:ring-[#1798D7]/10 transition-all cursor-pointer appearance-none"
                >
                    <option value="createdAt,desc">Newest Posted</option>
                    <option value="createdAt,asc">Oldest Posted</option>
                    <option value="fixedBudget,desc">Budget: High to Low</option>
                    <option value="fixedBudget,asc">Budget: Low to High</option>
                </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
                <button
                    onClick={onApply}
                    className="w-full bg-[#1798D7] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#1280B8] transition-colors shadow-sm cursor-pointer"
                >
                    Apply Filters
                </button>
                <button
                    onClick={onClear}
                    className="w-full text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                    Clear all
                </button>
            </div>
        </div>
    );
}