import { NextResponse } from "next/server";
import { AnalyticsService } from "@/lib/backend/services";

export async function GET() {
  try {
    const metrics = AnalyticsService.getMetrics();
    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve analytics metrics" },
      { status: 500 }
    );
  }
}
