"use client"

import { AppNavbar } from '@/components/app-navbar'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

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
      <div className="min-h-screen bg-white p-4 pb-20">
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-2xl tracking-tight text-black mb-8">Reto de hoy</h1>
          {loading ? (
            <div className="animate-pulse">
              <div className="block border border-neutral-200 p-6 mb-6">
                <div className="h-6 bg-neutral-100 rounded w-3/4 mb-3" />
                <div className="h-4 bg-neutral-100 rounded w-1/2 mb-4" />
                <div className="h-3 bg-neutral-100 rounded w-1/4" />
                <div className="w-full py-3 px-4 text-sm text-center bg-neutral-200 mt-4 rounded" />
              </div>

              <div className="border border-neutral-200">
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
            <Link href={`/reto/${reto.id}`} className="block border border-neutral-200 p-6 hover:border-neutral-300 transition-colors">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="text-lg text-black">{reto.title}</div>
                  {reto.description && (
                    <div className="text-sm text-neutral-500">{reto.description}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-neutral-500">Duración: {reto.duration_min} min</span>
                </div>
                <div className="w-full py-3 px-4 text-sm text-center text-white bg-black hover:bg-neutral-800 transition-colors">
                  Ver detalle
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
            <div className="border border-neutral-200">
              {retos.slice(1).map((r, index) => (
                <Link
                  key={r.id}
                  href={`/reto/${r.id}`}
                  className={`flex items-center justify-between p-4 ${index !== retos.slice(1).length - 1 ? 'border-b border-neutral-100' : ''}`}
                >
                  <span className="text-sm text-black">{r.title}</span>
                  <span className="text-xs text-neutral-500">{r.duration_min} min</span>
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
