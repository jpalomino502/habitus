import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = typeof body.email === 'string' ? body.email : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const username = typeof body.username === 'string' ? body.username : ''

    if (!email || !password) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const { data, error } = await supabaseServer.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: data.user, session: data.session })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}