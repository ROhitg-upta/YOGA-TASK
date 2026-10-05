import { NextResponse } from "next/server";
import { ApplicationService } from "@/lib/backend/services";
import { ZodError } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("search") || undefined;
    const department = searchParams.get("department") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 100;

    const result = await ApplicationService.search({
      query,
      department,
      status,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("GET /api/recruitment error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve recruitment applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Map backwards-compatible fields if submitted from quick form
    const payload = {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone || "+91 99999 99999",
      rollNumber: body.rollNumber || `TMP-${Date.now().toString().slice(-6)}`,
      branch: body.branch || "General Engineering",
      year: body.year || "1st Year",
      hostelStatus: body.hostelStatus || "Day Scholar",
      primaryDepartment: body.primaryDepartment || body.department || "tech",
      secondaryDepartment: body.secondaryDepartment || "none",
      skillLevel: body.skillLevel || "Intermediate",
      skills: Array.isArray(body.skills) ? body.skills : [],
      taskDetails: body.taskDetails || {
        taskType: `Task for ${body.primaryDepartment || body.department || "General"}`,
        githubUrl: body.portfolioUrl || "",
        liveUrl: "",
        figmaDriveUrl: body.portfolioUrl || "",
        videoDriveUrl: "",
        notes: body.notes || "",
      },
      whyJoin: body.whyJoin || "Enthusiastic applicant for SYC.",
      mindfulPerspective: body.mindfulPerspective || "",
      initiativeIdea: body.initiativeIdea || "",
      timeCommitment: body.timeCommitment || "6-8 hours/week",
    };

    const newApp = await ApplicationService.create(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Application successfully submitted and verified.",
        applicationId: newApp.id,
        application: newApp,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/recruitment error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updated = await ApplicationService.updateStatus(body);

    return NextResponse.json({
      success: true,
      message: `Status updated to ${updated.status}`,
      application: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/recruitment error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Invalid update data" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update status" },
      { status: 500 }
    );
  }
}
