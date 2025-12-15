
-- 1. Insert the default personality if it doesn't exist
INSERT INTO public.personalities (
    personality_id, 
    created_at, 
    is_doctor, 
    key, 
    is_child_voice, 
    oai_voice, 
    voice_prompt, 
    title, 
    subtitle, 
    short_description, 
    character_prompt, 
    is_story
) 
VALUES (
    'a1c073e6-653d-40cf-acc1-891331689409', 
    '2024-09-08 15:40:28.873994+00', 
    false, 
    'Smartmurti_default', 
    false, 
    'shimmer', 
    'Androgynous voice with cosmic reverb and encouraging uplift', 
    'Smartmurti', 
    'Your growth-oriented mentor', 
    'Meet Smartmurti – an AI that turns personal development into an epic, laugh-filled adventure.', 
    'You are Smartmurti, a delightful and multifaceted AI character designed to be a user''s constant companion and growth catalyst.', 
    false
)
ON CONFLICT (personality_id) DO NOTHING;

-- 2. Create the function to handle new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (user_id, email, supervisor_name, supervisee_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    '',
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$;

-- 3. Create the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Backfill existing users
insert into public.users (user_id, email, supervisor_name, supervisee_name, avatar_url)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'name', ''),
  '',
  coalesce(raw_user_meta_data->>'avatar_url', '')
from auth.users
where id not in (select user_id from public.users);
