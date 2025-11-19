-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.challenge_completions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  challenge_id bigint NOT NULL,
  user_id uuid NOT NULL,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_on date NOT NULL DEFAULT ((now() AT TIME ZONE 'utc'::text))::date,
  CONSTRAINT challenge_completions_pkey PRIMARY KEY (id),
  CONSTRAINT challenge_completions_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id),
  CONSTRAINT challenge_completions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.challenge_tasks (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  challenge_id bigint NOT NULL,
  position integer NOT NULL DEFAULT 1,
  content text NOT NULL,
  CONSTRAINT challenge_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT challenge_tasks_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id)
);
CREATE TABLE public.challenges (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  habit_id bigint,
  title text NOT NULL,
  description text,
  duration_min integer NOT NULL DEFAULT 10,
  points_per_completion integer NOT NULL DEFAULT 10,
  schedule USER-DEFINED NOT NULL DEFAULT 'daily'::challenge_schedule,
  scheduled_date date,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT challenges_pkey PRIMARY KEY (id),
  CONSTRAINT challenges_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id)
);
CREATE TABLE public.habit_streaks (
  user_id uuid NOT NULL,
  habit_id bigint NOT NULL,
  current_streak_days integer NOT NULL DEFAULT 0,
  longest_streak_days integer NOT NULL DEFAULT 0,
  updated_on date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT habit_streaks_pkey PRIMARY KEY (user_id, habit_id),
  CONSTRAINT habit_streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT habit_streaks_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id)
);
CREATE TABLE public.habits (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL UNIQUE,
  description text,
  default_duration_min integer NOT NULL DEFAULT 10,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT habits_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text NOT NULL UNIQUE,
  points integer NOT NULL DEFAULT 0,
  current_streak_days integer NOT NULL DEFAULT 0,
  longest_streak_days integer NOT NULL DEFAULT 0,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_habits (
  user_id uuid NOT NULL,
  habit_id bigint NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_habits_pkey PRIMARY KEY (user_id, habit_id),
  CONSTRAINT user_habits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT user_habits_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id)
);