import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, BadgeCheck } from "lucide-react";
import { useAxiosInstance } from "@/config/axiosConfig";

export default function FeaturedFreelancers() {
    const navigate = useNavigate();
    const axiosInstance = useAxiosInstance();
    const [freelancers, setFreelancers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFreelancers = async () => {
            try {
                const response = await axiosInstance.get("/api/freelancers/public/featured");
                setFreelancers(response.data || []);
            } catch (error) {
                console.error("Failed to fetch featured freelancers", error);
                setFreelancers([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFreelancers();
    }, [axiosInstance]);

    if (isLoading) return <div className="py-16 text-center">Loading talent...</div>;
    if (freelancers.length === 0) return null;

    return (
        <section className="py-16 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
                            Top Rated <span className="text-[#1798D7]">Talent</span>
                        </h2>
                        <p className="text-slate-500 font-medium max-w-xl">
                            Hire proven experts and highly-vetted professionals ready to tackle your projects.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/freelancers")}
                        className="flex items-center gap-2 text-[#1798D7] font-bold hover:text-[#1280B8] transition-colors group whitespace-nowrap cursor-pointer"
                    >
                        Explore all talent
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {freelancers.map((freelancer) => (
                        <div key={freelancer.id} className="group bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-center flex flex-col items-center">
                            <div className="relative mb-5">
                                <div className="w-24 h-24 rounded-full bg-blue-50 border-2 border-blue-100 p-1 flex items-center justify-center overflow-hidden">
                                    {freelancer.pfpUrl ? (
                                        <img src={freelancer.pfpUrl} alt={freelancer.displayName} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-black text-[#1798D7]">{freelancer.displayName?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
                                    <BadgeCheck size={24} className="text-[#1798D7] fill-blue-50" />
                                </div>
                            </div>

                            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#1798D7] transition-colors line-clamp-1">{freelancer.displayName}</h3>
                            <p className="text-sm font-bold text-slate-500 mt-1 mb-4 line-clamp-1">{freelancer.title}</p>

                            <div className="flex items-center gap-4 text-xs font-bold text-slate-700 mb-6 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                <span>{freelancer.totalJobsDone || 0} jobs done</span>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 mb-6 w-full">
                                {(freelancer.skills || []).slice(0, 3).map((skill, idx) => (
                                    <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg text-xs font-bold">{skill}</span>
                                ))}
                            </div>

                            <button
                                onClick={() => navigate(`/freelancer/${freelancer.slug}`)}
                                className="w-full mt-auto py-3 rounded-xl font-bold text-[#1798D7] bg-white border-2 border-slate-100 group-hover:border-[#1798D7] group-hover:bg-[#1798D7] group-hover:text-white transition-all cursor-pointer"
                            >
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}