import { createClientFromCookies } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const supabase = await createClientFromCookies()
    const { roomId } = await params

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const supabase = await createClientFromCookies()
    const { roomId } = await params
    const { senderName, content, imageUrl } = await req.json()

    if (!senderName) {
      return NextResponse.json({ error: 'senderName obrigatório' }, { status: 400 })
    }

    if (!content && !imageUrl) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 })
    }

    const { data: room } = await supabase
      .from('chat_rooms')
      .select('expires_at')
      .eq('id', roomId)
      .single()

    if (!room || new Date() > new Date(room.expires_at)) {
      return NextResponse.json({ error: 'Sala expirada' }, { status: 410 })
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        sender_name: senderName,
        content: content ?? null,
        image_url: imageUrl ?? null,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
