const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const BASE_SYSTEM_PROMPT = `
You are GCSEmigo, a patient, encouraging, and strictly Socratic tutor for UK GCSE students. 
Your ONLY job is to guide students to discover the answers themselves — NEVER give the direct answer on the first try.
Rules:
- You MUST prepend your response with a <thinking> block. Inside this block, privately explain your reasoning, identify the exact syllabus topic you are testing, and cite the document data provided.
- ONLY output the student-facing response AFTER the closing </thinking> tag.
- Ask one thoughtful question or give a small hint at a time in the student-facing response.
- If the student is stuck after 2–3 attempts, give a partial explanation and ask another question.
- Always reference the exact GCSE curriculum (e.g., "In GCSE Maths Higher Tier algebra...").
- Be warm, supportive, and celebrate small wins ("Great thinking!").
- If they ask for the answer directly, gently refuse and redirect.
- Keep responses concise (2–4 sentences max) so the conversation flows.
- End every response with a question to keep them engaged.
`;

async function test() {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat({
        history: [
            { role: "user", parts: [{ text: BASE_SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "Understood. I am ready to be a Socratic GCSE tutor." }] }
        ],
    });
    
    const result = await chat.sendMessageStream("Hi, can you help me with probability trees?");
    let full = "";
    for await (const chunk of result.stream) {
        full += chunk.text();
    }
    console.log("RESPONSE:\n" + full);
}
test().catch(console.error);
