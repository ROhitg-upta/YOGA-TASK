"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Code2,
  Palette,
  Film,
  Compass,
  FileText,
  User,
  GraduationCap,
  Briefcase,
  HelpCircle,
  ShieldCheck,
  Send,
  Loader2,
  AlertCircle,
  ExternalLink,
  GitBranch,
  Link2,
  Clock,
  Heart,
  ChevronRight
} from "lucide-react";

interface ApplicationFormData {
  // Step 1: Personal & Academic Profile
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  branch: string;
  year: string;
  hostelStatus: string;

  // Step 2: Department & Role
  primaryDepartment: string;
  secondaryDepartment: string;
  skillLevel: string;
  skills: string[];

  // Step 3: Interview Task Submission
  taskCompleted: boolean;
  githubUrl: string;
  liveUrl: string;
  figmaDriveUrl: string;
  videoDriveUrl: string;
  taskNotes: string;

  // Step 4: Mindful SOP
  whyJoin: string;
  mindfulPerspective: string;
  initiativeIdea: string;
  timeCommitment: string;

  // Step 5: Agreement
  agreedToConduct: boolean;
}

const INITIAL_FORM: ApplicationFormData = {
  fullName: "",
  email: "",
  phone: "",
  rollNumber: "",
  branch: "Computer Science & Engineering",
  year: "1st Year",
  hostelStatus: "Day Scholar",
  primaryDepartment: "tech",
  secondaryDepartment: "none",
  skillLevel: "Intermediate",
  skills: [],
  taskCompleted: true,
  githubUrl: "",
  liveUrl: "",
  figmaDriveUrl: "",
  videoDriveUrl: "",
  taskNotes: "",
  whyJoin: "",
  mindfulPerspective: "",
  initiativeIdea: "",
  timeCommitment: "6-8 hours/week",
  agreedToConduct: false,
};

const DEPARTMENTS = [
  {
    id: "tech",
    name: "Technical & Web Engineering",
    role: "Full-Stack • Creative Dev • System Tools",
    icon: Code2,
    taskTitle: "Task 3: SYC Recruitment Webpage",
    taskDesc: "Build and submit a responsive SYC Recruitment Webpage / Landing Page with clean code, responsive layout & interactions.",
    requiredFields: ["githubUrl"],
    toolsList: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Three.js", "Git"],
    badge: "Task 3"
  },
  {
    id: "design",
    name: "Graphic Design & Visual Brand",
    role: "Editorial • Visual Identity • Typography",
    icon: Palette,
    taskTitle: "Task 1: SYC Wellness Week Campaign",
    taskDesc: "Design 1 Instagram Post (1080×1080 px) & 1 Instagram Story (1080×1920 px) with consistent visual identity. (Text-only SYC branding).",
    requiredFields: ["figmaDriveUrl"],
    toolsList: ["Figma", "Photoshop", "Illustrator", "Canva Pro", "Typography", "Color Theory"],
    badge: "Task 1"
  },
  {
    id: "video",
    name: "Video Production & Motion",
    role: "Cinematography • Storytelling • Dynamic Reels",
    icon: Film,
    taskTitle: "Task 2: Promotional Reel (20–30s)",
    taskDesc: "Create a 20–30 second promotional Reel for SYC with proper cuts, music, captions, basic color grading, and text branding.",
    requiredFields: ["videoDriveUrl"],
    toolsList: ["Premiere Pro", "DaVinci Resolve", "After Effects", "CapCut Pro", "Sound Design"],
    badge: "Task 2"
  },
  {
    id: "ops",
    name: "Operations & Campus Wellness",
    role: "Event Logistics • Retreats • Community Flow",
    icon: Compass,
    taskTitle: "Event & Logistics Management",
    taskDesc: "Coordinate large-scale campus wellness festivals, sunrise meditation sessions, stage management, and public relations.",
    requiredFields: [],
    toolsList: ["Event Planning", "Stage Direction", "Pranayama / Yoga", "Team Leadership", "Operations"],
    badge: "Core Wing"
  },
  {
    id: "content",
    name: "Editorial & Content Strategy",
    role: "Mindful Storytelling • Copywriting • Socials",
    icon: FileText,
    taskTitle: "Editorial & Content Portfolio",
    taskDesc: "Write editorial articles, social copy, newsletters, and mindful thought leadership content for club channels.",
    requiredFields: ["figmaDriveUrl"],
    toolsList: ["Copywriting", "Creative Writing", "Editorial Research", "Social Media Strategy", "Content Curation"],
    badge: "Editorial"
  }
];

function ApplyFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Pre-select domain from query parameter if provided (e.g. /apply?domain=design)
  useEffect(() => {
    const domainQuery = searchParams.get("domain");
    if (domainQuery && DEPARTMENTS.some(d => d.id === domainQuery)) {
      setFormData(prev => ({ ...prev, primaryDepartment: domainQuery }));
    }
  }, [searchParams]);

  const updateField = (field: keyof ApplicationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => {
      const exists = prev.skills.includes(skill);
      const nextSkills = exists
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: nextSkills };
    });
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Please enter your full name.";
      if (!formData.email.trim()) {
        newErrors.email = "College / personal email is required.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Contact / WhatsApp number is required.";
      } else if (formData.phone.replace(/\D/g, "").length < 10) {
        newErrors.phone = "Please enter a valid 10-digit phone number.";
      }
      if (!formData.rollNumber.trim()) newErrors.rollNumber = "Roll number or Student ID is required.";
      if (!formData.branch.trim()) newErrors.branch = "Please specify your branch.";
    }

    if (step === 2) {
      if (!formData.primaryDepartment) newErrors.primaryDepartment = "Please choose a primary department.";
    }

    if (step === 3) {
      // If task is declared as completed now, validate links according to role
      if (formData.taskCompleted) {
        if (formData.primaryDepartment === "tech" && !formData.githubUrl.trim() && !formData.liveUrl.trim()) {
          newErrors.githubUrl = "Please provide your GitHub repo or Live URL for Task 3.";
        }
        if (formData.primaryDepartment === "design" && !formData.figmaDriveUrl.trim()) {
          newErrors.figmaDriveUrl = "Please provide your Google Drive or Figma link for Task 1.";
        }
        if (formData.primaryDepartment === "video" && !formData.videoDriveUrl.trim()) {
          newErrors.videoDriveUrl = "Please provide your Google Drive or video link for Task 2.";
        }
      }
    }

    if (step === 4) {
      if (!formData.whyJoin.trim() || formData.whyJoin.trim().length < 20) {
        newErrors.whyJoin = "Please share a brief statement (at least 20 characters) on why you'd like to join SYC.";
      }
    }

    if (step === 5) {
      if (!formData.agreedToConduct) {
        newErrors.agreedToConduct = "Please check the box to confirm adherence to the SYC culture and branding guidelines.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        rollNumber: formData.rollNumber,
        branch: formData.branch,
        year: formData.year,
        hostelStatus: formData.hostelStatus,
        primaryDepartment: formData.primaryDepartment,
        secondaryDepartment: formData.secondaryDepartment,
        skillLevel: formData.skillLevel,
        skills: formData.skills,
        taskDetails: {
          taskType: DEPARTMENTS.find(d => d.id === formData.primaryDepartment)?.taskTitle || "Interview Task",
          githubUrl: formData.githubUrl,
          liveUrl: formData.liveUrl,
          figmaDriveUrl: formData.figmaDriveUrl,
          videoDriveUrl: formData.videoDriveUrl,
          notes: formData.taskNotes,
        },
        whyJoin: formData.whyJoin,
        mindfulPerspective: formData.mindfulPerspective,
        initiativeIdea: formData.initiativeIdea,
        timeCommitment: formData.timeCommitment,
      };

      const res = await fetch("/api/recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit application");
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#2D4A3E", "#1C1D1A", "#8FA89B", "#F5F2EB", "#406352"]
        });
      } catch {}

      // Redirect to official success & admission pass slip
      router.push(`/apply/success?id=${data.applicationId}`);
    } catch (err: any) {
      setServerError(err.message || "An error occurred while transmitting your application.");
      setIsSubmitting(false);
    }
  };

  const selectedDeptObj = DEPARTMENTS.find(d => d.id === formData.primaryDepartment) || DEPARTMENTS[0];

  const stepsMeta = [
    { num: 1, title: "Identity", subtitle: "Academic Profile" },
    { num: 2, title: "Domain", subtitle: "Department & Role" },
    { num: 3, title: "Task Submission", subtitle: "Portfolio / Work" },
    { num: 4, title: "Philosophy", subtitle: "Mindful Statement" },
    { num: 5, title: "Verification", subtitle: "Review & Sign" },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1D1A] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Top Header / Back Navigation */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#E8E4DC]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#52504A] hover:text-[#2D4A3E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Overview</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#1C1D1A]">
              SYC
            </span>
            <span className="text-[11px] uppercase tracking-widest text-[#787670] font-semibold pl-2 border-l border-[#E8E4DC]">
              Recruitment 2026–27
            </span>
          </div>

          <Link
            href="/status"
            className="text-xs font-semibold text-[#2D4A3E] hover:underline hidden sm:inline-flex items-center gap-1"
          >
            <span>Track Existing</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-10">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-4">
            {stepsMeta.map((step) => {
              const isPassed = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    // Allow clicking back to completed steps
                    if (step.num < currentStep) setCurrentStep(step.num);
                  }}
                  disabled={step.num > currentStep}
                  className={`text-left transition-all ${step.num > currentStep ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        isPassed
                          ? "bg-[#2D4A3E] text-white"
                          : isCurrent
                          ? "bg-[#1C1D1A] text-[#FBF9F5] ring-4 ring-[#2D4A3E]/10"
                          : "bg-[#EAE6DD] text-[#787670]"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                    </span>
                    <span className="text-xs font-bold hidden sm:inline text-[#1C1D1A]">
                      {step.title}
                    </span>
                  </div>
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      isPassed || isCurrent ? "bg-[#2D4A3E]" : "bg-[#E8E4DC]"
                    }`}
                  />
                  <p className="text-[10px] text-[#787670] mt-1 hidden sm:block truncate">
                    {step.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Application Container */}
        <div className="editorial-card p-6 sm:p-10 md:p-12 bg-white relative overflow-hidden shadow-xl border border-[#E8E4DC]">
          {/* Ambient subtle corner glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#EAF2EC]/40 rounded-full blur-3xl pointer-events-none" />

          {/* Form Step Content */}
          <AnimatePresence mode="wait">
            {/* STEP 1: PERSONAL & ACADEMIC PROFILE */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#2D4A3E] flex items-center gap-1.5 mb-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Step 01 of 05 • Identity & College Standing</span>
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1D1A]">
                    Tell us about yourself
                  </h2>
                  <p className="text-sm text-[#52504A] mt-1">
                    Please provide your authentic details. We value curiosity and consistency over credentials.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Arjun Rathore"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]/30 transition-all ${
                        errors.fullName ? "border-rose-400 bg-rose-50/30" : "border-[#E8E4DC] focus:border-[#2D4A3E]"
                      }`}
                    />
                    {errors.fullName && <p className="text-xs text-rose-600 font-medium">{errors.fullName}</p>}
                  </div>

                  {/* College Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                      College / Active Email <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your.name@abes.ac.in"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]/30 transition-all ${
                        errors.email ? "border-rose-400 bg-rose-50/30" : "border-[#E8E4DC] focus:border-[#2D4A3E]"
                      }`}
                    />
                    {errors.email && <p className="text-xs text-rose-600 font-medium">{errors.email}</p>}
                  </div>

                  {/* WhatsApp / Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                      WhatsApp / Contact Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]/30 transition-all ${
                        errors.phone ? "border-rose-400 bg-rose-50/30" : "border-[#E8E4DC] focus:border-[#2D4A3E]"
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-rose-600 font-medium">{errors.phone}</p>}
                  </div>

                  {/* Roll Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                      University Roll Number / Student ID <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2300320100089"
                      value={formData.rollNumber}
                      onChange={(e) => updateField("rollNumber", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]/30 transition-all ${
                        errors.rollNumber ? "border-rose-400 bg-rose-50/30" : "border-[#E8E4DC] focus:border-[#2D4A3E]"
                      }`}
                    />
                    {errors.rollNumber && <p className="text-xs text-rose-600 font-medium">{errors.rollNumber}</p>}
                  </div>

                  {/* Year of Study */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                      Year of Study <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => updateField("year", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-sm text-[#1C1D1A] focus:outline-none focus:border-[#2D4A3E] focus:ring-2 focus:ring-[#2D4A3E]/30 transition-all"
                    >
                      <option value="1st Year">1st Year (Freshers - 2028 Batch)</option>
                      <option value="2nd Year">2nd Year (Sophomores - 2027 Batch)</option>
                      <option value="3rd Year">3rd Year (Juniors - 2026 Batch)</option>
                    </select>
                  </div>

                  {/* Branch / Department */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                      College Branch / Course <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CSE, IT, ECE, CSE (AI & ML), DS"
                      value={formData.branch}
                      onChange={(e) => updateField("branch", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]/30 transition-all ${
                        errors.branch ? "border-rose-400 bg-rose-50/30" : "border-[#E8E4DC] focus:border-[#2D4A3E]"
                      }`}
                    />
                    {errors.branch && <p className="text-xs text-rose-600 font-medium">{errors.branch}</p>}
                  </div>

                  {/* Hostel Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                      Residency Status
                    </label>
                    <select
                      value={formData.hostelStatus}
                      onChange={(e) => updateField("hostelStatus", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-sm text-[#1C1D1A] focus:outline-none focus:border-[#2D4A3E] focus:ring-2 focus:ring-[#2D4A3E]/30 transition-all"
                    >
                      <option value="Day Scholar">Day Scholar</option>
                      <option value="Hosteler">Hosteler (Campus Resident)</option>
                      <option value="PG / Day Resident">PG / Nearby Resident</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DEPARTMENT & DOMAIN SELECTION */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#2D4A3E] flex items-center gap-1.5 mb-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Step 02 of 05 • Domain Selection</span>
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1D1A]">
                    Choose Your Primary Department
                  </h2>
                  <p className="text-sm text-[#52504A] mt-1">
                    Select the domain you are most passionate about contributing to. Your interview task aligns with this choice.
                  </p>
                </div>

                {/* Domain Selector Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DEPARTMENTS.map((dept) => {
                    const Icon = dept.icon;
                    const isSelected = formData.primaryDepartment === dept.id;
                    return (
                      <div
                        key={dept.id}
                        onClick={() => updateField("primaryDepartment", dept.id)}
                        className={`p-5 rounded-2xl cursor-pointer border transition-all relative ${
                          isSelected
                            ? "bg-[#F5F2EB] border-[#2D4A3E] ring-2 ring-[#2D4A3E]/20 shadow-md"
                            : "bg-[#FBF9F5] border-[#E8E4DC] hover:border-[#2D4A3E]/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isSelected
                                ? "bg-[#2D4A3E] text-white"
                                : "bg-white border border-[#E8E4DC] text-[#2D4A3E]"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white border border-[#E8E4DC] text-[#52504A]">
                            {dept.badge}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-[#1C1D1A] mb-1">
                          {dept.name}
                        </h3>
                        <p className="text-xs text-[#2D4A3E] font-medium mb-2">
                          {dept.role}
                        </p>
                        <p className="text-xs text-[#52504A] line-clamp-2 leading-relaxed">
                          {dept.taskDesc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Secondary Department (Optional) */}
                <div className="pt-4 border-t border-[#E8E4DC]">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A] block mb-2">
                    Secondary Department of Interest (Optional Backup)
                  </label>
                  <select
                    value={formData.secondaryDepartment}
                    onChange={(e) => updateField("secondaryDepartment", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-sm text-[#1C1D1A] focus:outline-none focus:border-[#2D4A3E]"
                  >
                    <option value="none">None (Primary only)</option>
                    {DEPARTMENTS.filter(d => d.id !== formData.primaryDepartment).map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Skill Level & Tools */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                      Familiar Tools & Technologies in this Domain
                    </label>
                    <span className="text-[11px] text-[#787670]">Click to tag</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDeptObj.toolsList.map((tool) => {
                      const active = formData.skills.includes(tool);
                      return (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => toggleSkill(tool)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            active
                              ? "bg-[#2D4A3E] text-white border-[#2D4A3E]"
                              : "bg-[#FBF9F5] text-[#52504A] border-[#E8E4DC] hover:border-[#2D4A3E]/40"
                          }`}
                        >
                          {active ? `✓ ${tool}` : `+ ${tool}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Self-rated Experience Level */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A] block">
                    Self-Assessed Experience Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Beginner (Enthusiastic Learner)", "Intermediate (Built 2-3 Projects)", "Advanced (Seasoned / Production)"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => updateField("skillLevel", lvl.split(" ")[0])}
                        className={`p-3 rounded-xl text-xs font-medium border text-center transition-all ${
                          formData.skillLevel === lvl.split(" ")[0]
                            ? "bg-[#1C1D1A] text-white border-[#1C1D1A]"
                            : "bg-[#FBF9F5] text-[#52504A] border-[#E8E4DC] hover:border-slate-400"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: INTERVIEW TASK SUBMISSION */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#2D4A3E] flex items-center gap-1.5 mb-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Step 03 of 05 • Task Submission</span>
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1D1A]">
                    {selectedDeptObj.taskTitle}
                  </h2>
                  <p className="text-sm text-[#52504A] mt-1">
                    Submit the link to your task for <strong>{selectedDeptObj.name}</strong>. Remember the branding guideline: <em>Do not use official SYC/ABES logos; text "SYC" is allowed.</em>
                  </p>
                </div>

                {/* Task Context Card */}
                <div className="p-5 rounded-2xl bg-[#F5F2EB] border border-[#E8E4DC] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2D4A3E]">
                    <Sparkles className="w-4 h-4" />
                    <span>Official Task Brief</span>
                  </div>
                  <p className="text-sm text-[#1C1D1A] leading-relaxed">
                    {selectedDeptObj.taskDesc}
                  </p>
                  <p className="text-xs text-[#787670] pt-1">
                    ⏳ <strong>Deadline:</strong> Wednesday, 11:59 PM. (You can submit now, or submit a placeholder and update before deadline).
                  </p>
                </div>

                {/* Submission Links Based on Department */}
                <div className="space-y-6">
                  {/* Technical Domain Fields */}
                  {formData.primaryDepartment === "tech" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A] flex items-center gap-2">
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>GitHub Repository URL <span className="text-rose-600">*</span></span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://github.com/username/syc-recruitment"
                          value={formData.githubUrl}
                          onChange={(e) => updateField("githubUrl", e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]/30 transition-all ${
                            errors.githubUrl ? "border-rose-400 bg-rose-50/30" : "border-[#E8E4DC] focus:border-[#2D4A3E]"
                          }`}
                        />
                        {errors.githubUrl && <p className="text-xs text-rose-600 font-medium">{errors.githubUrl}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A] flex items-center gap-2">
                          <Link2 className="w-3.5 h-3.5" />
                          <span>Live Deployed Webpage URL (Vercel / Netlify / Render)</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://syc-recruitment.vercel.app"
                          value={formData.liveUrl}
                          onChange={(e) => updateField("liveUrl", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:border-[#2D4A3E]"
                        />
                      </div>
                    </>
                  )}

                  {/* Graphic Design Domain Fields */}
                  {formData.primaryDepartment === "design" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A] flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5" />
                        <span>Figma File / Google Drive / Behance Link (1080×1080 Post & 1080×1920 Story) <span className="text-rose-600">*</span></span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/drive/folders/... or https://www.figma.com/file/..."
                        value={formData.figmaDriveUrl}
                        onChange={(e) => updateField("figmaDriveUrl", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]/30 transition-all ${
                          errors.figmaDriveUrl ? "border-rose-400 bg-rose-50/30" : "border-[#E8E4DC] focus:border-[#2D4A3E]"
                        }`}
                      />
                      <p className="text-[11px] text-[#787670]">Make sure Google Drive link permissions are set to "Anyone with the link can view".</p>
                      {errors.figmaDriveUrl && <p className="text-xs text-rose-600 font-medium">{errors.figmaDriveUrl}</p>}
                    </div>
                  )}

                  {/* Video Production Domain Fields */}
                  {formData.primaryDepartment === "video" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A] flex items-center gap-2">
                        <Film className="w-3.5 h-3.5" />
                        <span>Google Drive / YouTube (Unlisted) / Vimeo Reel Link (20–30s) <span className="text-rose-600">*</span></span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/file/... or https://youtu.be/..."
                        value={formData.videoDriveUrl}
                        onChange={(e) => updateField("videoDriveUrl", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]/30 transition-all ${
                          errors.videoDriveUrl ? "border-rose-400 bg-rose-50/30" : "border-[#E8E4DC] focus:border-[#2D4A3E]"
                        }`}
                      />
                      <p className="text-[11px] text-[#787670]">Ensure the video has proper permissions so the review team can play it.</p>
                      {errors.videoDriveUrl && <p className="text-xs text-rose-600 font-medium">{errors.videoDriveUrl}</p>}
                    </div>
                  )}

                  {/* Operations or Content Fields */}
                  {(formData.primaryDepartment === "ops" || formData.primaryDepartment === "content") && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                        Portfolio / Sample Work Link / Writing Sample (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/... or Notion / Medium link"
                        value={formData.figmaDriveUrl}
                        onChange={(e) => updateField("figmaDriveUrl", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:border-[#2D4A3E]"
                      />
                    </div>
                  )}

                  {/* Task Notes / Design Rationale */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                      Submission Notes / Creative Rationale (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share a brief note about your design choices, tools used, or what you learned during this task..."
                      value={formData.taskNotes}
                      onChange={(e) => updateField("taskNotes", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:border-[#2D4A3E]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: MINDFUL SOP & FIT */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#2D4A3E] flex items-center gap-1.5 mb-1.5">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Step 04 of 05 • Culture & Mindful Fit</span>
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1D1A]">
                    Statement of Intent
                  </h2>
                  <p className="text-sm text-[#52504A] mt-1">
                    SYC is built on calmness, high execution, and mutual respect. Tell us what draws you to this space.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Why SYC */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                      Why do you want to join the Student Yogic Club (SYC)? <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Share your genuine motivation. What excites you about blending mindfulness with technical/creative projects?"
                      value={formData.whyJoin}
                      onChange={(e) => updateField("whyJoin", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:ring-2 focus:ring-[#2D4A3E]/30 transition-all ${
                        errors.whyJoin ? "border-rose-400 bg-rose-50/30" : "border-[#E8E4DC] focus:border-[#2D4A3E]"
                      }`}
                    />
                    {errors.whyJoin && <p className="text-xs text-rose-600 font-medium">{errors.whyJoin}</p>}
                  </div>

                  {/* Handling Academic Pressure */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                      How do you handle exam pressure or technical burnout?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g., Walks in nature, meditation, journaling, music, sports..."
                      value={formData.mindfulPerspective}
                      onChange={(e) => updateField("mindfulPerspective", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:border-[#2D4A3E]"
                    />
                  </div>

                  {/* Initiative Idea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                      One event or project you would love to see happen at ABES
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Campus-wide Sunrise Yoga & Code Jam, Mental Health Art Exhibition..."
                      value={formData.initiativeIdea}
                      onChange={(e) => updateField("initiativeIdea", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-sm text-[#1C1D1A] placeholder:text-[#A6A298] focus:outline-none focus:border-[#2D4A3E]"
                    />
                  </div>

                  {/* Weekly Availability */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#2D4A3E]" />
                      <span>Weekly Time Commitment</span>
                    </label>
                    <select
                      value={formData.timeCommitment}
                      onChange={(e) => updateField("timeCommitment", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-sm text-[#1C1D1A] focus:outline-none focus:border-[#2D4A3E]"
                    >
                      <option value="4-6 hours/week">4–6 hours/week (Comfortable alongside coursework)</option>
                      <option value="6-8 hours/week">6–8 hours/week (Balanced club engagement)</option>
                      <option value="8-12 hours/week">8–12 hours/week (Core team dedication)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: REVIEW & VERIFICATION */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#2D4A3E] flex items-center gap-1.5 mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Step 05 of 05 • Review & Confirmation</span>
                  </span>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1C1D1A]">
                    Review Your Application
                  </h2>
                  <p className="text-sm text-[#52504A] mt-1">
                    Please verify your information before submitting to the SYC Recruitment Committee.
                  </p>
                </div>

                {serverError && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Summary Box */}
                <div className="p-6 rounded-2xl bg-[#F5F2EB] border border-[#E8E4DC] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#787670] font-semibold">Applicant</p>
                      <h4 className="text-lg font-bold text-[#1C1D1A]">{formData.fullName}</h4>
                      <p className="text-xs text-[#52504A]">{formData.email} • {formData.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-semibold text-[#2D4A3E] hover:underline"
                    >
                      Edit Identity
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-[#E8E4DC] pb-4">
                    <div>
                      <span className="text-[#787670] block">Year:</span>
                      <strong className="text-[#1C1D1A]">{formData.year}</strong>
                    </div>
                    <div>
                      <span className="text-[#787670] block">Roll No:</span>
                      <strong className="text-[#1C1D1A]">{formData.rollNumber}</strong>
                    </div>
                    <div>
                      <span className="text-[#787670] block">Branch:</span>
                      <strong className="text-[#1C1D1A]">{formData.branch}</strong>
                    </div>
                    <div>
                      <span className="text-[#787670] block">Residence:</span>
                      <strong className="text-[#1C1D1A]">{formData.hostelStatus}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#787670] font-semibold">Department Applied</p>
                      <h4 className="text-base font-bold text-[#2D4A3E]">{selectedDeptObj.name}</h4>
                      <p className="text-xs text-[#52504A]">Task: {selectedDeptObj.taskTitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-semibold text-[#2D4A3E] hover:underline"
                    >
                      Edit Domain
                    </button>
                  </div>

                  <div className="space-y-2 border-b border-[#E8E4DC] pb-4 text-xs">
                    <p className="text-[#787670] font-semibold uppercase tracking-wider">Submitted Work / Task</p>
                    {formData.githubUrl && (
                      <p className="truncate">
                        <strong className="text-[#1C1D1A]">GitHub:</strong> {formData.githubUrl}
                      </p>
                    )}
                    {formData.liveUrl && (
                      <p className="truncate">
                        <strong className="text-[#1C1D1A]">Live Demo:</strong> {formData.liveUrl}
                      </p>
                    )}
                    {formData.figmaDriveUrl && (
                      <p className="truncate">
                        <strong className="text-[#1C1D1A]">Drive / Figma:</strong> {formData.figmaDriveUrl}
                      </p>
                    )}
                    {formData.videoDriveUrl && (
                      <p className="truncate">
                        <strong className="text-[#1C1D1A]">Video Link:</strong> {formData.videoDriveUrl}
                      </p>
                    )}
                    {formData.taskNotes && (
                      <p className="text-[#52504A] italic pt-1">
                        "{formData.taskNotes}"
                      </p>
                    )}
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-[#787670] font-semibold uppercase tracking-wider">Statement of Purpose</p>
                    <p className="text-[#1C1D1A] leading-relaxed italic">
                      "{formData.whyJoin}"
                    </p>
                  </div>
                </div>

                {/* Conduct & Branding Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 p-4 rounded-xl border border-[#E8E4DC] bg-[#FBF9F5] cursor-pointer hover:bg-[#F5F2EB] transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.agreedToConduct}
                      onChange={(e) => updateField("agreedToConduct", e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#2D4A3E] focus:ring-[#2D4A3E]"
                    />
                    <div className="text-xs text-[#1C1D1A] leading-relaxed">
                      <strong>Code of Mindfulness & Branding Agreement:</strong> I confirm that the work submitted is created by me. In adherence to the recruitment guidelines, I understand that <strong>no official SYC or ABES logos or crests</strong> should be used, and only stylized typography "SYC" is permissible.
                    </div>
                  </label>
                  {errors.agreedToConduct && (
                    <p className="text-xs text-rose-600 font-medium mt-1.5">{errors.agreedToConduct}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Control Buttons */}
          <div className="mt-10 pt-6 border-t border-[#E8E4DC] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-full border border-[#E8E4DC] text-xs font-semibold uppercase tracking-wider text-[#52504A] hover:bg-[#F5F2EB] transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3.5 rounded-full bg-[#1C1D1A] hover:bg-[#2D4A3E] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md inline-flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-9 py-3.5 rounded-full bg-[#2D4A3E] hover:bg-[#20362c] text-white text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-lg disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit to SYC</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Bottom Help Notice */}
        <div className="mt-8 text-center text-xs text-[#787670]">
          <p>
            Need to update your task later? Submit your application now and update your links using your Application ID before <strong>Wednesday 11:59 PM</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center text-[#52504A]">
          <Loader2 className="w-8 h-8 animate-spin text-[#2D4A3E] mb-3" />
          <p className="text-xs uppercase tracking-widest font-semibold">Loading SYC Application Portal...</p>
        </div>
      }
    >
      <ApplyFormContent />
    </Suspense>
  );
}
