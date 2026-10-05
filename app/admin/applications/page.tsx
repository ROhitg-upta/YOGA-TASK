"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  ExternalLink,
  CheckCircle,
  Clock,
  Code2,
  Palette,
  Film,
  Compass,
  ArrowLeft,
  Filter,
  RefreshCw,
  Eye,
  Check,
  X,
  FileText,
  Download,
  Calendar,
  Star,
  Award,
  BarChart3,
  MessageSquare,
  Sparkles,
  MapPin,
  Send,
  Loader2
} from "lucide-react";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal Tabs: "dossier" | "evaluate" | "schedule"
  const [modalTab, setModalTab] = useState<"dossier" | "evaluate" | "schedule">("dossier");

  // Evaluation Form State
  const [evalForm, setEvalForm] = useState({
    reviewerName: "Tech & Design Committee",
    technicalScore: 8,
    creativeScore: 8,
    culturalFitScore: 9,
    comments: "",
    recommendation: "Accept" as "Strong Accept" | "Accept" | "Neutral" | "Decline",
  });
  const [evalSubmitting, setEvalSubmitting] = useState(false);
  const [evalSuccess, setEvalSuccess] = useState("");

  // Interview Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({
    date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    time: "04:30 PM",
    mode: "In-Person (SYC Hub)" as "In-Person (SYC Hub)" | "Google Meet",
    meetLinkOrRoom: "SYC Innovation Hub, Room 304, ABES Campus",
    interviewerName: "Club Lead",
    notes: "Review task architecture and discuss club fit.",
  });
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resApps, resMetrics] = await Promise.all([
        fetch("/api/recruitment"),
        fetch("/api/recruitment/analytics")
      ]);
      const dataApps = await resApps.json();
      const dataMetrics = await resMetrics.json();

      if (dataApps.success) setApplications(dataApps.applications || []);
      if (dataMetrics.success) setMetrics(dataMetrics.metrics || null);
    } catch (err) {
      console.error("Failed to load recruitment data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/recruitment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setEvalSubmitting(true);
    setEvalSuccess("");

    try {
      const res = await fetch("/api/recruitment/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          reviewerName: evalForm.reviewerName,
          technicalScore: Number(evalForm.technicalScore),
          creativeScore: Number(evalForm.creativeScore),
          culturalFitScore: Number(evalForm.culturalFitScore),
          comments: evalForm.comments || "Candidate demonstrates strong passion and adherence to guidelines.",
          recommendation: evalForm.recommendation,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to log evaluation");
      }

      setEvalSuccess("Scorecard logged successfully!");
      fetchData();
      setTimeout(() => setEvalSuccess(""), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to submit scorecard");
    } finally {
      setEvalSubmitting(false);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setScheduleSubmitting(true);
    setScheduleSuccess("");

    try {
      const res = await fetch("/api/recruitment/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          candidateName: selectedApp.fullName,
          candidateEmail: selectedApp.email,
          department: selectedApp.primaryDepartment || selectedApp.department,
          date: scheduleForm.date,
          time: scheduleForm.time,
          mode: scheduleForm.mode,
          meetLinkOrRoom: scheduleForm.meetLinkOrRoom,
          interviewerName: scheduleForm.interviewerName,
          notes: scheduleForm.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to schedule interview");
      }

      setScheduleSuccess("Interview scheduled and status changed to Shortlisted!");
      handleUpdateStatus(selectedApp.id, "Interview Shortlisted");
      fetchData();
      setTimeout(() => setScheduleSuccess(""), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to schedule interview");
    } finally {
      setScheduleSubmitting(false);
    }
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      !search ||
      app.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      app.id?.toLowerCase().includes(search.toLowerCase()) ||
      app.email?.toLowerCase().includes(search.toLowerCase()) ||
      app.rollNumber?.toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      selectedDept === "all" ||
      app.primaryDepartment === selectedDept ||
      app.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1D1A] py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
          <div className="flex items-center gap-4">
            <Link
              href="/"
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
                  Recruitment Review Console
                </span>
              </div>
              <p className="text-xs text-[#52504A] mt-0.5">
                Tech & Design Lead Evaluation & Scoring Engine (Strict Typographic Branding)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/recruitment/export"
              download
              className="px-4 py-2 rounded-xl bg-white border border-[#E8E4DC] hover:border-[#2D4A3E] text-xs font-semibold text-[#1C1D1A] inline-flex items-center gap-1.5 transition-all shadow-sm"
              title="Download official CSV export for college records"
            >
              <Download className="w-3.5 h-3.5 text-[#2D4A3E]" />
              <span>Export CSV</span>
            </a>
            <button
              onClick={fetchData}
              className="px-4 py-2 rounded-xl bg-white border border-[#E8E4DC] hover:border-[#2D4A3E] text-xs font-semibold text-[#1C1D1A] inline-flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <span className="px-3 py-1.5 rounded-full bg-[#EAF2EC] text-[#2D4A3E] text-xs font-bold border border-[#2D4A3E]/20">
              {applications.length} Submissions Logged
            </span>
          </div>
        </div>

        {/* Live Analytics Dashboard Cards */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670] block">Total Influx</span>
              <p className="font-editorial text-2xl font-bold text-[#1C1D1A] mt-1">{metrics.totalApplications}</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Active Cycle</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670] block">💻 Tech (Task 3)</span>
              <p className="font-editorial text-2xl font-bold text-[#2D4A3E] mt-1">{metrics.byDepartment?.tech || 0}</p>
              <span className="text-[10px] text-[#787670]">Web & System Dev</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670] block">🎨 Design (Task 1)</span>
              <p className="font-editorial text-2xl font-bold text-[#1C1D1A] mt-1">{metrics.byDepartment?.design || 0}</p>
              <span className="text-[10px] text-[#787670]">Wellness Week</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670] block">🎬 Video (Task 2)</span>
              <p className="font-editorial text-2xl font-bold text-[#2D4A3E] mt-1">{metrics.byDepartment?.video || 0}</p>
              <span className="text-[10px] text-[#787670]">20-30s Reels</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670] block">Shortlisted</span>
              <p className="font-editorial text-2xl font-bold text-emerald-700 mt-1">{metrics.byStatus?.["Interview Shortlisted"] || 0}</p>
              <span className="text-[10px] text-[#787670]">Ready for 1-on-1</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787670] block">Avg Review Score</span>
              <p className="font-editorial text-2xl font-bold text-[#1C1D1A] mt-1">{metrics.averageScores?.overall || 9.1} / 10</p>
              <span className="text-[10px] text-amber-700 font-semibold">Quality Index</span>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#787670]" />
            <input
              type="text"
              placeholder="Search candidate, roll no, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E4DC] text-xs text-[#1C1D1A] focus:outline-none focus:border-[#2D4A3E] shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {[
              { id: "all", label: "All Wings" },
              { id: "tech", label: "Tech (Task 3)" },
              { id: "design", label: "Design (Task 1)" },
              { id: "video", label: "Video (Task 2)" },
              { id: "ops", label: "Operations" },
              { id: "content", label: "Editorial" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedDept(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDept === tab.id
                    ? "bg-[#1C1D1A] text-white"
                    : "bg-white border border-[#E8E4DC] text-[#52504A] hover:border-[#2D4A3E]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className="editorial-card overflow-hidden bg-white border border-[#E8E4DC] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F5F2EB] text-[#787670] uppercase tracking-wider font-semibold border-b border-[#E8E4DC]">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Academic Details</th>
                  <th className="py-3 px-4">Domain / Task</th>
                  <th className="py-3 px-4">Task Submission</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DC]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#787670]">
                      No applications found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((app) => (
                    <tr key={app.id} className="hover:bg-[#FBF9F5] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1C1D1A]">
                        {app.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="text-[#1C1D1A] block">{app.fullName}</strong>
                        <span className="text-[11px] text-[#787670]">{app.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[#1C1D1A] block">{app.year}</span>
                        <span className="text-[11px] text-[#787670]">{app.branch}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-[#EAF2EC] text-[#2D4A3E] font-bold text-[10px] uppercase">
                          {app.primaryDepartment || app.department}
                        </span>
                        <span className="block text-[11px] text-[#787670] mt-0.5">
                          {app.taskDetails?.taskType || "General"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {app.taskDetails?.githubUrl && (
                            <a
                              href={app.taskDetails.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded bg-[#F5F2EB] text-[#1C1D1A] hover:text-[#2D4A3E] transition-colors"
                              title="GitHub Repo"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {app.taskDetails?.liveUrl && (
                            <a
                              href={app.taskDetails.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold hover:bg-emerald-100"
                            >
                              Live Demo
                            </a>
                          )}
                          {app.taskDetails?.figmaDriveUrl && (
                            <a
                              href={app.taskDetails.figmaDriveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-[10px] font-semibold hover:bg-purple-100"
                            >
                              Drive / Figma
                            </a>
                          )}
                          {app.taskDetails?.videoDriveUrl && (
                            <a
                              href={app.taskDetails.videoDriveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 text-[10px] font-semibold hover:bg-sky-100"
                            >
                              Reel Video
                            </a>
                          )}
                          {!app.taskDetails?.githubUrl &&
                            !app.taskDetails?.liveUrl &&
                            !app.taskDetails?.figmaDriveUrl &&
                            !app.taskDetails?.videoDriveUrl && (
                              <span className="text-[11px] text-[#A6A298] italic">Pending link</span>
                            )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={app.status || "Under Review"}
                          disabled={updatingId === app.id}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border transition-colors ${
                            app.status === "Interview Shortlisted"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : app.status === "Accepted"
                              ? "bg-purple-50 text-purple-800 border-purple-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Task Received">Task Received</option>
                          <option value="Interview Shortlisted">Shortlisted</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Waitlisted">Waitlisted</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setModalTab("dossier");
                          }}
                          className="px-3 py-1 rounded-lg bg-[#F5F2EB] hover:bg-[#2D4A3E] hover:text-white text-[#1C1D1A] font-medium transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Dossier</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Inspection & Scoring Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E8E4DC] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#787670]">
                    Candidate Dossier & Review Suite
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#1C1D1A]">
                    {selectedApp.fullName}
                  </h3>
                  <p className="text-xs text-[#52504A]">ID: {selectedApp.id} • {selectedApp.email}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-[#E8E4DC] pb-3">
                <button
                  type="button"
                  onClick={() => setModalTab("dossier")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    modalTab === "dossier"
                      ? "bg-[#1C1D1A] text-white"
                      : "bg-[#F5F2EB] text-[#52504A] hover:bg-[#E8E4DC]"
                  }`}
                >
                  Applicant Dossier
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("evaluate")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    modalTab === "evaluate"
                      ? "bg-[#2D4A3E] text-white"
                      : "bg-[#F5F2EB] text-[#52504A] hover:bg-[#E8E4DC]"
                  }`}
                >
                  ⭐ Scorecard & Review
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("schedule")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    modalTab === "schedule"
                      ? "bg-[#2D4A3E] text-white"
                      : "bg-[#F5F2EB] text-[#52504A] hover:bg-[#E8E4DC]"
                  }`}
                >
                  📅 Schedule Interview
                </button>
              </div>

              {/* TAB 1: DOSSIER */}
              {modalTab === "dossier" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs p-4 rounded-2xl bg-[#F5F2EB]">
                    <div>
                      <span className="text-[#787670] block">Year & Branch:</span>
                      <strong className="text-[#1C1D1A]">{selectedApp.year} • {selectedApp.branch}</strong>
                    </div>
                    <div>
                      <span className="text-[#787670] block">Phone:</span>
                      <strong className="text-[#1C1D1A]">{selectedApp.phone}</strong>
                    </div>
                    <div>
                      <span className="text-[#787670] block">Primary Wing:</span>
                      <strong className="text-[#2D4A3E] uppercase">{selectedApp.primaryDepartment || selectedApp.department}</strong>
                    </div>
                    <div>
                      <span className="text-[#787670] block">Time Commitment:</span>
                      <strong className="text-[#1C1D1A]">{selectedApp.timeCommitment || "6-8 hrs/wk"}</strong>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold uppercase tracking-wider text-[#1C1D1A]">Interview Task Submission</h4>
                    <div className="p-4 rounded-2xl border border-[#E8E4DC] bg-[#FBF9F5] space-y-2">
                      <p className="font-semibold text-[#2D4A3E]">{selectedApp.taskDetails?.taskType}</p>
                      {selectedApp.taskDetails?.githubUrl && (
                        <p className="break-all">
                          <strong>GitHub:</strong>{" "}
                          <a href={selectedApp.taskDetails.githubUrl} target="_blank" className="text-blue-600 underline">
                            {selectedApp.taskDetails.githubUrl}
                          </a>
                        </p>
                      )}
                      {selectedApp.taskDetails?.liveUrl && (
                        <p className="break-all">
                          <strong>Live Webpage:</strong>{" "}
                          <a href={selectedApp.taskDetails.liveUrl} target="_blank" className="text-blue-600 underline">
                            {selectedApp.taskDetails.liveUrl}
                          </a>
                        </p>
                      )}
                      {selectedApp.taskDetails?.figmaDriveUrl && (
                        <p className="break-all">
                          <strong>Drive / Figma:</strong>{" "}
                          <a href={selectedApp.taskDetails.figmaDriveUrl} target="_blank" className="text-blue-600 underline">
                            {selectedApp.taskDetails.figmaDriveUrl}
                          </a>
                        </p>
                      )}
                      {selectedApp.taskDetails?.videoDriveUrl && (
                        <p className="break-all">
                          <strong>Reel Video:</strong>{" "}
                          <a href={selectedApp.taskDetails.videoDriveUrl} target="_blank" className="text-blue-600 underline">
                            {selectedApp.taskDetails.videoDriveUrl}
                          </a>
                        </p>
                      )}
                      {selectedApp.taskDetails?.notes && (
                        <p className="italic text-[#52504A] pt-1">
                          Notes: "{selectedApp.taskDetails.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* SOP */}
                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold uppercase tracking-wider text-[#1C1D1A]">Why Join SYC</h4>
                    <p className="p-3 rounded-xl bg-[#F5F2EB] text-[#1C1D1A] leading-relaxed italic">
                      "{selectedApp.whyJoin}"
                    </p>
                  </div>

                  {/* Fast Status Change Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DC]">
                    <span className="text-xs font-semibold text-[#787670]">Fast Decision:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedApp.id, "Interview Shortlisted")}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all"
                      >
                        Shortlist for Interview
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedApp.id, "Accepted")}
                        className="px-4 py-2 rounded-xl bg-[#1C1D1A] hover:bg-[#2D4A3E] text-white text-xs font-semibold transition-all"
                      >
                        Accept Candidate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SCORECARD & EVALUATE */}
              {modalTab === "evaluate" && (
                <form onSubmit={handleCreateEvaluation} className="space-y-4 text-xs">
                  {evalSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{evalSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#1C1D1A]">Technical Score (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={evalForm.technicalScore}
                        onChange={(e) => setEvalForm({ ...evalForm, technicalScore: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-center font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#1C1D1A]">Creative/Design (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={evalForm.creativeScore}
                        onChange={(e) => setEvalForm({ ...evalForm, creativeScore: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-center font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#1C1D1A]">Culture & Ethos (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={evalForm.culturalFitScore}
                        onChange={(e) => setEvalForm({ ...evalForm, culturalFitScore: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] text-center font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#1C1D1A]">Recommendation</label>
                    <select
                      value={evalForm.recommendation}
                      onChange={(e: any) => setEvalForm({ ...evalForm, recommendation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]"
                    >
                      <option value="Strong Accept">Strong Accept (Top 5% Candidate)</option>
                      <option value="Accept">Accept (Solid Contribution Potential)</option>
                      <option value="Neutral">Neutral (Depends on interview round)</option>
                      <option value="Decline">Decline</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#1C1D1A]">Reviewer Qualitative Feedback</label>
                    <textarea
                      rows={3}
                      placeholder="Comment on task quality, typography, code cleanliness, or communication..."
                      value={evalForm.comments}
                      onChange={(e) => setEvalForm({ ...evalForm, comments: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={evalSubmitting}
                      className="px-6 py-2.5 rounded-full bg-[#2D4A3E] hover:bg-[#1C1D1A] text-white font-semibold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-1.5"
                    >
                      {evalSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Star className="w-3.5 h-3.5" />}
                      <span>Save Scorecard</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: SCHEDULE INTERVIEW */}
              {modalTab === "schedule" && (
                <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs">
                  {scheduleSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{scheduleSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#1C1D1A]">Interview Date</label>
                      <input
                        type="date"
                        value={scheduleForm.date}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#1C1D1A]">Time Slot</label>
                      <input
                        type="text"
                        placeholder="e.g. 04:30 PM"
                        value={scheduleForm.time}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#1C1D1A]">Interview Mode</label>
                      <select
                        value={scheduleForm.mode}
                        onChange={(e: any) => setScheduleForm({ ...scheduleForm, mode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]"
                      >
                        <option value="In-Person (SYC Hub)">In-Person (SYC Hub)</option>
                        <option value="Google Meet">Google Meet</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#1C1D1A]">Assigned Interviewer</label>
                      <input
                        type="text"
                        value={scheduleForm.interviewerName}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#1C1D1A]">Room or Google Meet Link</label>
                    <input
                      type="text"
                      placeholder="e.g. https://meet.google.com/xyz or Room 304"
                      value={scheduleForm.meetLinkOrRoom}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, meetLinkOrRoom: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={scheduleSubmitting}
                      className="px-6 py-2.5 rounded-full bg-[#1C1D1A] hover:bg-[#2D4A3E] text-white font-semibold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-1.5"
                    >
                      {scheduleSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
                      <span>Confirm & Schedule Slot</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
