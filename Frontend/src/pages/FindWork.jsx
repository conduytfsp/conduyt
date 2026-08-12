import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useAxiosInstance } from "@/config/axiosConfig";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import JobList from "../components/JobList";
import toast from "react-hot-toast";

export default function FindWork() {
    const axios = useAxiosInstance();

    const DEFAULT_FILTERS = {
        searchQuery: "",
        selectedSkillId: "",
        budgetMin: "",
        budgetMax: "",
        sortBy: "createdAt,desc"
    };

    // 1. Draft State (Updates instantly as user types/selects, does NOT trigger API)
    const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);

    // 2. Applied State (Updates ONLY when user clicks "Apply Filters", triggers API)
    const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Reset pagination to page 1 ONLY when applied filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [appliedFilters]);

    // ================= FETCH SKILLS =================
    const { data: skills = [] } = useQuery({
        queryKey: ["skills"],
        queryFn: async () => {
            try {
                const res = await axios.get("/api/skills");
                return res.data?.data || res.data || [];
            } catch (err) {
                console.error("Failed to fetch skills:", err);
                return [];
            }
        },
        staleTime: 1000 * 60 * 30, // 30 mins
    });

    // ================= FETCH JOBS (Uses appliedFilters) =================
    const { data: pagedData, isLoading, isError } = useQuery({
        queryKey: ["jobs", "feed", appliedFilters, currentPage],
        queryFn: async () => {
            const params = {
                keyword: appliedFilters.searchQuery || undefined,
                skillIds: appliedFilters.selectedSkillId ? [appliedFilters.selectedSkillId] : undefined,
                minBudget: appliedFilters.budgetMin || undefined,
                maxBudget: appliedFilters.budgetMax || undefined,
                sort: appliedFilters.sortBy,
                page: currentPage - 1,
                size: pageSize
            };
            const res = await axios.get("/api/jobs/feed", { params });
            const responseData = res.data?.data || res.data;

            if (!responseData) {
                return { content: [], totalPages: 1, totalElements: 0 };
            }

            return {
                content: responseData.content || [],
                totalPages: responseData.totalPages || 1,
                totalElements: responseData.totalElements ?? (responseData.content?.length || 0)
            };
        },
        keepPreviousData: true,
    });

    // Action Handlers
    const applyFilters = () => {
        setAppliedFilters(draftFilters);
    };

    const clearFilters = () => {
        setDraftFilters(DEFAULT_FILTERS);
        setAppliedFilters(DEFAULT_FILTERS);
    };

    const updateDraftFilter = (key, value) => {
        setDraftFilters((prev) => ({ ...prev, [key]: value }));
    };

    const jobsList = pagedData?.content || [];
    const totalPages = pagedData?.totalPages || 1;
    const totalElements = pagedData?.totalElements ?? jobsList.length;

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex flex-col">
            <Navbar />

            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col">

                {/* TRUE CENTER ALIGNMENT: 3-Column Grid */}
                <div className="flex flex-col lg:grid lg:grid-cols-[280px_minmax(0,1fr)_280px] gap-x-10 gap-y-6 items-start w-full">

                    <div className="hidden lg:block"></div>

                    <div className="w-full">
                        <SearchBar
                            searchQuery={draftFilters.searchQuery}
                            onSearchChange={(val) => updateDraftFilter("searchQuery", val)}
                            onApply={applyFilters}
                        />
                    </div>

                    <div className="hidden lg:block"></div>

                    {/* Sidebar */}
                    <div className="w-full sticky top-24">
                        <FilterSidebar
                            skills={skills}
                            draftFilters={draftFilters}
                            updateDraftFilter={updateDraftFilter}
                            onApply={applyFilters}
                            onClear={clearFilters}
                        />
                    </div>

                    {/* Job List Feed with Loading State */}
                    <div className="w-full min-w-0 relative">
                        {isLoading && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-xs rounded-2xl min-h-[300px]">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="animate-spin text-[#1798D7]" size={36} />
                                    <p className="text-sm font-bold text-slate-600">Fetching jobs...</p>
                                </div>
                            </div>
                        )}

                        {isError ? (
                            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
                                <p className="text-rose-500 font-bold mb-2">Failed to load jobs feed.</p>
                                <p className="text-sm text-slate-500">Please check your network connection and try again.</p>
                            </div>
                        ) : (
                            <JobList
                                jobs={jobsList}
                                totalFilteredJobs={totalElements}
                                isLoading={isLoading}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                            />
                        )}
                    </div>

                    <div className="hidden lg:block"></div>

                </div>
            </main>

            <Footer />
        </div>
    );
}