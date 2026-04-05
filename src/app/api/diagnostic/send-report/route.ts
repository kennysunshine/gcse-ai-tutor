import { NextResponse } from 'next/server';
import { sendSocraticReport } from '@/lib/loops';

/**
 * API Route to trigger the Socratic Diagnostic Report via Loops.so
 */
export async function POST(req: Request) {
  try {
    const { email, name, thinkingProfile, bragStat, ageGroup } = await req.json();

    if (!email || !name || !thinkingProfile) {
      return NextResponse.json(
        { error: 'Missing required fields for diagnostic report.' },
        { status: 400 }
      );
    }

    // Using the high-level build-safe helper
    const result = await sendSocraticReport({
      email,
      name,
      thinkingProfile,
      bragStat,
      ageGroup,
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Diagnostic report dispatched.' });
    } else {
      console.error('Loops Delivery Error:', result);
      return NextResponse.json(
        { error: 'Failed to send transactional email via Loops.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Diagnostic API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during report delivery.' },
      { status: 500 }
    );
  }
}
