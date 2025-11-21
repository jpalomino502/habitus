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
<div className="page max-w-2xl mx-auto py-8 min-h-screen flex flex-col justify-center">
      <div className="container">
        <div className="hero text-center mb-6">
          <h1 className="text-2xl tracking-tight text-white">Iniciar sesión</h1>
          <p className="text-sm text-white/80">Accede a tu cuenta de Habitus</p>
        </div>

        <div className="mx-auto bg-white rounded-xl shadow-md p-6 w-full max-w-md">
          <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600">Correo electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="py-3 px-3 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
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
                className="py-3 px-3 pr-10 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition w-full"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black">
                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
              </button>
            </div>
          </div>
          <button onClick={onSubmit} disabled={loading} className="btn-primary mt-2 w-full">
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
          {error && <div className="text-sm text-red-600 text-center">{error}</div>}
          <a href="/registro" className="btn-secondary text-center w-full mt-2 inline-block">¿No tienes cuenta? Regístrate</a>
        </div>
        </div>
      </div>
    </div>
  )
}
