"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Sparkles, Send, AlertCircle, Loader2 } from "lucide-react";

const DEPARTMENTS = [
  { id: "tech-design", name: "Tech & Design", desc: "Web dev, UI/UX, Graphic Design, Video Editing" },
  { id: "events", name: "Event Management", desc: "Campus Yoga festivals, workshops, logistics" },
  { id: "pr-outreach", name: "PR & Media", desc: "Content creation, photography, social campaigns" },
  { id: "operations", name: "Yoga & Wellness Ops", desc: "Session coordination, mindfulness initiatives" },
];

export default function RecruitmentForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    branch: "CSE / IT",
    year: "1st Year",
    department: "tech-design",
    portfolioUrl: "",
    whyJoin: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [appId, setAppId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit application");
      }

      setAppId(data.applicationId);
      setStatus("success");

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#059669", "#10b981", "#34d399", "#0284c7"],
        });
      } catch {
        // fallback
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="glass-panel-glow rounded-3xl p-8 md:p-12 text-center max-w-xl mx-auto shadow-xl border border-emerald-200">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs uppercase tracking-widest font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Application Received
        </span>
        <h3 className="text-2xl md:text-3xl font-bold mt-4 mb-3 text-slate-900">
          Welcome to the SYC Journey!
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          Your application has been stored in the SYC recruitment portal. Our department leads will review your profile and reach out via email for the offline interview rounds.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
          <p className="text-xs text-slate-500 font-medium">Your Application ID</p>
          <p className="text-lg font-mono font-bold text-emerald-700 tracking-wider mt-0.5">{appId}</p>
        </div>
        <button
          onClick={() => {
            setStatus("idle");
            setFormData({
              fullName: "",
              email: "",
              rollNumber: "",
              branch: "CSE / IT",
              year: "1st Year",
              department: "tech-design",
              portfolioUrl: "",
              whyJoin: "",
            });
          }}
          className="text-xs text-emerald-600 hover:text-emerald-700 underline font-semibold"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel-light rounded-3xl p-6 md:p-10 max-w-2xl mx-auto relative overflow-hidden border border-slate-200/90 shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Recruitment Cycle 2024-25</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Join Team SYC
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Select your interest, share your background, and become part of campus wellness & innovation.
        </p>
      </div>

      {status === "error" && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aarav Sharma"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              College Email *
            </label>
            <input
              type="email"
              required
              placeholder="name@abes.ac.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Roll / Student ID
            </label>
            <input
              type="text"
              placeholder="23003201..."
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Branch
            </label>
            <select
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
            >
              <option value="CSE / IT">CSE / IT</option>
              <option value="ECE / EEE">ECE / EEE</option>
              <option value="AIML / DS">AIML / DS</option>
              <option value="Mechanical / Civil">Mechanical / Civil</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Year of Study
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Target Department *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEPARTMENTS.map((dept) => {
              const isSelected = formData.department === dept.id;
              return (
                <div
                  key={dept.id}
                  onClick={() => setFormData({ ...formData, department: dept.id })}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all text-left ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-slate-900 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900">{dept.name}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-emerald-600 bg-emerald-600" : "border-slate-300"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{dept.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Portfolio / GitHub / Drive / Work Link
          </label>
          <input
            type="url"
            placeholder="https://github.com/... or Behance/Drive link"
            value={formData.portfolioUrl}
            onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Why do you want to join SYC?
          </label>
          <textarea
            rows={3}
            placeholder="Share what excites you about mindful living, club culture, and your chosen department..."
            value={formData.whyJoin}
            onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 glow-emerald cursor-pointer shadow-md"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Application to SYC</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
