"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  Compass,
  ArrowLeft
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "SYC-2026-XXXX";

  const [copied, setCopied] = useState(false);
  const [appData, setAppData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApp() {
      try {
        const res = await fetch(`/api/recruitment?search=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data.success && data.applications && data.applications.length > 0) {
          setAppData(data.applications[0]);
        }
      } catch (err) {
        console.error("Failed to load application details", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchApp();
    }
  }, [id]);

  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printPass = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1D1A] py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8E4DC]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#52504A] hover:text-[#2D4A3E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to SYC</span>
          </Link>

          <span className="font-editorial text-2xl font-bold tracking-tight text-[#1C1D1A]">
            SYC
          </span>

          <Link
            href="/status"
            className="text-xs font-semibold text-[#2D4A3E] hover:underline"
          >
            Track Status
          </Link>
        </div>

        {/* Success Header Message */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#EAF2EC] text-[#2D4A3E] mb-2 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#1C1D1A]">
            Application Received
          </h1>
          <p className="text-sm text-[#52504A] max-w-md mx-auto">
            Your candidature for the <strong>Student Yogic Club (SYC)</strong> has been recorded and submitted to the Tech & Design review committee.
          </p>
        </div>

        {/* LUXURY DIGITAL ADMISSION PASS / SLIP */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="editorial-card overflow-hidden bg-white border border-[#E8E4DC] shadow-2xl relative"
        >
          {/* Top Notch / Header Bar */}
          <div className="bg-[#1C1D1A] text-[#F5F2EB] px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                SYC
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#A6A298] font-semibold pl-2 border-l border-zinc-700">
                Official Recruitment Pass
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#2D4A3E] text-[10px] font-bold uppercase tracking-wider text-white">
                Verified Submission
              </span>
            </div>
          </div>

          {/* Pass Body */}
          <div className="p-8 sm:p-10 space-y-6">
            {/* Candidate ID Callout */}
            <div className="p-5 rounded-2xl bg-[#F5F2EB] border border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#787670]">
                  Unique Application ID
                </p>
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-[#1C1D1A] tracking-wider mt-0.5">
                  {id}
                </p>
              </div>
              <button
                type="button"
                onClick={copyIdToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8E4DC] hover:border-[#2D4A3E] text-xs font-semibold text-[#1C1D1A] transition-all shadow-sm self-start sm:self-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Candidate Summary Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs border-y border-[#E8E4DC] py-5">
              <div>
                <span className="text-[#787670] uppercase tracking-wider font-semibold block mb-0.5">
                  Applicant
                </span>
                <p className="text-sm font-bold text-[#1C1D1A]">
                  {appData?.fullName || "Candidate"}
                </p>
                <p className="text-[#52504A] text-xs">{appData?.email}</p>
              </div>

              <div>
                <span className="text-[#787670] uppercase tracking-wider font-semibold block mb-0.5">
                  Department
                </span>
                <p className="text-sm font-bold text-[#2D4A3E] uppercase tracking-wide">
                  {appData?.primaryDepartment || "Tech & Design"}
                </p>
                <p className="text-[#52504A] text-xs">{appData?.year || "Cohort 2026–27"}</p>
              </div>

              <div>
                <span className="text-[#787670] uppercase tracking-wider font-semibold block mb-0.5">
                  College / Roll No
                </span>
                <p className="text-[#1C1D1A] font-semibold">
                  {appData?.rollNumber || "Registered"}
                </p>
                <p className="text-[#787670]">{appData?.branch || "ABES Engineering College"}</p>
              </div>

              <div>
                <span className="text-[#787670] uppercase tracking-wider font-semibold block mb-0.5">
                  Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {appData?.status || "Under Review"}
                </span>
              </div>
            </div>

            {/* Next Steps Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#2D4A3E]" />
                <span>Recruitment Next Steps</span>
              </h4>
              <ul className="text-xs text-[#52504A] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#EAF2EC] text-[#2D4A3E] flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span>
                  <span><strong>Task Evaluation:</strong> The Tech & Design leads will review your code/design/video submission against the official rubric.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#EAF2EC] text-[#2D4A3E] flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span>
                  <span><strong>Interview Shortlist:</strong> Shortlisted candidates will be invited for a relaxed 10-minute interaction. Check your WhatsApp & email.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#EAF2EC] text-[#2D4A3E] flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span>
                  <span><strong>Deadline:</strong> All tasks must be completed before <strong>Wednesday, 11:59 PM</strong>.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={printPass}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#E8E4DC] hover:bg-[#F5F2EB] text-xs font-semibold text-[#1C1D1A] transition-all inline-flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Save / Print Slip</span>
              </button>

              <Link
                href="/status"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1C1D1A] hover:bg-[#2D4A3E] text-white text-xs font-semibold transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Track Status Real-time</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Decorative Bottom Barcode Graphic */}
          <div className="bg-[#F5F2EB] px-8 py-3 border-t border-[#E8E4DC] flex items-center justify-between text-[10px] text-[#787670] font-mono">
            <span>SYC // MINDFUL COLLECTIVE</span>
            <span>NO OFFICIAL LOGOS USED • TYPOGRAPHIC COMPLIANCE</span>
            <span>TOKEN: {id}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ApplicationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
          <p className="text-xs uppercase tracking-widest text-[#787670]">Loading Confirmation...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
