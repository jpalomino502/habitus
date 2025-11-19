"use client"

import { AppNavbar } from '@/components/app-navbar'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { CompleteChallengeButton } from '@/components/complete-challenge-button'
import { ChallengeProgress } from '@/components/challenge-progress'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RetoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const idParam = Array.isArray(params.id) ? params.id[0] : (params.id as string)
  const id = Number.parseInt(idParam, 10)

  const [reto, setReto] = useState<{ id: number; title: string; description: string | null; duration_min: number; points_per_completion: number; habit_id: number | null } | null>(null)
  const [habit, setHabit] = useState<{ name: string; description: string | null } | null>(null)
  const [tasks, setTasks] = useState<{ id: number; position: number; content: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!Number.isFinite(id) || id <= 0) {
        router.push('/retos')
        return
      }
      const { data: retoData } = await supabase
        .from('challenges')
        .select('id,title,description,duration_min,points_per_completion,habit_id')
        .eq('id', id)
        .single()
      if (!retoData) {
        router.push('/retos')
        return
      }
      setReto(retoData as any)
      if (retoData.habit_id) {
        const { data: h } = await supabase
          .from('habits')
          .select('name,description')
          .eq('id', retoData.habit_id)
          .single()
        setHabit((h || null) as any)
      }
      const { data: t } = await supabase
        .from('challenge_tasks')
        .select('id,position,content')
        .eq('challenge_id', id)
        .order('position')
      setTasks((t || []) as any)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <>
      <div className="min-h-screen bg-white pb-20">
        {/* Header con navegación */}
        <div className="border-b border-neutral-200 bg-white sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/retos" className="text-neutral-400 hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg text-black">Detalle del reto</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Título del reto */}
          <div className="mb-6">
            <h2 className="text-2xl tracking-tight text-black mb-2">{reto?.title || (loading ? 'Cargando…' : 'Reto')}</h2>
            {habit?.name && (
              <div className="text-xs text-neutral-500">Hábito: {habit.name}</div>
            )}
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{reto?.duration_min ?? 10} min</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{reto?.points_per_completion ?? 10} puntos</span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="border border-neutral-200 p-6 mb-6">
            <h3 className="text-sm text-neutral-500 mb-3">Descripción</h3>
            {reto?.description ? (
              <p className="text-black leading-relaxed">{reto.description}</p>
            ) : habit?.description ? (
              <p className="text-black leading-relaxed">{habit.description}</p>
            ) : (
              <p className="text-black leading-relaxed">Completa las tareas para lograr el objetivo del día.</p>
            )}
          </div>

          {/* Tareas */}
          {tasks && tasks.length > 0 && (
            <div className="border border-neutral-200 p-6 mb-6">
              <h3 className="text-sm text-neutral-500 mb-4">Tareas</h3>
              <div className="flex flex-col gap-3">
                {tasks.map((t, i) => (
                  <div key={t.id} className="flex items-start gap-3">
                    <span className="text-sm text-neutral-400 shrink-0">{i + 1}.</span>
                    <span className="text-sm text-black">{t.content}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consejos */}
          <div className="border border-neutral-200 p-6 mb-6">
            <h3 className="text-sm text-neutral-500 mb-4">Consejos</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="text-sm text-neutral-400 shrink-0">1.</span>
                <span className="text-sm text-black">Encuentra un lugar tranquilo y cómodo</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-neutral-400 shrink-0">2.</span>
                <span className="text-sm text-black">Elimina distracciones (celular, TV, etc.)</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-neutral-400 shrink-0">3.</span>
                <span className="text-sm text-black">Mantén una postura adecuada</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-neutral-400 shrink-0">4.</span>
                <span className="text-sm text-black">Toma notas si encuentras algo interesante</span>
              </div>
            </div>
          </div>

          {/* Progreso */}
          {reto?.id && <ChallengeProgress challengeId={reto.id} />}

          {/* Botón de acción */}
          {reto?.id && <CompleteChallengeButton challengeId={reto.id} />}

          {/* Enlaces adicionales */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <Link href="/retos" className="text-sm text-neutral-500 hover:text-black transition-colors">
              Ver todos los retos
            </Link>
            <span className="text-neutral-300">|</span>
            <Link href="/clasificacion" className="text-sm text-neutral-500 hover:text-black transition-colors">
              Ver clasificación
            </Link>
          </div>
        </div>
      </div>
      
      <AppNavbar />
    </>
  )
}
