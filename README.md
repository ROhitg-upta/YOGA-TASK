# SYC — Student Yogic Club // Recruitment OS & Web Experience

> **Cohort 2026–27 Official Recruitment Portal, Applicant Tracking System (ATS), Digital Credential Verification Engine & 3D Interactive Showcase.**  
> *Developed for the Student Yogic Club (SYC) at ABES Engineering College.*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite_&_JSON_Dual_Engine-003B57?style=for-the-badge&logo=sqlite)](https://sqlite.org/)
[![Turbopack](https://img.shields.io/badge/Bundler-Turbopack-000000?style=for-the-badge&logo=vercel)](https://turbo.build/pack)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

---

## ✦ Table of Contents

- [Overview & Vision](#-overview--vision)
- [Key Features](#-key-features)
  - [1. 3D Perspective Works Wheel](#1-3d-perspective-works-wheel-experience)
  - [2. Multi-Track Candidate Application Portal](#2-multi-track-candidate-application-portal-apply)
  - [3. Real-Time Status Tracking & Calendar Invites](#3-real-time-status-tracking--calendar-invites-status)
  - [4. Cryptographic Digital Credentials & Letter of Acceptance](#4-cryptographic-digital-credentials--letter-of-acceptance-credentialsid)
  - [5. Administrative ATS & Multi-Criteria Scorecards](#5-administrative-ats--multi-criteria-scorecards-adminapplications)
  - [6. Executive Recruitment Intelligence & Funnel Analytics](#6-executive-recruitment-intelligence--funnel-analytics-adminanalytics)
- [Branding & Compliance Guidelines](#-branding--compliance-guidelines)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Database Engine & Persistence](#-database-engine--persistence)
- [Project Directory Structure](#-project-directory-structure)
- [Route & API Reference](#-route--api-reference)
- [Getting Started](#-getting-started)
- [Demo Test Accounts](#-demo-test-accounts)
- [Contributing & Code Standards](#-contributing--code-standards)
- [License](#-license)

---

## ✦ Overview & Vision

The **Student Yogic Club (SYC)** is an autonomous collegiate society at ABES Engineering College dedicated to harmonizing mindful discipline and yogic presence with elite engineering craftsmanship, high-aesthetic design, and cinematic storytelling.

This web application serves as the complete **end-to-end recruitment operating system** for the **2026–27 induction cohort**, handling:
- **Public Outreach**: Immersive editorial storytelling and a physical 3D drum works showcase.
- **Candidate Submission**: Structured intake across Technical (Task 3), Graphic Design (Task 1), Video Production (Task 2), and Operations wings.
- **Applicant Self-Service**: Real-time status lookup, deliverable updates, and calendar invite generation (`.ics`).
- **Administrative ATS**: Lead evaluation dossiers, 3-category rubrics (Technical, Creative, Cultural), interview scheduling with 1-click WhatsApp outreach, and university CSV exports.
- **Verification**: Public cryptographic verification of official induction certificates via SHA-256 digital seals.

---

## ✦ Key Features

### 1. 3D Perspective Works Wheel (`/experience`)
- **Physics-Driven Cylinder Drum**: Custom WebGL/CSS 3D perspective projection driven by continuous `requestAnimationFrame` interpolation (`EASE = 0.12`).
- **Bow Curvature & Hard Perspective**: Cards rotate away along a tuned spatial arc (`DRUM = 2.22`, `LENS = 2.7`, `BOW = 1.82`) with quiet settlement mechanics (`SETTLE_MS = 140`).
- **Multi-Touch & Scroll Inertia**: Natural trackpad, wheel, touch-drag, and keyboard arrow navigation.

### 2. Multi-Track Candidate Application Portal (`/apply`)
- **Structured Domain Selection**: Tailored inputs based on selected domain:
  - **💻 Technical (Task 3)**: GitHub repository URL, live deployed demo link, tech stack checklist.
  - **🎨 Graphic Design (Task 1)**: Google Drive / Figma deliverables (1080×1080 Post & 1080×1920 Story).
  - **🎬 Video Production (Task 2)**: 20–30s beat-synced reel submission (Drive / YouTube link).
  - **⚡ Operations & Editorial**: Written perspective, campus initiative proposal, and time commitment.
- **Zod Schema Validation**: Full client & server payload sanitization with academic email validation (`@abes.ac.in`).
- **Unique Candidate ID Generation**: Formatted as `SYC-2026-XXXX`.

### 3. Real-Time Status Tracking & Calendar Invites (`/status`)
- **4-Stage Progress Timeline**: Clear visual tracking (*Application Received → Task Under Review → Interview Shortlisted → Club Induction*).
- **Deliverable Revision Drawer**: Applicants can edit or refine repository or design links before the submission cutoff.
- **1-Click Add to Calendar (`.ics`)**: Shortlisted candidates can download a standard calendar event file that syncs directly with Google Calendar, Apple Calendar, or Microsoft Outlook.

### 4. Cryptographic Digital Credentials & Letter of Acceptance (`/credentials/[id]`)
- **SHA-256 Tamper-Proof Fingerprint**: Hash computed from applicant identity, roll number, department, and cohort year.
- **Public Authenticity Verification**: Accessible to recruiters, college administration, and peers.
- **A4 Single-Page Print Layout**: Dedicated `@media print` stylesheet allowing instant printing or PDF saving of the official Induction Certificate & Letter of Appointment with faculty and student signatory blocks.

### 5. Administrative ATS & Multi-Criteria Scorecards (`/admin/applications`)
- **Applicant Dossier View**: Comprehensive candidate summary, academic standing, residency (Hosteler / Day Scholar), and submitted URLs.
- **Rubric Scoring Engine**: Independent 1–10 scoring across:
  - *Technical Depth & Code Quality*
  - *Visual Aesthetic & Composition*
  - *Ethos, Mindfulness & Collaborative Alignment*
  - Qualitative notes and recommendation flags (*Strong Accept, Accept, Neutral, Decline*).
- **1-Click WhatsApp Candidate Outreach**: Generates tailored candidate invitation messages (`https://wa.me/91...`) containing exact date, time, venue, and status tracking links.
- **CSV Data Export**: One-click download of all candidate records formatted for administrative and college records.

### 6. Executive Recruitment Intelligence & Funnel Analytics (`/admin/analytics`)
- **High-Level KPIs**: Total influx, shortlist rate, acceptance rate, evaluation metrics, and active credentials.
- **Domain Influx Meters**: Real-time visual share across Tech, Design, Video, Operations, and Editorial.
- **4-Phase Selection Funnel**: Tracks candidate drop-off and conversion from registration to induction.
- **Demographics Breakdown**: Visual breakdown by academic year (1st–4th year), engineering branch (CSE, AIML, IT, ECE), and residency ratio.
- **Tamper-Evident Audit Trail**: Live log of admin evaluations, slot confirmations, and status transitions.

---

## ✦ Branding & Compliance Guidelines

> [!IMPORTANT]
> **Strict Typographic Branding Compliance:**  
> In strict accordance with institutional regulations, the portal exclusively utilizes clean typographic branding (`"SYC"` / `"Student Yogic Club"`).  
> **No official ABES or SYC crests, graphical logos, or university emblems are displayed or referenced.**

---

## ✦ Architecture & Tech Stack

```mermaid
graph TD
    Client[Candidate & Admin Client Browser] --> NextRouter[Next.js 16 App Router]
    NextRouter --> Pages[Pages: /, /experience, /apply, /status, /credentials, /admin]
    NextRouter --> API[REST API: /api/recruitment/*]
    API --> Services[Application & Analytics Services]
    Services --> DBEngine[Dual-Engine Database]
    DBEngine --> SQLite[Native SQLite Engine (node:sqlite)]
    DBEngine --> JSONBackup[Synchronous JSON Fallback (data/*.json)]
    DBEngine --> Crypto[SHA-256 Credential Generator]
```

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16.3.8 (App Router, Turbopack) |
| **Language** | TypeScript 5 (Strict Mode) |
| **UI & Styling** | Tailwind CSS 3.4, Lucide React, Framer Motion |
| **Typography** | Editorial Serif (`Playfair Display` / `Instrument Serif`), Clean Sans (`Inter`), Technical Mono (`Geist Mono`) |
| **Database** | Native SQLite (`node:sqlite`) with synchronous JSON fallback (`data/*.json`) |
| **Validation** | Zod 3.x |
| **Crypto** | Node.js `crypto` (SHA-256 hashing) |

---

## ✦ Database Engine & Persistence

The platform utilizes a **hybrid dual-engine architecture** (`lib/backend/db.ts`):

1. **Native SQLite Engine (`node:sqlite`)**:
   - Initialized at `data/syc_recruitment.sqlite`.
   - Relational tables: `applications`, `evaluations`, `interviews`, `credentials`, `activity_logs`.
   - Indexed lookups on `rollNumber`, `email`, `primaryDepartment`, and `status`.
2. **JSON Dual-Sync Fallback**:
   - Synchronous read/write sync with `data/applications.json`, `data/evaluations.json`, `data/interviews.json`, `data/credentials.json`, and `data/activity_logs.json`.
   - Ensures zero-configuration portability during static builds, serverless deployments, and local development.

---

## ✦ Project Directory Structure

```
syc-recruitment/
├── app/
│   ├── admin/
│   │   ├── analytics/
│   │   │   └── page.tsx              # Executive Analytics & Funnel Dashboard
│   │   └── applications/
│   │       └── page.tsx              # Candidate ATS, Scorecards & Interview Scheduler
│   ├── api/
│   │   └── recruitment/
│   │       ├── [id]/route.ts         # Single Candidate GET & PUT
│   │       ├── analytics/route.ts    # Aggregated Recruitment Metrics
│   │       ├── credentials/[id]/     # Cryptographic Credential API
│   │       ├── evaluations/route.ts  # Multi-Criteria Scorecard API
│   │       ├── export/route.ts       # CSV Export API
│   │       ├── interviews/route.ts   # Interview Scheduling API
│   │       └── route.ts              # Applications GET & POST
│   ├── apply/
│   │   ├── success/page.tsx          # Submission Confirmation with ID
│   │   └── page.tsx                  # Multi-Wing Recruitment Intake Form
│   ├── credentials/
│   │   └── [id]/page.tsx             # Printable Induction Certificate & Letter
│   ├── editorial/page.tsx            # Society Manifesto & Ethos
│   ├── experience/page.tsx           # Standalone 3D Perspective Works Wheel
│   ├── status/page.tsx               # Candidate Status Tracker & .ics Export
│   ├── why-join/page.tsx             # Redirect / Alternate Experience Route
│   ├── globals.css                   # Editorial Styling, Typography, Print Rules
│   ├── layout.tsx                    # Root Layout with Font Definitions
│   └── page.tsx                      # Hero, Video Showcase & Domain Tracks
├── components/
│   ├── ui/
│   │   ├── works-wheel.tsx           # Physical 3D Perspective Drum Component
│   │   └── orbit-delivery-hero.tsx   # Visual Domain Display
│   └── recruitment-form.tsx          # Comprehensive Zod-validated Form
├── data/                             # Dual-Engine JSON Storage
│   ├── activity_logs.json
│   ├── applications.json
│   ├── credentials.json
│   ├── evaluations.json
│   └── interviews.json
├── lib/
│   └── backend/
│       ├── db.ts                     # Dual SQLite + JSON Database Engine
│       ├── schemas.ts                # Zod Validation Schemas
│       ├── services.ts               # Core Business Logic & CSV Export
│       └── types.ts                  # TypeScript Interfaces & Models
└── README.md
```

---

## ✦ Route & API Reference

### User & Candidate Routes

| Route | Description |
| :--- | :--- |
| `/` | Landing page featuring high-contrast Hero over video, domain tracks, and club pillars |
| `/experience` | Standalone interactive 3D Perspective Works Wheel with physical inertia |
| `/apply` | Multi-track candidate application form with task links and SOP intake |
| `/apply/success` | Application confirmation displaying unique ID (`SYC-2026-XXXX`) |
| `/status` | Real-time candidate status tracking, deliverable updates, and calendar invite download |
| `/credentials/[id]` | Publicly verifiable Induction Certificate and Letter of Acceptance with A4 print layout |
| `/editorial` | SYC society manifesto, wellness principles, and campus leadership vision |

### Administrative Routes

| Route | Description |
| :--- | :--- |
| `/admin/applications` | Recruitment ATS console: candidate table, dossier review, rubric scorecards, WhatsApp invites |
| `/admin/analytics` | Executive recruitment intelligence: selection funnel, domain demand, cohort demographics |

### Backend REST Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/recruitment` | Search and filter applications by wing, status, or search query |
| `POST` | `/api/recruitment` | Submit new recruitment application (Zod validated) |
| `GET` | `/api/recruitment/:id` | Fetch candidate details, associated reviews, and interview slot |
| `PUT` | `/api/recruitment/:id` | Update candidate deliverable links (GitHub, live demo, Figma, video) |
| `PATCH` | `/api/recruitment` | Update application status (`Under Review`, `Shortlisted`, `Accepted`) |
| `GET` | `/api/recruitment/analytics` | Aggregated metrics, funnel stages, rubric averages, and audit logs |
| `POST` | `/api/recruitment/evaluations` | Log reviewer scorecard (Tech, Creative, Culture 1–10) |
| `POST` | `/api/recruitment/interviews` | Schedule interview slot and auto-update application status |
| `GET` | `/api/recruitment/credentials/:id` | Query and verify cryptographic credential record |
| `GET` | `/api/recruitment/export` | Download college-compliant CSV file of all applicants |

---

## ✦ Getting Started

### Prerequisites
- **Node.js**: Version `20.x`, `22.x`, or `24.x` (Node 24 supports native `node:sqlite`)
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Git**: Installed on your system

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ROhitg-upta/YOGA-TASK.git
   cd YOGA-TASK
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Web Portal: [http://localhost:3000](http://localhost:3000)
   - 3D Works Wheel: [http://localhost:3000/experience](http://localhost:3000/experience)
   - Status Tracker: [http://localhost:3000/status](http://localhost:3000/status)
   - Admin ATS Console: [http://localhost:3000/admin/applications](http://localhost:3000/admin/applications)
   - Executive Analytics: [http://localhost:3000/admin/analytics](http://localhost:3000/admin/analytics)

### Production Build & Verification

```bash
# Compile and optimize all 18 static & dynamic routes with Turbopack
npm run build

# Start production server
npm run start
```

---

## ✦ Demo Test Accounts

You can test candidate states and admin actions immediately using these pre-seeded records:

| Application ID | Candidate Name | Wing | Current Status | Available Actions |
| :--- | :--- | :--- | :--- | :--- |
| `SYC-2026-1048` | Kabir Mehta | Video (Task 2) | **Accepted** | View/Print Cryptographic Credential at `/credentials/SYC-2026-1048` |
| `SYC-2026-0814` | Aarav Sharma | Tech (Task 3) | **Interview Confirmed** | Download Calendar Invite (`.ics`) at `/status` |
| `SYC-2026-0922` | Sanya Kapoor | Design (Task 1) | **Under Review** | Test link updates in candidate drawer |

---

## ✦ Contributing & Code Standards

1. **Branding Rule**: Keep all branding strictly typographic (`"SYC"` / `"Student Yogic Club"`). Never import or render official university logos.
2. **Typography Hierarchy**: Use `.font-editorial` for serif headings, `font-sans` for structured UI, and `font-mono` for IDs and cryptographic hashes.
3. **Data Integrity**: Any new state mutations must pass through `ApplicationService` or `db.logActivity()` to maintain audit logging.

---

## ✦ License

This project is open-source under the [MIT License](LICENSE).  
Maintained by the **Student Yogic Club (SYC)** Tech & Creative Committee, Cohort 2026–27.
