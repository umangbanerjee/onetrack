import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUserProfile, getApplicationStatuses, upsertApplicationStatus, deleteApplicationStatus } from "@/lib/supabase/db";
import { statusConfigSchema } from "@/lib/validations/config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const statuses = await getApplicationStatuses();
    return NextResponse.json(statuses);
  } catch (error: any) {
    console.error("GET /api/config/statuses error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch statuses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    if (profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const validated = statusConfigSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }

    const result = await upsertApplicationStatus(validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/config/statuses error:", error);
    return NextResponse.json({ error: error.message || "Failed to create status" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
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

    if (profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Status ID is required" }, { status: 400 });
    }

    const validated = statusConfigSchema.partial().safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }

    const result = await upsertApplicationStatus({ id: body.id, ...validated.data });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("PATCH /api/config/statuses error:", error);
    return NextResponse.json({ error: error.message || "Failed to update status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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

    if (profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Status ID parameter is required" }, { status: 400 });
    }

    const success = await deleteApplicationStatus(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error("DELETE /api/config/statuses error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete status" }, { status: 500 });
  }
}
