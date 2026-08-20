import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { protectRequest } from "@/lib/arcjet";

interface SalaryRequestBody {
  roleTitle: string;
  location?: string;
  experienceLevel?: string;
  companyName?: string;
}

export const dynamic = "force-dynamic";

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

    const body: SalaryRequestBody = await req.json();
    const roleTitle = body.roleTitle?.trim() || "Software Engineer";
    const location = body.location?.trim() || "Bangalore";
    const experienceLevel = body.experienceLevel?.trim() || "Mid-Level (3-5y)";
    const companyName = body.companyName?.trim() || "";

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured.", needsKey: true },
        { status: 400 }
      );
    }

    const isIntern = experienceLevel.toLowerCase().includes("intern");

    const systemPrompt = `You are a premier compensation analyst specializing in real-world compensation benchmarks across ALL sectors in India (Tech, Finance & Investment Banking, Consulting, Marketing & Growth, Product & Design, Sales & BD, Operations, HR, Legal, Healthcare, and Core Engineering).
Analyze real-world compensation benchmarks (Levels.fyi, AmbitionBox, Glassdoor, Radford, Mercer, and verified disclosures) for the specified target.

Target Parameters:
- Role / Domain: "${roleTitle}"
- City / Region: "${location}"
- Level / Seniority: "${experienceLevel}"
${companyName ? `- Specific Company Context: "${companyName}"` : ""}
- Currency: "INR"

Respond STRICTLY with a valid JSON object without markdown code blocks, following this exact schema:
{
  "role": "${roleTitle}",
  "location": "${location}",
  "company": "${companyName}",
  "experience_level": "${experienceLevel}",
  "currency": "INR",
  "salary_period": "${isIntern ? "monthly" : "annual"}",
  "p25": <integer, 25th percentile compensation in INR>,
  "median": <integer, 50th percentile / median compensation in INR>,
  "p75": <integer, 75th percentile compensation in INR>,
  "p90": <integer, 90th percentile top-tier compensation in INR>,
  "yoy_growth_percent": <float, e.g. 12.4, current year YoY salary growth for this role/domain/company>,
  "yoy_history": [
    { "year": "2024", "avg_salary_lakhs": <float>, "growth_pct": <float> },
    { "year": "2025", "avg_salary_lakhs": <float>, "growth_pct": <float> },
    { "year": "2026", "avg_salary_lakhs": <float>, "growth_pct": <float> }
  ],
  "top_paying_companies": [
    { "name": "<Top Hiring Company 1 in this domain>", "range": "<e.g. ₹35L - ₹52L or monthly if intern>", "tier": "<e.g. Tier 1 Global / Top Product / Bulge Bracket / MBB>" },
    { "name": "<Top Hiring Company 2 in this domain>", "range": "<e.g. ₹30L - ₹45L>", "tier": "<Tier name>" },
    { "name": "<Top Hiring Company 3 in this domain>", "range": "<e.g. ₹28L - ₹40L>", "tier": "<Tier name>" },
    { "name": "<Top Hiring Company 4 in this domain>", "range": "<e.g. ₹25L - ₹36L>", "tier": "<Tier name>" },
    { "name": "<Top Hiring Company 5 in this domain>", "range": "<e.g. ₹22L - ₹32L>", "tier": "<Tier name>" }
  ]
}`;

    const modelEndpoints = [
      "https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent",
      "https://generativelanguage.googleapis.com/v1/models/gemini-3.7-flash:generateContent",
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
    ];

    let lastError = "";

    for (const endpoint of modelEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          const cleanedText = rawText?.replace(/```json\n?|\n?```/g, "").trim();
          const parsed = JSON.parse(cleanedText || "{}");
          return NextResponse.json(parsed);
        } else {
          const errorText = await response.text();
          lastError = `Endpoint ${endpoint} status ${response.status}: ${errorText}`;
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    throw new Error(lastError || "Failed to query compensation API");
  } catch (error: any) {
    console.error("Salary API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve market salary" },
      { status: 500 }
    );
  }
}
