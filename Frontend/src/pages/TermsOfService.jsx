import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/layout/footer.jsx";

export default function TermsOfService() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const lastUpdated = "August 1, 2026";
    const sections = ["Acceptance of Terms", "User Accounts", "Freelancer & Client Conduct", "Payments and Fees", "Termination"];

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex flex-col">
            <Navbar />

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 flex flex-col">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12 border-b border-slate-200 pb-10">
                        <div className="flex shrink-0 h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-[#1798D7] shadow-sm">
                            <ShieldCheck size={32} />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">Terms of Service</h1>
                            <p className="text-slate-500 font-medium">Last updated: {lastUpdated}</p>
                        </div>
                    </div>

                    {/* 2-Column Wide Layout */}
                    <div className="flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-10 items-start">

                        {/* Sticky Table of Contents */}
                        <aside className="hidden lg:block sticky top-24 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm w-full">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-3">Contents</h3>
                            <ul className="space-y-1">
                                {sections.map((section, idx) => (
                                    <li key={idx}>
                                        <a href={`#section-${idx + 1}`} className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#1798D7] hover:bg-blue-50 rounded-lg transition-colors group">
                                            {section} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        {/* Content Area */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm text-slate-600 space-y-10 leading-relaxed w-full min-w-0">
                            <section id="section-1">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                                <p>By accessing or using the Conduyt platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
                            </section>

                            <section id="section-2">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">2. User Accounts</h2>
                                <p className="mb-4">When you create an account with us, you must provide accurate, complete, and current information at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                    <li>You are responsible for safeguarding the password that you use to access the service.</li>
                                    <li>You agree not to disclose your password to any third party.</li>
                                    <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                                </ul>
                            </section>

                            <section id="section-3">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">3. Freelancer and Client Conduct</h2>
                                <p>Conduyt serves as a marketplace connecting freelancers and clients. We expect all users to communicate professionally. Harassment, discriminatory language, or attempting to circumvent the platform's payment systems will result in an immediate ban.</p>
                            </section>

                            <section id="section-4">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">4. Payments and Fees</h2>
                                <p>Clients agree to fund milestones or fixed-budget projects prior to work commencing. Freelancers will receive payment upon successful completion and client approval of the work. Conduyt reserves the right to charge service fees, which will be explicitly outlined during the proposal stage.</p>
                            </section>

                            <section id="section-5">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">5. Termination</h2>
                                <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
                            </section>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}