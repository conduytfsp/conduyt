import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, CreditCard, Settings, UserCheck, ChevronDown } from 'lucide-react';
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/layout/footer.jsx";

const FAQS = [
  {
    question: "How does the AI Compatibility Score work?",
    answer: "Our AI engine analyzes the required skills and description of a job post against your profile's skills, portfolio, and past experience to generate a match percentage. This helps both you and the client ensure a great fit."
  },
  {
    question: "When do I get paid for a completed project?",
    answer: "Payments are processed once the client approves the final milestone. Funds are securely held in escrow during the project and released to your configured payment method within 3-5 business days after approval."
  },
  {
    question: "How do I update my Freelancer profile?",
    answer: "Navigate to your Dashboard and click on the 'Profile' tab. From there, you can upload a new PDF resume, update your hourly rate, and add new skills or portfolio links."
  },
  {
    question: "Can I apply to jobs if my profile is incomplete?",
    answer: "We strongly recommend completing your profile first. Clients are significantly more likely to hire freelancers with a visible portfolio, uploaded resume, and verified skills."
  }
];

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
      <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex flex-col">
        <Navbar />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 flex flex-col">

          {/* Search Hero */}
          <div className="bg-[#1798D7] rounded-3xl p-10 md:p-16 text-center text-white mb-16 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">How can we help you?</h1>
              <div className="relative w-full text-slate-900">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                  <Search size={22} />
                </div>
                <input
                    type="text"
                    placeholder="Search for articles, guides, or FAQs..."
                    className="block w-full pl-14 pr-6 py-4 border-none rounded-2xl bg-white text-lg font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <HelpCategoryCard icon={Book} title="Getting Started" desc="Basics of using the platform." color="text-blue-500" bg="bg-blue-50" />
            <HelpCategoryCard icon={UserCheck} title="Account & Profile" desc="Manage your settings." color="text-emerald-500" bg="bg-emerald-50" />
            <HelpCategoryCard icon={CreditCard} title="Payments & Fees" desc="Billing and withdrawals." color="text-indigo-500" bg="bg-indigo-50" />
            <HelpCategoryCard icon={Settings} title="Troubleshooting" desc="Fix common account issues." color="text-rose-500" bg="bg-rose-50" />
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-colors hover:border-[#1798D7]/30">
                    <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                    >
                      <span className="font-bold text-slate-800 text-base">{faq.question}</span>
                      <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-[#1798D7]' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === idx && (
                          <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                          >
                            <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 mt-2">
                              {faq.answer}
                            </div>
                          </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
              ))}
            </div>
          </div>

        </main>
        <Footer />
      </div>
  );
}

function HelpCategoryCard({ icon: Icon, title, desc, color, bg }) {
  return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center group">
        <div className={`h-14 w-14 rounded-2xl ${bg} ${color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
  );
}