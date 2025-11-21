"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { AppNavbar } from '@/components/app-navbar'
import { Flame, TrendingUp, Trophy } from 'lucide-react'

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
      <div className="page max-w-2xl mx-auto py-8">
        <div className="container">
          <div className="hero">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl text-white">Rachas</h1>
                <p className="text-sm text-white/80">Mantén tu constancia diaria</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-white/20 text-white">Hábitos <span className="">{rows.length}</span></span>
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-20 rounded-xl border border-neutral-200 bg-neutral-50" />
              <div className="h-20 rounded-xl border border-neutral-200 bg-neutral-50" />
              <div className="h-20 rounded-xl border border-neutral-200 bg-neutral-50" />
            </div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-neutral-500">No tienes hábitos activos. Selecciona hábitos para empezar.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {rows.map((r) => (
                <div
                  key={r.habit_id}
                  className="group rounded-2xl border border-neutral-200 bg-gradient-to-r from-blue-50 to-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/60 flex items-center justify-center shrink-0">
                      <Flame className="w-6 h-6 text-neutral-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-black  truncate">{r.name}</div>
                      {r.description && (
                        <div className="text-xs text-neutral-500">{r.description}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-sm text-neutral-500 text-center w-16">
                        <div className="rounded-full bg-blue-50 text-blue-700 text-base px-3 py-1 ">
                          {r.current}
                        </div>
                        <div className="mt-1 text-[11px] flex items-center justify-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>Actual</span>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-500 text-center w-16">
                        <div className="rounded-full bg-blue-50 text-blue-700 text-base px-3 py-1 ">
                          {r.longest}
                        </div>
                        <div className="mt-1 text-[11px] flex items-center justify-center gap-1">
                          <Trophy className="w-3 h-3" />
                          <span>Récord</span>
                        </div>
                      </div>
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
