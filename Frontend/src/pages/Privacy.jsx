import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ChevronRight } from 'lucide-react';
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/layout/footer.jsx";

export default function Privacy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const lastUpdated = "August 1, 2026";
    const sections = ["Information We Collect", "How We Use Your Data", "Data Sharing", "Data Security", "Your Rights"];

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex flex-col">
            <Navbar />

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 flex flex-col">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12 border-b border-slate-200 pb-10">
                        <div className="flex shrink-0 h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-[#09D66D] shadow-sm">
                            <Lock size={32} />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">Privacy Policy</h1>
                            <p className="text-slate-500 font-medium">Last updated: {lastUpdated}</p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-10 items-start">

                        <aside className="hidden lg:block sticky top-24 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm w-full">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-3">Contents</h3>
                            <ul className="space-y-1">
                                {sections.map((section, idx) => (
                                    <li key={idx}>
                                        <a href={`#section-${idx + 1}`} className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#09D66D] hover:bg-emerald-50 rounded-lg transition-colors group">
                                            {section} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm text-slate-600 space-y-10 leading-relaxed w-full min-w-0">
                            <section id="section-1">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                                <p className="mb-4">We collect information to provide better services to all our users. The types of information we collect include:</p>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                    <li><strong>Personal Data:</strong> Email address, first name, last name, phone number, and profile picture.</li>
                                    <li><strong>Professional Data:</strong> Resumes, portfolios, skills, and work history.</li>
                                    <li><strong>Usage Data:</strong> Information on how you access and use the platform (e.g., page visits).</li>
                                </ul>
                            </section>

                            <section id="section-2">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">2. How We Use Your Data</h2>
                                <p>We use the collected data to maintain and provide our Service, including generating AI compatibility scores between freelancers and client job postings, processing payments, and providing customer support. Your data helps us personalize your experience.</p>
                            </section>

                            <section id="section-3">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">3. Data Sharing and Disclosure</h2>
                                <p>We do not sell your personal data. We may share your information with trusted third-party service providers (such as payment processors or cloud storage providers like Cloudinary) strictly for the purpose of operating our platform. Freelancer profiles and job postings are visible to other registered users of the platform as intended by the marketplace functionality.</p>
                            </section>

                            <section id="section-4">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">4. Data Security</h2>
                                <p>The security of your data is important to us. We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or destruction. However, remember that no method of transmission over the Internet or electronic storage is 100% secure.</p>
                            </section>

                            <section id="section-5">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">5. Your Rights</h2>
                                <p>You have the right to access, update, or delete the information we have on you. You can manage your personal information directly within your account settings. If you require assistance with your data, please contact our support team.</p>
                            </section>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}