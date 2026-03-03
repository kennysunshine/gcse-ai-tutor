const fs = require('fs');
const { execSync } = require('child_process');

async function deploy() {
    const token = "nfc_oNqDPsCpnWU88SNzJiXvzeKchxiCWqPM9f09";
    const envLocal = fs.readFileSync('.env.local', 'utf-8');

    // Create site
    console.log("Creating Netlify site...");
    const createRes = await fetch("https://api.netlify.com/api/v1/sites", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name: "lumenforge-gcse-tutor-" + Math.floor(Math.random() * 10000)
        })
    });

    const siteData = await createRes.json();
    if (!createRes.ok) {
        throw new Error("Failed to create site: " + JSON.stringify(siteData));
    }
    const siteId = siteData.site_id || siteData.id;
    console.log(`Site created: ${siteData.name} - ID: ${siteId} - URL: ${siteData.url}`);

    // Parse env vars
    console.log("Parsing .env.local...");
    const envVars = {};
    envLocal.split('\n').forEach(line => {
        if (!line || line.startsWith('#')) return;
        const [key, ...valArr] = line.split('=');
        if (key && valArr.length) {
            let val = valArr.join('=').trim();
            // Remove quotes if present
            if (val.startsWith('"') && val.endsWith('"') || val.startsWith("'") && val.endsWith("'")) {
                val = val.substring(1, val.length - 1);
            }
            envVars[key.trim()] = val;
        }
    });

    // Upload env vars via build_settings
    console.log("Uploading env vars...");
    const updateRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            build_settings: {
                env: envVars
            }
        })
    });
    if (!updateRes.ok) {
        const updateData = await updateRes.json();
        console.warn("Issue uploading env vars natively via PATCH. Proceeding with deployment. Error:", updateData);
    } else {
        console.log("Environment variables secured.");
    }

    // Run build and deploy
    console.log("\n--- Triggering Netlify Production Deployment ---");
    // Link the site explicitly using the cli so we don't have to pass --site on every call
    execSync(`npx netlify link --id ${siteId} --auth ${token}`, { stdio: 'inherit' });

    // Deploy
    execSync(`npx netlify deploy --prod --build --auth ${token}`, { stdio: 'inherit' });

    console.log("\n[SUCCESS] Deployment complete! Live URL: " + siteData.url);
}

deploy().catch(console.error);
