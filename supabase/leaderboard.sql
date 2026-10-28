-- Candle friends leaderboard (Supabase/Postgres)
-- Run in Supabase SQL Editor. Do not place service-role keys in browser code.
create extension if not exists pgcrypto;
create table if not exists public.candle_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default 'Explorer' check (char_length(display_name) between 1 and 24),
 friend_code text not null unique default upper(substr(encode(gen_random_bytes(6),'hex'),1,8)),
 created_at timestamptz not null default now()
);
create table if not exists public.candle_friends (
 user_id uuid not null references auth.users(id) on delete cascade,
 friend_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(user_id,friend_id),
 check(user_id<>friend_id)
);
create table if not exists public.candle_stage_completions (
 user_id uuid not null references auth.users(id) on delete cascade,
 stage_id integer not null check(stage_id between 0 and 149),
 completed_at timestamptz not null default now(),
 primary key(user_id,stage_id)
);
create table if not exists public.candle_scores (
 user_id uuid primary key references auth.users(id) on delete cascade,
 lifetime_xp integer not null default 0 check(lifetime_xp>=0),
 updated_at timestamptz not null default now()
);
create table if not exists public.candle_xp_events (
 user_id uuid not null references auth.users(id) on delete cascade,
 stage_id integer not null,
 points integer not null check(points between 0 and 40),
 earned_at timestamptz not null default now(),
 primary key(user_id,stage_id)
);
alter table public.candle_profiles enable row level security;
alter table public.candle_friends enable row level security;
alter table public.candle_stage_completions enable row level security;
alter table public.candle_scores enable row level security;
alter table public.candle_xp_events enable row level security;
revoke all on public.candle_profiles,public.candle_friends,public.candle_stage_completions,public.candle_scores,public.candle_xp_events from anon,authenticated;
-- Expose only narrow SECURITY DEFINER functions, not underlying tables.
create or replace function public.candle_ensure_profile(p_name text default 'Explorer')
returns table(friend_code text, display_name text) language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 insert into candle_profiles(user_id,display_name) values(auth.uid(),left(coalesce(nullif(trim(p_name),''),'Explorer'),24))
 on conflict(user_id) do nothing;
 insert into candle_scores(user_id) values(auth.uid()) on conflict do nothing;
 return query select p.friend_code,p.display_name from candle_profiles p where p.user_id=auth.uid();
end $$;
create or replace function public.candle_set_name(p_name text)
returns void language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 if length(trim(coalesce(p_name,''))) not between 1 and 24 then raise exception 'Name must be 1–24 characters'; end if;
 update candle_profiles set display_name=trim(p_name) where user_id=auth.uid();
end $$;
create or replace function public.candle_add_friend(p_code text)
returns text language plpgsql security definer set search_path=public as $$
declare target uuid; n text;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 select user_id,display_name into target,n from candle_profiles where friend_code=upper(trim(p_code));
 if target is null then raise exception 'Friend code not found'; end if;
 if target=auth.uid() then raise exception 'Cannot add yourself'; end if;
 insert into candle_friends(user_id,friend_id) values(auth.uid(),target) on conflict do nothing;
 return n;
end $$;
-- This prototype awards points only once per stage; scores cannot be set directly by clients.
-- IMPORTANT: Stage completion is client-asserted, not yet independently quiz-verified.
create or replace function public.candle_complete_stage(p_stage_id integer,p_perfect boolean default false)
returns integer language plpgsql security definer set search_path=public as $$
declare award_points integer:=case when p_perfect then 40 else 25 end; inserted integer;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 if p_stage_id not between 0 and 149 then raise exception 'Invalid stage'; end if;
 insert into candle_xp_events(user_id,stage_id,points) values(auth.uid(),p_stage_id,award_points)
 on conflict do nothing returning candle_xp_events.points into inserted;
 if inserted is not null then
  insert into candle_scores(user_id,lifetime_xp) values(auth.uid(),inserted)
  on conflict(user_id) do update set lifetime_xp=candle_scores.lifetime_xp+excluded.lifetime_xp,updated_at=now();
 end if;
 return coalesce(inserted,0);
end $$;
create or replace function public.candle_leaderboard(p_scope text default 'friends')
returns table(display_name text,friend_code text,weekly_xp bigint,lifetime_xp integer,is_self boolean)
language sql security definer set search_path=public as $$
 select p.display_name,p.friend_code,
 coalesce((select sum(e.points) from candle_xp_events e where e.user_id=p.user_id and e.earned_at>=date_trunc('week',now())),0)::bigint,
 coalesce(s.lifetime_xp,0),p.user_id=auth.uid()
 from candle_profiles p left join candle_scores s on s.user_id=p.user_id
 where auth.uid() is not null and (p.user_id=auth.uid() or (p_scope='friends' and exists
 (select 1 from candle_friends f where f.user_id=auth.uid() and f.friend_id=p.user_id)))
 order by 3 desc,4 desc,p.display_name asc limit 100
$$;
revoke execute on function public.candle_ensure_profile(text),public.candle_set_name(text),public.candle_add_friend(text),public.candle_complete_stage(integer,boolean),public.candle_leaderboard(text) from public,anon;
grant execute on function public.candle_ensure_profile(text),public.candle_set_name(text),public.candle_add_friend(text),public.candle_complete_stage(integer,boolean),public.candle_leaderboard(text) to authenticated;
