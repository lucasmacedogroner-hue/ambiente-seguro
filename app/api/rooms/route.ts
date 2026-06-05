import { createClientFromCookies } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'

const codeGen = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6)

const FREE_DURATION = 6

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClientFromCookies()
    const body = await req.json()
    const { isPrivate, createdBySessionId, duration_hours: requestedHours } = body

    if (!createdBySessionId) {
      return NextResponse.json({ error: 'Session ID obrigatório' }, { status: 400 })
    }

    // MVP: servidor só cria salas no plano free (premium exige conta/pagamento futuro)
    const plan = 'free' as const
    const durationHours = FREE_DURATION

    const { count, error: countError } = await supabase
      .from('chat_rooms')
      .select('id', { count: 'exact', head: true })
      .eq('created_by_session_id', createdBySessionId)
      .gt('expires_at', new Date().toISOString())

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    if ((count ?? 0) >= 1) {
      return NextResponse.json(
        {
          error:
            'No plano gratuito você pode ter apenas 1 sala ativa. Assine o Premium para criar mais salas.',
          code: 'FREE_ROOM_LIMIT',
        },
        { status: 403 }
      )
    }

    if (requestedHours != null && requestedHours !== FREE_DURATION) {
      return NextResponse.json(
        {
          error: 'Duração personalizada é recurso Premium.',
          code: 'PREMIUM_DURATION',
        },
        { status: 403 }
      )
    }

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + durationHours)

    const accessCode = isPrivate ? codeGen() : null

    const { data, error } = await supabase
      .from('chat_rooms')
      .insert({
        is_private: isPrivate ?? false,
        access_code: accessCode,
        created_by_session_id: createdBySessionId,
        plan,
        duration_hours: durationHours,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
