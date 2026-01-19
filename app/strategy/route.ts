import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// --- SECURITY CONFIGURATION ---
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 Hours
const MAX_REQUESTS_PER_WINDOW = 2;             // 2 Strikes Policy

// In-Memory User Tracker
const ipTracker = new Map<string, { count: number; expiry: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown_ip";
  let idea = "";

  try {
    const body = await req.json();
    idea = body.idea || "";

    // 1. TELEMETRY: LOG REQUEST
    console.log(JSON.stringify({
      level: "info",
      event: "strategy_request",
      ip: ip,
      idea_preview: idea // Valuable market data
    }));

    const now = Date.now();
    const userRecord = ipTracker.get(ip);
    
    // Cleanup expired records
    if (userRecord && now > userRecord.expiry) {
      ipTracker.delete(ip);
    }

    // 2. SECURITY: ENFORCE STRICT LIMIT
    if (userRecord && userRecord.count >= MAX_REQUESTS_PER_WINDOW) {
      console.warn(JSON.stringify({
        level: "warning",
        event: "strategy_blocked",
        ip: ip,
        reason: "rate_limit_exceeded"
      }));

      return NextResponse.json(
        { 
          strategy: `### 🔒 Access Limit Reached\n\nTo ensure fair access for all recruiters and visitors, this demo is restricted to **${MAX_REQUESTS_PER_WINDOW} analyses per day**.\n\nPlease feel free to explore the rest of my portfolio or reach out via email for a deeper discussion!` 
        },
        { status: 429 }
      );
    }

    // Update Tracker
    if (!userRecord) {
      ipTracker.set(ip, { count: 1, expiry: now + RATE_LIMIT_WINDOW });
    } else {
      userRecord.count++;
    }

    // 3. AI EXECUTION
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


    const prompt = `
      # ROLE & PERSONA
      You are "The Venture Architect," a Tier-1 Venture Capitalist and Product Strategist with the critical eye of a "Shark Tank" judge and the technical depth of a Senior PM. Your goal is not to be nice, but to be *right*. You validate, contextualize, and assess market viability with brutal honesty and high-level strategic insight.

      # INPUT DATA
      The user has provided the following startup/product concept:
      """
      ${idea}
      """

      # OPERATIONAL PROTOCOL
      You must follow this logic flow strictly. Do not skip steps.

      ## PHASE 1: THE PITCH AUDIT (Internal Monologue)
      Analyze the input. Does it provide sufficient detail regarding:
      1.  **Vision** (What is it?)
      2.  **Target Market** (Who is it for?)
      3.  **Context/differentiation** (Why now? Why this?)

      ## PHASE 2: INTERACTION GATE (Crucial)
      * **IF the input is vague or lacks the details above:** Do NOT output the full analysis yet. Instead, adopt the persona of a skeptical investor. Acknowledge the concept, but refuse to give a verdict until you know more. Ask 3 sharp, specific clarifying questions to fill the gaps. Stop and wait for the user's reply.
      * **IF (and only if) the input is sufficient:** Proceed immediately to PHASE 3.

      ## PHASE 3: THE "VAC" EVALUATION
      Conduct the analysis using the VAC Framework:
      1.  **Validation:** Does this solve a real problem? Is the tech feasible?
      2.  **Assessment:** Market size, competition, and monetization potential.
      3.  **Contextualization:** Fit within current market trends/macroeconomics.

      ## PHASE 4: THE VERDICT (Final Output Format)
      Once the analysis is complete, generate the response using strictly these headers and tone:

      ### 🦈 The Shark's Verdict
      * **Viability Score:** [X]/10
      * **The Bottom Line:** [One punchy sentence: Are you "In" or "Out"?]

      ### 🔬 Deep Dive Analysis (VAC)
      * **Validation Check:** [Critique of problem/solution fit]
      * **Market Assessment:** [Viability of the business model and scale]
      * **Contextual Reality:** [Technical or market barriers they missed]

      ### 💡 The Golden Ticket (Improvement)
      * [Provide exactly ONE high-impact, actionable tip to significantly increase their score.]

      ---

      ### 📥 YOUR STRATEGY DOWNLOAD
      *Below is your formalized Investment Memo. You can copy/export this section.*

      \`\`\`markdown
      # 📄 INVESTMENT MEMO: [Project Name]
      **Date:** ${new Date().toLocaleDateString()}
      **Status:** [Fundable / Needs Work / High Risk]

      ## EXECUTIVE SUMMARY
      [3-bullet summary of the analysis]

      ## SWOT SNAPSHOT
      * **Strengths:** [Key asset]
      * **Weaknesses:** [Key flaw]
      * **Opportunities:** [Growth path]
      * **Threats:** [Competitor/Risk]

      ## NEXT STEPS
      [The specific improvement tip provided above]
      \`\`\`
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. TELEMETRY: LOG SUCCESS
    console.log(JSON.stringify({
      level: "info",
      event: "strategy_success",
      ip: ip
    }));

    return NextResponse.json({ strategy: text });

  } catch (error) {
    console.error(JSON.stringify({
      level: "error",
      event: "strategy_failure",
      ip: ip,
      error: String(error)
    }));
    return NextResponse.json({ error: "Failed to generate strategy" }, { status: 500 });
  }
}