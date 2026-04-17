import 'dotenv/config';
import { 
  Client, 
  GatewayIntentBits, 
  Message, 
  Partials,
  Attachment 
} from 'discord.js';
import { getSocraticHint } from '../lib/socratic-core';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const SOCRATIC_CHANNELS = (process.env.SOCRATIC_CHANNELS || '').split(',');

if (!DISCORD_TOKEN) {
  console.error("CRITICAL: DISCORD_TOKEN is missing in .env");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.once('ready', () => {
  console.log(`LumenForge Socratic Referee is LIVE as ${client.user?.tag}`);
  console.log(`Listening in channels: ${SOCRATIC_CHANNELS.join(', ') || 'ALL (Not recommended)'}`);
});

client.on('messageCreate', async (message: Message) => {
  // 1. Ignore bots and short messages
  if (message.author.bot) return;
  
  // 2. Channel Whitelist (Optional but recommended)
  if (SOCRATIC_CHANNELS.length > 0 && !SOCRATIC_CHANNELS.includes(message.channelId)) {
    // Check if it's a mention
    if (!message.mentions.has(client.user!.id)) return;
  }

  // 3. Heuristic Trigger: Look for "How", "Why", "Help", or images
  const content = message.content.toLowerCase();
  const studyKeywords = ['how', 'why', 'help', 'explain', 'stuck', 'formula', 'method', 'work out'];
  const isStudyQuestion = studyKeywords.some(k => content.includes(k));
  const hasImage = message.attachments.size > 0;

  if (!isStudyQuestion && !hasImage && !message.mentions.has(client.user!.id)) return;

  try {
    // Indicate thinking
    await message.channel.sendTyping();

    let imagePart = undefined;

    // 4. Vision Handling: If there's an image, fetch and convert to Part
    if (hasImage) {
      const attachment = message.attachments.first()!;
      if (attachment.contentType?.startsWith('image/')) {
        const response = await fetch(attachment.url);
        const buffer = await response.arrayBuffer();
        imagePart = {
          inlineData: {
            data: Buffer.from(buffer).toString('base64'),
            mimeType: attachment.contentType
          }
        };
      }
    }

    // 5. Call Socratic Core
    const result = await getSocraticHint(
      message.content || "Help me solve this problem in the image.",
      [], // No history tracking for Discord one-shots in MVP
      { imagePart }
    );

    // 6. Growth Hook Construction
    const growthHook = `\n\n> **Mastered via Socratic Logic.**\n> For your full AQA/Edexcel Mastery Map, join the Socratic Pilot: https://lumenforge.ai/dashboard?ref=discord`;

    // 7. Send Response
    await message.reply({
      content: result.text + growthHook,
      allowedMentions: { repliedUser: true }
    });

  } catch (error) {
    console.error("Discord Bot Error:", error);
    // Silent fail in production to avoid cluttering chat
  }
});

client.login(DISCORD_TOKEN);
