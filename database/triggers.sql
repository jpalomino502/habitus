-- Trigger function to update profile points and habit streaks when a challenge completion is inserted
-- Assumes tables: challenges(id, points_per_completion, habit_id), profiles(id, points),
-- challenge_completions(id, challenge_id, user_id, completed_on), habit_streaks(user_id, habit_id, current_streak_days, longest_streak_days, updated_on)

CREATE OR REPLACE FUNCTION public.handle_challenge_completion()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_points integer := 0;
  v_habit_id bigint;
  v_last_date date;
  v_yesterday date := (NEW.completed_on - INTERVAL '1 day')::date;
  v_prev_current integer := 0;
  v_prev_longest integer := 0;
  v_new_current integer := 1;
BEGIN
  -- get challenge info
  SELECT points_per_completion, habit_id
  INTO v_points, v_habit_id
  FROM public.challenges
  WHERE id = NEW.challenge_id;

  IF v_points IS NULL THEN
    v_points := 0;
  END IF;

  -- increment profile points
  UPDATE public.profiles
  SET points = COALESCE(points, 0) + v_points
  WHERE id = NEW.user_id;

  -- if this challenge is linked to a habit, update/create streak
  IF v_habit_id IS NOT NULL THEN
    -- find the last completion date for this user for any challenge of this habit, excluding the new row
    SELECT cc.completed_on::date
    INTO v_last_date
    FROM public.challenge_completions cc
    JOIN public.challenges ch ON ch.id = cc.challenge_id
    WHERE cc.user_id = NEW.user_id
      AND ch.habit_id = v_habit_id
      AND cc.id <> NEW.id
    ORDER BY cc.completed_on DESC
    LIMIT 1;

    -- fetch existing streak row values if any
    SELECT current_streak_days, longest_streak_days
    INTO v_prev_current, v_prev_longest
    FROM public.habit_streaks
    WHERE user_id = NEW.user_id
      AND habit_id = v_habit_id;

    -- determine new current streak: if last completion was yesterday, increment, else start at 1
    IF v_last_date IS NOT NULL AND v_last_date = v_yesterday THEN
      v_new_current := COALESCE(v_prev_current, 0) + 1;
    ELSE
      v_new_current := 1;
    END IF;

    -- upsert habit_streaks
    INSERT INTO public.habit_streaks (user_id, habit_id, current_streak_days, longest_streak_days, updated_on, created_at)
    VALUES (NEW.user_id, v_habit_id, v_new_current, GREATEST(COALESCE(v_prev_longest, 0), v_new_current), NEW.completed_on::date, now())
    ON CONFLICT (user_id, habit_id) DO UPDATE
    SET current_streak_days = EXCLUDED.current_streak_days,
        longest_streak_days = EXCLUDED.longest_streak_days,
        updated_on = EXCLUDED.updated_on;

    -- update overall streaks in profiles: take max across user's habit_streaks
    PERFORM (
      UPDATE public.profiles p
      SET current_streak_days = COALESCE(s.max_current, 0),
          longest_streak_days = COALESCE(s.max_longest, 0)
      FROM (
        SELECT MAX(current_streak_days) AS max_current, MAX(longest_streak_days) AS max_longest
        FROM public.habit_streaks hs
        WHERE hs.user_id = NEW.user_id
      ) s
      WHERE p.id = NEW.user_id
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger: call handle_challenge_completion after insert on challenge_completions
DROP TRIGGER IF EXISTS trg_handle_challenge_completion ON public.challenge_completions;
CREATE TRIGGER trg_handle_challenge_completion
AFTER INSERT ON public.challenge_completions
FOR EACH ROW
EXECUTE FUNCTION public.handle_challenge_completion();
