import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load Environment Variables from .env.local
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ GOOGLE_GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// 🏛️ Extract Socratic Engine Prompt from route.ts
function getTutorPrompt() {
  const routePath = path.join(process.cwd(), 'src/app/api/chat/route.ts');
  const content = fs.readFileSync(routePath, 'utf-8');
  const match = content.match(/const ENGINE_V2_6_PROMPT = `([\s\S]*?)`;/);
  return match ? match[1].trim() : "";
}

// 🏛️ Load Personas
function getPersonas() {
  const personaPath = path.join(process.cwd(), 'src/simulations/student_personas.json');
  return JSON.parse(fs.readFileSync(personaPath, 'utf-8'));
}

// 🏛️ Load Auditor Logic
function getAuditorPrompt() {
  const auditorPath = path.join(process.cwd(), 'src/simulations/auditor_logic.md');
  return fs.readFileSync(auditorPath, 'utf-8');
}

// 🏛️ The Foundry Agent Session
async function runSimulation(persona, topic, turnCount = 4) {
  const tutorPrompt = getTutorPrompt();
  const auditorPrompt = getAuditorPrompt();
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  let history = [];

  console.log(`🏛️  Starting Simulation for: ${persona.name} | Topic: ${topic}`);

  // 2. Turn Loop
  for (let i = 0; i < turnCount; i++) {
    // --- SCHOLAR TURN ---
    let scholarMsg = "";
    if (i === 0) {
      scholarMsg = `I'm struggling with ${topic}. Can you just tell me the answer?`;
    } else {
      const scholarPersonaPrompt = `Act as ${persona.name} (${persona.level}). Your traits: ${persona.trait}. Your bias: ${persona.bias}. The topic is ${topic}. React to the tutor. Keep it very brief.`;
      const scholarRes = await model.generateContent(`${scholarPersonaPrompt}\n\nPrevious Turns: ${JSON.stringify(history.slice(-2))}`);
      scholarMsg = scholarRes.response.text().trim();
    }
    
    history.push({ role: "user", parts: [{ text: scholarMsg }] });
    console.log(`   👤 Scholar (Turn ${i+1}): ${scholarMsg}`);

    // --- TUTOR TURN ---
    // Simulating the server-side logic in route.ts
    const tutorSession = model.startChat({
        history: [
            { role: "user", parts: [{ text: tutorPrompt }] },
            { role: "model", parts: [{ text: "Understood. I am ready to be a Socratic tutor." }] }
        ]
    });
    
    const tutorRes = await tutorSession.sendMessage(scholarMsg);
    const tutorMsg = tutorRes.response.text().trim();
    
    history.push({ role: "model", parts: [{ text: tutorMsg }] });
    console.log(`   👨‍🏫 Tutor (Turn ${i+1}): ${tutorMsg.substring(0, 100)}...`);
  }

  // 3. AUDIT PHASE
  console.log(`⚖️  Auditing session...`);
  const auditSessionPrompt = `${auditorPrompt}\n\nFULL TRANSCRIPT:\n${JSON.stringify(history, null, 2)}`;
  const auditRes = await model.generateContent(auditSessionPrompt);
  const rawAudit = auditRes.response.text();
  
  try {
    const jsonMatch = rawAudit.match(/JSON_START([\s\S]*?)JSON_END/);
    if (jsonMatch) {
      const auditData = JSON.parse(jsonMatch[1].trim());
      auditData.session_id = `FOUNDRY-${Date.now().toString().slice(-6)}`;
      auditData.persona_id = persona.id;
      return auditData;
    }
  } catch (e) {
    console.error(`❌  Audit Extraction Error: ${e.message}`);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const count = parseInt(args[0]) || 1;
  const results = [];
  const personas = getPersonas();
  const topics = [
    "GCSE Physics: Kinetic Energy", 
    "GCSE Maths: Quadratic Equations", 
    "GCSE Biology: Mitosis", 
    "GCSE Chemistry: Atomic Structure",
    "GCSE English Literature: Macbeth (Theme of Ambition)",
    "GCSE Spanish: Family and Relationships Vocabulary"
  ];

  for (let i = 0; i < count; i++) {
    const persona = personas[i % personas.length];
    const topic = topics[i % topics.length];
    
    const auditResult = await runSimulation(persona, topic);
    if (auditResult) {
      results.push(auditResult);
    }
  }

  const outputPath = path.join(process.cwd(), 'src/simulations/foundry_audit_v1.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`\n✅  Foundry Complete. ${results.length} simulations logged to: ${outputPath}`);
}

main().catch(console.error);
