import { z } from "zod";

// Schema for New Candidate Application
export const applicationCreateSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("A valid email address is required"),
  phone: z.string().min(10, "Phone number must have at least 10 digits"),
  rollNumber: z.string().min(2, "University Roll Number or Student ID is required"),
  branch: z.string().min(2, "Branch / Department is required"),
  year: z.enum(["1st Year", "2nd Year", "3rd Year"]).default("1st Year"),
  hostelStatus: z.enum(["Day Scholar", "Hosteler", "PG / Day Resident"]).default("Day Scholar"),
  primaryDepartment: z.enum(["tech", "design", "video", "ops", "content"]),
  secondaryDepartment: z.string().optional().default("none"),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
  skills: z.array(z.string()).default([]),
  taskDetails: z.object({
    taskType: z.string().default("Interview Task"),
    githubUrl: z.string().url("GitHub URL must be a valid link").or(z.literal("")).optional(),
    liveUrl: z.string().url("Live URL must be a valid link").or(z.literal("")).optional(),
    figmaDriveUrl: z.string().url("Figma/Drive URL must be a valid link").or(z.literal("")).optional(),
    videoDriveUrl: z.string().url("Video URL must be a valid link").or(z.literal("")).optional(),
    notes: z.string().max(1000).optional().default(""),
  }).default({
    taskType: "Interview Task",
    notes: ""
  }),
  whyJoin: z.string().min(10, "Please share a meaningful reason for wanting to join SYC"),
  mindfulPerspective: z.string().optional().default(""),
  initiativeIdea: z.string().optional().default(""),
  timeCommitment: z.string().default("6-8 hours/week"),
});

// Schema for Updating Application Status
export const statusUpdateSchema = z.object({
  id: z.string().min(1, "Application ID is required"),
  status: z.enum([
    "Under Review",
    "Task Received",
    "Interview Shortlisted",
    "Accepted",
    "Waitlisted",
    "Rejected",
  ]),
  reviewer: z.string().optional().default("Recruitment Committee"),
  notes: z.string().optional().default(""),
});

// Schema for Candidate updating their Task submission links
export const taskUpdateSchema = z.object({
  id: z.string().min(1, "Application ID is required"),
  email: z.string().email("Email is required for identity confirmation"),
  githubUrl: z.string().url("GitHub URL must be valid").or(z.literal("")).optional(),
  liveUrl: z.string().url("Live URL must be valid").or(z.literal("")).optional(),
  figmaDriveUrl: z.string().url("Drive/Figma link must be valid").or(z.literal("")).optional(),
  videoDriveUrl: z.string().url("Video link must be valid").or(z.literal("")).optional(),
  notes: z.string().optional().default(""),
});

// Schema for Interviewer Scorecard / Evaluation
export const evaluationCreateSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  reviewerName: z.string().min(2, "Reviewer name is required"),
  technicalScore: z.number().min(1).max(10),
  creativeScore: z.number().min(1).max(10),
  culturalFitScore: z.number().min(1).max(10),
  comments: z.string().min(5, "Comments must provide constructive reasoning"),
  recommendation: z.enum(["Strong Accept", "Accept", "Neutral", "Decline"]),
});

// Schema for Scheduling an Interview Slot
export const interviewSlotSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  candidateName: z.string().min(1, "Candidate name is required"),
  candidateEmail: z.string().email("Candidate email is required"),
  department: z.string().min(1, "Department is required"),
  date: z.string().min(1, "Date is required (YYYY-MM-DD)"),
  time: z.string().min(1, "Time slot is required"),
  mode: z.enum(["In-Person (SYC Hub)", "Google Meet"]).default("In-Person (SYC Hub)"),
  meetLinkOrRoom: z.string().min(1, "Location or Meeting link is required"),
  interviewerName: z.string().min(1, "Assigned interviewer is required"),
  notes: z.string().optional().default(""),
});
