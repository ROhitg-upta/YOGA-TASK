import { NextResponse } from "next/server";
import { ApplicationService } from "@/lib/backend/services";
import { ZodError } from "zod";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dossier = await ApplicationService.getById(id);

    if (!dossier.application) {
      return NextResponse.json(
        { success: false, error: `Candidate with ID or email "${id}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ...dossier,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve candidate dossier" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await ApplicationService.updateTaskLinks({
      ...body,
      id,
    });

    return NextResponse.json({
      success: true,
      message: "Task submission links successfully updated before deadline.",
      application: updated,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update task links" },
      { status: 400 }
    );
  }
}
