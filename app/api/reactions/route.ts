import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';
import { supabase } from '@/lib/supabase-client';

// POST — Save a reaction (+ optional comment)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { replyId, reaction, ownComment, deviceId } = body;

    if (!replyId || !reaction || !deviceId) {
      return NextResponse.json(
        { error: 'missing required fields' },
        { status: 400 }
      );
    }

    if (ownComment && ownComment.length > 120) {
      return NextResponse.json(
        { error: 'comment must be 120 characters or less' },
        { status: 400 }
      );
    }

    let reactionData;
    if (supabase) {
      const { data, error: reactionError } = await supabase
        .from('reactions')
        .insert({
          reply_id: replyId,
          reaction,
          own_comment: ownComment || null,
          device_id: deviceId,
        })
        .select()
        .single();

      if (reactionError) {
        console.error('Supabase createReaction error:', reactionError);
        throw reactionError;
      }

      reactionData = {
        id: data.id,
        replyId: data.reply_id,
        reaction: data.reaction,
        ownComment: data.own_comment,
        deviceId: data.device_id,
        createdAt: data.created_at,
      };
    } else {
      reactionData = await mockDb.createReaction({
        replyId,
        reaction,
        ownComment: ownComment || undefined,
        deviceId,
      });
    }

    return NextResponse.json(reactionData, { status: 201 });
  } catch (error) {
    console.error('Error creating reaction:', error);
    return NextResponse.json(
      { error: 'failed to save reaction' },
      { status: 500 }
    );
  }
}
