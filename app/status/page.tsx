"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Calendar,
  AlertCircle,
  FileCheck,
  UserCheck,
  Send,
  Loader2,
  Sparkles,
  MapPin,
  Edit3,
  Check,
  Video,
  GitBranch,
  Palette,
  Film
} from "lucide-react";

export default function StatusTrackingPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Edit Task Link State
  const [showEditTask, setShowEditTask] = useState(false);
  const [editTaskData, setEditTaskData] = useState({
    githubUrl: "",
    liveUrl: "",
    figmaDriveUrl: "",
    videoDriveUrl: "",
    notes: "",
  });
  const [taskUpdating, setTaskUpdating] = useState(false);
  const [taskUpdateSuccess, setTaskUpdateSuccess] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);
    setResult(null);

    try {
      const res = await fetch(`/api/recruitment/${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.application) {
        // Fallback to query search
        const fallbackRes = await fetch(`/api/recruitment?search=${encodeURIComponent(query.trim())}`);
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success && fallbackData.applications && fallbackData.applications.length > 0) {
          setResult({
            application: fallbackData.applications[0],
            interviews: [],
            evaluations: []
          });
          initEditForm(fallbackData.applications[0]);
          return;
        }
        throw new Error(data.error || `No candidate application found for "${query}".`);
      }

      setResult(data);
      initEditForm(data.application);
    } catch (err: any) {
      setError(err.message || "An error occurred while tracking status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadIcs = (interview: any) => {
    if (!app) return;
    const title = `SYC 2026 Recruitment Interview - ${app.fullName}`;
    const description = `Student Yogic Club recruitment personal interaction with ${interview.interviewerName}. Mode/Room: ${interview.meetLinkOrRoom}. Notes: ${interview.notes || "None"}`;
    const location = interview.meetLinkOrRoom || "SYC Innovation Hub, Room 304, ABES Campus";
    
    // Format date: e.g. 2026-10-07 -> 20261007T110000Z
    const cleanDate = (interview.date || "2026-10-07").replace(/-/g, "");
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Student Yogic Club//Recruitment 2026//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${cleanDate}T110000Z`,
      `DTEND:${cleanDate}T114500Z`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SYC_Interview_${app.id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const initEditForm = (app: any) => {
    setEditTaskData({
      githubUrl: app.taskDetails?.githubUrl || "",
      liveUrl: app.taskDetails?.liveUrl || "",
      figmaDriveUrl: app.taskDetails?.figmaDriveUrl || "",
      videoDriveUrl: app.taskDetails?.videoDriveUrl || "",
      notes: app.taskDetails?.notes || "",
    });
  };

  const handleUpdateTaskLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result?.application) return;

    setTaskUpdating(true);
    setTaskUpdateSuccess("");

    try {
      const res = await fetch(`/api/recruitment/${result.application.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: result.application.email,
          ...editTaskData,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update task submission");
      }

      setTaskUpdateSuccess("Task submission links updated successfully!");
      setResult((prev: any) => ({
        ...prev,
        application: data.application,
      }));
      setTimeout(() => setShowEditTask(false), 2000);
    } catch (err: any) {
      alert(err.message || "Failed to update task links");
    } finally {
      setTaskUpdating(false);
    }
  };

  const getTimelineSteps = (status: string) => {
    const isShortlisted = status === "Interview Shortlisted" || status === "Accepted";
    const isAccepted = status === "Accepted";

    return [
      {
        title: "Application Received",
        desc: "Candidate data and academic standing recorded.",
        done: true,
      },
      {
        title: "Task Review Underway",
        desc: "Domain leads evaluating code, design, or video submission.",
        done: true,
      },
      {
        title: "Interview Shortlist",
        desc: "Selected candidates invited for personal interactions.",
        done: isShortlisted,
        active: status === "Under Review" || status === "Interview Shortlisted",
      },
      {
        title: "Club Induction & Welcome",
        desc: "Induction into SYC and orientation retreat.",
        done: isAccepted,
      },
    ];
  };

  const app = result?.application;
  const interviews = result?.interviews || [];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1D1A] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8E4DC]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#52504A] hover:text-[#2D4A3E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Overview</span>
          </Link>

          <span className="font-editorial text-2xl font-bold tracking-tight text-[#1C1D1A]">
            SYC
          </span>

          <Link
            href="/apply"
            className="text-xs font-semibold text-[#2D4A3E] hover:underline"
          >
            New Application
          </Link>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] text-[#2D4A3E] text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Real-time Candidate Tracking</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#1C1D1A]">
            Track Application Status
          </h1>
          <p className="text-sm text-[#52504A] max-w-md mx-auto">
            Enter your unique Application ID (e.g. <code>SYC-2026-XXXX</code>) or registered College Email to check your progress.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="e.g. SYC-2026-0814 or your.email@abes.ac.in"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-5 pr-28 py-3.5 rounded-full bg-white border border-[#E8E4DC] text-sm text-[#1C1D1A] placeholder:text-[#A6A298] shadow-sm focus:outline-none focus:border-[#2D4A3E] focus:ring-2 focus:ring-[#2D4A3E]/20 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-1.5 px-5 py-2.5 rounded-full bg-[#1C1D1A] hover:bg-[#2D4A3E] text-white text-xs font-semibold tracking-wider transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Check</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 max-w-xl mx-auto">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Card */}
        <AnimatePresence>
          {app && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              className="editorial-card p-6 sm:p-8 bg-white border border-[#E8E4DC] shadow-xl space-y-6"
            >
              {/* Top Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#787670]">
                    Application ID
                  </span>
                  <h3 className="font-mono text-2xl font-bold text-[#1C1D1A]">{app.id}</h3>
                  <p className="text-sm font-semibold text-[#52504A] mt-0.5">{app.fullName}</p>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#787670] mb-1">
                    Current Stage
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      app.status === "Interview Shortlisted"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : app.status === "Accepted"
                        ? "bg-purple-50 text-purple-800 border-purple-300"
                        : "bg-amber-50 text-amber-800 border-amber-300"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    {app.status || "Under Review"}
                  </span>
                </div>
              </div>

              {/* ACCEPTED INDUCTION BANNER (IF ACCEPTED) */}
              {app.status === "Accepted" && (
                <div className="p-5 rounded-2xl bg-[#EAF2EC] border border-[#2D4A3E]/30 text-[#1C1D1A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2D4A3E]">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>Induction Accepted // Cohort 2026–27</span>
                    </div>
                    <p className="text-xs text-[#52504A]">
                      Congratulations! Your official acceptance letter and cryptographic credential have been issued.
                    </p>
                  </div>
                  <Link
                    href={`/credentials/${app.id}`}
                    className="px-5 py-2.5 rounded-full bg-[#2D4A3E] hover:bg-[#1C1D1A] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md inline-flex items-center gap-2 flex-shrink-0"
                  >
                    <span>View Official Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* SCHEDULED INTERVIEW APPOINTMENT BANNER (IF SCHEDULED) */}
              {interviews.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#EAF2EC] border border-[#2D4A3E]/30 text-[#1C1D1A] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2D4A3E]">
                      <Calendar className="w-4 h-4" />
                      <span>Interview Appointment Confirmed</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadIcs(interviews[0])}
                      className="px-3 py-1 rounded-lg bg-white border border-[#2D4A3E]/30 text-[#2D4A3E] hover:bg-[#2D4A3E] hover:text-white text-[11px] font-semibold transition-all inline-flex items-center gap-1 shadow-xs"
                      title="Download calendar event file (.ics)"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Add to Calendar (.ics)</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[#52504A] block">Date & Time:</span>
                      <strong className="text-sm font-bold text-[#1C1D1A]">{interviews[0].date} at {interviews[0].time}</strong>
                    </div>
                    <div>
                      <span className="text-[#52504A] block">Format & Location:</span>
                      <strong className="text-[#1C1D1A]">{interviews[0].mode}</strong>
                      <p className="text-[11px] text-[#2D4A3E] font-medium">{interviews[0].meetLinkOrRoom}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#52504A] pt-1 border-t border-[#2D4A3E]/20">
                    Interviewer: <strong>{interviews[0].interviewerName}</strong>. Please arrive or join 5 minutes early.
                  </p>
                </div>
              )}

              {/* Recruitment Timeline Progress */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1D1A]">
                  Recruitment Progression
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {getTimelineSteps(app.status).map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        step.done
                          ? "bg-[#EAF2EC] border-[#2D4A3E]/30 text-[#1C1D1A]"
                          : step.active
                          ? "bg-white border-[#2D4A3E] ring-2 ring-[#2D4A3E]/10"
                          : "bg-[#FBF9F5] border-[#E8E4DC] text-[#A6A298]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold">0{idx + 1}</span>
                        {step.done && <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4A3E]" />}
                      </div>
                      <p className="font-bold">{step.title}</p>
                      <p className="text-[11px] leading-tight text-[#52504A]">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submitted Details & Task Update Trigger */}
              <div className="p-5 rounded-2xl bg-[#F5F2EB] border border-[#E8E4DC] text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-2">
                  <span className="text-[#787670] font-semibold uppercase tracking-wider">Candidate Profile</span>
                  <span className="font-bold text-[#2D4A3E] uppercase">{app.primaryDepartment || app.department} Domain</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#787670]">Academic Standing:</span>
                    <p className="font-semibold text-[#1C1D1A]">{app.year} • {app.branch}</p>
                  </div>
                  <div>
                    <span className="text-[#787670]">Roll Number:</span>
                    <p className="font-semibold text-[#1C1D1A]">{app.rollNumber}</p>
                  </div>
                </div>

                {/* Task Links */}
                <div className="pt-2 border-t border-[#E8E4DC] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#787670] font-semibold">Submitted Task Deliverables:</span>
                    <button
                      type="button"
                      onClick={() => setShowEditTask(!showEditTask)}
                      className="text-xs font-semibold text-[#2D4A3E] hover:underline inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Update Task Links</span>
                    </button>
                  </div>

                  {app.taskDetails?.githubUrl && (
                    <div className="flex items-center gap-2">
                      <strong className="text-[#1C1D1A]">GitHub:</strong>
                      <a href={app.taskDetails.githubUrl} target="_blank" className="text-[#2D4A3E] hover:underline truncate">
                        {app.taskDetails.githubUrl}
                      </a>
                    </div>
                  )}
                  {app.taskDetails?.liveUrl && (
                    <div className="flex items-center gap-2">
                      <strong className="text-[#1C1D1A]">Live Webpage:</strong>
                      <a href={app.taskDetails.liveUrl} target="_blank" className="text-[#2D4A3E] hover:underline truncate">
                        {app.taskDetails.liveUrl}
                      </a>
                    </div>
                  )}
                  {app.taskDetails?.figmaDriveUrl && (
                    <div className="flex items-center gap-2">
                      <strong className="text-[#1C1D1A]">Drive / Figma:</strong>
                      <a href={app.taskDetails.figmaDriveUrl} target="_blank" className="text-[#2D4A3E] hover:underline truncate">
                        {app.taskDetails.figmaDriveUrl}
                      </a>
                    </div>
                  )}
                  {app.taskDetails?.videoDriveUrl && (
                    <div className="flex items-center gap-2">
                      <strong className="text-[#1C1D1A]">Video Link:</strong>
                      <a href={app.taskDetails.videoDriveUrl} target="_blank" className="text-[#2D4A3E] hover:underline truncate">
                        {app.taskDetails.videoDriveUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* TASK UPDATE DRAWER / MODAL */}
              {showEditTask && (
                <form onSubmit={handleUpdateTaskLinks} className="p-5 rounded-2xl bg-white border border-[#2D4A3E]/30 space-y-4 text-xs shadow-md">
                  <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-2">
                    <span className="font-bold text-[#1C1D1A] uppercase tracking-wider flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-[#2D4A3E]" />
                      <span>Update Submission Links (Before Wed 11:59 PM)</span>
                    </span>
                    <button type="button" onClick={() => setShowEditTask(false)} className="text-[#787670] hover:text-black">✕</button>
                  </div>

                  {taskUpdateSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{taskUpdateSuccess}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {app.primaryDepartment === "tech" && (
                      <>
                        <div className="space-y-1">
                          <label className="font-bold text-[#1C1D1A]">GitHub Repository URL</label>
                          <input
                            type="url"
                            value={editTaskData.githubUrl}
                            onChange={(e) => setEditTaskData({ ...editTaskData, githubUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-[#1C1D1A]">Live Deployed URL</label>
                          <input
                            type="url"
                            value={editTaskData.liveUrl}
                            onChange={(e) => setEditTaskData({ ...editTaskData, liveUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]"
                          />
                        </div>
                      </>
                    )}

                    {app.primaryDepartment === "design" && (
                      <div className="space-y-1">
                        <label className="font-bold text-[#1C1D1A]">Figma / Google Drive Link (1080x1080 & 1080x1920)</label>
                        <input
                          type="url"
                          value={editTaskData.figmaDriveUrl}
                          onChange={(e) => setEditTaskData({ ...editTaskData, figmaDriveUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]"
                        />
                      </div>
                    )}

                    {app.primaryDepartment === "video" && (
                      <div className="space-y-1">
                        <label className="font-bold text-[#1C1D1A]">Video Link (Google Drive / YouTube Reel)</label>
                        <input
                          type="url"
                          value={editTaskData.videoDriveUrl}
                          onChange={(e) => setEditTaskData({ ...editTaskData, videoDriveUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="font-bold text-[#1C1D1A]">Notes on Changes Made</label>
                      <input
                        type="text"
                        placeholder="e.g. Added responsive mobile layout, improved color grade..."
                        value={editTaskData.notes}
                        onChange={(e) => setEditTaskData({ ...editTaskData, notes: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEditTask(false)}
                      className="px-4 py-2 rounded-xl border border-[#E8E4DC] hover:bg-zinc-100 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={taskUpdating}
                      className="px-5 py-2 rounded-xl bg-[#2D4A3E] hover:bg-[#1C1D1A] text-white font-semibold inline-flex items-center gap-1.5"
                    >
                      {taskUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <SaveIcon />}
                      <span>Save Updated Links</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo IDs Quick Test Card */}
        <div className="p-4 rounded-2xl border border-dashed border-[#E8E4DC] text-center text-xs text-[#787670] space-y-1">
          <p className="font-semibold text-[#1C1D1A]">Demo Application IDs to Test:</p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono">
            <button
              type="button"
              onClick={() => { setQuery("SYC-2026-0814"); }}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E4DC] hover:border-[#2D4A3E] text-[#1C1D1A] transition-colors"
            >
              SYC-2026-0814 (Tech • Scheduled)
            </button>
            <button
              type="button"
              onClick={() => { setQuery("SYC-2026-0922"); }}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E4DC] hover:border-[#2D4A3E] text-[#1C1D1A] transition-colors"
            >
              SYC-2026-0922 (Design • Under Review)
            </button>
            <button
              type="button"
              onClick={() => { setQuery("SYC-2026-1048"); }}
              className="px-2.5 py-1 rounded-lg bg-[#EAF2EC] border border-[#2D4A3E]/30 hover:border-[#2D4A3E] text-[#2D4A3E] font-semibold transition-colors"
            >
              SYC-2026-1048 (Video • Accepted & Credential)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SaveIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
