import { NextResponse } from "next/server";
import { InterviewService } from "@/lib/backend/services";
import { ZodError } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");

    const slots = applicationId
      ? InterviewService.getByApplicationId(applicationId)
      : InterviewService.getAll();

    return NextResponse.json({
      success: true,
      total: slots.length,
      slots,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve interview slots" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slot = await InterviewService.schedule(body);

    return NextResponse.json(
      {
        success: true,
        message: "Interview slot successfully reserved and candidate shortlisted.",
        slot,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to schedule interview" },
      { status: 500 }
    );
  }
}
