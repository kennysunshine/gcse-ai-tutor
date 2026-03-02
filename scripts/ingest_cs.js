const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase credentials in .env.local");
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Gemini Text Embedding Client
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing GOOGLE_GEMINI_API_KEY in .env.local");
const genAI = new GoogleGenerativeAI(apiKey);

function chunkText(text, maxChars = 1000) {
    const chunks = [];
    let currentChunk = '';
    const paragraphs = text.split('\n\n');

    for (const paragraph of paragraphs) {
        if (currentChunk.length + paragraph.length > maxChars) {
            chunks.push(currentChunk.trim());
            currentChunk = '';
        }
        currentChunk += paragraph + '\n\n';
    }
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function embedWithRetry(model, chunk, maxRetries = 3) {
    for (let attempts = 0; attempts < maxRetries; attempts++) {
        try {
            const request = {
                content: { parts: [{ text: chunk }] },
                outputDimensionality: 768
            };
            const result = await model.embedContent(request);
            return result.embedding.values;
        } catch (error) {
            if (error.message.includes('429') || error.message.includes('quota')) {
                const delayStr = Math.pow(2, attempts) * 2000;
                console.warn(`    ⚠️ Rate limit hit. Retrying in ${delayStr / 1000}s... (Attempt ${attempts + 1}/${maxRetries})`);
                await sleep(delayStr);
            } else {
                throw error;
            }
        }
    }
    throw new Error(`Failed after ${maxRetries} retries.`);
}

async function ingestDocument(filePath, filename) {
    console.log(`\n📄 Processing: ${filename}`);

    try {
        const textData = fs.readFileSync(filePath, 'utf-8');
        const chunks = chunkText(textData);
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        let successCount = 0;

        for (let i = 0; i < chunks.length; i++) {
            try {
                const chunk = chunks[i];
                const embedding = await embedWithRetry(model, chunk);

                const { error } = await supabase
                    .from('curriculum_documents')
                    .insert({
                        content: chunk,
                        embedding: embedding,
                        metadata: {
                            subject: filename,
                            chunk_index: i
                        }
                    });

                if (error) {
                    console.error(`- Error inserting chunk ${i}:`, error.message);
                } else {
                    successCount++;
                }

                await sleep(4000); // rate limiting
            } catch (error) {
                console.error(`- Failed to embed chunk ${i}:`, error.message);
            }
        }
        console.log(`✅ Successfully ingested ${successCount}/${chunks.length} chunks.`);
    } catch (err) {
        console.error(`❌ Failed to process ${filename}:`, err.message);
    }
}

async function run() {
    console.log("🚀 Starting Targeted RAG Ingestion Pipeline for Computer Science...");
    const dirPath = './curriculum_data';

    // specifically target just the CS one
    const files = [
        'aqa-gcse-computer-science-8525.md'
    ];

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        if (fs.existsSync(filePath)) {
            await ingestDocument(filePath, file);
        } else {
            console.warn(`${filePath} not found`);
        }
    }

    console.log("\n🎉 Targeted Ingestion Complete!");
}

run();
