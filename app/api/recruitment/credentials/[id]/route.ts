import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/backend/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing identifier" }, { status: 400 });
    }

    const decodedId = decodeURIComponent(id).trim();

    // Check by credential ID or application ID
    let credential = db.getCredentialByApplicationId(decodedId);
    let app = db.getApplications().find(
      (a) => a.id.toLowerCase() === decodedId.toLowerCase() ||
             (credential && a.id.toLowerCase() === credential.applicationId.toLowerCase())
    );

    // If application is accepted but no credential record exists, auto-issue it
    if (!credential && app && app.status === "Accepted") {
      credential = db.issueCredential(app);
    }

    if (!credential) {
      return NextResponse.json(
        {
          success: false,
          error: `No official credential or acceptance record found for ID: "${decodedId}".`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      credential,
      application: app || null,
      verificationUrl: `/credentials/${credential.id}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve credential" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const roleTitle = body.roleTitle;

    const apps = db.getApplications();
    const app = apps.find((a) => a.id === id);

    if (!app) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    const credential = db.issueCredential(app, roleTitle);

    return NextResponse.json({
      success: true,
      credential,
      message: `Credential issued successfully for ${app.fullName}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to issue credential" },
      { status: 500 }
    );
  }
}
