'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AppNavbar() {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white/90 backdrop-blur z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {/* Retos */}
          <Link 
            href="/retos" 
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
              isActive('/retos') ? 'text-blue-700 bg-blue-50 rounded-xl' : 'text-neutral-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span className="text-xs">Retos</span>
          </Link>
          
          {/* Clasificación */}
          {/* Racha */}
          <Link 
            href="/racha" 
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
              isActive('/racha') ? 'text-blue-700 bg-blue-50 rounded-xl' : 'text-neutral-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v6l4-4M6 21l6-6 4 4" />
            </svg>
            <span className="text-xs">Racha</span>
          </Link>

          <Link 
            href="/clasificacion" 
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
              isActive('/clasificacion') ? 'text-blue-700 bg-blue-50 rounded-xl' : 'text-neutral-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Clasificación</span>
          </Link>
          
          {/* Perfil */}
          <Link 
            href="/perfil" 
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
              isActive('/perfil') ? 'text-blue-700 bg-blue-50 rounded-xl' : 'text-neutral-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Perfil</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
