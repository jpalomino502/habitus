"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { AppNavbar } from '@/components/app-navbar'

type HabitRow = {
  habit_id: number
  name: string
  description?: string | null
  current?: number
  longest?: number
}

export default function RachaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<HabitRow[]>([])
  

  const load = async () => {
    setLoading(true)
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData.user) {
      router.push('/login')
      return
    }

    const userId = userData.user.id

    // fetch user's active habits and their names
    const { data: userHabits } = await supabase
      .from('user_habits')
      .select('habit_id,habits(name,description)')
      .eq('user_id', userId)
      .eq('active', true)

    const habits = (userHabits || []).map((uh: any) => ({
      habit_id: uh.habit_id as number,
      name: uh.habits?.name ?? 'Hábito',
      description: uh.habits?.description ?? null,
    })) as HabitRow[]

    const ids = habits.map((h) => h.habit_id)
    let streaks: any[] = []
    if (ids.length) {
      const { data: s } = await supabase
        .from('habit_streaks')
        .select('habit_id,current_streak_days,longest_streak_days')
        .eq('user_id', userId)
        .in('habit_id', ids)
      streaks = s || []
    }

    const merged = habits.map((h) => {
      const s = streaks.find((x) => x.habit_id === h.habit_id)
      return { ...h, current: s?.current_streak_days ?? 0, longest: s?.longest_streak_days ?? 0 }
    })

    setRows(merged)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  // Automatic-only page: no manual buttons. Subscribe to completion events to reload.

  useEffect(() => {
    let bc: BroadcastChannel | null = null
    try {
      bc = new BroadcastChannel('habitus')
      bc.onmessage = (ev) => {
        if (ev?.data?.type === 'completion') {
          // reload streaks when a completion happens elsewhere
          load()
        }
      }
    } catch (e) {
      // BroadcastChannel might be unavailable
    }
    return () => {
      try { bc?.close() } catch (e) {}
    }
  }, [])

  return (
    <>
      <div className="min-h-screen bg-white p-4 pb-20">
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-2xl tracking-tight text-black mb-6">Rachas</h1>

          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-12 bg-neutral-100 rounded" />
              <div className="h-12 bg-neutral-100 rounded" />
              <div className="h-12 bg-neutral-100 rounded" />
            </div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-neutral-500">No tienes hábitos activos. Selecciona hábitos para empezar.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {rows.map((r) => (
                <div key={r.habit_id} className="border border-neutral-200 p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-black">{r.name}</div>
                    {r.description && <div className="text-xs text-neutral-500">{r.description}</div>}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-neutral-500 text-center">
                      <div className="text-black text-lg">{r.current}</div>
                      <div className="text-xs">Actual</div>
                    </div>
                    <div className="text-sm text-neutral-500 text-center">
                      <div className="text-black text-lg">{r.longest}</div>
                      <div className="text-xs">Máx</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <AppNavbar />
    </>
  )
}
