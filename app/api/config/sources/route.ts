import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUserProfile, getApplicationSources, upsertApplicationSource, deleteApplicationSource } from "@/lib/supabase/db";
import { sourceConfigSchema } from "@/lib/validations/config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sources = await getApplicationSources();
    return NextResponse.json(sources);
  } catch (error: any) {
    console.error("GET /api/config/sources error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch sources" }, { status: 500 });
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
    const validated = sourceConfigSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }

    const result = await upsertApplicationSource(validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/config/sources error:", error);
    return NextResponse.json({ error: error.message || "Failed to create source" }, { status: 500 });
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
      return NextResponse.json({ error: "Source ID is required" }, { status: 400 });
    }

    const validated = sourceConfigSchema.partial().safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }

    const result = await upsertApplicationSource({ id: body.id, ...validated.data });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("PATCH /api/config/sources error:", error);
    return NextResponse.json({ error: error.message || "Failed to update source" }, { status: 500 });
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
      return NextResponse.json({ error: "Source ID parameter is required" }, { status: 400 });
    }

    const success = await deleteApplicationSource(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error("DELETE /api/config/sources error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete source" }, { status: 500 });
  }
}
