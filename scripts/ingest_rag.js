const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
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

// Helper function to chunk large text strings into ~1000 character segments
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

// Sleep function for delays
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
            // Check if it's a rate limit error (429) or quota error
            if (error.message.includes('429') || error.message.includes('quota')) {
                const delayStr = Math.pow(2, attempts) * 2000; // Exponential backoff
                console.warn(`    ⚠️ Rate limit hit. Retrying in ${delayStr / 1000}s... (Attempt ${attempts + 1}/${maxRetries})`);
                await sleep(delayStr);
            } else {
                throw error; // If it's a different error, throw immediately
            }
        }
    }
    throw new Error(`Failed after ${maxRetries} retries.`);
}

async function ingestDocument(filePath, filename) {
    console.log(`\n📄 Processing: ${filename}`);

    try {
        // 1. Read Markdown
        const textData = fs.readFileSync(filePath, 'utf-8');
        console.log(`- Extracted Markdown text.`);

        // 2. Chunk Text
        const chunks = chunkText(textData);
        console.log(`- Created ${chunks.length} text chunks for embedding.`);

        // 3. Generate Embeddings and Insert into Supabase
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        let successCount = 0;

        for (let i = 0; i < chunks.length; i++) {
            try {
                const chunk = chunks[i];

                // Generate Vector Embedding via Gemini API (with retry)
                const embedding = await embedWithRetry(model, chunk);

                // Insert into Supabase pgvector table
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

                // Respect API rate limits (e.g., Gemini free tier has RPM limits)
                // 15 requests per minute -> 4 seconds per request. 
                await sleep(4000);

            } catch (error) {
                console.error(`- Failed to embed chunk ${i}:`, error.message);
            }
        }
        console.log(`✅ Successfully ingested ${successCount}/${chunks.length} chunks into Supabase.`);
    } catch (err) {
        console.error(`❌ Failed to process ${filename}:`, err.message);
    }
}

async function run() {
    console.log("🚀 Starting Bulk RAG Ingestion Pipeline...");
    const dirPath = './curriculum_data';

    if (!fs.existsSync(dirPath)) {
        console.error(`Directory ${dirPath} does not exist.`);
        return;
    }

    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.md'));

    console.log(`Found ${files.length} PDFs to process.`);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        await ingestDocument(filePath, file);
    }

    console.log("\n🎉 Bulk Ingestion Complete!");
}

run();
