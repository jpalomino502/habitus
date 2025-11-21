"use client"

import { AppNavbar } from '@/components/app-navbar'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Flame, Timer, ChevronRight } from 'lucide-react'

type Reto = { id: number; title: string; description: string | null; duration_min: number; habit_id: number | null }

export default function RetosPage() {
  const [retos, setRetos] = useState<Reto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()
      let challengeQuery = supabase
        .from('challenges')
        .select('id,title,description,duration_min,habit_id')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(10)

      if (userData.user) {
        const { data: userHabits } = await supabase
          .from('user_habits')
          .select('habit_id')
          .eq('user_id', userData.user.id)
          .eq('active', true)
        const ids = (userHabits || []).map((h) => h.habit_id as number)
        if (ids.length) {
          challengeQuery = challengeQuery.in('habit_id', ids)
        } else {
          setRetos([])
          setLoading(false)
          return
        }
      }

      const { data } = await challengeQuery
      setRetos(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const reto = retos[0] || null
  return (
    <>
      <div className="page max-w-2xl mx-auto py-8">
        <div className="container">
          <div className="hero">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl text-white">Reto de hoy</h1>
                <p className="text-sm text-white/80">Impulsa tu progreso con un reto diario</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-white/20 text-white">Disponible <span className="">{retos.length}</span></span>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="rounded-xl border border-neutral-200 p-6 shadow-sm">
                <div className="h-6 bg-neutral-100 rounded w-3/4 mb-4" />
                <div className="h-4 bg-neutral-100 rounded w-1/2 mb-6" />
                <div className="h-10 bg-neutral-100 rounded" />
              </div>
              <div className="rounded-xl border border-neutral-200">
                <div className="p-4 flex items-center justify-between border-b border-neutral-100">
                  <div className="h-4 bg-neutral-100 rounded w-2/3" />
                  <div className="h-4 bg-neutral-100 rounded w-12" />
                </div>
                <div className="p-4 flex items-center justify-between border-b border-neutral-100">
                  <div className="h-4 bg-neutral-100 rounded w-2/3" />
                  <div className="h-4 bg-neutral-100 rounded w-12" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="h-4 bg-neutral-100 rounded w-2/3" />
                  <div className="h-4 bg-neutral-100 rounded w-12" />
                </div>
              </div>
            </div>
          ) : reto ? (
            <Link href={`/reto/${reto.id}`} className="block rounded-2xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/60 flex items-center justify-center shrink-0">
                  <Flame className="w-6 h-6 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <div className="text-lg text-black ">{reto.title}</div>
                  {reto.description && (
                    <div className="text-sm text-neutral-500 mt-1">{reto.description}</div>
                  )}
                  <div className="flex items-center gap-3 pt-4">
                    <div className="flex items-center gap-1 text-xs text-blue-700">
                      <Timer className="w-4 h-4 text-blue-700" />
                      <span>{reto.duration_min} min</span>
                    </div>
                    <div className="ml-auto inline-flex items-center gap-2 text-sm rounded-full bg-blue-600 text-white px-3 py-1 hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                      <span>Comenzar</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="text-sm text-neutral-500">
              {retos.length === 0
                ? 'No hay retos para tus hábitos seleccionados. Selecciona hábitos para ver retos.'
                : 'No hay retos activos'}
            </div>
          )}
          <div className="mt-8">
            <h2 className="text-sm text-neutral-500 mb-4">Más retos</h2>
            <div className="card">
              {retos.slice(1).map((r, index) => (
                <Link
                  key={r.id}
                  href={`/reto/${r.id}`}
                  className={`flex items-center justify-between p-4 hover:bg-blue-50 transition-colors ${index !== retos.slice(1).length - 1 ? 'border-b border-neutral-100' : ''}`}
                >
                  <span className="text-sm text-black">{r.title}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-blue-700 flex items-center gap-1">
                      <Timer className="w-3 h-3 text-blue-700" />
                      {r.duration_min} min
                    </span>
                    <ChevronRight className="w-4 h-4 text-blue-400" />
                  </span>
                </Link>
              ))}
              {!loading && retos.length <= 1 && (
                <div className="p-4 text-sm text-neutral-500">No hay más retos</div>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <a href="/clasificacion" className="text-sm text-neutral-500 hover:text-black">
              Ver clasificación
            </a>
          </div>
        </div>
      </div>
      <AppNavbar />
    </>
  )
}
