import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Zap, Building, ShieldCheck } from 'lucide-react';
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
      <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex flex-col">
        <Navbar />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20 flex flex-col">

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                Empowering the modern <span className="text-[#1798D7]">workforce.</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
                Conduyt was built to remove the friction between world-class freelancers and the clients who need them. We use AI-driven matching to ensure the perfect fit, every time.
              </p>
            </motion.div>
          </div>

          {/* Origin / Story Section */}
          <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm mb-16 flex flex-col lg:flex-row gap-10 items-center"
          >
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#09D66D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Building size={14} /> Headquartered in Kolkata
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Built for a global scale.</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                What started as a vision to simplify technical hiring has grown into a powerful marketplace. We recognized that standard job boards were inefficient. By leveraging smart AI summaries, direct budget filtering, and skill tagging, Conduyt ensures that talent doesn't get lost in the noise.
              </p>
            </div>
            <div className="flex-1 w-full bg-slate-100 rounded-2xl h-[300px] flex items-center justify-center border border-slate-200 overflow-hidden relative">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1798D7] via-transparent to-transparent"></div>
              <Globe size={100} className="text-slate-300" strokeWidth={1} />
            </div>
          </motion.div>

          {/* Core Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 text-[#1798D7] flex items-center justify-center mx-auto mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community First</h3>
              <p className="text-slate-500 leading-relaxed text-sm">We prioritize the success and growth of our users, fostering a safe and professional environment for everyone.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-[#09D66D] flex items-center justify-center mx-auto mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Powered</h3>
              <p className="text-slate-500 leading-relaxed text-sm">Our platform uses intelligent matching algorithms to surface the best projects tailored specifically to your skills.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Total Transparency</h3>
              <p className="text-slate-500 leading-relaxed text-sm">No hidden fees, no obscured budgets. What you see is what you get, ensuring trust between clients and talent.</p>
            </motion.div>
          </div>

        </main>
        <Footer />
      </div>
  );
}