import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';
import { supabase } from '@/lib/supabase-client';

// GET — Retrieve a single vent by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let vent = null;
    if (supabase) {
      const { data, error } = await supabase
        .from('vents')
        .select('*, replies(count)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase fetch vent error:', error);
        throw error;
      }

      if (data) {
        vent = {
          id: data.id,
          content: data.content,
          mood: data.mood,
          moodEmoji: data.mood_emoji,
          moodColor: data.mood_color,
          replyStyle: data.reply_style,
          showOnFeed: data.show_on_feed,
          autoDelete: data.auto_delete,
          deviceId: data.device_id,
          replyCount: data.replies?.[0]?.count || 0,
          gender: data.gender || 'anon',
          createdAt: data.created_at,
          expiresAt: data.expires_at,
        };
      }
    } else {
      const mockVent = await mockDb.getVentById(id);
      if (mockVent) {
        vent = mockVent;
      }
    }

    if (!vent) {
      return NextResponse.json(
        { error: 'vent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ vent });
  } catch (error) {
    console.error('Error fetching vent:', error);
    return NextResponse.json(
      { error: 'failed to fetch vent' },
      { status: 500 }
    );
  }
}

// DELETE — Delete own vent (within 1 hour, verified by device_id)
export async function DELETE(

  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');

    if (!deviceId) {
      return NextResponse.json(
        { error: 'device ID required' },
        { status: 400 }
      );
    }

    if (supabase) {
      // Fetch vent first to check permissions and time window
      const { data: vent, error: fetchError } = await supabase
        .from('vents')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !vent) {
        return NextResponse.json(
          { error: 'cannot delete: vent not found' },
          { status: 404 }
        );
      }

      if (vent.device_id !== deviceId) {
        return NextResponse.json(
          { error: 'cannot delete: not authorized' },
          { status: 403 }
        );
      }

      const { error: deleteError } = await supabase
        .from('vents')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Supabase deleteVent error:', deleteError);
        throw deleteError;
      }
    } else {
      const success = await mockDb.deleteVent(id, deviceId);

      if (!success) {
        return NextResponse.json(
          { error: 'cannot delete: vent not found or not yours' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vent:', error);
    return NextResponse.json(
      { error: 'failed to delete vent' },
      { status: 500 }
    );
  }
}
