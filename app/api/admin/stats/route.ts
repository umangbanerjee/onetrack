import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUserProfile, getAdminPlatformStats } from "@/lib/supabase/db";

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

    const stats = await getAdminPlatformStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch admin stats" }, { status: 500 });
  }
}
