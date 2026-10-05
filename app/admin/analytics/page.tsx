"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  ArrowLeft,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Download,
  RefreshCw,
  PieChart,
  ShieldCheck,
  Building,
  GraduationCap,
  Sparkles,
  Layers,
  Activity
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recruitment/analytics");
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#2D4A3E] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#787670] font-semibold">
            Aggregating Recruitment Intelligence...
          </p>
        </div>
      </div>
    );
  }

  const total = metrics?.totalApplications || 1;
  const acceptedCount = metrics?.byStatus?.["Accepted"] || 0;
  const shortlistedCount = metrics?.byStatus?.["Interview Shortlisted"] || 0;
  const underReviewCount = (metrics?.byStatus?.["Under Review"] || 0) + (metrics?.byStatus?.["Task Received"] || 0);

  const acceptanceRate = ((acceptedCount / total) * 100).toFixed(1);
  const shortlistRate = (((shortlistedCount + acceptedCount) / total) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1D1A] py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/applications"
              className="p-2 rounded-xl bg-white border border-[#E8E4DC] hover:border-[#2D4A3E] text-[#52504A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-2xl font-bold tracking-tight text-[#1C1D1A]">
                  SYC
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#787670] font-semibold pl-2 border-l border-[#E8E4DC]">
                  Recruitment Executive Intelligence
                </span>
              </div>
              <p className="text-xs text-[#52504A] mt-0.5">
                Cohort 2026–27 Applicant Demographics, Evaluation Funnel & Rubric Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/applications"
              className="px-4 py-2 rounded-xl bg-white border border-[#E8E4DC] hover:border-[#2D4A3E] text-xs font-semibold text-[#1C1D1A] inline-flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Users className="w-3.5 h-3.5 text-[#2D4A3E]" />
              <span>ATS Table</span>
            </Link>
            <a
              href="/api/recruitment/export"
              download
              className="px-4 py-2 rounded-xl bg-white border border-[#E8E4DC] hover:border-[#2D4A3E] text-xs font-semibold text-[#1C1D1A] inline-flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#2D4A3E]" />
              <span>Export CSV</span>
            </a>
            <button
              onClick={fetchMetrics}
              className="px-4 py-2 rounded-xl bg-white border border-[#E8E4DC] hover:border-[#2D4A3E] text-xs font-semibold text-[#1C1D1A] inline-flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* Primary Executive KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670] block">Total Applications</span>
            <p className="font-editorial text-3xl font-bold text-[#1C1D1A]">{metrics?.totalApplications || 0}</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold pt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Active 2026 Cycle</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670] block">Shortlisted For Interview</span>
            <p className="font-editorial text-3xl font-bold text-[#2D4A3E]">{shortlistedCount}</p>
            <span className="text-[11px] text-[#787670] block pt-1">{shortlistRate}% shortlisting rate</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670] block">Accepted / Inducted</span>
            <p className="font-editorial text-3xl font-bold text-purple-900">{acceptedCount}</p>
            <span className="text-[11px] text-purple-700 font-semibold block pt-1">{acceptanceRate}% acceptance rate</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670] block">Evaluations Logged</span>
            <p className="font-editorial text-3xl font-bold text-[#1C1D1A]">{metrics?.evaluationsLogged || 0}</p>
            <span className="text-[11px] text-[#787670] block pt-1">Avg Score: {metrics?.averageScores?.overall || 9.0}/10</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670] block">Digital Credentials</span>
            <p className="font-editorial text-3xl font-bold text-[#2D4A3E]">{metrics?.credentialsIssued || 0}</p>
            <span className="text-[11px] text-emerald-700 font-semibold block pt-1">Cryptographically Sealed</span>
          </div>
        </div>

        {/* Visual Charts & Demographics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department / Wing Breakdown */}
          <div className="editorial-card p-6 sm:p-8 bg-white border border-[#E8E4DC] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#1C1D1A]">Domain Demand Distribution</h3>
                <p className="text-xs text-[#52504A]">Applicant volume distributed across recruitment task tracks</p>
              </div>
              <Layers className="w-5 h-5 text-[#2D4A3E]" />
            </div>

            <div className="space-y-4">
              {[
                { key: "tech", label: "💻 Technical & Web Engineering (Task 3)", count: metrics?.byDepartment?.tech || 0, color: "bg-[#2D4A3E]" },
                { key: "design", label: "🎨 Graphic Design & Visual Story (Task 1)", count: metrics?.byDepartment?.design || 0, color: "bg-amber-600" },
                { key: "video", label: "🎬 Motion Narrative & Video (Task 2)", count: metrics?.byDepartment?.video || 0, color: "bg-purple-600" },
                { key: "ops", label: "⚡ Operations & Logistics", count: metrics?.byDepartment?.ops || 0, color: "bg-blue-600" },
                { key: "content", label: "✍️ Editorial & Content", count: metrics?.byDepartment?.content || 0, color: "bg-rose-600" },
              ].map((item) => {
                const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1C1D1A]">{item.label}</span>
                      <span className="font-mono text-[#787670]">{item.count} candidates ({pct}%)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#F5F2EB] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selection Funnel */}
          <div className="editorial-card p-6 sm:p-8 bg-white border border-[#E8E4DC] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#1C1D1A]">Recruitment Selection Funnel</h3>
                <p className="text-xs text-[#52504A]">Progressive candidate filtration from registration to induction</p>
              </div>
              <Activity className="w-5 h-5 text-[#2D4A3E]" />
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8E4DC] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670]">Phase 1</span>
                  <p className="font-semibold text-xs text-[#1C1D1A]">Applications Influx</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-[#1C1D1A]">{total}</span>
                  <span className="block text-[10px] text-[#787670]">100% Volume</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8E4DC] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670]">Phase 2</span>
                  <p className="font-semibold text-xs text-[#1C1D1A]">Task Received & Lead Review</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-[#2D4A3E]">{underReviewCount + shortlistedCount + acceptedCount}</span>
                  <span className="block text-[10px] text-[#787670]">Portfolio Evaluated</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EAF2EC] border border-[#2D4A3E]/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D4A3E]">Phase 3</span>
                  <p className="font-semibold text-xs text-[#1C1D1A]">Interview Shortlisted</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-[#2D4A3E]">{shortlistedCount + acceptedCount}</span>
                  <span className="block text-[10px] text-[#2D4A3E] font-medium">{shortlistRate}% Conversion</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1C1D1A] text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Final Stage</span>
                  <p className="font-semibold text-xs">Official Induction (Cohort 2026–27)</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-emerald-400">{acceptedCount}</span>
                  <span className="block text-[10px] text-zinc-400">Credentials Issued</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Year & Rubric Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Academic Cohort */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h4 className="font-editorial text-lg font-bold text-[#1C1D1A]">Year-Wise Share</h4>
              <GraduationCap className="w-4 h-4 text-[#2D4A3E]" />
            </div>
            <div className="space-y-3 text-xs">
              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yr) => {
                const count = metrics?.byYear?.[yr] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={yr} className="flex items-center justify-between">
                    <span className="text-[#52504A]">{yr}</span>
                    <span className="font-mono font-bold text-[#1C1D1A]">{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rubric Quality Scores */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h4 className="font-editorial text-lg font-bold text-[#1C1D1A]">Average Rubric Ratings</h4>
              <Sparkles className="w-4 h-4 text-[#2D4A3E]" />
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#52504A]">Technical Architecture</span>
                <span className="font-mono font-bold text-[#2D4A3E]">{metrics?.averageScores?.technical || 9.0} / 10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52504A]">Visual / Creative Design</span>
                <span className="font-mono font-bold text-amber-700">{metrics?.averageScores?.creative || 8.8} / 10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52504A]">Cultural & Mindful Fit</span>
                <span className="font-mono font-bold text-purple-700">{metrics?.averageScores?.cultural || 9.5} / 10</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#E8E4DC]">
                <span className="font-bold text-[#1C1D1A]">Composite Quality Index</span>
                <span className="font-mono font-bold text-[#1C1D1A]">{metrics?.averageScores?.overall || 9.1} / 10</span>
              </div>
            </div>
          </div>

          {/* Residency Demographics */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h4 className="font-editorial text-lg font-bold text-[#1C1D1A]">Campus Residency</h4>
              <Building className="w-4 h-4 text-[#2D4A3E]" />
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#52504A]">Day Scholars</span>
                <span className="font-mono font-bold text-[#1C1D1A]">{metrics?.byHostel?.["Day Scholar"] || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52504A]">Hostel Residents</span>
                <span className="font-mono font-bold text-[#1C1D1A]">{metrics?.byHostel?.["Hosteler"] || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F2EB] text-[11px] text-[#787670] mt-2">
                Recruitment open equally to both day scholars and on-campus hostelers across all 4 departments.
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Audit Trail & Activity Logs */}
        {metrics?.activityLogs && metrics.activityLogs.length > 0 && (
          <div className="editorial-card p-6 sm:p-8 bg-white border border-[#E8E4DC] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#1C1D1A]">System Activity Audit Trail</h3>
                <p className="text-xs text-[#52504A]">Tamper-evident log of reviewer evaluations, status changes, and credential issuances</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-[#2D4A3E]" />
            </div>

            <div className="divide-y divide-[#E8E4DC] text-xs">
              {metrics.activityLogs.map((log: any, idx: number) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#1C1D1A]">{log.actor}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#F5F2EB] font-mono text-[10px] text-[#787670]">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-[#52504A]">{log.details}</p>
                  </div>
                  <span className="font-mono text-[10px] text-[#A6A298] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
