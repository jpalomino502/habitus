insert into public.habits (name, description, default_duration_min)
values
  ('Leer 10 min', 'Leer un capítulo o artículo breve', 10),
  ('Beber agua', 'Beber al menos 2L al día', 5),
  ('Ejercicio ligero', 'Caminar o estiramientos', 20),
  ('Meditar', 'Práctica de mindfulness', 10),
  ('Diario de gratitud', 'Escribir 3 cosas por las que estás agradecido', 5)
on conflict (name) do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id, 'Leer 10 min', 'Lee 10 minutos hoy', 10, 10, 'daily', true
from public.habits h where h.name = 'Leer 10 min'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id, 'Beber agua', 'Asegúrate de hidratarte adecuadamente', 5, 8, 'daily', true
from public.habits h where h.name = 'Beber agua'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id, 'Ejercicio ligero', 'Camina 20 minutos o haz estiramientos', 20, 12, 'daily', true
from public.habits h where h.name = 'Ejercicio ligero'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id, 'Meditar', 'Realiza una sesión de meditación breve', 10, 10, 'daily', true
from public.habits h where h.name = 'Meditar'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id, 'Diario de gratitud', 'Escribe tu diario de gratitud', 5, 7, 'daily', true
from public.habits h where h.name = 'Diario de gratitud'
on conflict do nothing;

-- Tareas para retos
insert into public.challenge_tasks (challenge_id, position, content)
select c.id, 1, 'Prepara una botella de agua a mano'
from public.challenges c join public.habits h on h.id = c.habit_id and h.name = 'Beber agua'
on conflict do nothing;

insert into public.challenge_tasks (challenge_id, position, content)
select c.id, 2, 'Registra tu consumo durante el día'
from public.challenges c join public.habits h on h.id = c.habit_id and h.name = 'Beber agua'
on conflict do nothing;

insert into public.challenge_tasks (challenge_id, position, content)
select c.id, 1, 'Busca un lugar tranquilo'
from public.challenges c join public.habits h on h.id = c.habit_id and h.name = 'Meditar'
on conflict do nothing;

insert into public.challenge_tasks (challenge_id, position, content)
select c.id, 2, 'Respira profundamente durante 5 minutos'
from public.challenges c join public.habits h on h.id = c.habit_id and h.name = 'Meditar'
on conflict do nothing;

insert into public.challenge_tasks (challenge_id, position, content)
select c.id, 1, 'Elige un texto breve'
from public.challenges c join public.habits h on h.id = c.habit_id and h.name = 'Leer 10 min'
on conflict do nothing;

insert into public.challenge_tasks (challenge_id, position, content)
select c.id, 2, 'Lee sin distracciones por 10 minutos'
from public.challenges c join public.habits h on h.id = c.habit_id and h.name = 'Leer 10 min'
on conflict do nothing;

-- Retos para hábitos adicionales con descripciones detalladas
insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Dormir 8 horas',
  'Establece una rutina de sueño consistente: prepara el entorno (oscuro, fresco), evita pantallas 60 min antes y realiza una actividad relajante como lectura suave o respiración antes de acostarte. Apunta a 8 horas continuas de descanso.',
  h.default_duration_min,
  15,
  'daily',
  true
from public.habits h where h.name = 'Dormir 8 horas'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Estiramientos matutinos',
  'Realiza una rutina breve: movilidad de cuello y hombros, estiramiento de espalda (cat-cow), cadera y piernas. Respira profundamente y mantén cada posición 20–30 segundos para activar el cuerpo sin sobreesfuerzo.',
  h.default_duration_min,
  10,
  'daily',
  true
from public.habits h where h.name = 'Estiramientos matutinos'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Leer 30 min',
  'Elige un material significativo (libro, artículo técnico o educativo). Divide la sesión en bloques de 10 minutos con breves pausas para retención. Toma notas de ideas clave y un resumen al finalizar.',
  h.default_duration_min,
  12,
  'daily',
  true
from public.habits h where h.name = 'Leer 30 min'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Practicar un instrumento',
  'Calienta con escalas y ejercicios de técnica. Trabaja una pieza concreta enfocándote en tempo y articulación. Graba un fragmento para autoevaluación y anota puntos a mejorar en la próxima sesión.',
  h.default_duration_min,
  12,
  'daily',
  true
from public.habits h where h.name = 'Practicar un instrumento'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Aprender un idioma',
  'Define un mini-objetivo (10 palabras nuevas o una regla gramatical). Practica con ejemplos y repite en voz alta. Cierra con 5 minutos de escucha o lectura breve para consolidar lo aprendido.',
  h.default_duration_min,
  11,
  'daily',
  true
from public.habits h where h.name = 'Aprender un idioma'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Escribir diario personal',
  'Reflexiona sobre emociones, decisiones y aprendizajes del día. Usa prompts: ¿qué salió bien?, ¿qué puedo mejorar?, ¿qué me preocupa? Cierra con una frase de intención para mañana.',
  h.default_duration_min,
  10,
  'daily',
  true
from public.habits h where h.name = 'Escribir diario personal'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Hacer yoga',
  'Secuencia básica: respiración, saludos al sol, balance sencillo, apertura de caderas y relajación final. Mantén atención en la respiración para mejorar foco y reducir estrés.',
  h.default_duration_min,
  12,
  'daily',
  true
from public.habits h where h.name = 'Hacer yoga'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Caminar 5.000 pasos',
  'Planifica una ruta segura y agradable. Divide en dos salidas si lo necesitas. Usa una app o reloj para contar pasos y mantén ritmo cómodo. Hidrátate y registra tu progreso.',
  h.default_duration_min,
  13,
  'daily',
  true
from public.habits h where h.name = 'Caminar 5.000 pasos'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Planear el día',
  'Define tus 3 prioridades, el tiempo estimado y bloquea horarios. Anticipa obstáculos y un plan B. Cierra con un checklist claro para ejecutar sin fricción.',
  h.default_duration_min,
  9,
  'daily',
  true
from public.habits h where h.name = 'Planear el día'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Ahorrar dinero',
  'Separa una cantidad fija o porcentual del ingreso diario. Regístrala en tu app/hoja y revisa tu objetivo mensual. Busca micro-gastos a recortar sin afectar bienestar.',
  h.default_duration_min,
  8,
  'daily',
  true
from public.habits h where h.name = 'Ahorrar dinero'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Limpiar 10 minutos',
  'Elige un área pequeña (escritorio, fregadero, una repisa). Activa un temporizador de 10 minutos y enfócate en orden y limpieza rápida. Cierra con descarte de lo innecesario.',
  h.default_duration_min,
  9,
  'daily',
  true
from public.habits h where h.name = 'Limpiar 10 minutos'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Evitar redes sociales',
  'Establece una ventana sin redes. Usa bloqueadores si hace falta. Sustituye por lectura breve o paseo. Observa cómo te sientes al reducir estímulos y distracciones.',
  h.default_duration_min,
  10,
  'daily',
  true
from public.habits h where h.name = 'Evitar redes sociales'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Practicar respiración',
  'Realiza respiración cuadrada (4 inhalar, 4 sostener, 4 exhalar, 4 sostener) por varios ciclos. Mantén espalda recta y suelta tensión en hombros. Nota el efecto calmante.',
  h.default_duration_min,
  8,
  'daily',
  true
from public.habits h where h.name = 'Practicar respiración'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Aprender algo nuevo',
  'Elige un tema puntual. Consumo activo: toma notas, resume y crea 1 ejemplo práctico. Aplica lo aprendido en una mini tarea para reforzar comprensión.',
  h.default_duration_min,
  12,
  'daily',
  true
from public.habits h where h.name = 'Aprender algo nuevo'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Tomar vitaminas',
  'Integra tus suplementos según recomendación médica. Toma con agua y alimentos si corresponde. Marca tu ingesta para mantener consistencia y evitar olvidos.',
  h.default_duration_min,
  6,
  'daily',
  true
from public.habits h where h.name = 'Tomar vitaminas'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Agradecer a alguien',
  'Piensa en alguien que aportó positivamente a tu día. Envía un mensaje breve y genuino de agradecimiento. Fortalece vínculos y tu mentalidad de gratitud.',
  h.default_duration_min,
  7,
  'daily',
  true
from public.habits h where h.name = 'Agradecer a alguien'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Pasear al aire libre',
  'Realiza un paseo suave. Observa entorno, colores y sonidos. Evita el celular. Lleva agua y usa calzado cómodo. Vuelve con una idea o pensamiento que te inspire.',
  h.default_duration_min,
  12,
  'daily',
  true
from public.habits h where h.name = 'Pasear al aire libre'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Hacer una comida saludable',
  'Prepara un plato balanceado: proteína, carbohidrato complejo y verduras. Usa métodos sencillos (horno, salteado). Evita ultraprocesados y añade agua/té.',
  h.default_duration_min,
  13,
  'daily',
  true
from public.habits h where h.name = 'Hacer una comida saludable'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'No azúcar por un día',
  'Evita bebidas azucaradas y postres. Sustituye por frutas o frutos secos. Lee etiquetas y detecta azúcares ocultos. Observa tu energía y estado de ánimo.',
  h.default_duration_min,
  10,
  'daily',
  true
from public.habits h where h.name = 'No azúcar por un día'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Fijar objetivos diarios',
  'Define metas claras y alcanzables (SMART). Estima tiempos y recursos. Revisa progreso al cierre del día y ajusta prioridades para mañana.',
  h.default_duration_min,
  9,
  'daily',
  true
from public.habits h where h.name = 'Fijar objetivos diarios'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Revisar gastos',
  'Registra movimientos del día y compara con tu presupuesto. Identifica categorías que exceden lo previsto y define acciones correctivas simples.',
  h.default_duration_min,
  9,
  'daily',
  true
from public.habits h where h.name = 'Revisar gastos'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Ordenar escritorio',
  'Retira objetos innecesarios, limpia superficies y organiza herramientas al alcance. Cierra con una regla de orden: todo elemento debe tener su lugar.',
  h.default_duration_min,
  8,
  'daily',
  true
from public.habits h where h.name = 'Ordenar escritorio'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Practicar dibujo',
  'Elige un motivo sencillo. Calienta con trazos y formas básicas, luego haz un boceto rápido y añade sombras ligeras. Enfócate en consistencia, no perfección.',
  h.default_duration_min,
  11,
  'daily',
  true
from public.habits h where h.name = 'Practicar dibujo'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Escuchar un podcast',
  'Selecciona un episodio educativo o inspirador. Toma notas de 3 ideas clave y piensa cómo aplicarlas en tu día o proyecto actual.',
  h.default_duration_min,
  10,
  'daily',
  true
from public.habits h where h.name = 'Escuchar un podcast'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Tomar té',
  'Prepara tu té favorito con atención al proceso (agua, infusión, aromas). Tómalo sin distracciones como un breve ritual de calma consciente.',
  h.default_duration_min,
  7,
  'daily',
  true
from public.habits h where h.name = 'Tomar té'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Visualizar metas',
  'Cierra los ojos y visualiza el logro de una meta concreta. Observa pasos, emociones y resultados. Termina con una acción mínima para avanzar hoy.',
  h.default_duration_min,
  8,
  'daily',
  true
from public.habits h where h.name = 'Visualizar metas'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Beber un batido saludable',
  'Prepara un batido con base de fruta y vegetal, añade proteína y grasa saludable si corresponde. Evita azúcar extra; prioriza sabor natural.',
  h.default_duration_min,
  9,
  'daily',
  true
from public.habits h where h.name = 'Beber un batido saludable'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Correr 15 min',
  'Calienta con movilidad y caminata ligera, corre a ritmo conversacional y finaliza con estiramientos suaves. Enfócate en técnica y respiración.',
  h.default_duration_min,
  13,
  'daily',
  true
from public.habits h where h.name = 'Correr 15 min'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Aprender programación',
  'Elige un tema (estructuras de datos, APIs, tests). Lee, codifica un ejemplo corto y escribe una nota con lo aprendido y dudas para explorar mañana.',
  h.default_duration_min,
  12,
  'daily',
  true
from public.habits h where h.name = 'Aprender programación'
on conflict do nothing;

insert into public.challenges (habit_id, title, description, duration_min, points_per_completion, schedule, active)
select h.id,
  'Hacer limpieza digital',
  'Elige una zona (inbox, descargas, fotos). Borra duplicados y archiva lo útil. Crea reglas simples para mantener orden (carpetas y nombres consistentes).',
  h.default_duration_min,
  10,
  'daily',
  true
from public.habits h where h.name = 'Hacer limpieza digital'
on conflict do nothing;