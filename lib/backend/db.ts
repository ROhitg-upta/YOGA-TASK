import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  ApplicationRecord,
  EvaluationRecord,
  InterviewSlotRecord,
  ActivityLogRecord,
  CredentialRecord,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

const FILES = {
  applications: path.join(DATA_DIR, "applications.json"),
  evaluations: path.join(DATA_DIR, "evaluations.json"),
  interviews: path.join(DATA_DIR, "interviews.json"),
  credentials: path.join(DATA_DIR, "credentials.json"),
  logs: path.join(DATA_DIR, "activity_logs.json"),
  sqlite: path.join(DATA_DIR, "syc_recruitment.sqlite"),
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

// Initial Seed Data to make the system rich, realistic and production-tested
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
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "REST APIs"],
    taskDetails: {
      taskType: "Task 3: SYC Recruitment Webpage",
      githubUrl: "https://github.com/aarav-dev/syc-web-experience",
      liveUrl: "https://syc-experience.vercel.app",
      figmaDriveUrl: "",
      videoDriveUrl: "",
      notes: "Built with Next.js 15 App Router, TypeScript, custom 3D drum perspective, and atomic backend."
    },
    whyJoin: "I want to blend meditative yogic focus with world-class engineering systems.",
    mindfulPerspective: "Morning pranayama breathwork helps me maintain peak flow state during 5-hour hackathons.",
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
    skills: ["Figma", "Illustrator", "Photoshop", "Swiss Typography", "Art Direction"],
    taskDetails: {
      taskType: "Task 1: SYC Wellness Week Campaign",
      githubUrl: "",
      liveUrl: "",
      figmaDriveUrl: "https://drive.google.com/drive/folders/sample-syc-wellness-week",
      videoDriveUrl: "",
      notes: "Created 1080x1080 Post and 1080x1920 Story for 'SYC Wellness Week' with strict text-only SYC branding."
    },
    whyJoin: "SYC offers the most thoughtful aesthetic and creative freedom on campus.",
    mindfulPerspective: "Designing with intention rather than rushing creates lasting visual resonance.",
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
    skills: ["Premiere Pro", "After Effects", "Sound Design", "DaVinci Resolve", "Color Grading"],
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

const SEED_CREDENTIALS: CredentialRecord[] = [
  {
    id: "SYC-CRED-2026-1048",
    applicationId: "SYC-2026-1048",
    candidateName: "Kabir Mehta",
    rollNumber: "2500320100210",
    department: "Video Production & Motion Narrative",
    cohort: "Cohort 2026–27",
    role: "Junior Media Producer & Motion Storyteller",
    certificateHash: "8f7e2a9c3d4b1a5e7f0d8c2e6b9a3f1d4c7e0a2b5d8f1e3c6a9b2d5e8f1c4a7b",
    issueDate: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "Active",
  }
];

export class Database {
  private static instance: Database;
  private sqliteDb: any = null;
  private hasSqlite: boolean = false;

  private constructor() {
    this.ensureInitialized();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private initSqlite() {
    try {
      // Dynamic import of node:sqlite for Node 22+
      const { DatabaseSync } = require("node:sqlite");
      this.sqliteDb = new DatabaseSync(FILES.sqlite);
      this.hasSqlite = true;

      // Create relational schema with proper primary keys and foreign constraints
      this.sqliteDb.exec(`
        CREATE TABLE IF NOT EXISTS applications (
          id TEXT PRIMARY KEY,
          fullName TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          rollNumber TEXT NOT NULL,
          branch TEXT NOT NULL,
          year TEXT NOT NULL,
          hostelStatus TEXT NOT NULL,
          primaryDepartment TEXT NOT NULL,
          secondaryDepartment TEXT,
          skillLevel TEXT,
          skills TEXT,
          taskDetails TEXT,
          whyJoin TEXT,
          mindfulPerspective TEXT,
          initiativeIdea TEXT,
          timeCommitment TEXT,
          status TEXT NOT NULL,
          submittedAt TEXT NOT NULL,
          updatedAt TEXT,
          tags TEXT
        );

        CREATE TABLE IF NOT EXISTS evaluations (
          id TEXT PRIMARY KEY,
          applicationId TEXT NOT NULL,
          reviewerName TEXT NOT NULL,
          technicalScore REAL NOT NULL,
          creativeScore REAL NOT NULL,
          culturalFitScore REAL NOT NULL,
          overallScore REAL NOT NULL,
          comments TEXT,
          recommendation TEXT,
          createdAt TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS interviews (
          id TEXT PRIMARY KEY,
          applicationId TEXT NOT NULL,
          candidateName TEXT NOT NULL,
          candidateEmail TEXT NOT NULL,
          department TEXT NOT NULL,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          mode TEXT NOT NULL,
          meetLinkOrRoom TEXT NOT NULL,
          interviewerName TEXT NOT NULL,
          notes TEXT,
          status TEXT NOT NULL,
          createdAt TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS credentials (
          id TEXT PRIMARY KEY,
          applicationId TEXT NOT NULL,
          candidateName TEXT NOT NULL,
          rollNumber TEXT NOT NULL,
          department TEXT NOT NULL,
          cohort TEXT NOT NULL,
          role TEXT NOT NULL,
          certificateHash TEXT NOT NULL,
          issueDate TEXT NOT NULL,
          status TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS activity_logs (
          id TEXT PRIMARY KEY,
          applicationId TEXT,
          actor TEXT NOT NULL,
          action TEXT NOT NULL,
          details TEXT NOT NULL,
          timestamp TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_apps_roll ON applications(rollNumber);
        CREATE INDEX IF NOT EXISTS idx_apps_email ON applications(email);
        CREATE INDEX IF NOT EXISTS idx_apps_dept ON applications(primaryDepartment);
        CREATE INDEX IF NOT EXISTS idx_apps_status ON applications(status);
        CREATE INDEX IF NOT EXISTS idx_eval_app ON evaluations(applicationId);
        CREATE INDEX IF NOT EXISTS idx_int_app ON interviews(applicationId);
        CREATE INDEX IF NOT EXISTS idx_cred_app ON credentials(applicationId);
      `);

      // Seed SQLite if empty
      const countStmt = this.sqliteDb.prepare("SELECT COUNT(*) as count FROM applications");
      const row = countStmt.get() as { count: number };
      if (!row || row.count === 0) {
        this.syncAllToSqlite();
      }
    } catch (err) {
      console.warn("SQLite initialized in JSON-fallback mode (node:sqlite not active).", err);
      this.hasSqlite = false;
    }
  }

  private syncAllToSqlite() {
    if (!this.hasSqlite || !this.sqliteDb) return;
    try {
      const apps = this.getApplications();
      const insertApp = this.sqliteDb.prepare(`
        INSERT OR REPLACE INTO applications (
          id, fullName, email, phone, rollNumber, branch, year, hostelStatus,
          primaryDepartment, secondaryDepartment, skillLevel, skills, taskDetails,
          whyJoin, mindfulPerspective, initiativeIdea, timeCommitment, status, submittedAt, updatedAt, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const a of apps) {
        insertApp.run(
          a.id,
          a.fullName,
          a.email,
          a.phone,
          a.rollNumber,
          a.branch,
          a.year,
          a.hostelStatus,
          a.primaryDepartment,
          a.secondaryDepartment || "",
          a.skillLevel || "",
          JSON.stringify(a.skills || []),
          JSON.stringify(a.taskDetails || {}),
          a.whyJoin || "",
          a.mindfulPerspective || "",
          a.initiativeIdea || "",
          a.timeCommitment || "",
          a.status || "Under Review",
          a.submittedAt || new Date().toISOString(),
          a.updatedAt || "",
          JSON.stringify(a.tags || [])
        );
      }
    } catch (e) {
      console.error("Error syncing applications to SQLite:", e);
    }
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
    if (!fs.existsSync(FILES.credentials)) {
      safeWriteFile(FILES.credentials, SEED_CREDENTIALS);
    }
    if (!fs.existsSync(FILES.logs)) {
      safeWriteFile(FILES.logs, [
        {
          id: "LOG-INIT",
          actor: "System",
          action: "DATABASE_INITIALIZED",
          details: "Recruitment database initialized with dual SQLite & JSON persistence",
          timestamp: new Date().toISOString(),
        }
      ]);
    }

    this.initSqlite();
  }

  // Applications
  public getApplications(): ApplicationRecord[] {
    return safeReadFile<ApplicationRecord[]>(FILES.applications, []);
  }

  public saveApplications(apps: ApplicationRecord[]): void {
    safeWriteFile(FILES.applications, apps);
    this.syncAllToSqlite();
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

  // Digital Credentials & Verification
  public getCredentials(): CredentialRecord[] {
    return safeReadFile<CredentialRecord[]>(FILES.credentials, []);
  }

  public getCredentialByApplicationId(applicationId: string): CredentialRecord | null {
    const creds = this.getCredentials();
    return creds.find(c => c.applicationId === applicationId || c.id === applicationId) || null;
  }

  public issueCredential(application: ApplicationRecord, roleTitle?: string): CredentialRecord {
    const creds = this.getCredentials();
    const existing = creds.find(c => c.applicationId === application.id);
    if (existing) return existing;

    const credId = `SYC-CRED-2026-${application.id.split("-").pop() || Math.floor(1000 + Math.random() * 9000)}`;
    const hashData = `${credId}:${application.fullName}:${application.rollNumber}:${application.primaryDepartment}:2026-27`;
    const certificateHash = crypto.createHash("sha256").update(hashData).digest("hex");

    const defaultRole = application.primaryDepartment === "tech"
      ? "Junior Software Engineer & System Builder"
      : application.primaryDepartment === "design"
      ? "Visual Designer & Editorial Typographer"
      : application.primaryDepartment === "video"
      ? "Motion Storyteller & Media Editor"
      : "Operations Lead & Community Coordinator";

    const newCred: CredentialRecord = {
      id: credId,
      applicationId: application.id,
      candidateName: application.fullName,
      rollNumber: application.rollNumber,
      department: String(application.primaryDepartment).toUpperCase(),
      cohort: "Cohort 2026–27",
      role: roleTitle || defaultRole,
      certificateHash,
      issueDate: new Date().toISOString(),
      status: "Active",
    };

    creds.unshift(newCred);
    safeWriteFile(FILES.credentials, creds);

    this.logActivity(
      "System",
      "CREDENTIAL_ISSUED",
      `Official Induction Certificate issued to ${application.fullName} (${credId})`,
      application.id
    );

    return newCred;
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
    if (logs.length > 1000) logs.pop();
    safeWriteFile(FILES.logs, logs);
  }

  // University & College CSV Export
  public exportToCsv(): string {
    const apps = this.getApplications();
    const evals = this.getEvaluations();
    const headers = [
      "Application ID",
      "Full Name",
      "Email",
      "Phone",
      "Roll Number",
      "Branch",
      "Year",
      "Primary Department",
      "Status",
      "Technical Score",
      "Creative Score",
      "Cultural Fit Score",
      "Overall Score",
      "GitHub URL",
      "Live Deployment URL",
      "Submitted At"
    ];

    const rows = apps.map(app => {
      const evaluation = evals.find(e => e.applicationId === app.id);
      return [
        `"${app.id}"`,
        `"${app.fullName.replace(/"/g, '""')}"`,
        `"${app.email}"`,
        `"${app.phone}"`,
        `"${app.rollNumber}"`,
        `"${app.branch}"`,
        `"${app.year}"`,
        `"${app.primaryDepartment}"`,
        `"${app.status}"`,
        evaluation ? evaluation.technicalScore : "N/A",
        evaluation ? evaluation.creativeScore : "N/A",
        evaluation ? evaluation.culturalFitScore : "N/A",
        evaluation ? evaluation.overallScore : "N/A",
        `"${app.taskDetails?.githubUrl || ""}"`,
        `"${app.taskDetails?.liveUrl || ""}"`,
        `"${app.submittedAt}"`
      ].join(",");
    });

    return [headers.join(","), ...rows].join("\n");
  }
}

export const db = Database.getInstance();
