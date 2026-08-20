import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/next";

export const aj = process.env.ARCJET_KEY
  ? arcjet({
      key: process.env.ARCJET_KEY,
      characteristics: ["userId"], // Track by Clerk userId
      rules: [
        // Protect against common web attacks / SQLi / XSS
        shield({
          mode: "LIVE",
        }),
        // Detect automated malicious scrapers / bots
        detectBot({
          mode: "LIVE",
          allow: [
            "CATEGORY:SEARCH_ENGINE", // Allow Google, Bing etc
          ],
        }),
        // Rate limiting for writes: 30 requests per 60 seconds per user
        slidingWindow({
          mode: "LIVE",
          interval: "1m",
          max: 30,
        }),
      ],
    })
  : null;

export async function protectRequest(req: Request, userId: string = "anonymous") {
  if (!aj) {
    return { isAllowed: true, reason: "Arcjet key not configured" };
  }

  try {
    const decision = await aj.protect(req, { userId });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return { isAllowed: false, status: 429, message: "Too many requests. Please slow down." };
      }
      if (decision.reason.isBot()) {
        return { isAllowed: false, status: 403, message: "Automated bot activity detected." };
      }
      if (decision.reason.isShield()) {
        return { isAllowed: false, status: 403, message: "Request blocked by security shield." };
      }
      return { isAllowed: false, status: 403, message: "Access denied by security policy." };
    }
    return { isAllowed: true };
  } catch (error) {
    console.error("Arcjet protection error:", error);
    // Fail open in case of network/transient SDK issues to not block legitimate users
    return { isAllowed: true };
  }
}
