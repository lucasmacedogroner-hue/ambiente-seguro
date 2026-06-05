import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

const MAX_SIZE = 4 * 1024 * 1024

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const entry = form.get('file')

    if (!entry || typeof entry === 'string') {
      return NextResponse.json({ error: 'Arquivo ausente' }, { status: 400 })
    }

    const file = entry as File

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Arquivo maior que 4MB' },
        { status: 413 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Apenas imagens são permitidas' },
        { status: 400 }
      )
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filename = `chat/${Date.now()}-${safeName}`

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro no upload'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
