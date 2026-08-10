import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "@/config/axiosConfig";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/layout/footer.jsx";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import JobList from "../components/JobList";

// ================= MOCK DATA FALLBACKS =================
const MOCK_SKILLS = [
    { id: 1, label: "React.js", name: "REACT" },
    { id: 2, label: "Spring Boot", name: "SPRING_BOOT" },
    { id: 3, label: "Java", name: "JAVA" },
    { id: 4, label: "PostgreSQL", name: "POSTGRESQL" },
    { id: 5, label: "Figma", name: "FIGMA" }
];

const MOCK_PAGED_JOBS = {
    content: [
        { id: 101, title: "Senior Spring Boot Backend Developer", clientName: "TechNova Solutions", clientType: "COMPANY", clientPfpUrl: "https://i.pravatar.cc/150?u=tech", fixedBudget: 85000.0, aiGenSummary: "Looking for an expert Java developer to refactor a monolithic billing system into scalable Spring Boot microservices.", requiredSkills: ["Java", "Spring Boot", "Microservices"], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
        { id: 102, title: "React.js Frontend Specialist (Dashboard)", clientName: "Rahul Sharma", clientType: "INDIVIDUAL", clientPfpUrl: "https://i.pravatar.cc/150?u=rahul", fixedBudget: 45000.0, aiGenSummary: "Need a clean, responsive SaaS dashboard built in React.js with Tailwind CSS.", requiredSkills: ["React.js", "Tailwind CSS", "Figma"], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
        { id: 103, title: "Full Stack Developer for E-Commerce App", clientName: "StyleCart Inc.", clientType: "COMPANY", clientPfpUrl: null, fixedBudget: 120000.0, aiGenSummary: "End-to-end development of a multi-vendor e-commerce platform.", requiredSkills: ["Java", "Spring Boot", "React.js"], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
        { id: 104, title: "PostgreSQL Database Administrator", clientName: "DataFlow Systems", clientType: "COMPANY", clientPfpUrl: "https://i.pravatar.cc/150?u=data", fixedBudget: 95000.0, aiGenSummary: "Require an experienced DBA to optimize slow-running queries.", requiredSkills: ["PostgreSQL", "Database Design"], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
    ],
    totalPages: 1,
    totalElements: 4
};

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
                return res.data?.data || res.data;
            } catch (err) {
                console.warn("Backend /api/skills offline. Serving mock data.");
                return MOCK_SKILLS;
            }
        },
        staleTime: 1000 * 60 * 30, // 30 mins
    });

    // ================= FETCH JOBS (Uses appliedFilters) =================
    const { data: pagedData, isLoading } = useQuery({
        queryKey: ["jobs", "feed", appliedFilters, currentPage],
        queryFn: async () => {
            try {
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
                return res.data?.data || res.data;
            } catch (err) {
                console.warn("Backend /api/jobs/feed offline. Serving mock data.");
                return MOCK_PAGED_JOBS;
            }
        },
        placeholderData: MOCK_PAGED_JOBS,
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
    const totalElements = pagedData?.totalElements || jobsList.length;

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

                    <div className="w-full min-w-0">
                        <JobList
                            jobs={jobsList}
                            totalFilteredJobs={totalElements}
                            isLoading={isLoading}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>

                    <div className="hidden lg:block"></div>

                </div>
            </main>

            <Footer />
        </div>
    );
}