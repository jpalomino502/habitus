export default function HomePage() {
  return (
    <div className="page max-w-2xl mx-auto py-8 min-h-screen flex flex-col justify-center">
      <div className="container">
        <div className="hero text-center mb-6">
          <h1 className="text-3xl tracking-tight text-white">Habitus</h1>
          <p className="text-sm text-white/80">Construye mejores hábitos</p>
        </div>

        <div className="mx-auto w-full max-w-md bg-white/5 backdrop-blur rounded-xl p-6 shadow-sm">
          <div className="w-full flex flex-col gap-3">
            <a href="/login" className="btn-secondary text-center w-full">Iniciar sesión</a>
            <a href="/registro" className="btn-primary text-center w-full">Crear cuenta</a>
          </div>
        </div>
      </div>
    </div>
  )
}
