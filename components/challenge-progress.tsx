"use client"

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

function startOfWeek(d: Date) {
  const day = d.getUTCDay()
  const diff = (day + 6) % 7
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  start.setUTCDate(start.getUTCDate() - diff)
  return start
}

function endOfWeek(d: Date) {
  const start = startOfWeek(d)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 6)
  return end
}

export function ChallengeProgress({ challengeId }: { challengeId: number }) {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const today = useMemo(() => new Date(), [])
  const start = useMemo(() => startOfWeek(today), [today])
  const end = useMemo(() => endOfWeek(today), [today])

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        setLoading(false)
        return
      }
      const startStr = start.toISOString().slice(0, 10)
      const endStr = end.toISOString().slice(0, 10)
      const { data } = await supabase
        .from('challenge_completions')
        .select('id')
        .eq('user_id', userData.user.id)
        .eq('challenge_id', challengeId)
        .gte('completed_on', startStr)
        .lte('completed_on', endStr)
      setCount((data || []).length)
      setLoading(false)
    }
    load()
  }, [challengeId, start, end])

  const percent = Math.min(100, Math.round((count / 7) * 100))

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-neutral-500">Tu progreso esta semana</h3>
        <span className="text-sm text-black">{loading ? '…' : `${count}/7 días`}</span>
      </div>
      <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  )
}