export type ApplicationStatus =
  | "Under Review"
  | "Task Received"
  | "Interview Shortlisted"
  | "Accepted"
  | "Waitlisted"
  | "Rejected";

export type DepartmentKey = "tech" | "design" | "video" | "ops" | "content";

export interface TaskDetails {
  taskType: string;
  githubUrl?: string;
  liveUrl?: string;
  figmaDriveUrl?: string;
  videoDriveUrl?: string;
  notes?: string;
  updatedAt?: string;
}

export interface ApplicationRecord {
  id: string; // e.g. SYC-2026-0814
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  branch: string;
  year: string;
  hostelStatus: string;
  primaryDepartment: DepartmentKey | string;
  secondaryDepartment?: string;
  skillLevel: string;
  skills: string[];
  taskDetails: TaskDetails;
  whyJoin: string;
  mindfulPerspective?: string;
  initiativeIdea?: string;
  timeCommitment: string;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt?: string;
  tags?: string[];
}

export interface EvaluationRecord {
  id: string;
  applicationId: string;
  reviewerName: string;
  technicalScore: number; // 1-10
  creativeScore: number;  // 1-10
  culturalFitScore: number; // 1-10
  overallScore: number;   // calculated average
  comments: string;
  recommendation: "Strong Accept" | "Accept" | "Neutral" | "Decline";
  createdAt: string;
}

export interface InterviewSlotRecord {
  id: string;
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  department: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "04:30 PM"
  mode: "In-Person (SYC Hub)" | "Google Meet";
  meetLinkOrRoom: string;
  interviewerName: string;
  notes?: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";
  createdAt: string;
}

export interface ActivityLogRecord {
  id: string;
  applicationId?: string;
  actor: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface AnalyticsMetrics {
  totalApplications: number;
  byDepartment: Record<string, number>;
  byYear: Record<string, number>;
  byStatus: Record<string, number>;
  bySkillLevel: Record<string, number>;
  byBranch?: Record<string, number>;
  byHostel?: Record<string, number>;
  interviewsScheduled: number;
  evaluationsLogged: number;
  credentialsIssued?: number;
  averageScores: {
    technical: number;
    creative: number;
    cultural: number;
    overall: number;
  };
  recentSubmissions: ApplicationRecord[];
  activityLogs?: ActivityLogRecord[];
}

export interface CredentialRecord {
  id: string; // e.g. SYC-CRED-2026-0814
  applicationId: string;
  candidateName: string;
  rollNumber: string;
  department: string;
  cohort: string;
  role: string;
  certificateHash: string; // Cryptographic SHA-256 fingerprint
  issueDate: string;
  status: "Active" | "Revoked";
}
