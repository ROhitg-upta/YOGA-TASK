"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Code2,
  Palette,
  Film,
  Compass,
  Users,
  Award,
  Zap,
  Shield,
  Layers,
  MousePointer,
  RotateCw
} from "lucide-react";

// Curated 8 Rich SYC Pillars with Complete Editorial Details
const SYC_PILLARS: WorksWheelItem[] = [
  {
    title: "Zero Burnout & Flow State",
    subtitle: "Mindful Vitality & Sustained Creative Energy",
    wing: "Culture & Yogic Discipline",
    category: "Mindful Practice",
    domain: "",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
    href: "/apply",
    description:
      "Traditional college clubs encourage late-night panic sprints and exhausting silos that drain your mental energy. SYC transforms this paradigm: we ground technical engineering and high-stakes design in yogic breathwork, cognitive centering, and digital stillness. You learn to access peak flow state on demand, crafting better software and branding in two focused hours than fatigued peers do in all-nighters.",
    highlights: [
      "Guided 15-minute pranayama & focus sessions before hackathons",
      "Ergonomic, distraction-free creative pod workspaces",
      "Zero-stress culture: mental equilibrium valued above hurried deadlines",
      "Member Vitality Index consistently rated 4.9 / 5.0"
    ],
    skills: ["Pranayama Breathwork", "Deep Work Habituation", "Cognitive Stamina", "Mindful Pod Sprints"],
    deliverable: "Holistic balance, peak cognitive clarity, and sustained vitality across college semesters.",
  },
  {
    title: "Production Web Platforms",
    subtitle: "Enterprise Next.js Architecture & Spatial User Interfaces",
    wing: "Technical & Web Engineering",
    category: "Task 3: Technical",
    domain: "tech",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    href: "/apply?domain=tech",
    description:
      "Move beyond toy tutorials and generic todo-lists. In SYC's Technical Wing, you architect, deploy, and maintain live platforms that serve thousands of ABES students. From high-throughput recruitment platforms with atomic JSON backend stores to spatial 3D interactive drums and real-time candidate evaluation consoles, you build real software that tech recruiters respect.",
    highlights: [
      "Modern Next.js 15 App Router, TypeScript, and Tailwind CSS ecosystem",
      "Scalable REST API design, Zod schema validation, and atomic database persistence",
      "Spatial 3D web interfaces using Three.js, React Three Fiber, and hardware acceleration",
      "Git flow collaboration, code reviews, and CI/CD automated deployments"
    ],
    skills: ["Next.js 15", "TypeScript", "Tailwind CSS", "Node.js REST APIs", "Three.js", "Zod"],
    deliverable: "Complete working recruitment web portal with full source code & responsive design (Task 3).",
  },
  {
    title: "Editorial Brand Identity",
    subtitle: "Swiss Typography, Visual Systems & High-Fashion Collateral",
    wing: "Graphic Design & Visual Brand",
    category: "Task 1: Graphic Design",
    domain: "design",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1200&auto=format&fit=crop",
    href: "/apply?domain=design",
    description:
      "Visual design at SYC is treated as a discipline of pristine intention and restraint. Our designers craft luxury editorial zines, promotional event campaign suites, and high-impact social media assets adhering to strict typographic standards. You'll master Swiss layout grids, micro-typography, hierarchy, and editorial color theory under guidance from experienced design leads.",
    highlights: [
      "Full Figma design system creation with responsive auto-layout components",
      "1 Instagram Post (1080×1080) & 1 Instagram Story (1080×1920) for SYC Wellness Week",
      "Strict text-only 'SYC' typographic branding without generic college crests",
      "Portfolio reviews and direct feedback from senior design agency mentors"
    ],
    skills: ["Figma Systems", "Adobe Illustrator", "Photoshop", "Swiss Typography", "Art Direction"],
    deliverable: "Promotional campaign suite for 'SYC Wellness Week': 1 Square Post (1080×1080) & 1 Story (1080×1920).",
  },
  {
    title: "Cinematic Film & Dynamic Reels",
    subtitle: "Visual Storytelling, Soundscapes & Rhythm-Driven Editing",
    wing: "Video Production & Motion Narrative",
    category: "Task 2: Video Editing",
    domain: "video",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
    href: "/apply?domain=video",
    description:
      "Short-form cinematic motion is the primary voice of campus culture. SYC's Media Wing captures student vitality, sunrise retreats, and campus events with cinema-grade pacing. We teach you how to hook viewers in the first 2 seconds, edit to rhythmic music cuts, master sound design, and color grade serene and vibrant palettes that stand out on Instagram and YouTube.",
    highlights: [
      "20–30 second high-retention promotional reel for SYC recruitment",
      "Dynamic narrative pacing, seamless transitions, and synchronized audio beats",
      "Color grading, studio sound design, and clean typographic captions",
      "Production gear access: cinema bodies, gimbals, and wireless audio setups"
    ],
    skills: ["Premiere Pro", "DaVinci Resolve", "After Effects", "Sound Design", "Color Grading"],
    deliverable: "Final 20–30 second cinematic promotional Reel with audio cuts, color grading, and text branding.",
  },
  {
    title: "Sunrise Retreats & Outdoor Jams",
    subtitle: "Large-Scale Wellness Summits & Stage Management",
    wing: "Events, Logistics & Wellness Ops",
    category: "Operations Leadership",
    domain: "ops",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop",
    href: "/apply?domain=ops",
    description:
      "Behind every seamless summit, yoga retreat, and high-energy hackathon is SYC's Operations wing. Members orchestrate venue spatial layout, acoustic logistics, stage timing, guest speaker hospitality, and participant flow. You develop invaluable real-world project leadership, crisis resolution, and team coordination capabilities that corporate leadership programs look for.",
    highlights: [
      "End-to-end logistics coordination for 500+ participant campus festivals",
      "Stage management, live audio routing, and crowd experience flow",
      "Exclusive access to organize outdoor sunrise retreats and nature wellness jams",
      "Practical leadership training under seasoned club captains"
    ],
    skills: ["Event Direction", "Stage Logistics", "Pranayama / Yoga", "Crisis Management", "Public Relations"],
    deliverable: "Comprehensive operations blueprint & on-ground execution leadership for SYC Wellness Week.",
  },
  {
    title: "Senior Industry Mentorship",
    subtitle: "Direct 1-on-1 Guidance from Placed 3rd & 4th Year Seniors",
    wing: "Career & Personal Growth",
    category: "Mentorship Network",
    domain: "",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    href: "/apply",
    description:
      "Never navigate college or engineering recruitment alone. As an SYC member, you are paired with passionate 3rd and 4th year seniors who have placed at top product engineering firms, venture-backed startups, and premier creative studios. Get your resumes roasted, your code reviewed line-by-line, and participate in realistic mock technical and design interviews.",
    highlights: [
      "Weekly 1-on-1 portfolio, code, and design critique sessions",
      "Direct referrals to software internships and design freelance opportunities",
      "Off-campus hackathon team building and cross-college networking",
      "Lifelong alumni network spanning leading tech companies globally"
    ],
    skills: ["Portfolio Strategy", "System Design Reviews", "Interview Preparation", "Networking"],
    deliverable: "1-on-1 personalized mentorship roadmap and interview preparation for top product roles.",
  },
  {
    title: "Competitive Hackathons & Creative Pods",
    subtitle: "High-Energy Cross-Disciplinary Squads Competing Nationally",
    wing: "Technical & Innovation Pods",
    category: "Prototyping & Competitions",
    domain: "tech",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop",
    href: "/apply?domain=tech",
    description:
      "SYC forms handpicked, cross-functional squads—combining full-stack engineers, UI/UX designers, and video storytellers—to represent ABES in premier national hackathons and creative designathons. We provide the mentorship, brainstorming frameworks, and high-caffeine (or herbal green tea!) late-night workspace to ship winning prototypes under tight deadlines.",
    highlights: [
      "Cross-functional squads paired by complementary skillsets",
      "Rapid MVP prototyping, pitch deck storytelling, and live demo coaching",
      "History of top-3 podium finishes and cash prizes across regional hackathons",
      "All hackathon projects deployed live to portfolio-grade subdomains"
    ],
    skills: ["Rapid Prototyping", "Full-Stack MVPs", "Pitch Deck Design", "Team Problem Solving"],
    deliverable: "Live deployed hackathon prototype + pitch presentation deck under competitive sprint conditions.",
  },
  {
    title: "Official Leadership Credentials",
    subtitle: "Verified Society Honors, Advisor Recommendations & Badges",
    wing: "Certification & Society Honor",
    category: "Recognition & Portfolio",
    domain: "",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    href: "/apply",
    description:
      "Your creative contributions, technical architecture, and community leadership at SYC receive formal, verifiable recognition. Every active contributor receives official Society Leadership Certificates, personalized recommendation letters from faculty advisors, and distinguished cohort badges that substantiate your resume and LinkedIn credentials.",
    highlights: [
      "Official Society Leadership & Task Completion Credentials",
      "Verifiable Letters of Recommendation from faculty advisors and society heads",
      "Exclusive cohort induction pins and digital portfolio verification badges",
      "Permanent inclusion in the SYC Alumni Honor Registry"
    ],
    skills: ["Verified Leadership", "Recommendation Letters", "Society Credentials", "Alumni Status"],
    deliverable: "Official SYC Leadership Certificate & Advisor Recommendation Letter for Cohort 2026–27.",
  },
];

export default function ExperiencePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState<number | undefined>(undefined);

  const activePillar = SYC_PILLARS[activeIndex] || SYC_PILLARS[0];

  const handleSelectPillar = (idx: number) => {
    setActiveIndex(idx);
    setTargetIndex(idx);
  };

  const handleActiveChange = React.useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  // Global keyboard navigation for quick accessibility
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        handleSelectPillar((activeIndex + 1) % SYC_PILLARS.length);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        handleSelectPillar((activeIndex - 1 + SYC_PILLARS.length) % SYC_PILLARS.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1D1A] flex flex-col justify-between overflow-x-hidden select-none">
      {/* 1. TOP EDITORIAL NAVIGATION BAR */}
      <header className="w-full px-6 sm:px-10 py-5 flex items-center justify-between border-b border-[#E8E4DC] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="px-4 py-2 rounded-full border border-[#E8E4DC] hover:border-[#2D4A3E] hover:bg-[#F5F2EB] text-xs font-semibold text-[#52504A] hover:text-[#2D4A3E] transition-all flex items-center gap-2 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Landing Page</span>
          </Link>
          <div className="h-4 w-px bg-[#E8E4DC] hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="font-editorial text-xl font-bold tracking-tight text-[#1C1D1A]">
              SYC
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#787670] font-semibold pl-2 border-l border-[#E8E4DC]">
              3D Spatial Perspective Drum
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/status"
            className="text-xs font-semibold text-[#787670] hover:text-[#2D4A3E] transition-colors hidden md:inline-block px-3 py-1.5"
          >
            Track Status
          </Link>
          <Link
            href="/apply"
            className="px-5 py-2.5 rounded-full bg-[#1C1D1A] hover:bg-[#2D4A3E] text-[#FBF9F5] text-xs font-semibold tracking-wider transition-all duration-300 shadow-sm flex items-center gap-1.5"
          >
            <span>Apply Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 2. MAIN INTERACTIVE STAGE: SPLIT EDITORIAL CONSOLE + 3D PERSPECTIVE DRUM */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT COLUMN: DETAILED EDITORIAL CONSOLE (FLUID ANIMATION & PERFECT ALIGNMENT) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#1C1D1A]/5 space-y-6 relative overflow-hidden">
            {/* Top Eyebrow Badges */}
            <div className="flex items-center justify-between gap-2 border-b border-[#E8E4DC] pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2D4A3E] px-2.5 py-1 rounded-full bg-[#EAF2EC] border border-[#D2E3D8]">
                  0{activeIndex + 1} / 0{SYC_PILLARS.length}
                </span>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#787670]">
                  {activePillar.category}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#2D4A3E] bg-[#F5F2EB] px-3 py-1 rounded-full border border-[#E8E4DC]">
                {activePillar.wing}
              </span>
            </div>

            {/* Dynamic Pillar Details with Smooth Crossfade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-4"
              >
                <div>
                  <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1C1D1A] leading-tight">
                    {activePillar.title}
                  </h1>
                  {activePillar.subtitle && (
                    <p className="text-xs font-medium text-[#2D4A3E] mt-1">
                      {activePillar.subtitle}
                    </p>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#52504A] leading-relaxed font-light">
                  {activePillar.description}
                </p>

                {/* Key Highlights list */}
                {activePillar.highlights && (
                  <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8E4DC] space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#2D4A3E] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Key Pillar Impact & Highlights</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-[#52504A]">
                      {activePillar.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4A3E] mt-0.5 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Official Task Deliverable Requirement Notice */}
                {activePillar.deliverable && (
                  <div className="p-3.5 rounded-2xl bg-[#EAF2EC]/60 border border-[#D2E3D8] text-xs text-[#2D4A3E] space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2D4A3E]">
                      Official Evaluation Deliverable:
                    </span>
                    <p className="font-medium text-[11px] text-[#1C1D1A]">
                      {activePillar.deliverable}
                    </p>
                  </div>
                )}

                {/* Skills & Tools tags */}
                {activePillar.skills && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#787670]">
                      Relevant Skills & Frameworks
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePillar.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-[#F5F2EB] text-[10px] font-medium text-[#1C1D1A] border border-[#E8E4DC]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Direct Action Link for Active Domain */}
            <div className="pt-4 border-t border-[#E8E4DC] flex items-center gap-3">
              <Link
                href={activePillar.domain ? `/apply?domain=${activePillar.domain}` : "/apply"}
                className="flex-1 py-3 px-5 rounded-full bg-[#1C1D1A] hover:bg-[#2D4A3E] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Apply for this Role</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => handleSelectPillar((activeIndex - 1 + SYC_PILLARS.length) % SYC_PILLARS.length)}
                className="p-3 rounded-full bg-[#F5F2EB] hover:bg-[#EAF2EC] text-[#1C1D1A] hover:text-[#2D4A3E] border border-[#E8E4DC] transition-all cursor-pointer"
                title="Rotate to Previous Pillar"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleSelectPillar((activeIndex + 1) % SYC_PILLARS.length)}
                className="p-3 rounded-full bg-[#F5F2EB] hover:bg-[#EAF2EC] text-[#1C1D1A] hover:text-[#2D4A3E] border border-[#E8E4DC] transition-all cursor-pointer"
                title="Rotate to Next Pillar"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Domain Selector Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#787670]">
                Quick Jump to Pillar (Click to Rotate)
              </span>
              <span className="text-[10px] text-[#787670] font-mono hidden sm:inline">
                Use ↑ ↓ Keys
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SYC_PILLARS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPillar(idx)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    activeIndex === idx
                      ? "bg-[#2D4A3E] text-white border-[#2D4A3E] shadow-sm ring-1 ring-[#2D4A3E]"
                      : "bg-white border-[#E8E4DC] text-[#52504A] hover:border-[#2D4A3E]"
                  }`}
                >
                  <span className="block font-mono text-[10px] font-bold opacity-80">
                    0{idx + 1}
                  </span>
                  <span className="block text-[11px] font-semibold truncate">
                    {item.title.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D PERSPECTIVE DRUM (SCROLL-DRIVEN, HARDWARE ACCELERATED) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <div className="w-full h-[580px] sm:h-[680px] rounded-[36px] overflow-hidden border border-[#E8E4DC] bg-white shadow-2xl relative group">
            {/* Subtle luxury dot texture overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#2D4A3E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none z-10" />

            {/* WorksWheel with enableScroll={true}, globalScroll={true} and two-way sync */}
            <WorksWheel
              items={SYC_PILLARS}
              label="Why SYC // '26"
              action="Apply for Domain"
              enableScroll={true}
              globalScroll={true}
              initialIndex={0}
              hideSideDetails={true}
              targetIndex={targetIndex}
              onActiveChange={handleActiveChange}
              className="h-full bg-transparent"
            />

            {/* Floating Instructional Pill */}
            <div className="absolute bottom-5 left-6 z-20 hidden sm:flex items-center gap-2.5 text-xs text-[#52504A] bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#E8E4DC] shadow-md pointer-events-none">
              <MousePointer className="w-3.5 h-3.5 text-[#2D4A3E] animate-bounce" />
              <span>
                <strong>Scroll mouse wheel anywhere</strong> or drag vertically to rotate the 3D drum
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. LUXURY FOOTER TICKER & STATUS */}
      <footer className="w-full px-6 sm:px-10 py-4 border-t border-[#E8E4DC] bg-white text-xs text-[#787670] flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026–27 Student Yogic Club (SYC). 3D Spatial Drum Experience.</p>
        <div className="flex items-center gap-4">
          <span className="text-[#2D4A3E] font-semibold">
            Task Submission Deadline: Wednesday 11:59 PM
          </span>
          <span className="text-[#E8E4DC]">|</span>
          <Link href="/apply" className="hover:text-[#2D4A3E] font-semibold">
            Begin 5-Step Application ↗
          </Link>
        </div>
      </footer>
    </div>
  );
}
