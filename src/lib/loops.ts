import { LoopsClient } from 'loops';

// Build-safe initialization: Only initialize if API key exists
export const loops = process.env.LOOPS_API_KEY 
  ? new LoopsClient(process.env.LOOPS_API_KEY) 
  : null;

if (!loops) {
  console.warn('LOOPS_API_KEY is missing. Loops client will not be initialized.');
}

interface SocraticReportData {
  email: string;
  name: string;
  thinkingProfile: string;
  bragStat: string;
  ageGroup: string;
}

/**
 * Sends a transactional diagnostic report via Loops
 */
export async function sendSocraticReport({
  email,
  name,
  thinkingProfile,
  bragStat,
  ageGroup,
}: SocraticReportData) {
  if (!loops) {
    console.error('Loops client not initialized. Cannot send report.');
    return { success: false, error: 'Loops client not initialized' };
  }

  try {
    const transactionalId = process.env.LOOPS_TRANSACTION_ID;

    if (!transactionalId) {
      throw new Error('LOOPS_TRANSACTION_ID is required for transactional emails');
    }

    return await loops.sendTransactionalEmail({
      email,
      transactionalId: transactionalId as string,
      dataVariables: {
        name,
        thinkingProfile,
        bragStat,
        ageGroup,
        ctaLink: 'https://gcse-ai-tutor.vercel.app/signup',
      },
    });
  } catch (error) {
    console.error('Error sending report via Loops:', error);
    throw error;
  }
}
