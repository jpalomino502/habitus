export default function SeleccionPage() {
  const habitos = [
    { id: 1, nombre: 'Leer 10 min', descripcion: 'Leer durante 10 minutos diarios' },
    { id: 2, nombre: 'Caminar', descripcion: 'Dar un paseo diario' },
    { id: 3, nombre: 'Meditar', descripcion: 'Sesión de meditación' },
    { id: 4, nombre: 'Beber agua', descripcion: 'Mantener hidratación constante' },
  ]
  
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl tracking-tight text-black mb-8">Selecciona un hábito</h1>
        
        <div className="grid gap-3">
          {habitos.map((habito) => (
            <a
              key={habito.id}
              href="/retos"
              className="p-4 border border-neutral-200 hover:bg-neutral-50 transition-colors flex flex-col gap-1"
            >
              <div className="text-sm text-black">{habito.nombre}</div>
              <div className="text-sm text-neutral-500">{habito.descripcion}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
