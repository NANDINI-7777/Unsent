import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';
import { filterProfanity } from '@/lib/profanity';
import { supabase } from '@/lib/supabase-client';

// POST — Create a human reply to a vent
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ventId, content, deviceId } = body;

    if (!ventId || !content || !deviceId) {
      return NextResponse.json(
        { error: 'missing required fields' },
        { status: 400 }
      );
    }

    let reply;
    if (supabase) {
      // Check parent vent exists
      const { data: vent, error: ventError } = await supabase
        .from('vents')
        .select('*')
        .eq('id', ventId)
        .single();

      if (ventError || !vent) {
        return NextResponse.json(
          { error: 'vent not found' },
          { status: 404 }
        );
      }

      const filteredContent = filterProfanity(content);

      // Create reply
      const { data, error: replyError } = await supabase
        .from('replies')
        .insert({
          vent_id: ventId,
          content: filteredContent,
          device_id: deviceId,
        })
        .select()
        .single();

      if (replyError) {
        console.error('Supabase createReply error:', replyError);
        throw replyError;
      }

      // Increment reply count on vent
      const { error: updateError } = await supabase
        .from('vents')
        .update({ reply_count: (vent.reply_count || 0) + 1 })
        .eq('id', ventId);

      if (updateError) {
        console.error('Failed to update reply count in Supabase:', updateError);
      }

      reply = {
        id: data.id,
        ventId: data.vent_id,
        content: data.content,
        deviceId: data.device_id,
        createdAt: data.created_at,
      };
    } else {
      // Check vent exists
      const vent = await mockDb.getVentById(ventId);
      if (!vent) {
        return NextResponse.json(
          { error: 'vent not found' },
          { status: 404 }
        );
      }

      const filteredContent = filterProfanity(content);

      reply = await mockDb.createReply({
        ventId,
        content: filteredContent,
        deviceId,
      });
    }

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { error: 'failed to create reply' },
      { status: 500 }
    );
  }
}
