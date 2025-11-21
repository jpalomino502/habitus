"use client"

import { AppNavbar } from '@/components/app-navbar'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Trophy } from 'lucide-react'

type Usuario = { username: string | null; points: number }

export default function ClasificacionPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username,points')
        .order('points', { ascending: false })
        .limit(20)
      setUsuarios(data || [])
    }
    load()
  }, [])
  
  return (
    <>
      <div className="page max-w-2xl mx-auto py-8">
        <div className="container">
          <div className="hero flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl text-white">Clasificación</h1>
              <p className="text-sm text-white/80">Sube puestos acumulando puntos</p>
            </div>
          </div>
          
          <div className="rounded-2xl border border-neutral-200 overflow-hidden">
            {usuarios.map((usuario, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 ${
                  index !== usuarios.length - 1 ? 'border-b border-neutral-100' : ''
                } ${index < 3 ? 'bg-blue-50' : 'bg-white'}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${index === 0 ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                    {index + 1}
                  </span>
                  <span className="text-sm text-black">{usuario.username || 'Usuario'}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                  <Trophy className="w-3 h-3 text-blue-700" />
                  {usuario.points} pts
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <a href="/perfil" className="text-sm text-neutral-500 hover:text-black">
              Ver mi perfil
            </a>
          </div>
        </div>
      </div>
      
      <AppNavbar />
    </>
  )
}
