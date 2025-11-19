"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Habit = {
  id: number
  name: string
  description: string | null
}

export default function SeleccionHabitosPage() {
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: userData, error: userErr } = await supabase.auth.getUser()
      if (userErr || !userData.user) {
        router.push('/login')
        return
      }
      const { data: habitsData } = await supabase.from('habits').select('id,name,description').order('name')
      const { data: userHabits } = await supabase
        .from('user_habits')
        .select('habit_id')
        .eq('user_id', userData.user.id)
        .eq('active', true)
      setHabits(habitsData || [])
      setSelected((userHabits || []).map((uh) => uh.habit_id as number))
      setLoading(false)
    }
    load()
  }, [router])

  const toggleHabit = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const save = async () => {
    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      setLoading(false)
      return
    }
    const { data: current } = await supabase
      .from('user_habits')
      .select('habit_id')
      .eq('user_id', userData.user.id)
      .eq('active', true)
    const currentIds = (current || []).map((uh) => uh.habit_id as number)
    const toAdd = selected.filter((id) => !currentIds.includes(id))
    const toRemove = currentIds.filter((id) => !selected.includes(id))

    if (toAdd.length) {
      const rows = toAdd.map((habit_id) => ({ user_id: userData.user!.id, habit_id, active: true }))
      await supabase.from('user_habits').upsert(rows)
    }
    if (toRemove.length) {
      await supabase
        .from('user_habits')
        .delete()
        .eq('user_id', userData.user.id)
        .in('habit_id', toRemove)
    }
    setLoading(false)
    router.push('/retos')
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl tracking-tight text-black mb-6">Selecciona tus hábitos</h1>
        {loading ? (
          <div className="text-sm text-neutral-500">Cargando…</div>
        ) : (
          <div className="flex flex-col gap-3">
            {habits.map((h) => (
              <label key={h.id} className="flex items-center justify-between border border-neutral-200 p-3">
                <div>
                  <div className="text-sm text-black">{h.name}</div>
                  {h.description && <div className="text-xs text-neutral-500">{h.description}</div>}
                </div>
                <input
                  type="checkbox"
                  checked={selected.includes(h.id)}
                  onChange={() => toggleHabit(h.id)}
                />
              </label>
            ))}
          </div>
        )}
        <button
          onClick={save}
          disabled={loading}
          className="w-full py-3 px-4 text-sm text-white bg-black hover:bg-neutral-800 transition-colors mt-6 disabled:opacity-50"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
