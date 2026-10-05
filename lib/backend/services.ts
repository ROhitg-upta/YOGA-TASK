import { db } from "./db";
import {
  ApplicationRecord,
  EvaluationRecord,
  InterviewSlotRecord,
  AnalyticsMetrics,
  ApplicationStatus,
} from "./types";
import {
  applicationCreateSchema,
  statusUpdateSchema,
  taskUpdateSchema,
  evaluationCreateSchema,
  interviewSlotSchema,
} from "./schemas";
import { z } from "zod";

export class ApplicationService {
  public static async create(rawData: any): Promise<ApplicationRecord> {
    const validated = applicationCreateSchema.parse(rawData);

    // Generate unique readable candidate ID (e.g. SYC-2026-XXXX)
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `SYC-2026-${suffix}`;

    const newApp: ApplicationRecord = {
      id: newId,
      fullName: validated.fullName.trim(),
      email: validated.email.trim().toLowerCase(),
      phone: validated.phone.trim(),
      rollNumber: validated.rollNumber.trim(),
      branch: validated.branch.trim(),
      year: validated.year,
      hostelStatus: validated.hostelStatus,
      primaryDepartment: validated.primaryDepartment,
      secondaryDepartment: validated.secondaryDepartment || "none",
      skillLevel: validated.skillLevel,
      skills: validated.skills,
      taskDetails: {
        taskType: validated.taskDetails.taskType,
        githubUrl: validated.taskDetails.githubUrl || "",
        liveUrl: validated.taskDetails.liveUrl || "",
        figmaDriveUrl: validated.taskDetails.figmaDriveUrl || "",
        videoDriveUrl: validated.taskDetails.videoDriveUrl || "",
        notes: validated.taskDetails.notes || "",
        updatedAt: new Date().toISOString(),
      },
      whyJoin: validated.whyJoin.trim(),
      mindfulPerspective: validated.mindfulPerspective?.trim() || "",
      initiativeIdea: validated.initiativeIdea?.trim() || "",
      timeCommitment: validated.timeCommitment,
      status: "Under Review",
      submittedAt: new Date().toISOString(),
    };

    const apps = db.getApplications();
    apps.unshift(newApp);
    db.saveApplications(apps);

    db.logActivity(
      newApp.fullName,
      "APPLICATION_SUBMITTED",
      `New application submitted for ${newApp.primaryDepartment} department.`,
      newApp.id
    );

    return newApp;
  }

  public static async getById(id: string): Promise<{
    application: ApplicationRecord | null;
    evaluations: EvaluationRecord[];
    interviews: InterviewSlotRecord[];
  }> {
    const apps = db.getApplications();
    const app = apps.find(a => a.id.toLowerCase() === id.toLowerCase() || a.email.toLowerCase() === id.toLowerCase()) || null;

    if (!app) {
      return { application: null, evaluations: [], interviews: [] };
    }

    const evaluations = db.getEvaluations().filter(e => e.applicationId === app.id);
    const interviews = db.getInterviewSlots().filter(i => i.applicationId === app.id);

    return { application: app, evaluations, interviews };
  }

  public static async search(params: {
    query?: string;
    department?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    let apps = db.getApplications();

    if (params.query) {
      const q = params.query.toLowerCase().trim();
      apps = apps.filter(
        a =>
          a.id.toLowerCase().includes(q) ||
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.rollNumber.toLowerCase().includes(q)
      );
    }

    if (params.department && params.department !== "all") {
      apps = apps.filter(
        a => a.primaryDepartment === params.department || (a as any).department === params.department
      );
    }

    if (params.status && params.status !== "all") {
      apps = apps.filter(a => a.status === params.status);
    }

    const total = apps.length;
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 50);
    const offset = (page - 1) * limit;
    const paginated = apps.slice(offset, offset + limit);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      applications: paginated,
    };
  }

  public static async updateStatus(rawData: any): Promise<ApplicationRecord> {
    const validated = statusUpdateSchema.parse(rawData);

    const apps = db.getApplications();
    const idx = apps.findIndex(a => a.id === validated.id);
    if (idx === -1) {
      throw new Error(`Application ${validated.id} not found.`);
    }

    const oldStatus = apps[idx].status;
    apps[idx].status = validated.status;
    apps[idx].updatedAt = new Date().toISOString();
    db.saveApplications(apps);

    db.logActivity(
      validated.reviewer,
      "STATUS_UPDATED",
      `Changed status from "${oldStatus}" to "${validated.status}". Notes: ${validated.notes || "None"}`,
      validated.id
    );

    return apps[idx];
  }

  public static async updateTaskLinks(rawData: any): Promise<ApplicationRecord> {
    const validated = taskUpdateSchema.parse(rawData);

    const apps = db.getApplications();
    const idx = apps.findIndex(
      a => a.id === validated.id && a.email.toLowerCase() === validated.email.toLowerCase()
    );

    if (idx === -1) {
      throw new Error("Application not found or email does not match applicant record.");
    }

    apps[idx].taskDetails = {
      ...apps[idx].taskDetails,
      githubUrl: validated.githubUrl !== undefined ? validated.githubUrl : apps[idx].taskDetails.githubUrl,
      liveUrl: validated.liveUrl !== undefined ? validated.liveUrl : apps[idx].taskDetails.liveUrl,
      figmaDriveUrl: validated.figmaDriveUrl !== undefined ? validated.figmaDriveUrl : apps[idx].taskDetails.figmaDriveUrl,
      videoDriveUrl: validated.videoDriveUrl !== undefined ? validated.videoDriveUrl : apps[idx].taskDetails.videoDriveUrl,
      notes: validated.notes || apps[idx].taskDetails.notes,
      updatedAt: new Date().toISOString(),
    };
    apps[idx].status = "Task Received";
    apps[idx].updatedAt = new Date().toISOString();

    db.saveApplications(apps);

    db.logActivity(
      apps[idx].fullName,
      "TASK_LINKS_UPDATED",
      "Applicant updated their task submission links prior to deadline.",
      apps[idx].id
    );

    return apps[idx];
  }

  public static exportToCsv(): string {
    const apps = db.getApplications();
    const headers = [
      "Application ID",
      "Full Name",
      "Email",
      "Phone",
      "Roll Number",
      "Branch",
      "Year",
      "Residency",
      "Primary Department",
      "Secondary Department",
      "Skill Level",
      "GitHub Repo",
      "Live Demo",
      "Drive/Figma Link",
      "Video Link",
      "Status",
      "Submitted At",
    ];

    const rows = apps.map(a => [
      `"${a.id}"`,
      `"${a.fullName.replace(/"/g, '""')}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.rollNumber}"`,
      `"${a.branch}"`,
      `"${a.year}"`,
      `"${a.hostelStatus}"`,
      `"${a.primaryDepartment}"`,
      `"${a.secondaryDepartment || 'None'}"`,
      `"${a.skillLevel}"`,
      `"${a.taskDetails?.githubUrl || ''}"`,
      `"${a.taskDetails?.liveUrl || ''}"`,
      `"${a.taskDetails?.figmaDriveUrl || ''}"`,
      `"${a.taskDetails?.videoDriveUrl || ''}"`,
      `"${a.status}"`,
      `"${a.submittedAt}"`,
    ]);

    return [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
  }
}

export class EvaluationService {
  public static async create(rawData: any): Promise<EvaluationRecord> {
    const validated = evaluationCreateSchema.parse(rawData);

    const overallScore = Number(
      ((validated.technicalScore + validated.creativeScore + validated.culturalFitScore) / 3).toFixed(1)
    );

    const newEval: EvaluationRecord = {
      id: `EV-${Date.now().toString().slice(-6)}`,
      applicationId: validated.applicationId,
      reviewerName: validated.reviewerName,
      technicalScore: validated.technicalScore,
      creativeScore: validated.creativeScore,
      culturalFitScore: validated.culturalFitScore,
      overallScore,
      comments: validated.comments,
      recommendation: validated.recommendation,
      createdAt: new Date().toISOString(),
    };

    const evals = db.getEvaluations();
    evals.unshift(newEval);
    db.saveEvaluations(evals);

    db.logActivity(
      validated.reviewerName,
      "EVALUATION_LOGGED",
      `Score: ${overallScore}/10 (${validated.recommendation})`,
      validated.applicationId
    );

    return newEval;
  }

  public static getByApplicationId(applicationId: string): EvaluationRecord[] {
    return db.getEvaluations().filter(e => e.applicationId === applicationId);
  }
}

export class InterviewService {
  public static async schedule(rawData: any): Promise<InterviewSlotRecord> {
    const validated = interviewSlotSchema.parse(rawData);

    const newSlot: InterviewSlotRecord = {
      id: `INT-${Date.now().toString().slice(-6)}`,
      applicationId: validated.applicationId,
      candidateName: validated.candidateName,
      candidateEmail: validated.candidateEmail,
      department: validated.department,
      date: validated.date,
      time: validated.time,
      mode: validated.mode,
      meetLinkOrRoom: validated.meetLinkOrRoom,
      interviewerName: validated.interviewerName,
      notes: validated.notes || "",
      status: "Scheduled",
      createdAt: new Date().toISOString(),
    };

    const slots = db.getInterviewSlots();
    slots.unshift(newSlot);
    db.saveInterviewSlots(slots);

    // Auto-update application status to Interview Shortlisted
    try {
      await ApplicationService.updateStatus({
        id: validated.applicationId,
        status: "Interview Shortlisted",
        reviewer: validated.interviewerName,
        notes: `Interview scheduled on ${validated.date} at ${validated.time}`,
      });
    } catch {}

    db.logActivity(
      validated.interviewerName,
      "INTERVIEW_SCHEDULED",
      `Slot reserved on ${validated.date} (${validated.time}) via ${validated.mode}`,
      validated.applicationId
    );

    return newSlot;
  }

  public static getAll(): InterviewSlotRecord[] {
    return db.getInterviewSlots();
  }

  public static getByApplicationId(applicationId: string): InterviewSlotRecord[] {
    return db.getInterviewSlots().filter(i => i.applicationId === applicationId);
  }
}

export class AnalyticsService {
  public static getMetrics(): AnalyticsMetrics {
    const apps = db.getApplications();
    const evals = db.getEvaluations();
    const interviews = db.getInterviewSlots();

    const byDepartment: Record<string, number> = {};
    const byYear: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const bySkillLevel: Record<string, number> = {};

    apps.forEach(a => {
      const dept = a.primaryDepartment || (a as any).department || "tech";
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;

      const yr = a.year || "1st Year";
      byYear[yr] = (byYear[yr] || 0) + 1;

      const st = a.status || "Under Review";
      byStatus[st] = (byStatus[st] || 0) + 1;

      const skl = a.skillLevel || "Intermediate";
      bySkillLevel[skl] = (bySkillLevel[skl] || 0) + 1;
    });

    let totalTech = 0;
    let totalCreative = 0;
    let totalCultural = 0;
    let totalOverall = 0;

    evals.forEach(e => {
      totalTech += e.technicalScore;
      totalCreative += e.creativeScore;
      totalCultural += e.culturalFitScore;
      totalOverall += e.overallScore;
    });

    const evalCount = evals.length || 1;

    return {
      totalApplications: apps.length,
      byDepartment,
      byYear,
      byStatus,
      bySkillLevel,
      interviewsScheduled: interviews.length,
      evaluationsLogged: evals.length,
      averageScores: {
        technical: Number((totalTech / evalCount).toFixed(1)),
        creative: Number((totalCreative / evalCount).toFixed(1)),
        cultural: Number((totalCultural / evalCount).toFixed(1)),
        overall: Number((totalOverall / evalCount).toFixed(1)),
      },
      recentSubmissions: apps.slice(0, 5),
    };
  }
}
