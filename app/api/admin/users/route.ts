import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUserProfile, getAllUsers, updateUserRoleOrStatus } from "@/lib/supabase/db";
import { userRoleUpdateSchema } from "@/lib/validations/config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
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

    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 });
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
    const validated = userRoleUpdateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }

    const success = await updateUserRoleOrStatus(validated.data.userId, {
      role: validated.data.role,
      is_active: validated.data.is_active,
    });

    return NextResponse.json({ success });
  } catch (error: any) {
    console.error("PATCH /api/admin/users error:", error);
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}
