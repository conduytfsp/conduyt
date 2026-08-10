import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Briefcase, Users, ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

import FeaturedJobs from '../components/FeaturedJobs';
import FeaturedFreelancers from '../components/FeaturedFreelancers';

// Helper to read authentication cookies instantly
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Stock images for the auto-sliding hero banner
const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    tag: "Collaborative Engineering",
    title: "Empower Your Workflow, Build Exceptional Products",
    description: "Connect with high-caliber teams or find flexible contracts that match your exact technical expertise."
  },
  {
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80",
    tag: "AI-Driven Precision",
    title: "Intelligent Matching for Modern Enterprises",
    description: "Stop wasting time sorting through unqualified resumes. Let our algorithms pair projects with proven professionals instantly."
  },
  {
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80",
    tag: "Global Talent Network",
    title: "Scale Your Technical Capacity On Demand",
    description: "Whether you need specialized full-stack architecture or UI/UX design, find vetted talent ready to deliver."
  }
];

export default function LandingLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Check login state instantly via cookies on mount & location change
  useEffect(() => {
    const profilesCookie = getCookie("available_profiles");
    const tokenCookie = getCookie("accessToken");

    if (profilesCookie || tokenCookie) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Auto-sliding hero interval (Every 6 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
      <div className="min-h-screen flex flex-col font-sans antialiased bg-[#F8FAFC] text-slate-800">
        <Navbar />

        <main className="flex-grow flex flex-col items-center w-full">

          {/* ================= HERO SLIDER SECTION ================= */}
          <section className="relative w-full h-[550px] md:h-[650px] overflow-hidden bg-slate-900 flex items-center">
            {HERO_SLIDES.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                >
                  {/* Background Image with Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10"></div>
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover object-center" />

                  {/* Slide Content */}
                  <div className="absolute inset-0 z-20 flex items-center max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
                    <div className="max-w-2xl space-y-6 text-white">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-[#09D66D]">
                        <Sparkles size={14} /> {slide.tag}
                      </div>

                      <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
                        {slide.title}
                      </h1>

                      <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed max-w-lg">
                        {slide.description}
                      </p>

                      {/* Conditional Action Buttons based on instant cookie auth */}
                      <div className="pt-2 flex flex-wrap gap-4">
                        {!isLoggedIn ? (
                            <>
                              <NavLink
                                  to="/register"
                                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1798D7] text-white font-bold text-sm hover:bg-[#1280B8] shadow-lg transition-all active:scale-95 cursor-pointer"
                              >
                                <Briefcase size={18} /> I'm looking for work
                              </NavLink>
                              <NavLink
                                  to="/register"
                                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#09D66D] text-white font-bold text-sm hover:bg-[#07B85D] shadow-lg transition-all active:scale-95 cursor-pointer"
                              >
                                <Users size={18} /> I need to hire
                              </NavLink>
                            </>
                        ) : (
                            <NavLink
                                to="/dashboard"
                                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 shadow-lg transition-all active:scale-95 cursor-pointer"
                            >
                              Go to Dashboard <ArrowRight size={18} />
                            </NavLink>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            ))}

            {/* Slider Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all cursor-pointer"
                aria-label="Previous Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all cursor-pointer"
                aria-label="Next Slide"
            >
              <ChevronRight size={22} />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {HERO_SLIDES.map((_, idx) => (
                  <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${idx === currentSlide ? 'w-8 bg-[#09D66D]' : 'w-2 bg-white/50'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                  />
              ))}
            </div>
          </section>

          {/* ================= DYNAMIC FEATURED SECTIONS ================= */}
          <div className="w-full">
            <FeaturedFreelancers />
            <FeaturedJobs />
          </div>

          {/* ================= PLATFORM STATS BAR ================= */}
          <section className="w-full max-w-6xl mx-auto px-6 py-16">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 md:p-12">
              <div className="text-center max-w-xl mx-auto mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Trusted by Professionals Worldwide</h2>
                <p className="text-slate-500 text-sm mt-2">Built on transparency, speed, and absolute quality assurance.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-4 border-r border-slate-100 last:border-none">
                  <span className="text-3xl md:text-4xl font-black text-[#1798D7] block mb-1">100%</span>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Profiles</p>
                </div>
                <div className="p-4 border-r border-slate-100 last:border-none">
                  <span className="text-3xl md:text-4xl font-black text-[#09D66D] block mb-1">500+</span>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Successful Matches</p>
                </div>
                <div className="p-4 border-r border-slate-100 last:border-none">
                  <span className="text-3xl md:text-4xl font-black text-[#1798D7] block mb-1">&lt; 24h</span>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Hiring Time</p>
                </div>
                <div className="p-4">
                  <span className="text-3xl md:text-4xl font-black text-[#09D66D] block mb-1">24/7</span>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Security</p>
                </div>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
  );
}