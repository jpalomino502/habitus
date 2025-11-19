"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Credenciales inválidas')
        setLoading(false)
        return
      }
      if (json.session?.access_token && json.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: json.session.access_token,
          refresh_token: json.session.refresh_token,
        })
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
          await supabase.from('profiles').upsert({ id: userData.user.id }).select().single()
        }
        router.push('/retos')
      } else {
        setError('No se pudo iniciar sesión')
      }
    } catch {
      setError('Error de red')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white relative flex items-center justify-center">
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-0">
        <svg viewBox="0 0 1440 120" className="w-full h-24 text-neutral-200"><path fill="currentColor" d="M0 60 C 240 10 480 110 720 60 C 960 10 1200 110 1440 60 L 1440 0 L 0 0 Z"/></svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none rotate-180 z-0">
        <svg viewBox="0 0 1440 120" className="w-full h-24 text-neutral-200"><path fill="currentColor" d="M0 60 C 240 10 480 110 720 60 C 960 10 1200 110 1440 60 L 1440 0 L 0 0 Z"/></svg>
      </div>
      <div className="w-full max-w-sm flex flex-col gap-8 p-6 relative z-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl tracking-tight text-black">Iniciar sesión</h1>
          <p className="text-sm text-neutral-500">Accede a tu cuenta</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600">Correo electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="py-3 px-3 text-sm border border-neutral-200 focus:outline-none focus:border-neutral-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600">Contraseña</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="py-3 px-3 pr-10 text-sm border border-neutral-200 focus:outline-none focus:border-neutral-400 w-full"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black">
                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
              </button>
            </div>
          </div>
          <button onClick={onSubmit} disabled={loading} className="w-full py-3 px-4 text-sm text-white bg-black hover:bg-neutral-800 transition-colors mt-2 disabled:opacity-50">
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
          {error && <div className="text-sm text-red-600 text-center">{error}</div>}
          <a href="/registro" className="text-sm text-neutral-500 hover:text-black text-center">¿No tienes cuenta? Regístrate</a>
        </div>
      </div>
    </div>
  )
}
