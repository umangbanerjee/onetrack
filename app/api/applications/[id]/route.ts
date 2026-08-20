import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUserProfile, getApplicationById, updateApplication, deleteApplication } from "@/lib/supabase/db";
import { applicationPatchSchema } from "@/lib/validations";
import { protectRequest } from "@/lib/arcjet";

export const dynamic = "force-dynamic";

/**
 * GET /api/applications/[id]
 * Fetch a single application by ID for the authorized user.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const profile = await getOrCreateUserProfile(
      userId,
      user?.emailAddresses?.[0]?.emailAddress,
      user?.fullName || user?.firstName
    );

    const app = await getApplicationById(params.id, profile.id);
    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(app, {
      headers: {
        "Cache-Control": "private, no-cache, no-transform",
      },
    });
  } catch (error: any) {
    console.error(`GET /api/applications/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || "Failed to fetch application" }, { status: 500 });
  }
}

/**
 * PATCH /api/applications/[id]
 * Partially or completely update a single application record.
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const arcjetDecision = await protectRequest(req, userId);
    if (!arcjetDecision.isAllowed) {
      return NextResponse.json(
        { error: arcjetDecision.message || "Rate limit exceeded" },
        { status: arcjetDecision.status || 429 }
      );
    }

    const user = await currentUser();
    const profile = await getOrCreateUserProfile(
      userId,
      user?.emailAddresses?.[0]?.emailAddress,
      user?.fullName || user?.firstName
    );

    const body = await req.json();
    const validated = applicationPatchSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await updateApplication(params.id, profile.id, validated.data);
    if (!updated) {
      return NextResponse.json({ error: "Application not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`PATCH /api/applications/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || "Failed to update application" }, { status: 500 });
  }
}

/**
 * DELETE /api/applications/[id]
 * Remove an application record belonging to the authorized user.
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const arcjetDecision = await protectRequest(req, userId);
    if (!arcjetDecision.isAllowed) {
      return NextResponse.json(
        { error: arcjetDecision.message || "Rate limit exceeded" },
        { status: arcjetDecision.status || 429 }
      );
    }

    const user = await currentUser();
    const profile = await getOrCreateUserProfile(
      userId,
      user?.emailAddresses?.[0]?.emailAddress,
      user?.fullName || user?.firstName
    );

    const success = await deleteApplication(params.id, profile.id);
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error(`DELETE /api/applications/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || "Failed to delete application" }, { status: 500 });
  }
}
