"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function CompleteChallengeButton({ challengeId }: { challengeId: number }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onClick = async () => {
    setLoading(true)
    setError(null)
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData.user) {
      setError('Debes iniciar sesión')
      setLoading(false)
      return
    }
    const { error: insertErr } = await supabase
      .from('challenge_completions')
      .insert({ challenge_id: challengeId, user_id: userData.user.id })
    if (insertErr) {
      setError(insertErr.message)
      setLoading(false)
      return
    }
    setDone(true)
    setLoading(false)
  }

  return (
    <div>
      <button
        onClick={onClick}
        disabled={loading || done}
        className="w-full py-4 px-4 text-sm text-white bg-black hover:bg-neutral-800 transition-colors disabled:opacity-50"
      >
        {done ? 'Completado' : loading ? 'Marcando…' : 'Marcar como completado'}
      </button>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      {done && <div className="mt-2 text-sm text-neutral-600">+ puntos sumados a tu perfil</div>}
    </div>
  )
}