import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageSquare, Send } from 'lucide-react';
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/layout/footer.jsx";
import toast from 'react-hot-toast';

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate an API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Message sent! We'll get back to you soon.");
            e.target.reset();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex flex-col">
            <Navbar />

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col">

                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#1798D7] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 shadow-sm">
                        <MessageSquare size={14} /> Get in touch
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        We'd love to hear from you
                    </h1>
                    <p className="text-slate-500 text-base md:text-lg leading-relaxed">
                        Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

                    {/* Contact Form (Takes up 3 columns) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">First Name</label>
                                    <input required type="text" placeholder="Jane" className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1798D7] focus:ring-2 focus:ring-[#1798D7]/10 transition-all placeholder:text-slate-400" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Last Name</label>
                                    <input required type="text" placeholder="Doe" className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1798D7] focus:ring-2 focus:ring-[#1798D7]/10 transition-all placeholder:text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                                <input required type="email" placeholder="jane@example.com" className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1798D7] focus:ring-2 focus:ring-[#1798D7]/10 transition-all placeholder:text-slate-400" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message</label>
                                <textarea required rows="5" placeholder="How can we help you today?" className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1798D7] focus:ring-2 focus:ring-[#1798D7]/10 transition-all placeholder:text-slate-400 resize-none"></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-[#1798D7] text-white text-base font-bold py-3.5 rounded-xl hover:bg-[#1280B8] transition-colors shadow-sm disabled:opacity-70 cursor-pointer mt-2"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Info Sidebar (Takes up 2 columns) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Email Card */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1798D7] mb-5">
                                <Mail size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Email support</h3>
                            <p className="text-sm text-slate-500 mb-4">Our team typically responds within 24 hours.</p>
                            <a href="mailto:support@conduyt.com" className="text-[#1798D7] font-bold hover:underline">
                                support@conduyt.com
                            </a>
                        </div>

                        {/* Location Card */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#09D66D] mb-5">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Our Headquarters</h3>
                            <p className="text-sm text-slate-500 mb-4">Come visit us or send us a letter.</p>
                            <p className="text-slate-800 font-bold">
                                Kolkata, West Bengal<br />
                                India
                            </p>
                        </div>
                    </motion.div>

                </div>
            </main>

            <Footer />
        </div>
    );
}