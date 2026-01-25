import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// --- SECURITY CONFIGURATION ---
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; 
const MAX_REQUESTS_PER_WINDOW = 10;            

// In-Memory User Tracker
const ipTracker = new Map<string, { count: number; expiry: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown_ip";

  try {
    // 1. SAFETY CHECK: Check API Key FIRST
    if (!process.env.GROQ_API_KEY) {
      console.error("CRITICAL: GROQ_API_KEY is missing in .env.local");
      return NextResponse.json(
        { content: "### ⚠️ System Error\n\nMy brain is missing an API Key. Please tell the developer." },
        { status: 500 }
      );
    }

    // Initialize Groq
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const body = await req.json();
    
    const { messages } = body; 
    
    const currentMessages = messages || [];

    // 2. TELEMETRY: LOG REQUEST
    console.log(JSON.stringify({
      level: "info",
      event: "strategy_turn",
      ip: ip,
      msg_count: currentMessages.length
    }));

    const now = Date.now();
    const userRecord = ipTracker.get(ip);
    
    if (userRecord && now > userRecord.expiry) {
      ipTracker.delete(ip);
    }

    // 3. SECURITY: ENFORCE STRICT LIMIT
    if (userRecord && userRecord.count >= MAX_REQUESTS_PER_WINDOW) {
      console.warn(JSON.stringify({
        level: "warning",
        event: "strategy_blocked",
        ip: ip,
        reason: "rate_limit_exceeded"
      }));

      return NextResponse.json(
        { 
          content: `### 🔒 Access Limit Reached\n\nTo ensure fair access, strategy sessions are limited to **${MAX_REQUESTS_PER_WINDOW} turns per day**.` 
        },
        { status: 429 }
      );
    }

    // Updates Tracker
    if (!userRecord) {
      ipTracker.set(ip, { count: 1, expiry: now + RATE_LIMIT_WINDOW });
    } else {
      userRecord.count++;
    }

    // 4. AI EXECUTION
    const systemPrompt = `
      # ROLE & PERSONA
      You are "The Venture Architect," a Tier-1 Venture Capitalist and Product Strategist with the critical eye of a "Shark Tank" judge and the technical depth of a Senior PM. Your goal is not to be nice, but to be *right*. You validate, contextualize, and assess market viability with brutal honesty and high-level strategic insight.

      # 🛡️ STRICT GUARDRAILS (SCOPE ENFORCEMENT)
      **You are strictly a business validation engine.**
      * **ACCEPTABLE TOPICS:** Startup ideas, business models, market analysis, product features, pricing, and growth strategy.
      * **OFF-TOPIC TRIGGERS:** If the user asks about:
        - General knowledge (e.g., "What is the capital of France?", "Who won the World Cup?")
        - Creative writing (e.g., "Write a poem about cats")
        - Coding help unrelated to architecture (e.g., "How do I center a div?")
        - Personal life or casual chit-chat.
      
      * **PROTOCOL FOR OFF-TOPIC INPUT:**
        Do NOT answer the question. Do NOT apologize profusely.
        Reply strictly with: "Sorry, I cannot provide you with information you requested. My system is calibrated exclusively for Venture Strategy. Please provide a startup concept or business question to proceed."
      
      # INPUT DATA
      The user is pitching a startup/product concept in this conversation.
      You must treat the entire message history as the context for the pitch.

      # OPERATIONAL PROTOCOL
      If the Input is on topic, you must follow this logic flow strictly. Do not skip steps.
      Display each phase and its title and their contents. This is what all the phase titles should be:
      Phase one - **PHASE 1: THE AUDIT**
      Phase two - **PHASE 2: THE ANALYSIS**
      Phase three - **PHASE 3: THE EVALUATION**
      Phase four - **PHASE 4: THE VERDICT**

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
      * [Provide exactly TWO high-impact, actionable tip to significantly increase their score.]

      ---

      ### 📥 YOUR STRATEGY MAP
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
      [The specific improvement tips provided above]
      \`\`\`
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt }, 
        ...currentMessages 
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
    });

    const replyText = completion.choices[0]?.message?.content || "Analysis failed to generate.";

    // 5. TELEMETRY: LOG SUCCESS
    console.log(JSON.stringify({
      level: "info",
      event: "strategy_success",
      ip: ip
    }));

    return NextResponse.json({ content: replyText });

  } catch (error: unknown) {
    console.error("Strategy API Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: `Failed to generate strategy: ${errorMessage}` }, 
      { status: 500 }
    );
  }
}