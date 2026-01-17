import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Act as a Senior Technical Product Manager. Analyze this startup idea: "${idea}".
      Provide a response in strict Markdown format with these exact headers:
      ### Feasibility Score: [Low/Medium/High]
      - **Reason:** [One sentence technical reason]
      ### MVP Core Feature
      - [The one single feature to build first]
      ### Growth Hack strategy
      - [A specific low-cost channel to get first 100 users]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ strategy: text });
  } catch (error) {
    console.error("Chat API Error:", error); // <--- Fix: We now use the variable
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 });
  }
}