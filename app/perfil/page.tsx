"use client"

import { AppNavbar } from '@/components/app-navbar'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function PerfilPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [points, setPoints] = useState<number>(0)

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.push('/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('username,points')
        .eq('id', userData.user.id)
        .single()
      setUsername(profile?.username || '')
      setPoints(profile?.points || 0)
    }
    load()
  }, [router])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
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
              <div className="text-sm text-neutral-500">{points} puntos acumulados</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 max-w-sm mx-auto mb-8">
            <button className="w-full py-3 px-4 text-sm text-black border border-neutral-200 hover:bg-neutral-50 transition-colors">
              Editar perfil
            </button>
          
            <button onClick={logout} className="w-full py-3 px-4 text-sm text-neutral-500 border border-neutral-200 hover:bg-neutral-50 transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
      
      <AppNavbar />
    </>
  )
}
