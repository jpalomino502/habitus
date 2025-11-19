create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  points integer not null default 0,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.habits (
  id bigint generated always as identity primary key,
  name text not null unique,
  description text,
  default_duration_min integer not null default 10,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_habits (
  user_id uuid not null references public.profiles(id) on delete cascade,
  habit_id bigint not null references public.habits(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (user_id, habit_id)
);

do $$ begin
  if not exists (select 1 from pg_type where typname = 'challenge_schedule') then
    create type public.challenge_schedule as enum ('daily','weekly','once');
  end if;
end $$;

create table if not exists public.challenges (
  id bigint generated always as identity primary key,
  habit_id bigint references public.habits(id) on delete set null,
  title text not null,
  description text,
  duration_min integer not null default 10,
  points_per_completion integer not null default 10,
  schedule public.challenge_schedule not null default 'daily',
  scheduled_date date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.challenge_completions (
  id bigint generated always as identity primary key,
  challenge_id bigint not null references public.challenges(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  completed_at timestamptz not null default now(),
  completed_on date not null default (now() at time zone 'utc')::date,
  unique (user_id, challenge_id, completed_on)
);

create index if not exists idx_user_habits_user on public.user_habits(user_id);
create index if not exists idx_challenge_completions_user_day on public.challenge_completions(user_id, completed_on);
create index if not exists idx_challenges_habit on public.challenges(habit_id);

create table if not exists public.challenge_tasks (
  id bigint generated always as identity primary key,
  challenge_id bigint not null references public.challenges(id) on delete cascade,
  position integer not null default 1,
  content text not null
);

alter table public.challenge_tasks enable row level security;

drop policy if exists challenge_tasks_select_all on public.challenge_tasks;
create policy challenge_tasks_select_all on public.challenge_tasks for select using (true);

create or replace function public.award_points_on_completion()
returns trigger
language plpgsql
as $$
begin
  update public.profiles
  set points = profiles.points + (select points_per_completion from public.challenges where id = new.challenge_id)
  where id = new.user_id;
  return new;
end;
$$;

drop trigger if exists award_points_after_completion on public.challenge_completions;
create trigger award_points_after_completion
after insert on public.challenge_completions
for each row execute function public.award_points_on_completion();

create or replace function public.set_completed_on()
returns trigger
language plpgsql
as $$
begin
  new.completed_on := (new.completed_at at time zone 'utc')::date;
  return new;
end;
$$;

drop trigger if exists set_completed_on_before_write on public.challenge_completions;
create trigger set_completed_on_before_write
before insert or update on public.challenge_completions
for each row execute function public.set_completed_on();

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.user_habits enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_completions enable row level security;

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert with check (id = auth.uid());

drop policy if exists profiles_select_auth on public.profiles;
create policy profiles_select_auth on public.profiles for select using (auth.role() = 'authenticated');

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists habits_select_all on public.habits;
create policy habits_select_all on public.habits for select using (true);

drop policy if exists user_habits_select_own on public.user_habits;
create policy user_habits_select_own on public.user_habits for select using (user_id = auth.uid());

drop policy if exists user_habits_insert_own on public.user_habits;
create policy user_habits_insert_own on public.user_habits for insert with check (user_id = auth.uid());

drop policy if exists user_habits_update_own on public.user_habits;
create policy user_habits_update_own on public.user_habits for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists user_habits_delete_own on public.user_habits;
create policy user_habits_delete_own on public.user_habits for delete using (user_id = auth.uid());

drop policy if exists challenges_select_all on public.challenges;
create policy challenges_select_all on public.challenges for select using (true);

drop policy if exists challenge_completions_select_own on public.challenge_completions;
create policy challenge_completions_select_own on public.challenge_completions for select using (user_id = auth.uid());

drop policy if exists challenge_completions_insert_own on public.challenge_completions;
create policy challenge_completions_insert_own on public.challenge_completions for insert with check (user_id = auth.uid());