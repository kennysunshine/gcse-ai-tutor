const fs = require('fs');
const booksPath = 'src/data/books.json';
const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

const updates = {
  // Batch I & II
  'B00QMB81D6': { src: 'matilda_foundry_edition_1775472904573.png', dest: 'matilda.png' },
  'B01A031FZY': { src: 'designing_life_foundry_edition_1775472934225.png', dest: 'designing-life.png' },
  '0399581685': { src: 'parachute_foundry_edition_1775472948117.png', dest: 'parachute.png' },
  'B001NLKSW4': { src: 'think_grow_rich_foundry_edition_1775472917030.png', dest: 'think-grow-rich.png' },
  
  // Batch III
  'B007I7L0A8': { src: 'defining_decade_foundry_edition_1775473214452.png', dest: 'defining-decade.png' },
  'B00867866Y': { src: 'badass_foundry_edition_1775473228966.png', dest: 'badass.png' },
  'B000OIZSZK': { src: 'never_eat_alone_foundry_edition_1775473249619.png', dest: 'never-eat-alone.png' },
  'B01KTIEIV0': { src: 'radical_candor_foundry_edition_1775473264189.png', dest: 'radical-candor.png' },

  // Batch IV (New)
  'B07D3Z7W5U': { src: 'dare_lead_foundry_edition_1775473912572.png', dest: 'dare-lead.png' },
  'B004H4XLFV': { src: 'drive_foundry_edition_1775473932362.png', dest: 'drive.png' },
  'B000FCK2S6': { src: 'mindset_foundry_edition_1775473951277.png', dest: 'mindset.png' },
  'B005P1YT3M': { src: 'power_habit_foundry_edition_1775473968439.png', dest: 'power-of-habit.png' }
};

const brainDir = '/Users/kenny-swann/.gemini/antigravity/brain/cc830607-f7f8-4884-8246-8a1d6c3b1376';
const publicDir = 'public/images/books';

let copiedCount = 0;
books.forEach(book => {
  if (updates[book.id]) {
    const asset = updates[book.id];
    const srcPath = `${brainDir}/${asset.src}`;
    const destPath = `${publicDir}/${asset.dest}`;
    try {
      if(fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        book.imageUrl = `/images/books/${asset.dest}`;
        copiedCount++;
      } else {
        console.log("Missing src:", srcPath);
      }
    } catch (e) {
      console.error("Error copy", e.message);
    }
  }
});

fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));
console.log(`🏛️ Migration complete. Successfully anchored ${copiedCount} assets.`);
