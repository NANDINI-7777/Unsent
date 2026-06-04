import { NextResponse } from 'next/server';
import { generateRephrasedVent } from '@/lib/gemini';

// POST — Rephrase a vent draft using AI
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string' || content.trim().length < 10) {
      return NextResponse.json(
        { error: 'content must be at least 10 characters long' },
        { status: 400 }
      );
    }

    const rephrased = await generateRephrasedVent(content);

    return NextResponse.json({ rephrased }, { status: 200 });
  } catch (error) {
    console.error('Error in rephrase API route:', error);
    return NextResponse.json(
      { error: 'failed to rephrase message' },
      { status: 500 }
    );
  }
}
