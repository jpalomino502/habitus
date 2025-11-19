"use client"

import { AppNavbar } from '@/components/app-navbar'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function PerfilPage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [username, setUsername] = useState('')
  const [points, setPoints] = useState<number>(0)
  const [overallStreakValue, setOverallStreakValue] = useState<number>(0)
  const [habits, setHabits] = useState<{ id: number; name: string }[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [todayCount, setTodayCount] = useState(0)
  const [weekCount, setWeekCount] = useState(0)
  const [streaks, setStreaks] = useState<Record<number, { current: number; longest: number }>>({})
  const [recent, setRecent] = useState<{ title: string; points: number; completed_at: string }[]>([])

  const load = async () => {
    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      router.push('/login')
      return
    }

    const userId = userData.user.id

    const { data: profile } = await supabase
      .from('profiles')
      .select('username,points,current_streak_days')
      .eq('id', userId)
      .single()
    setUsername(profile?.username || '')
    setPoints(profile?.points || 0)
    setOverallStreakValue(profile?.current_streak_days ?? 0)

    const { data: allHabits } = await supabase
      .from('habits')
      .select('id,name')
      .order('name')
    const { data: userHabits } = await supabase
      .from('user_habits')
      .select('habit_id')
      .eq('user_id', userId)
      .eq('active', true)
    setHabits((allHabits || []) as any)
    setSelected((userHabits || []).map((uh: any) => uh.habit_id as number))

    const today = new Date().toISOString().slice(0, 10)
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const start = new Date(d)
    start.setDate(diff)
    const startStr = start.toISOString().slice(0, 10)

    const { data: todayCompletions } = await supabase
      .from('challenge_completions')
      .select('id')
      .eq('user_id', userId)
      .eq('completed_on', today)
    setTodayCount((todayCompletions || []).length)

    const { data: weekCompletions } = await supabase
      .from('challenge_completions')
      .select('id')
      .eq('user_id', userId)
      .gte('completed_on', startStr)
      .lte('completed_on', today)
    setWeekCount((weekCompletions || []).length)

    const { data: streakRows } = await supabase
      .from('habit_streaks')
      .select('habit_id,current_streak_days,longest_streak_days')
      .eq('user_id', userId)
    const map: Record<number, { current: number; longest: number }> = {}
    for (const r of streakRows || []) {
      map[(r as any).habit_id as number] = { current: (r as any).current_streak_days as number, longest: (r as any).longest_streak_days as number }
    }
    setStreaks(map)

    const { data: rec } = await supabase
      .from('challenge_completions')
      .select('completed_at,challenge_id,challenges(title,points_per_completion)')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(10)
    setRecent((rec || []).map((r: any) => ({ title: r.challenges?.title ?? 'Reto', points: r.challenges?.points_per_completion ?? 0, completed_at: r.completed_at })))

    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  useEffect(() => {
    let bc: BroadcastChannel | null = null
    try {
      bc = new BroadcastChannel('habitus')
      bc.onmessage = (ev) => {
        if (ev?.data?.type === 'completion') {
          load()
        }
      }
    } catch (e) {
      // BroadcastChannel might be unavailable in some environments
    }
    return () => {
      try { bc?.close() } catch (e) {}
    }
  }, [])

  const filteredHabits = useMemo(() => habits.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase())), [habits, searchTerm])
  const selectedHabits = useMemo(() => habits.filter(h => selected.includes(h.id)), [habits, selected])

  const toggleHabit = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const saveHabits = async () => {
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
    const currentIds = (current || []).map((uh: any) => uh.habit_id as number)
    const toAdd = selected.filter(id => !currentIds.includes(id))
    const toRemove = currentIds.filter(id => !selected.includes(id))
    if (toAdd.length) {
      const rows = toAdd.map(habit_id => ({ user_id: userData.user!.id, habit_id, active: true }))
      await supabase.from('user_habits').upsert(rows)
    }
    if (toRemove.length) {
      await supabase.from('user_habits').delete().eq('user_id', userData.user.id).in('habit_id', toRemove)
    }
    setShowModal(false)
    setLoading(false)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const overallStreak = useMemo(() => overallStreakValue, [overallStreakValue])

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-white p-4 pb-20">
          <div className="max-w-2xl mx-auto py-8">
            <div className="animate-pulse flex flex-col items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-neutral-100 border border-neutral-200" />
              <div className="w-48 h-6 bg-neutral-100 rounded" />
              <div className="w-32 h-4 bg-neutral-100 rounded" />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="h-20 bg-neutral-100 rounded"></div>
              <div className="h-20 bg-neutral-100 rounded"></div>
              <div className="h-20 bg-neutral-100 rounded"></div>
            </div>

            <div className="mb-8">
              <div className="h-12 bg-neutral-100 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-16 bg-neutral-100 rounded" />
                <div className="h-16 bg-neutral-100 rounded" />
                <div className="h-16 bg-neutral-100 rounded" />
              </div>
            </div>

            <div className="mb-8">
              <div className="h-6 bg-neutral-100 rounded mb-4" />
              <div className="grid grid-cols-4 gap-3">
                <div className="h-24 bg-neutral-100 rounded" />
                <div className="h-24 bg-neutral-100 rounded" />
                <div className="h-24 bg-neutral-100 rounded" />
                <div className="h-24 bg-neutral-100 rounded opacity-40" />
              </div>
            </div>

            <div className="mb-8">
              <div className="h-6 bg-neutral-100 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-12 bg-neutral-100 rounded" />
                <div className="h-12 bg-neutral-100 rounded" />
                <div className="h-12 bg-neutral-100 rounded" />
              </div>
            </div>

            <div className="flex flex-col gap-3 max-w-sm mx-auto mb-8">
              <div className="h-12 bg-neutral-100 rounded" />
              <div className="h-12 bg-neutral-100 rounded" />
              <div className="h-12 bg-neutral-100 rounded" />
            </div>
          </div>
        </div>
        <AppNavbar />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-white p-4 pb-20">
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-2xl tracking-tight text-black mb-8">Perfil</h1>
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
              <span className="text-3xl text-neutral-400">{username?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            <div className="text-center">
              <div className="text-xl text-black mb-1">{username || 'Usuario'}</div>
              <div className="text-sm text-neutral-500">{selectedHabits.length} hábitos activos</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="border border-neutral-200 p-4 text-center">
              <div className="text-2xl text-black mb-1">{points}</div>
              <div className="text-xs text-neutral-500">Puntos</div>
            </div>
            <div className="border border-neutral-200 p-4 text-center">
              <div className="text-2xl text-black mb-1">{overallStreak}</div>
              <div className="text-xs text-neutral-500">Racha días</div>
            </div>
            <div className="border border-neutral-200 p-4 text-center">
              <div className="text-2xl text-black mb-1">{todayCount}</div>
              <div className="text-xs text-neutral-500">Hoy</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm text-neutral-500">Hábitos activos</h2>
              <button 
                onClick={() => setShowModal(true)}
                className="text-xs text-black border border-neutral-200 px-3 py-1.5 hover:bg-neutral-50 transition-colors"
              >
                Gestionar hábitos
              </button>
            </div>
            
            {selectedHabits.length > 0 ? (
              <div className="flex flex-col gap-3">
                {selectedHabits.map((habit) => (
                  <div key={habit.id} className="border border-neutral-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-lg">{habit.name.slice(0,1)}</div>
                      <div>
                        <div className="text-sm text-black">{habit.name}</div>
                        <div className="text-xs text-neutral-500">Racha {streaks[habit.id]?.current ?? 0}d • Máx {streaks[habit.id]?.longest ?? 0}d</div>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-500">Activo</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-neutral-200 p-8 text-center">
                <div className="text-sm text-neutral-500 mb-4">No tienes hábitos activos</div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="text-sm text-black border border-neutral-200 px-4 py-2 hover:bg-neutral-50 transition-colors"
                >
                  Agregar hábitos
                </button>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-sm text-neutral-500 mb-4">Logros desbloqueados</h2>
            <div className="grid grid-cols-4 gap-3">
              <div className="border border-neutral-200 p-4 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-xl">
                  🏆
                </div>
                <div className="text-xs text-center text-neutral-500">Primera semana</div>
              </div>
              
              <div className="border border-neutral-200 p-4 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-xl">
                  🔥
                </div>
                <div className="text-xs text-center text-neutral-500">Racha {overallStreak} días</div>
              </div>
              
              <div className="border border-neutral-200 p-4 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-xl">
                  ⭐
                </div>
                <div className="text-xs text-center text-neutral-500">50 puntos</div>
              </div>
              
              <div className="border border-neutral-200 p-4 flex flex-col items-center gap-2 opacity-40">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-xl">
                  💎
                </div>
                <div className="text-xs text-center text-neutral-500">Bloqueado</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-sm text-neutral-500 mb-4">Actividad reciente</h2>
            <div className="border border-neutral-200 divide-y divide-neutral-200">
              {recent.length === 0 ? (
                <div className="p-4 text-sm text-neutral-500">Sin actividad</div>
              ) : recent.map((r, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-black mb-1">Completaste "{r.title}"</div>
                    <div className="text-xs text-neutral-500">{new Date(r.completed_at).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-neutral-500">+{r.points} pts</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 max-w-sm mx-auto mb-8">
            <button className="w-full py-3 px-4 text-sm text-black border border-neutral-200 hover:bg-neutral-50 transition-colors">
              Editar perfil
            </button>

            <button className="w-full py-3 px-4 text-sm text-black border border-neutral-200 hover:bg-neutral-50 transition-colors">
              Configuración
            </button>
          
            <button onClick={logout} className="w-full py-3 px-4 text-sm text-neutral-500 border border-neutral-200 hover:bg-neutral-50 transition-colors">
              Cerrar sesión
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-neutral-100">
            <div className="text-sm text-neutral-500 text-center">
              <a href="/" className="hover:text-black">Volver al inicio</a>
            </div>
          </div>
        </div>
      </div>
      
      <AppNavbar />

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white w-full max-w-lg max-h-[80vh] flex flex-col border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg text-black">Gestionar hábitos</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-neutral-500 hover:text-black text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Input de búsqueda */}
            <div className="p-4 border-b border-neutral-200">
              <input
                type="text"
                placeholder="Buscar hábitos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-neutral-200 focus:outline-none focus:border-neutral-400"
              />
            </div>

            {/* Lista de hábitos con scroll */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredHabits.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {filteredHabits.map((habit) => (
                    <label 
                      key={habit.id}
                      className="flex items-center justify-between p-3 border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors"
                    >
                      <span className="text-sm text-black">{habit.name}</span>
                      <input type="checkbox" checked={selected.includes(habit.id)} onChange={() => toggleHabit(habit.id)} className="w-4 h-4" />
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-neutral-500">
                  No se encontraron hábitos
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="p-4 border-t border-neutral-200 flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 px-4 text-sm text-neutral-500 border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button onClick={saveHabits} className="flex-1 py-2 px-4 text-sm text-white bg-black hover:bg-neutral-800 transition-colors disabled:opacity-50" disabled={loading}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
