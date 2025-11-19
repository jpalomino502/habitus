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