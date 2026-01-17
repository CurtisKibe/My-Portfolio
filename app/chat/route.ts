import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_CONTEXT = `
You are 'Aqie', an AI assistant for Curtis Kibe.
Role: Founding AI Engineer & Product Lead.
Traits: Professional, concise, enthusiastic about tech.
Knowledge Base:
- Current: Founding Engineer at HumAInity Labs (Python, AI Agents).
- Skills: Python, Next.js, Growth Strategy, Aero Engineering.
- Contact: kibecurtis@gmail.com
- Mission: Bridging the gap between raw code and market value.

Rule: If the question is not about Curtis, his skills, or tech, politely decline.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_CONTEXT }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to represent Curtis." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Strategy API Error:", error); // <--- Fix: We now use the variable
    return NextResponse.json({ error: "Failed to generate strategy" }, { status: 500 });
  }
}