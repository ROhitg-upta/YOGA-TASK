"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Code2,
  Palette,
  Film,
  Compass,
  FileText,
  Layers,
  Heart,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Quote,
  Shield,
  Zap,
  Award,
  Calendar,
  Clock,
  Menu,
  X,
  Users,
  Search,
  Volume2,
  VolumeX
} from "lucide-react";

// Curated high-res editorial imagery
const ASSETS = {
  heroBanner: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1600&auto=format&fit=crop", // Serene mindfulness & wellness space
  creativeStudio: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1000&auto=format&fit=crop", // Design and creative work
  techWorkspace: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop", // Modern code & development
  communityGathering: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop", // Yoga & meditation gathering
  teamLead1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  teamLead2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
  teamLead3: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
  wellnessPostMockup: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
};

// Marquee ticker items for perfectly seamless infinite looping
const TICKER_ITEMS = [
  "🌿 SYC Wellness Week • Registrations Active",
  "Task 1: Graphic Design (Instagram Post & Story)",
  "Task 2: Video Production (20–30s Cinematic Reel)",
  "Task 3: Technical (Recruitment Webpage & Source Code)",
  "Strict Branding: No Official Logos • Text 'SYC' Permitted",
  "Deadline: Wednesday, 11:59 PM",
  "Zero Burnout • 100% Mindful Collective",
  "Mentorship from Senior Builders & Designers",
];

export default function EditorialLandingPage() {
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // High-performance Lenis smooth scroll momentum setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Smooth anchor navigation handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -90, duration: 0.85 });
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Philosophy interactive steps
  const [activeStep, setActiveStep] = useState(0);
  const philosophySteps = [
    {
      num: "01",
      title: "Mindful Engineering & Deep Work",
      desc: "We cultivate deep focus and emotional equilibrium through breathwork and yogic discipline, helping engineers eliminate burnout and write world-class code with clarity.",
      img: ASSETS.creativeStudio,
      tag: "Focus & Flow State"
    },
    {
      num: "02",
      title: "Creative Storytelling & Visual Craft",
      desc: "Graphic designers, cinematographers, motion artists, and full-stack builders collaborate in unified pods, creating high-impact visual campaigns and digital experiences for campus culture.",
      img: ASSETS.techWorkspace,
      tag: "Cross-Disciplinary Pods"
    },
    {
      num: "03",
      title: "Campus Vitality & Community Leadership",
      desc: "From campus-wide wellness festivals and sunrise meditation retreats to competitive hackathons, we create experiences that elevate the consciousness and skill of every student.",
      img: ASSETS.communityGathering,
      tag: "Campus-Wide Impact"
    },
  ];

  // Core Domains / Departments (Directly matching Interview Tasks)
  const [activeDomainTab, setActiveDomainTab] = useState("all");
  const domains = [
    {
      id: "tech",
      name: "Technical & Web Engineering",
      role: "Full-Stack • Creative Development • Systems",
      icon: Code2,
      taskTag: "Task 3: Technical",
      desc: "Architect reactive web platforms, responsive recruitment portals, and internal productivity tools using modern web ecosystems.",
      taskBrief: "Create a simple, responsive SYC Recruitment Webpage / Landing Page featuring introduction, departments, why join, recruitment section, and basic animations.",
      skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js APIs"],
      deliverable: "Working Webpage + Source Code",
      applyLink: "/apply?domain=tech"
    },
    {
      id: "design",
      name: "Graphic Design & Visual Brand",
      role: "Brand Identity • Editorial Typography • Social Media",
      icon: Palette,
      taskTag: "Task 1: Graphic Design",
      desc: "Craft promotional posters, brand collateral, editorial zines, and high-fashion social campaigns for club initiatives with pristine typography.",
      taskBrief: "Create a promotional campaign for 'SYC Wellness Week': 1 Instagram Post (1080×1080 px) & 1 Instagram Story (1080×1920 px) with consistent visual identity and text-only SYC branding.",
      skills: ["Figma", "Photoshop", "Illustrator", "Typography", "Art Direction"],
      deliverable: "1 Post (1080×1080) & 1 Story (1080×1920)",
      applyLink: "/apply?domain=design"
    },
    {
      id: "video",
      name: "Video Production & Motion Narrative",
      role: "Cinematography • Storytelling • Dynamic Reels",
      icon: Film,
      taskTag: "Task 2: Video Editing",
      desc: "Film, edit, and color-grade cinematic short-form promotional reels, capturing the rhythm of student vitality, yoga retreats, and club events.",
      taskBrief: "Create a 20–30 second promotional Reel for SYC with proper cuts, transitions, captions, music/audio, color correction, and text-only SYC branding.",
      skills: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Sound Design", "Color Grading"],
      deliverable: "20–30s Final Promotional Reel",
      applyLink: "/apply?domain=video"
    },
    {
      id: "ops",
      name: "Events, Logistics & Wellness Ops",
      role: "Session Flow • Retreats • Community Relations",
      icon: Compass,
      taskTag: "Core Operations",
      desc: "Orchestrate large-scale campus wellness festivals, sunrise meditation sessions, stage management, audio logistics, and public relations.",
      taskBrief: "Plan and coordinate on-ground operations for SYC Wellness Week, including venue flow, participant seating, and speaker hospitality.",
      skills: ["Event Direction", "Stage Logistics", "Pranayama / Yoga", "Outreach", "Leadership"],
      deliverable: "Operations Plan & On-ground Leadership",
      applyLink: "/apply?domain=ops"
    },
    {
      id: "content",
      name: "Editorial & Content Strategy",
      role: "Mindful Storytelling • Copywriting • Campus Voice",
      icon: FileText,
      taskTag: "Editorial",
      desc: "Write editorial articles, social copy, newsletters, and mindful thought leadership content that articulates the club's philosophy.",
      taskBrief: "Draft compelling copy and storytelling narratives for the SYC Wellness Week promotional campaign and recruitment announcements.",
      skills: ["Copywriting", "Creative Writing", "Editorial Research", "Social Media Strategy"],
      deliverable: "Campaign Copy & Editorial Articles",
      applyLink: "/apply?domain=content"
    }
  ];

  // Team Leads Spotlight
  const teamMembers = [
    {
      name: "Devanshi Verma",
      wing: "Creative Direction & Design",
      bio: "Editorial graphic designer passionate about Swiss typography, branding systems, and serene visual storytelling.",
      image: ASSETS.teamLead1,
      badge: "Design Lead"
    },
    {
      name: "Arjun Rathore",
      wing: "Technical Architecture",
      bio: "Full-stack engineer crafting high-performance React ecosystems and spatial web interfaces.",
      image: ASSETS.teamLead2,
      badge: "Tech Lead"
    },
    {
      name: "Rhea Mukherjee",
      wing: "Video & Motion Narrative",
      bio: "Visual storyteller specializing in cinematic rhythm, sound design, and viral short-form campus media.",
      image: ASSETS.teamLead3,
      badge: "Media Lead"
    },
  ];

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    {
      q: "Who is eligible to apply for SYC Recruitment 2026–27?",
      a: "All 1st, 2nd, and 3rd-year students across all branches at ABES Engineering College are eligible to apply. No prior club membership is required. We evaluate based on your curiosity, enthusiasm, and completion of your domain's interview task."
    },
    {
      q: "What is the strict branding guideline for all task submissions?",
      a: "Important: Do NOT use the official SYC or ABES logo anywhere in your submission. You may use 'SYC' as text wherever required, but no official logos or crests should be included."
    },
    {
      q: "When is the interview task submission deadline?",
      a: "The deadline is Wednesday at 11:59 PM. You have 4 days to complete and submit your task alongside your regular college schedule."
    },
    {
      q: "Can I apply for more than one department?",
      a: "Yes! In the multi-page application portal, you can select your Primary Department (which your interview task corresponds to) and an optional Secondary Department of interest."
    },
    {
      q: "How does the selection process work after submitting?",
      a: "After you submit, our domain leads evaluate your task. Shortlisted candidates are invited for a friendly 10-minute interaction. You can check your application status anytime on our live tracking page."
    }
  ];

  const filteredDomains = activeDomainTab === "all"
    ? domains
    : domains.filter(d => d.id === activeDomainTab);

  const renderDepartmentCard = (dept: typeof domains[0]) => {
    const Icon = dept.icon;
    return (
      <div
        key={dept.id}
        className="editorial-card p-7 bg-white border border-[#E8E4DC] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 h-full"
      >
        <div className="space-y-4">
          {/* Top Icon & Tag */}
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF2EC] text-[#2D4A3E] flex items-center justify-center group-hover:bg-[#2D4A3E] group-hover:text-white transition-colors">
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[#F5F2EB] text-[#2D4A3E] border border-[#E8E4DC]">
              {dept.taskTag}
            </span>
          </div>

          {/* Department Title & Role */}
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#1C1D1A] group-hover:text-[#2D4A3E] transition-colors">
              {dept.name}
            </h3>
            <p className="text-xs font-medium text-[#787670] mt-1">
              {dept.role}
            </p>
          </div>

          <p className="text-xs text-[#52504A] leading-relaxed">
            {dept.desc}
          </p>

          {/* Official Interview Task Brief Box */}
          <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2D4A3E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interview Task Brief</span>
            </div>
            <p className="text-xs text-[#1C1D1A] leading-relaxed">
              {dept.taskBrief}
            </p>
            <div className="pt-1 text-[11px] text-[#787670]">
              <strong>Expected:</strong> {dept.deliverable}
            </div>
          </div>

          {/* Skills pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {dept.skills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-lg bg-[#F5F2EB] text-[10px] font-medium text-[#52504A]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Apply Action Link */}
        <div className="pt-6 mt-6 border-t border-[#E8E4DC]">
          <Link
            href={dept.applyLink}
            className="w-full py-3 rounded-full bg-[#1C1D1A] hover:bg-[#2D4A3E] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Apply for {dept.name.split(" ")[0]}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1D1A] font-sans selection:bg-[#2D4A3E] selection:text-[#F5F2EB]">
      {/* 1. FLOATING LUXURY PILL NAVBAR */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <header className="editorial-pill px-6 py-3 flex items-center justify-between w-full max-w-5xl pointer-events-auto shadow-lg shadow-[#1C1D1A]/5">
          {/* Stylized Typography Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#1C1D1A] group-hover:text-[#2D4A3E] transition-colors">
              SYC
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#787670] font-semibold pl-2 border-l border-[#E8E4DC]">
              Collective
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#52504A]">
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="hover:text-[#2D4A3E] transition-colors cursor-pointer"
            >
              Philosophy
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("domains")}
              className="hover:text-[#2D4A3E] transition-colors cursor-pointer"
            >
              Departments
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("why-join")}
              className="hover:text-[#2D4A3E] transition-colors cursor-pointer"
            >
              Why Join
            </button>
            <Link
              href="/experience"
              className="hover:text-[#2D4A3E] text-[#2D4A3E] font-bold transition-colors flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#D2E3D8]"
            >
              <span>3D Drum</span>
              <Sparkles className="w-3 h-3 text-[#2D4A3E]" />
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection("process")}
              className="hover:text-[#2D4A3E] transition-colors cursor-pointer"
            >
              Process
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("faq")}
              className="hover:text-[#2D4A3E] transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <Link href="/status" className="hover:text-[#2D4A3E] transition-colors text-[#2D4A3E] font-bold">
              Track Status
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/applications"
              className="text-[11px] font-semibold text-[#787670] hover:text-[#2D4A3E] transition-colors hidden lg:inline-block"
              title="Recruitment Lead Review Console"
            >
              Review Portal
            </Link>
            <Link
              href="/apply"
              className="px-5 py-2.5 rounded-full bg-[#1C1D1A] hover:bg-[#2D4A3E] text-[#FBF9F5] text-xs font-semibold tracking-wider transition-all duration-300 shadow-sm"
            >
              Apply Now ↗
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-[#1C1D1A] hover:bg-black/5 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-40 bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-[#E8E4DC] shadow-2xl md:hidden space-y-4"
          >
            <nav className="flex flex-col gap-3 text-sm font-semibold uppercase tracking-wider text-[#52504A]">
              <button
                type="button"
                onClick={() => scrollToSection("about")}
                className="text-left py-2 border-b border-[#E8E4DC] hover:text-[#2D4A3E] cursor-pointer"
              >
                Philosophy
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("domains")}
                className="text-left py-2 border-b border-[#E8E4DC] hover:text-[#2D4A3E] cursor-pointer"
              >
                Departments & Tasks
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("why-join")}
                className="text-left py-2 border-b border-[#E8E4DC] hover:text-[#2D4A3E] cursor-pointer"
              >
                Why Join SYC
              </button>
              <Link
                href="/experience"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#E8E4DC] text-[#2D4A3E] font-bold flex items-center justify-between"
              >
                <span>3D Spatial Drum Experience</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EAF2EC] text-[#2D4A3E]">
                  New
                </span>
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection("process")}
                className="text-left py-2 border-b border-[#E8E4DC] hover:text-[#2D4A3E] cursor-pointer"
              >
                Recruitment Process
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("faq")}
                className="text-left py-2 border-b border-[#E8E4DC] hover:text-[#2D4A3E] cursor-pointer"
              >
                FAQ
              </button>
              <Link
                href="/status"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#E8E4DC] text-[#2D4A3E] font-bold"
              >
                Track Application Status ↗
              </Link>
            </nav>
            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block text-center py-3 rounded-xl bg-[#2D4A3E] text-white text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Begin 5-Step Application
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO SECTION: FULL-PAGE CINEMATIC VIDEO HERO (NORMAL DOCUMENT FLOW) */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-[#141512] text-white pt-32 pb-10 px-6 sm:px-12 border-b border-[#2A2B27]">
        {/* Full-bleed background video positioned strictly inside this hero section (NOT fixed) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover object-center brightness-[0.72] contrast-[1.08]"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Luxury cinematic gradients for text readability and editorial atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141512] via-[#141512]/30 to-[#141512]/75" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(20,21,18,0.55)_100%)]" />
        </div>

        {/* Top Eyebrow Tag with High-Contrast Dark Backdrop */}
        <div className="relative z-10 flex justify-center mb-4">
          <div className="px-5 py-2 rounded-full flex items-center gap-2.5 text-xs font-semibold text-white bg-[#141512]/92 border border-white/25 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="tracking-wide">
              Student Yogic Club <span className="text-white/40">•</span> Tech &amp; Design Recruitment <span className="text-emerald-300 font-bold">Cohort 2026–27</span>
            </span>
          </div>
        </div>

        {/* Big Bold Editorial Headline & Central Action Group */}
        <div className="relative z-10 text-center max-w-5xl mx-auto my-auto space-y-6">
          <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[96px] font-normal leading-[0.96] tracking-tight text-white drop-shadow-lg">
            BALANCE <span className="font-sans text-4xl sm:text-6xl md:text-7xl text-white/40 font-light italic">//</span> INNOVATE <br />
            <em className="italic font-editorial text-[#A8D5BA]">Reconnect</em> WITH SYC
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-zinc-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
            A sanctuary where deep yogic vitality fuels high-craft code, cinematic motion, and impactful campus leadership.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/apply"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-[#F5F2EB] text-[#1C1D1A] font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-2xl inline-flex items-center justify-center gap-2 group"
            >
              <span>Begin Application</span>
              <ArrowRight className="w-4 h-4 text-[#2D4A3E] group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection("domains")}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-black/45 hover:bg-black/65 text-white backdrop-blur-md border border-white/25 font-semibold text-xs uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Explore Departments ↓</span>
            </button>
            <Link
              href="/status"
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 font-semibold text-xs uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Track Status</span>
            </Link>
          </div>
        </div>

        {/* Bottom Status & Community Bar */}
        <div className="relative z-10 w-full max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-300 border-t border-white/15">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img src={ASSETS.teamLead1} className="w-7 h-7 rounded-full border-2 border-[#1C1D1A] object-cover" alt="Member" />
              <img src={ASSETS.teamLead2} className="w-7 h-7 rounded-full border-2 border-[#1C1D1A] object-cover" alt="Member" />
              <img src={ASSETS.teamLead3} className="w-7 h-7 rounded-full border-2 border-[#1C1D1A] object-cover" alt="Member" />
            </div>
            <span className="font-semibold text-white">500+ Campus Yogis & Creators</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#D2E3D8] font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#A8D5BA]" />
              <span>Task Deadline: Wednesday 11:59 PM</span>
            </div>

            {/* Subtle Audio Mute/Unmute Toggle */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all pointer-events-auto cursor-pointer"
              title={isMuted ? "Unmute Video Audio" : "Mute Video Audio"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#A8D5BA]" />}
            </button>
          </div>
        </div>
      </section>

      {/* 2. INFINITE EDITORIAL MARQUEE TICKER (TRANSITION BANNER) */}
      <div className="border-y border-[#E8E4DC] bg-[#F5F2EB] py-3.5 overflow-hidden select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#52504A]">
          {TICKER_ITEMS.map((item, idx) => (
            <span key={`a-${idx}`} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="text-[#A8A49C]">•</span>
            </span>
          ))}
          {TICKER_ITEMS.map((item, idx) => (
            <span key={`b-${idx}`} className="flex items-center gap-8" aria-hidden="true">
              <span>{item}</span>
              <span className="text-[#A8A49C]">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. QUICK VALUE METRICS RIBBON (PERFECT BALANCED ALIGNMENT) */}
      <div className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm hover:shadow-md transition-shadow text-center">
            <p className="font-editorial text-4xl font-bold text-[#1C1D1A]">500+</p>
            <p className="text-xs text-[#787670] uppercase font-semibold tracking-wider mt-1.5">Active Campus Members</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm hover:shadow-md transition-shadow text-center">
            <p className="font-editorial text-4xl font-bold text-[#2D4A3E]">18+</p>
            <p className="text-xs text-[#787670] uppercase font-semibold tracking-wider mt-1.5">Flagship Summits & Retreats</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm hover:shadow-md transition-shadow text-center">
            <p className="font-editorial text-4xl font-bold text-[#1C1D1A]">100%</p>
            <p className="text-xs text-[#787670] uppercase font-semibold tracking-wider mt-1.5">Live Production Projects</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm hover:shadow-md transition-shadow text-center">
            <p className="font-editorial text-4xl font-bold text-[#2D4A3E]">Wed 11:59 PM</p>
            <p className="text-xs text-[#787670] uppercase font-semibold tracking-wider mt-1.5">Task Submission Deadline</p>
          </div>
        </div>
      </div>

      {/* 4. PHILOSOPHY & MINDFUL APPROACH */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Manifesto */}
          <div className="lg:col-span-5 space-y-6">
            <div className="editorial-pill px-3.5 py-1 inline-flex items-center gap-2 text-xs font-semibold text-[#2D4A3E]">
              <Compass className="w-3.5 h-3.5" />
              <span>The SYC Philosophy</span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl font-normal leading-tight text-[#1C1D1A]">
              A Mindful Space to Build & Grow
            </h2>
            <p className="text-base text-[#52504A] leading-relaxed font-light">
              Traditional college clubs create burnout and hyper-competitive silos. SYC redefines the paradigm: 
              we cultivate internal equilibrium through yogic discipline, enabling creators to build superior technical systems and breathtaking visual narratives with sustained joy.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/apply"
                className="px-6 py-3 rounded-full bg-[#1C1D1A] hover:bg-[#2D4A3E] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center gap-2"
              >
                <span>Join the Collective</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection("domains")}
                className="text-xs font-semibold uppercase tracking-wider text-[#52504A] hover:text-[#2D4A3E] transition-colors cursor-pointer"
              >
                View Departments ↓
              </button>
            </div>
          </div>

          {/* Right Column: 3-Step Interactive Pillar Reveal */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Step Selection List */}
            <div className="space-y-4">
              {philosophySteps.map((step, idx) => (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    activeStep === idx
                      ? "bg-[#F5F2EB] border-[#2D4A3E] shadow-sm ring-1 ring-[#2D4A3E]/20"
                      : "bg-white border-[#E8E4DC] hover:border-[#2D4A3E]/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#2D4A3E]">
                      {step.num}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#787670]">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="font-editorial text-lg font-bold text-[#1C1D1A] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#52504A] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Dynamic Step Image */}
            <div className="relative rounded-3xl overflow-hidden h-full min-h-[380px] border border-[#E8E4DC] shadow-lg bg-[#EAE6DD]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  src={philosophySteps[activeStep].img}
                  alt={philosophySteps[activeStep].title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1D1A]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#D2E3D8] font-bold">
                  Core Pillar {philosophySteps[activeStep].num}
                </span>
                <p className="text-sm font-editorial font-bold mt-0.5">
                  {philosophySteps[activeStep].title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEPARTMENTS / DOMAINS SECTION (COVERING TASKS 1, 2, 3) */}
      <section id="domains" className="py-24 px-6 bg-[#F5F2EB] border-y border-[#E8E4DC]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="editorial-pill px-3.5 py-1 inline-flex items-center gap-2 text-xs font-semibold text-[#2D4A3E] mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>Interview Task Guidelines & Domains</span>
              </div>
              <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#1C1D1A]">
                Departments Open for Recruitment
              </h2>
              <p className="text-sm text-[#52504A] mt-2 max-w-xl">
                Choose the department aligned with your passion. Complete <strong>ONLY</strong> the task assigned to your selected role.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                { id: "all", label: "All Wings" },
                { id: "tech", label: "💻 Technical (Task 3)" },
                { id: "design", label: "🎨 Graphic Design (Task 1)" },
                { id: "video", label: "🎬 Video (Task 2)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDomainTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeDomainTab === tab.id
                      ? "bg-[#1C1D1A] text-white shadow-sm"
                      : "bg-white border border-[#E8E4DC] text-[#52504A] hover:border-[#2D4A3E]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Department Cards Grid: Symmetrical & Balanced */}
          {activeDomainTab === "all" ? (
            <div className="space-y-6">
              {/* Row 1: The 3 Core Interview Task Domains */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {domains.slice(0, 3).map((dept) => renderDepartmentCard(dept))}
              </div>
              {/* Row 2: The 2 Core Foundation & Society Wings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {domains.slice(3, 5).map((dept) => renderDepartmentCard(dept))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDomains.map((dept) => renderDepartmentCard(dept))}
            </div>
          )}
        </div>
      </section>

      {/* 6. WHY JOIN SYC: 3D PERSPECTIVE DRUM & LUXURY BENTO */}
      <section id="why-join" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="editorial-pill px-3.5 py-1 inline-flex items-center gap-2 text-xs font-semibold text-[#2D4A3E]">
            <Award className="w-3.5 h-3.5" />
            <span>The SYC Experience • 3D Spatial Drum</span>
          </div>
          <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#1C1D1A]">
            Why Build Your College Journey With Us
          </h2>
          <p className="text-sm sm:text-base text-[#52504A]">
            Explore how mindful focus, high-craft engineering, and creative leadership converge across all SYC domains.
          </p>
        </div>

        {/* 3D DRUM EXPERIENCE DEDICATED LAUNCHER HERO BANNER */}
        <div className="w-full rounded-[32px] overflow-hidden border border-[#E8E4DC] bg-gradient-to-br from-[#1C1D1A] via-[#242621] to-[#141512] text-white p-8 sm:p-12 md:p-14 shadow-2xl relative mb-14">
          <div className="absolute inset-0 bg-[radial-gradient(#8FA89B_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.08] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-[#D2E3D8] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Scroll-Driven Spatial Showcase</span>
              </div>
              <h3 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-tight">
                Step Inside the <em className="text-[#8FA89B] italic font-serif">3D Perspective Drum</em>
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-xl">
                Experience all 8 foundational SYC pillars on our dedicated spatial 3D stage. Built with perspective geometry, inertia physics, and scroll-wheel mechanics that reveal deep narratives, deliverables, and recruitment tasks.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/experience"
                  className="editorial-button-light px-7 py-3 rounded-full text-xs font-semibold inline-flex items-center gap-2 group shadow-lg"
                >
                  <span>Launch 3D Drum Experience</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="/apply"
                  className="px-6 py-3 rounded-full text-xs font-semibold text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors inline-flex items-center gap-2"
                >
                  <span>Direct Application Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <div className="text-emerald-400 font-mono text-xl font-bold mb-1">08</div>
                <div className="text-xs font-semibold text-white">Curated Pillars</div>
                <div className="text-[11px] text-zinc-400 mt-1">Flow state, Next.js, Swiss typography & films.</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <div className="text-emerald-400 font-mono text-xl font-bold mb-1">360°</div>
                <div className="text-xs font-semibold text-white">Scroll Navigation</div>
                <div className="text-[11px] text-zinc-400 mt-1">Direct mousewheel & drag physics navigation.</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <div className="text-emerald-400 font-mono text-xl font-bold mb-1">100%</div>
                <div className="text-xs font-semibold text-white">Full Editorial Copy</div>
                <div className="text-[11px] text-zinc-400 mt-1">Comprehensive deliverables & skill breakdowns.</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <div className="text-emerald-400 font-mono text-xl font-bold mb-1">1-Click</div>
                <div className="text-xs font-semibold text-white">Domain Jump</div>
                <div className="text-[11px] text-zinc-400 mt-1">Seamless deep link into 5-step registration.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid: Balanced Heights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Large Editorial Dark Feature */}
          <div className="editorial-dark-card md:col-span-2 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group h-full">
            <div className="space-y-4 max-w-lg z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-white/10 text-[#D2E3D8] border border-white/10">
                Foundational Principle
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-normal text-white leading-tight">
                Zero Burnout. <br />
                <em className="text-[#8FA89B] italic font-serif">Unstoppable Flow State.</em>
              </h3>
              <p className="text-sm text-zinc-300 font-light leading-relaxed">
                Coding late into the night or designing high-stakes branding shouldn't leave you depleted. SYC members practice ancient breathwork and focus techniques that optimize cognitive stamina and mental tranquility.
              </p>
            </div>

            <div className="pt-8 z-10 flex items-center gap-6 text-xs text-zinc-400">
              <div>
                <strong className="text-white font-mono text-lg block">4.9 / 5.0</strong>
                <span>Member Vitality Index</span>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div>
                <strong className="text-white font-mono text-lg block">100%</strong>
                <span>Inclusive Community</span>
              </div>
            </div>

            {/* Ambient Background graphic */}
            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#2D4A3E]/30 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          </div>

          {/* Card 2: Hands-On Production */}
          <div className="editorial-card p-8 bg-white border border-[#E8E4DC] flex flex-col justify-between h-full">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] text-[#2D4A3E] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#1C1D1A]">
                Portfolio-Grade Projects
              </h3>
              <p className="text-xs text-[#52504A] leading-relaxed">
                No dummy exercises. You will build live platforms, launch multi-thousand-attendee campaigns, and direct cinematic festival reels that make your resume stand out in tech and design recruitment.
              </p>
            </div>
            <div className="pt-6 border-t border-[#E8E4DC]">
              <span className="text-[11px] font-semibold text-[#2D4A3E] uppercase tracking-wider">
                Production-Ready Experience
              </span>
            </div>
          </div>

          {/* Card 3: Mentorship & Alumni */}
          <div className="editorial-card p-8 bg-white border border-[#E8E4DC] flex flex-col justify-between h-full">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F2EB] text-[#1C1D1A] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#1C1D1A]">
                Senior Mentorship
              </h3>
              <p className="text-xs text-[#52504A] leading-relaxed">
                Work alongside passionate 3rd & 4th year seniors who have placed at top product firms and creative studios. Get code reviews, design critique, and resume feedback.
              </p>
            </div>
            <div className="pt-6 border-t border-[#E8E4DC]">
              <span className="text-[11px] font-semibold text-[#787670] uppercase tracking-wider">
                1-on-1 Guidance
              </span>
            </div>
          </div>

          {/* Card 4: Official Recognition & Retreats */}
          <div className="editorial-card md:col-span-2 p-8 bg-[#F5F2EB] border border-[#E8E4DC] flex flex-col sm:flex-row items-center justify-between gap-6 h-full">
            <div className="space-y-2">
              <div className="editorial-pill px-3 py-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2D4A3E]">
                <Shield className="w-3.5 h-3.5" />
                <span>Certification & Retreats</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1C1D1A]">
                Sunrise Retreats & Leadership Certificates
              </h3>
              <p className="text-xs text-[#52504A] max-w-md leading-relaxed">
                Attend exclusive outdoor weekend wellness jams, sunrise yoga sessions, and receive official club leadership credentials for your active contributions.
              </p>
            </div>
            <Link
              href="/apply"
              className="px-6 py-3.5 rounded-full bg-[#1C1D1A] hover:bg-[#2D4A3E] text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Apply for Cohort 2026–27</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. RECRUITMENT ROADMAP / 4-STAGE TIMELINE */}
      <section id="process" className="py-24 px-6 bg-white border-y border-[#E8E4DC]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">
              Step-by-Step Flow
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#1C1D1A]">
              Recruitment Process & Timeline
            </h2>
            <p className="text-sm text-[#52504A] max-w-md mx-auto">
              Transparent, relaxed, and designed to evaluate your creative problem solving.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                phase: "Phase 01",
                title: "Application & Task",
                desc: "Complete the 5-step registration form and submit your domain task link (Figma, GitHub, or Video Reel).",
                time: "Deadline: Wed 11:59 PM",
                badge: "Active Now",
                isCurrent: true,
              },
              {
                phase: "Phase 02",
                title: "Task Review",
                desc: "Our tech & design leads review your code structure, design typography, or video pacing against the task brief.",
                time: "Within 48 Hours",
                badge: "Upcoming",
                isCurrent: false,
              },
              {
                phase: "Phase 03",
                title: "1-on-1 Interaction",
                desc: "A relaxed 10-minute friendly conversation to understand your creative interests, passion, and mindful fit.",
                time: "SYC Student Hub / Google Meet",
                badge: "Upcoming",
                isCurrent: false,
              },
              {
                phase: "Phase 04",
                title: "Cohort Induction",
                desc: "Welcome to the family! Induction ceremony, orientation retreat, and allocation to live club pods.",
                time: "Next Week",
                badge: "Welcome",
                isCurrent: false,
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border transition-all h-full flex flex-col justify-between ${
                  step.isCurrent
                    ? "bg-[#F5F2EB] border-[#2D4A3E] ring-2 ring-[#2D4A3E]/20 shadow-md"
                    : "bg-[#FBF9F5] border-[#E8E4DC]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#2D4A3E]">
                      {step.phase}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                        step.isCurrent
                          ? "bg-[#2D4A3E] text-white"
                          : "bg-white border border-[#E8E4DC] text-[#787670]"
                      }`}
                    >
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[#1C1D1A] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#52504A] leading-relaxed mb-4">
                    {step.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E8E4DC] text-[11px] font-semibold text-[#787670] flex items-center gap-1.5 mt-auto">
                  <Clock className="w-3 h-3 text-[#2D4A3E]" />
                  <span>{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VOICES OF SYC / TESTIMONIALS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">
            Student Voices
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#1C1D1A]">
            Mentors & Creative Leads
          </h2>
          <p className="text-sm text-[#52504A]">
            Meet the students leading the intersection of engineering and design at SYC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="editorial-card p-6 bg-white border border-[#E8E4DC] space-y-4 hover:-translate-y-1 transition-all h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#E8E4DC]"
                  />
                  <div>
                    <h4 className="font-bold text-base text-[#1C1D1A]">{member.name}</h4>
                    <p className="text-xs text-[#2D4A3E] font-medium">{member.wing}</p>
                    <span className="inline-block mt-0.5 text-[10px] uppercase font-bold tracking-wider text-[#787670]">
                      {member.badge}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#52504A] leading-relaxed italic border-t border-[#E8E4DC] pt-4 mt-auto">
                "{member.bio}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. INTERACTIVE FAQ ACCORDION */}
      <section id="faq" className="py-24 px-6 bg-[#F5F2EB] border-t border-[#E8E4DC]">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D4A3E]">
              Got Questions?
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#1C1D1A]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#52504A]">
              Everything you need to know about joining SYC and the interview task.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="editorial-card overflow-hidden bg-white border border-[#E8E4DC]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#1C1D1A] hover:text-[#2D4A3E] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#787670] transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? "rotate-180 text-[#2D4A3E]" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5 text-xs text-[#52504A] leading-relaxed border-t border-[#E8E4DC] pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. RECRUITMENT CALL-TO-ACTION */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="editorial-dark-card p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-white/10 text-[#D2E3D8] border border-white/10">
              Applications Closing Wednesday 11:59 PM
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl font-normal text-white leading-tight">
              Ready to create something meaningful?
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
              Step into a community where your engineering skills and creative curiosity are celebrated. Submit your application in less than 5 minutes.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/apply"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-[#F5F2EB] text-[#1C1D1A] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xl inline-flex items-center justify-center gap-2"
              >
                <span>Begin 5-Step Application</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2D4A3E]" />
              </Link>
              <Link
                href="/status"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Track Application</span>
              </Link>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2D4A3E]/30 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 11. LUXURY EDITORIAL FOOTER */}
      <footer className="border-t border-[#E8E4DC] bg-[#F5F2EB] py-14 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
          {/* Brand Manifesto */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#1C1D1A]">
                SYC
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#787670] font-semibold pl-2 border-l border-[#E8E4DC]">
                Student Yogic Club
              </span>
            </div>
            <p className="text-[#52504A] max-w-md leading-relaxed">
              A student society cultivating mindful technologists, brand storytellers, and visionary campus leaders. Where ancient inner poise meets cutting-edge creative execution.
            </p>
            <p className="text-[11px] text-[#787670] pt-2">
              ⚠️ <strong>Strict Branding Compliance:</strong> Built exclusively with text-only "SYC" typography in strict accordance with the interview guidelines. No official SYC or ABES logos used.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-[#1C1D1A]">Recruitment Links</h4>
            <ul className="space-y-2 text-[#52504A]">
              <li>
                <Link href="/apply" className="hover:text-[#2D4A3E] transition-colors">
                  Multi-Page Application Portal
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-[#2D4A3E] transition-colors">
                  Track Application Status
                </Link>
              </li>
              <li>
                <Link href="/admin/applications" className="hover:text-[#2D4A3E] transition-colors">
                  Lead Evaluation Console
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("domains")}
                  className="hover:text-[#2D4A3E] transition-colors cursor-pointer text-left"
                >
                  Department Tasks (1, 2, 3)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Deadlines */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-[#1C1D1A]">Interview Deadline</h4>
            <p className="text-[#52504A] leading-relaxed">
              Wednesday, 11:59 PM <br />
              Candidate questions & updates will be shared via official WhatsApp groups and email.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#EAF2EC] text-[#2D4A3E] font-bold text-[11px]">
                Cohort &apos;26–&apos;27 Intake
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-[#E8E4DC] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#787670] gap-4">
          <p>© 2026–27 Student Yogic Club (SYC). All rights reserved.</p>
          <p>Designed with mindful precision for the Tech & Design Recruitment Task.</p>
        </div>
      </footer>

      {/* 12. FLOATING BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => lenisRef.current?.scrollTo(0, { duration: 0.85 })}
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#1C1D1A] text-white hover:bg-[#2D4A3E] shadow-2xl border border-white/20 transition-all flex items-center justify-center group cursor-pointer"
            title="Back to Top"
            aria-label="Back to Top"
          >
            <ArrowUpRight className="w-4 h-4 -rotate-45 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
