import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';
import { supabase } from '@/lib/supabase-client';

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

      const createdTime = new Date(vent.created_at).getTime();
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - createdTime > oneHour) {
        return NextResponse.json(
          { error: 'cannot delete: older than 1 hour' },
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
          { error: 'cannot delete: vent not found, not yours, or older than 1 hour' },
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
