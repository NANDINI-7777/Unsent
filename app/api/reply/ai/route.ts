import { NextResponse } from 'next/server';
import { generateAIReply } from '@/lib/gemini';
import { mockDb } from '@/lib/mock-db';
import { supabase } from '@/lib/supabase-client';

// POST — Generate AI reply for a vent
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ventId, ventContent, mood, replyStyle } = body;

    if (!ventId || !ventContent) {
      return NextResponse.json(
        { error: 'missing required fields' },
        { status: 400 }
      );
    }

    // Fetch the parent vent first to get its gender context if available, but do not fail if it isn't found
    const { gender: bodyGender } = body;
    let gender = bodyGender || 'anon';
    let parentVent = null;

    if (supabase) {
      try {
        const { data, error: ventError } = await supabase
          .from('vents')
          .select('*')
          .eq('id', ventId)
          .single();

        if (!ventError && data) {
          parentVent = data;
          gender = data.gender || gender;
        }
      } catch (err) {
        console.warn('Failed to query parent vent in Supabase:', err);
      }
    } else {
      const mockVent = await mockDb.getVentById(ventId);
      if (mockVent) {
        parentVent = mockVent;
        gender = mockVent.gender || gender;
      }
    }

    // Generate reply via Groq API (or mock fallback) using the correct gender context
    const replyContent = await generateAIReply(
      ventContent,
      mood || 'unknown',
      replyStyle || 'heart-to-heart',
      gender
    );

    // Save to database
    let reply;
    if (supabase) {
      // Create reply
      const { data, error: replyError } = await supabase
        .from('replies')
        .insert({
          vent_id: ventId,
          content: replyContent,
        })
        .select()
        .single();

      if (replyError) {
        console.error('Supabase createReply error:', replyError);
        throw replyError;
      }

      // Increment reply count on vent if parentVent exists
      if (parentVent) {
        const { error: updateError } = await supabase
          .from('vents')
          .update({ reply_count: (parentVent.reply_count || 0) + 1 })
          .eq('id', ventId);

        if (updateError) {
          console.error('Failed to update reply count in Supabase:', updateError);
        }
      }

      reply = {
        id: data.id,
        ventId: data.vent_id,
        content: data.content,
        deviceId: data.device_id,
        createdAt: data.created_at,
      };
    } else {
      reply = await mockDb.createReply({
        ventId,
        content: replyContent,
      });
    }

    // Return reply WITHOUT the is_ai flag — the mystery must be preserved
    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error('Error generating AI reply:', error);
    return NextResponse.json(
      { error: 'failed to generate reply' },
      { status: 500 }
    );
  }
}
