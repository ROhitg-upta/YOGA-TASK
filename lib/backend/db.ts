import fs from "fs";
import path from "path";
import {
  ApplicationRecord,
  EvaluationRecord,
  InterviewSlotRecord,
  ActivityLogRecord,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

const FILES = {
  applications: path.join(DATA_DIR, "applications.json"),
  evaluations: path.join(DATA_DIR, "evaluations.json"),
  interviews: path.join(DATA_DIR, "interviews.json"),
  logs: path.join(DATA_DIR, "activity_logs.json"),
};

// Safe atomic writer using temporary file to prevent data corruption
function safeWriteFile(filePath: string, data: any) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempPath = `${filePath}.${Date.now()}.tmp`;
  const serialized = JSON.stringify(data, null, 2);
  fs.writeFileSync(tempPath, serialized, "utf-8");
  fs.renameSync(tempPath, filePath);
}

function safeReadFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

// Initial Seed Data to make the system rich and realistic out of the box
const SEED_APPLICATIONS: ApplicationRecord[] = [
  {
    id: "SYC-2026-0814",
    fullName: "Aarav Sharma",
    email: "aarav.sharma@abes.ac.in",
    phone: "+91 98765 43210",
    rollNumber: "2400320100045",
    branch: "Computer Science & Engineering",
    year: "2nd Year",
    hostelStatus: "Day Scholar",
    primaryDepartment: "tech",
    secondaryDepartment: "design",
    skillLevel: "Advanced",
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    taskDetails: {
      taskType: "Task 3: SYC Recruitment Webpage",
      githubUrl: "https://github.com/aarav-dev/syc-web-experience",
      liveUrl: "https://syc-experience.vercel.app",
      figmaDriveUrl: "",
      videoDriveUrl: "",
      notes: "Built with Next.js 15, Tailwind, and custom luxury editorial components."
    },
    whyJoin: "I want to blend meditative discipline with clean engineering practices.",
    mindfulPerspective: "Morning pranayama helps me stay completely focused during 5-hour hackathons.",
    initiativeIdea: "Host a Mindful Code Sprint where participants take 5-minute breathing pauses between sprints.",
    timeCommitment: "8-10 hours/week",
    status: "Interview Shortlisted",
    submittedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    id: "SYC-2026-0922",
    fullName: "Sanya Kapoor",
    email: "sanya.kapoor@abes.ac.in",
    phone: "+91 98111 22334",
    rollNumber: "2500320130089",
    branch: "Information Technology",
    year: "1st Year",
    hostelStatus: "Hosteler",
    primaryDepartment: "design",
    secondaryDepartment: "video",
    skillLevel: "Intermediate",
    skills: ["Figma", "Illustrator", "Photoshop", "Editorial Layouts"],
    taskDetails: {
      taskType: "Task 1: SYC Wellness Week Campaign",
      githubUrl: "",
      liveUrl: "",
      figmaDriveUrl: "https://drive.google.com/drive/folders/sample-syc-wellness-week",
      videoDriveUrl: "",
      notes: "Created 1080x1080 Post and 1080x1920 Story for 'SYC Wellness Week' with strict text-only SYC branding."
    },
    whyJoin: "SYC offers the most thoughtful aesthetic and creative freedom on campus.",
    mindfulPerspective: "Designing with intention rather than rushing creates lasting visual impact.",
    initiativeIdea: "Curate a printed physical zine on campus wellness and creative mindfulness.",
    timeCommitment: "6-8 hours/week",
    status: "Under Review",
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "SYC-2026-1048",
    fullName: "Kabir Mehta",
    email: "kabir.mehta@abes.ac.in",
    phone: "+91 97123 45678",
    rollNumber: "2500320100210",
    branch: "Computer Science (AI & ML)",
    year: "1st Year",
    hostelStatus: "Day Scholar",
    primaryDepartment: "video",
    secondaryDepartment: "tech",
    skillLevel: "Advanced",
    skills: ["Premiere Pro", "After Effects", "Sound Design", "DaVinci Resolve"],
    taskDetails: {
      taskType: "Task 2: Promotional Reel (20–30s)",
      githubUrl: "",
      liveUrl: "",
      figmaDriveUrl: "",
      videoDriveUrl: "https://drive.google.com/file/d/sample-syc-promotional-reel",
      notes: "28-second dynamic reel with beat-synced cuts, typography text animations, and color grading."
    },
    whyJoin: "Passionate about capturing the raw energy of collegiate wellness and tech.",
    mindfulPerspective: "Editing rhythm requires deep presence and active listening.",
    initiativeIdea: "Produce a mini-documentary series on campus innovators and their mental health.",
    timeCommitment: "6-8 hours/week",
    status: "Accepted",
    submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  }
];

const SEED_EVALUATIONS: EvaluationRecord[] = [
  {
    id: "EV-01",
    applicationId: "SYC-2026-0814",
    reviewerName: "Arjun Rathore (Tech Lead)",
    technicalScore: 9,
    creativeScore: 8,
    culturalFitScore: 10,
    overallScore: 9.0,
    comments: "Exceptional code quality. Clean Next.js components and responsive layout. Highly aligned with SYC mindful ethos.",
    recommendation: "Strong Accept",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "EV-02",
    applicationId: "SYC-2026-1048",
    reviewerName: "Rhea Mukherjee (Media Lead)",
    technicalScore: 9,
    creativeScore: 10,
    culturalFitScore: 9,
    overallScore: 9.3,
    comments: "Brilliant color grading and tempo. The text branding compliance (no official logos) was strictly honored.",
    recommendation: "Strong Accept",
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  }
];

const SEED_INTERVIEWS: InterviewSlotRecord[] = [
  {
    id: "INT-01",
    applicationId: "SYC-2026-0814",
    candidateName: "Aarav Sharma",
    candidateEmail: "aarav.sharma@abes.ac.in",
    department: "Technical & Web Engineering",
    date: "2026-10-07",
    time: "04:30 PM",
    mode: "In-Person (SYC Hub)",
    meetLinkOrRoom: "SYC Innovation Hub, Room 304, ABES Campus",
    interviewerName: "Arjun Rathore",
    notes: "Review repository architecture and discuss state management approaches.",
    status: "Scheduled",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

export class Database {
  private static instance: Database;

  private constructor() {
    this.ensureInitialized();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private ensureInitialized() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(FILES.applications)) {
      safeWriteFile(FILES.applications, SEED_APPLICATIONS);
    }
    if (!fs.existsSync(FILES.evaluations)) {
      safeWriteFile(FILES.evaluations, SEED_EVALUATIONS);
    }
    if (!fs.existsSync(FILES.interviews)) {
      safeWriteFile(FILES.interviews, SEED_INTERVIEWS);
    }
    if (!fs.existsSync(FILES.logs)) {
      safeWriteFile(FILES.logs, [
        {
          id: "LOG-INIT",
          actor: "System",
          action: "DATABASE_INITIALIZED",
          details: "Recruitment database initialized with seed records",
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  }

  // Applications
  public getApplications(): ApplicationRecord[] {
    return safeReadFile<ApplicationRecord[]>(FILES.applications, []);
  }

  public saveApplications(apps: ApplicationRecord[]): void {
    safeWriteFile(FILES.applications, apps);
  }

  // Evaluations
  public getEvaluations(): EvaluationRecord[] {
    return safeReadFile<EvaluationRecord[]>(FILES.evaluations, []);
  }

  public saveEvaluations(evals: EvaluationRecord[]): void {
    safeWriteFile(FILES.evaluations, evals);
  }

  // Interview Slots
  public getInterviewSlots(): InterviewSlotRecord[] {
    return safeReadFile<InterviewSlotRecord[]>(FILES.interviews, []);
  }

  public saveInterviewSlots(slots: InterviewSlotRecord[]): void {
    safeWriteFile(FILES.interviews, slots);
  }

  // Activity Logs
  public getActivityLogs(): ActivityLogRecord[] {
    return safeReadFile<ActivityLogRecord[]>(FILES.logs, []);
  }

  public logActivity(actor: string, action: string, details: string, applicationId?: string): void {
    const logs = this.getActivityLogs();
    const newLog: ActivityLogRecord = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      applicationId,
      actor,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // Keep last 1000 logs
    if (logs.length > 1000) logs.pop();
    safeWriteFile(FILES.logs, logs);
  }
}

export const db = Database.getInstance();
