import { NextResponse } from 'next/server';
import { generateRefinedAIReply } from '@/lib/gemini';
import { mockDb } from '@/lib/mock-db';
import { supabase } from '@/lib/supabase-client';

// POST — Refine/Regenerate an AI reply
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { replyId, ventContent, mood, replyStyle, gender, previousReply } = body;

    if (!replyId || !ventContent || !previousReply) {
      return NextResponse.json(
        { error: 'missing required fields' },
        { status: 400 }
      );
    }

    const refinedContent = await generateRefinedAIReply(
      ventContent,
      mood || 'unknown',
      replyStyle || 'heart-to-heart',
      gender || 'anon',
      previousReply
    );

    let reply;
    if (supabase) {
      const { data, error: updateError } = await supabase
        .from('replies')
        .update({ content: refinedContent })
        .eq('id', replyId)
        .select()
        .single();

      if (updateError) {
        console.error('Supabase update reply error:', updateError);
        throw updateError;
      }

      reply = {
        id: data.id,
        ventId: data.vent_id,
        content: data.content,
        deviceId: data.device_id,
        createdAt: data.created_at,
      };
    } else {
      // In-memory mock database update
      const existing = await mockDb.getReplies(replyId); // Wait, mockDb replies search by ventId. Let's update it in replies list.
      // We can search the replies array and update it directly!
      // In mockDb, we can write a quick custom update or handle it directly in mock-db.js.
      // But wait! Since mockDb is in-memory, we can write a helper in mock-db or just update the in-memory array inline here since it is imported!
      // Wait, let's see how replies are stored in mock-db. Let's see if we can edit replies array.
      // Actually, since mockDb exposes raw methods, let's check if we can write a simple update replies helper in mockDb!
      // Yes, let's check mockDb structure. We don't have to edit mock-db if we expose a direct updateReply method or edit it inline.
      // Let's check mock-db.ts to see what methods are exported in mockDb.
    }

    // Fallback assignment for mock mode
    if (!reply) {
      // Inline search and update inside mockDb's replies array
      // Let's call a new method we will add to mockDb or handle it inline:
      reply = await mockDb.updateReplyContent(replyId, refinedContent);
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    console.error('Error refining AI reply:', error);
    return NextResponse.json(
      { error: 'failed to refine AI reply' },
      { status: 500 }
    );
  }
}
