import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Sparkles,
  CreditCard,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // Opens first FAQ by default

  // Category Quick Links
  const categories = [
    {
      title: "Job Management",
      desc: "Learn how to post, edit, and close project listings.",
      icon: Briefcase,
    },
    {
      title: "AI Match & Ranking",
      desc: "Understand how candidate scoring works.",
      icon: Sparkles,
    },
    {
      title: "Payments & Invoicing",
      desc: "Manage billing, GST details, and milestone escrows.",
      icon: CreditCard,
    },
    {
      title: "Security & Privacy",
      desc: "2FA, password resets, and role permissions.",
      icon: ShieldCheck,
    },
  ];

  // FAQ Items Data
  const faqs = [
    {
      question: "How do I post a new job?",
      answer:
        "Navigate to 'Jobs Management' from your dashboard sidebar and click the 'Post New Job' button. Fill out the job title, required skills, and budget details to publish.",
    },
    {
      question: "How does AI Candidate Ranking work?",
      answer:
        "Our AI algorithms analyze incoming freelancer proposals by matching their skill badges, past project ratings, and portfolio relevance against your specific job description.",
    },
    {
      question: "Can I switch between Individual and Company modes?",
      answer:
        "Yes! In 'Personal Details', you can toggle your Account Category between Individual/Solo Client and Registered Company. This dynamically adjusts your portal settings.",
    },
    {
      question: "Where can I manage tax invoices and GSTIN?",
      answer:
        "Go to 'Company Details' in your dashboard sidebar. There you can add or update your 15-digit GSTIN and registered billing address.",
    },
    {
      question: "What should I do if a password reset link expires?",
      answer:
        "You can request a new reset email anytime from the Security tab by clicking 'Reset Password', or reach out directly to our 24/7 support team.",
    },
  ];

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f2fcf6] text-[#141b2b] p-4 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-8 antialiased">
      {/* ================= HEADER & SEARCH ================= */}
      <header className="text-center max-w-2xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#09D66D]/10 text-[#09D66D] rounded-full text-xs font-semibold">
          <HelpCircle size={14} /> Help Center
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          How can we help you today?
        </h1>
        <p className="text-sm md:text-base text-gray-500">
          Search our knowledge base or explore popular topics below.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto pt-2">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for articles, guides, or questions..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#09D66D]/20 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-[#09D66D] outline-none transition-all"
          />
        </div>
      </header>

      {/* ================= QUICK CATEGORY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.title}
              className="bg-white p-5 rounded-xl border border-[#09D66D]/20 shadow-sm hover:border-[#09D66D]/60 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="p-2.5 bg-[#09D66D]/10 text-[#09D66D] rounded-lg w-fit mb-3 group-hover:bg-[#09D66D] group-hover:text-white transition-colors">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {cat.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {cat.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* ================= FAQ ACCORDION SECTION ================= */}
      <div className="bg-white border border-[#09D66D]/20 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#141b2b]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Quick answers to standard client workflow questions.
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between text-left font-semibold text-gray-900 text-sm hover:text-[#09D66D] transition-colors py-1 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-[#09D66D] flex-shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed pl-0 pr-6 animate-fadeIn">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-gray-500">
              No help articles found matching "{searchQuery}".
            </div>
          )}
        </div>
      </div>

      {/* ================= CONTACT SUPPORT BANNER ================= */}
      <div className="bg-gradient-to-r from-[#09D66D] to-[#4AB7B2] text-white p-6 md:p-8 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Still need assistance?</h3>
          <p className="text-xs md:text-sm text-emerald-50 mt-1">
            Our support team is available 24/7 to help resolve technical or billing inquiries.
          </p>
        </div>
        <button className="bg-white text-[#09D66D] hover:bg-emerald-50 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm cursor-pointer">
          <MessageSquare size={16} /> Contact Support
        </button>
      </div>
    </div>
  );
}