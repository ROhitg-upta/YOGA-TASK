import { NextResponse } from "next/server";
import { ApplicationService } from "@/lib/backend/services";

export async function GET() {
  try {
    const csvContent = ApplicationService.exportToCsv();

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="syc_applications_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to generate CSV export" },
      { status: 500 }
    );
  }
}
