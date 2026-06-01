import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';
import { supabase } from '@/lib/supabase-client';

// GET — Get all replies for a vent
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    let replies = [];
    if (supabase) {
      const { data, error } = await supabase
        .from('replies')
        .select('*')
        .eq('vent_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase fetch replies error:', error);
        throw error;
      }

      // Standardize schema fields for frontend components
      replies = data.map((item: any) => ({
        id: item.id,
        ventId: item.vent_id,
        content: item.content,
        deviceId: item.device_id,
        createdAt: item.created_at,
      }));
    } else {
      replies = await mockDb.getReplies(id);
    }

    return NextResponse.json({ replies });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'failed to fetch replies' },
      { status: 500 }
    );
  }
}
