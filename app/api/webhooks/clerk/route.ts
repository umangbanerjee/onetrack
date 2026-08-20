import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { getOrCreateUserProfile, updateUserRoleOrStatus } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/clerk
 * Svix-verified webhook handler for Clerk user lifecycle events.
 */
export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const payload = await req.json();
  const body = JSON.stringify(payload);

  if (WEBHOOK_SECRET && WEBHOOK_SECRET.startsWith("whsec_")) {
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ error: "Missing required Svix signature headers" }, { status: 400 });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: any;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err: any) {
      console.error("Error verifying webhook signature:", err?.message || err);
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const eventType = evt.type;
    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address;
      const displayName = [first_name, last_name].filter(Boolean).join(" ") || undefined;
      await getOrCreateUserProfile(id, email, displayName);
    } else if (eventType === "user.deleted") {
      const { id } = evt.data;
      if (id) {
        await updateUserRoleOrStatus(id, { is_active: false });
      }
    }
  } else {
    // In development mode only: allow graceful fallback
    if (process.env.NODE_ENV === "development") {
      if (payload.type === "user.created" || payload.type === "user.updated") {
        const { id, email_addresses, first_name, last_name } = payload.data || {};
        if (id) {
          const email = email_addresses?.[0]?.email_address;
          const displayName = [first_name, last_name].filter(Boolean).join(" ") || undefined;
          await getOrCreateUserProfile(id, email, displayName);
        }
      }
    } else {
      return NextResponse.json({ error: "Clerk webhook signing secret not configured" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
