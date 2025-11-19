"use client"

import { AppNavbar } from '@/components/app-navbar'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

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
      <div className="min-h-screen bg-white p-4 pb-20">
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-2xl tracking-tight text-black mb-8">Clasificación</h1>
          
          <div className="border border-neutral-200">
            {usuarios.map((usuario, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 ${
                  index !== usuarios.length - 1 ? 'border-b border-neutral-100' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-400 w-6">{index + 1}</span>
                  <span className="text-sm text-black">{usuario.username || 'Usuario'}</span>
                </div>
                <span className="text-sm text-neutral-500">{usuario.points} pts</span>
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
