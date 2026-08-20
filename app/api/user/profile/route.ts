import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUserProfile } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/profile
 * Retrieves authenticated user's profile and role (admin/user) dynamically from DB.
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const primaryEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
    const allEmails = Array.from(
      new Set([
        primaryEmail,
        ...(user?.emailAddresses?.map((e) => e.emailAddress) || []),
      ].filter(Boolean))
    ) as string[];

    const displayName = user?.fullName || user?.firstName;

    const profile = await getOrCreateUserProfile(userId, allEmails, displayName);

    return NextResponse.json({
      id: profile.id,
      clerk_user_id: profile.clerk_user_id,
      email: profile.email || primaryEmail,
      display_name: profile.display_name,
      role: profile.role,
      isAdmin: profile.role === "admin",
      is_active: profile.is_active,
      created_at: profile.created_at,
    }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("GET /api/user/profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve user profile" },
      { status: 500 }
    );
  }
}
