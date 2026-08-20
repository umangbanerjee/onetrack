import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUserProfile, getDashboardSummary } from "@/lib/supabase/db";

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

    const summary = await getDashboardSummary(profile.id);
    return NextResponse.json(summary);
  } catch (error: any) {
    console.error("GET /api/dashboard/summary error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch dashboard summary" }, { status: 500 });
  }
}
