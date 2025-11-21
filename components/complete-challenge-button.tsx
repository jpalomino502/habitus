"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function CompleteChallengeButton({ challengeId }: { challengeId: number }) {
  const router = useRouter()
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

    // Let the DB trigger handle points and streaks atomically.
    setDone(true)
    setLoading(false)

    // Broadcast to the app that a completion occurred so other pages update automatically
    try {
      const bc = new BroadcastChannel('habitus')
      bc.postMessage({ type: 'completion', challengeId })
      bc.close()
    } catch (e) {
      // ignore if BroadcastChannel not available
    }

    // Ask Next.js to revalidate server-side data where applicable
    try { router.refresh() } catch (e) {}

    // Refresh data or navigate — keep original navigation behavior

    const today = new Date().toISOString().slice(0, 10)
    const { data: userHabits } = await supabase
      .from('user_habits')
      .select('habit_id')
      .eq('user_id', userData.user.id)
      .eq('active', true)
    const habitIds = (userHabits || []).map((h) => h.habit_id as number)
    let nextId: number | null = null
    if (habitIds.length) {
      const { data: completedToday } = await supabase
        .from('challenge_completions')
        .select('challenge_id')
        .eq('user_id', userData.user.id)
        .eq('completed_on', today)
      const completedIds = new Set((completedToday || []).map((c) => c.challenge_id as number))
      const { data: candidates } = await supabase
        .from('challenges')
        .select('id,habit_id')
        .eq('active', true)
        .in('habit_id', habitIds)
        .order('created_at', { ascending: false })
      const next = (candidates || []).find((c) => c.id !== challengeId && !completedIds.has(c.id as number))
      nextId = next ? (next.id as number) : null
    }
    if (nextId) {
      router.push(`/reto/${nextId}`)
    } else {
      router.push('/retos')
    }
  }

  return (
    <div>
      <button
        onClick={onClick}
        disabled={loading || done}
        className="btn-primary"
      >
        {done ? 'Completado' : loading ? 'Marcando…' : 'Marcar como completado'}
      </button>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      {done && <div className="mt-2 text-sm text-neutral-600">+ puntos sumados a tu perfil</div>}
    </div>
  )
}