import { NextResponse } from "next/server";
import { EvaluationService } from "@/lib/backend/services";
import { ZodError } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "applicationId query parameter is required" },
        { status: 400 }
      );
    }

    const evaluations = EvaluationService.getByApplicationId(applicationId);
    return NextResponse.json({
      success: true,
      total: evaluations.length,
      evaluations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve evaluations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const evaluation = await EvaluationService.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Evaluation scorecard successfully logged.",
        evaluation,
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
      { success: false, error: error.message || "Failed to log evaluation" },
      { status: 500 }
    );
  }
}
