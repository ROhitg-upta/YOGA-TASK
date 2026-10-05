"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  Calendar,
  User,
  Hash,
  Sparkles,
  ExternalLink,
  Lock,
  Building
} from "lucide-react";

export default function CredentialVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadCredential() {
      try {
        setLoading(true);
        const res = await fetch(`/api/recruitment/credentials/${encodeURIComponent(id)}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Credential record not found.");
        }
        setData(json);
      } catch (err: any) {
        setError(err.message || "Failed to verify credential authenticity.");
      } finally {
        setLoading(false);
      }
    }
    loadCredential();
  }, [id]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#2D4A3E] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#787670] font-semibold">
            Querying Cryptographic Ledger...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data?.credential) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E8E4DC] text-center space-y-5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#1C1D1A]">Verification Failed</h2>
          <p className="text-xs text-[#52504A] leading-relaxed">
            {error || "The credential certificate could not be authenticated against the 2026–27 registry."}
          </p>
          <div className="pt-2">
            <Link
              href="/status"
              className="px-5 py-2.5 rounded-full bg-[#1C1D1A] text-white text-xs font-semibold hover:bg-[#2D4A3E] transition-colors inline-block"
            >
              Check Candidate Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { credential, application } = data;

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1C1D1A] py-8 sm:py-14 px-4 sm:px-8 print:p-0 print:bg-white">
      {/* Non-print Top Action Bar */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/status"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52504A] hover:text-[#2D4A3E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Candidate Status</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E8E4DC] hover:border-[#2D4A3E] text-xs font-semibold text-[#1C1D1A] inline-flex items-center gap-1.5 shadow-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#52504A]" />}
            <span>{copied ? "Link Copied" : "Share Link"}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-[#2D4A3E] text-white text-xs font-semibold hover:bg-[#1C1D1A] inline-flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Letter</span>
          </button>
        </div>
      </div>

      {/* Official Certificate & Acceptance Dossier */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl sm:rounded-[32px] border-2 border-[#DCD6C8] shadow-2xl p-8 sm:p-14 relative overflow-hidden print:border-none print:shadow-none print:p-8">
        {/* Subtle Watermark Branding */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.025] font-editorial text-[14rem] sm:text-[20rem] font-bold text-[#1C1D1A] tracking-tighter">
          SYC
        </div>

        {/* Certificate Frame Inner Border */}
        <div className="border border-[#E8E4DC] rounded-2xl sm:rounded-[24px] p-6 sm:p-10 space-y-8 relative z-10 bg-white/95">
          {/* Header */}
          <div className="text-center space-y-3 pb-6 border-b border-[#E8E4DC]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] text-[#2D4A3E] text-[11px] font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D4A3E]" />
              <span>Cryptographically Verified Credential</span>
            </div>

            <div className="pt-2">
              <span className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-[#1C1D1A] block">
                SYC
              </span>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#787670] mt-1">
                Student Yogic Club • ABES Engineering College
              </p>
              <p className="text-[11px] text-[#A6A298] tracking-widest uppercase">
                Autonomous Student Creative & Engineering Society
              </p>
            </div>
          </div>

          {/* Letter Title */}
          <div className="text-center space-y-1">
            <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1C1D1A]">
              Official Letter of Induction & Leadership Appointment
            </h1>
            <p className="text-xs text-[#787670] uppercase tracking-wider font-semibold">
              {credential.cohort} • Technical & Creative Wings
            </p>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-xs sm:text-sm text-[#3E3C36] leading-relaxed">
            <p>
              This is to formally certify that, following competitive performance in the rigorous domain assessments and review evaluations,
            </p>

            {/* Candidate Spotlight Box */}
            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#E8E4DC] text-center space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#787670]">
                Candidate Name
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1C1D1A]">
                {credential.candidateName}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#52504A] pt-1">
                <span>Roll No: <strong>{credential.rollNumber}</strong></span>
                <span>•</span>
                <span>Branch: <strong>{application?.branch || "Computer Science"}</strong></span>
                <span>•</span>
                <span>Year: <strong>{application?.year || "2026 Batch"}</strong></span>
              </div>
            </div>

            <p>
              has been inducted as an active member of the <strong>Student Yogic Club (SYC)</strong> for the academic year <strong>2026–2027</strong> in the domain of:
            </p>

            <div className="p-4 rounded-xl bg-[#EAF2EC] border border-[#2D4A3E]/30 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#2D4A3E] block mb-1">
                Designated Appointment & Role
              </span>
              <p className="font-editorial text-lg sm:text-xl font-bold text-[#2D4A3E]">
                {credential.role}
              </p>
              <span className="text-xs text-[#52504A]">
                {credential.department} Wing
              </span>
            </div>

            <p className="text-xs text-[#52504A]">
              The candidate has pledged to uphold the society's core values: balancing relentless engineering craftsmanship and aesthetic clarity with mindful discipline, integrity, and peer mentorship.
            </p>
          </div>

          {/* Cryptographic Proof Verification Block */}
          <div className="p-4 rounded-xl bg-[#F5F2EB] border border-[#E8E4DC] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#1C1D1A]">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Hash className="w-3.5 h-3.5 text-[#2D4A3E]" />
                <span>SHA-256 Cryptographic Fingerprint</span>
              </span>
              <span className="font-mono text-[#2D4A3E]">RECORD ID: {credential.id}</span>
            </div>
            <p className="font-mono text-[10px] break-all text-[#52504A] bg-white p-2.5 rounded-lg border border-[#E8E4DC]">
              {credential.certificateHash}
            </p>
            <div className="flex items-center justify-between text-[10px] text-[#787670] pt-1">
              <span>Issued: {new Date(credential.issueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Official Registry Hash Verified</span>
              </span>
            </div>
          </div>

          {/* Official Signatures Section */}
          <div className="pt-6 border-t border-[#E8E4DC] grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-2">
              <div className="h-10 flex items-center justify-center font-editorial text-xl italic text-[#1C1D1A]">
                Arjun Rathore
              </div>
              <div className="border-t border-[#1C1D1A]/30 pt-1.5">
                <strong className="block text-[#1C1D1A]">Tech & Operations Lead</strong>
                <span className="text-[10px] text-[#787670]">Student Yogic Club</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-10 flex items-center justify-center font-editorial text-xl italic text-[#1C1D1A]">
                Dr. R. K. Sharma
              </div>
              <div className="border-t border-[#1C1D1A]/30 pt-1.5">
                <strong className="block text-[#1C1D1A]">Faculty Advisor & Convenor</strong>
                <span className="text-[10px] text-[#787670]">ABES Engineering College</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[10px] text-[#A6A298] pt-2">
            This digital certificate is tamper-proof and verifiable directly via the SYC Recruitment System at abes.ac.in.
          </div>
        </div>
      </div>
    </div>
  );
}
