export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-4xl tracking-tight text-black">Habitus</h1>
          <p className="text-sm text-neutral-500">Construye mejores hábitos</p>
        </div>
        
        <div className="w-full flex flex-col gap-3">
          <a 
            href="/login" 
            className="w-full py-3 px-4 text-center text-sm text-black border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            Iniciar sesión
          </a>
          <a 
            href="/registro" 
            className="w-full py-3 px-4 text-center text-sm text-white bg-black hover:bg-neutral-800 transition-colors"
          >
            Crear cuenta
          </a>
        </div>
      </div>
    </div>
  )
}
