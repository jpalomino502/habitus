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
            className="btn-secondary text-center"
          >
            Iniciar sesión
          </a>
          <a 
            href="/registro" 
            className="btn-primary text-center"
          >
            Crear cuenta
          </a>
        </div>
      </div>
    </div>
  )
}
