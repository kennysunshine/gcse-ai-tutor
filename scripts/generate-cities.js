const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("\n❌ ERROR: GOOGLE_GEMINI_API_KEY is missing.");
  console.error("💡 Fix: Make sure to run the script with your environment variables loaded, like this:");
  console.error("   node --env-file=.env.local scripts/generate-cities.js 'Bristol, York'\n");
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("\n❌ ERROR: Please provide a comma-separated list of cities to generate.");
  console.error("💡 Example: node --env-file=.env.local scripts/generate-cities.js 'Bristol, York, Edinburgh'\n");
  process.exit(1);
}

// Extract the cities string and sanitize
const citiesString = args[0];
const cities = citiesString.split(',').map(c => c.trim()).filter(Boolean);

const genAI = new GoogleGenerativeAI(API_KEY);

// Define the path to our pSEO database
const dataPath = path.join(__dirname, '../src/data/guideData.json');
const currentData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

async function generateCityData() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  console.log(`\n🤖 Starting Socratic pSEO Research Mode for: ${cities.join(', ')}...\n`);

  const prompt = `
    You are an expert UK education market researcher and SEO specialist.
    I am providing you with a list of UK cities/regions: ${cities.join(', ')}
    
    For EACH city, generate a highly accurate, structured JSON object mapping local educational and industrial data.
    IMPORTANT: You must return exact JSON. Do not include markdown \`\`\`json blocks. Return ONLY the raw JSON object.

    The structure MUST match this exact interface:
    {
       "[city_key_lowercase_no_spaces]": {
          "name": "City Name",
          "context": "Short 4-word context (e.g. 'Bristol's booming tech sector')",
          "cityImage": "/images/cities/[city_key].png",
          "averageTutorRate": [integer, realistic hourly rate for human GCSE tutors in this city],
          "primaryExamBoard": "dominant exam board e.g. AQA / Edexcel / OCR",
          "industryConnections": {
             "biology": "A short sentence about the local biotech or medical research sector here.",
             "computer-science": "A short sentence about the local software/tech industry here.",
             "physics": "A short sentence about the local advanced engineering or aerospace industry.",
             "maths": "A short sentence about local financial or quantitative sectors.",
             "english-literature": "A short sentence about local legal, media or communications sectors."
          },
          "tip": "A 1-sentence tip for parents in this specific city regarding local grammar schools, academy trusts, or academic competition.",
          "analysis": "Two sentences analysing the specific educational landscape and pressures in this city.",
          "localFocus": "Short 5-word focus (e.g. 'High Competition for Grammar Schools')",
          "deepDive": [
             "Paragraph 1 about local academic transition from KS3 to GCSE.",
             "Paragraph 2 about specific curriculum challenges locally.",
             "Paragraph 3 about why Socratic logic defeats rote-learning in this specific city."
          ]
       }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    let jsonText = result.response.text();
    
    // Scrape away any accidental markdown formatting the LLM might have returned
    jsonText = jsonText.replace(/^\s*```(?:json)?/, '').replace(/```\s*$/, '').trim();
    
    const newCitiesData = JSON.parse(jsonText);
    let addedCount = 0;

    for (const [key, value] of Object.entries(newCitiesData)) {
       if (!currentData.locations[key]) {
          currentData.locations[key] = value;
          addedCount++;
          console.log(`✅ Successfully generated Socratic Data for: ${value.name}`);
       } else {
          console.log(`⚠️ ${value.name} already exists in guideData.json, skipping to avoid overwrites.`);
       }
    }
    
    if (addedCount > 0) {
       fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2));
       console.log(`\n🚀 Automation Complete: Added ${addedCount} new cities to the pSEO database!`);
       console.log(`▶️ Next Steps: Make sure to add stock images for the cities in /public/images/cities/`);
       console.log(`▶️ Run 'git commit' and 'git push' to deploy these new pages live.\n`);
    } else {
       console.log(`\n🤷 No new cities were added.\n`);
    }

  } catch (error) {
    console.error("\n❌ Failed to generate or parse data. The API might have returned invalid JSON.");
    console.error(error);
  }
}

generateCityData();
