const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    console.error("Missing environment variables.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const VAULT_DIR = path.join(__dirname, '../PDF vault/UK_Primary_Education_Resources_2026/white_rose_maths');

async function extractTextFromPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    try {
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (err) {
        console.error(`Error parsing PDF ${filePath}:`, err);
        return null;
    }
}

// White Rose Small Steps chunks should ideally be slightly smaller and strictly
// tied to their specific term/year group to preserve the pedagogical progression.
function chunkText(text, maxChunkSize = 600) {
    const words = text.split(/\s+/);
    const chunks = [];
    let currentChunk = [];

    for (const word of words) {
        currentChunk.push(word);
        if (currentChunk.join(' ').length >= maxChunkSize) {
            chunks.push(currentChunk.join(' '));
            currentChunk = [];
        }
    }
    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
    }
    return chunks;
}

async function getEmbedding(text) {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent({
        content: { role: "user", parts: [{ text }] },
        outputDimensionality: 768
    });
    return result.embedding.values;
}

async function processVault() {
    console.log("Starting White Rose Maths ingestion...");

    if (!fs.existsSync(VAULT_DIR)) {
        console.error(`Directory not found: ${VAULT_DIR}`);
        return;
    }

    const filesToProcess = fs.readdirSync(VAULT_DIR).filter(file => file.endsWith('.pdf'));

    console.log(`Found ${filesToProcess.length} White Rose documents to process.`);

    for (const file of filesToProcess) {
        console.log(`\nProcessing: ${file}`);
        const filePath = path.join(VAULT_DIR, file);

        const subjectTag = 'Maths (Primary)';

        const text = await extractTextFromPDF(filePath);
        if (!text) {
            console.log(`Skipping ${file} due to extraction error.`);
            continue;
        }

        const chunks = chunkText(text);
        console.log(`Extracted ${chunks.length} chunks from ${file}`);

        for (let i = 0; i < chunks.length; i++) {
            const chunkTextContent = chunks[i];

            if (chunkTextContent.trim().length < 50) continue;

            const header = `[Source: White Rose Maths Schemes of Learning - ${file}]`;
            const content = `${header}\n${chunkTextContent}`;

            try {
                const embedding = await getEmbedding(chunkTextContent);

                const { error } = await supabase.from('curriculum_documents').insert({
                    content: content,
                    embedding: embedding,
                    metadata: {
                        subject: subjectTag,
                        source: file,
                        type: 'WHITE_ROSE_SMALL_STEPS'
                    }
                });

                if (error) {
                    console.error(`Error inserting chunk ${i} of ${file}:`, error.message);
                } else {
                    process.stdout.write("."); // Progress indicator
                }

                // Rate limit Gemini API
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (err) {
                console.error(`Error processing chunk ${i} of ${file}:`, err.message);
            }
        }
    }
    console.log("\n\nWhite Rose Ingestion Complete!");
}

processVault();
