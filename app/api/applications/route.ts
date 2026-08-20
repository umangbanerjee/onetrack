import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUserProfile, getApplications, createApplication } from "@/lib/supabase/db";
import { applicationSchema, applicationsQuerySchema } from "@/lib/validations";
import { protectRequest } from "@/lib/arcjet";

export const dynamic = "force-dynamic";

/**
 * GET /api/applications
 * Retrieves a filtered, sorted list of job applications for the authenticated user.
 */
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

    const { searchParams } = new URL(req.url);
    const statusParams = searchParams.getAll("statusId");
    const sourceParams = searchParams.getAll("sourceId");

    // Validate query parameters with Zod
    const queryValidation = applicationsQuerySchema.safeParse({
      q: searchParams.get("q") || undefined,
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined,
      statusId: statusParams.length > 0 ? statusParams : searchParams.get("status") || undefined,
      sourceId: sourceParams.length > 0 ? sourceParams : searchParams.get("source") || undefined,
      sortBy: searchParams.get("sortBy") || "date_applied",
      sortOrder: searchParams.get("sortOrder") || "desc",
      limit: searchParams.get("limit") || 50,
      offset: searchParams.get("offset") || 0,
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: queryValidation.error.flatten() },
        { status: 400 }
      );
    }

    const { from, to, statusId, sourceId, q, sortBy, sortOrder } = queryValidation.data;

    const data = await getApplications(profile.id, {
      from,
      to,
      statusId,
      sourceId,
      q,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "private, no-cache, no-transform",
      },
    });
  } catch (error: any) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/applications
 * Records a new job application for the authenticated user.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Arcjet Rate-Limiting & WAF Shield check
    const arcjetDecision = await protectRequest(req, userId);
    if (!arcjetDecision.isAllowed) {
      return NextResponse.json(
        { error: arcjetDecision.message || "Rate limit or security policy exceeded" },
        { status: arcjetDecision.status || 429 }
      );
    }

    const body = await req.json();
    const validated = applicationSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const profile = await getOrCreateUserProfile(
      userId,
      user?.emailAddresses?.[0]?.emailAddress,
      user?.fullName || user?.firstName
    );

    const newApp = await createApplication(profile.id, validated.data);
    return NextResponse.json(newApp, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create application" },
      { status: 500 }
    );
  }
}
