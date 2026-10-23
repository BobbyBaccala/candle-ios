-- Apply after leaderboard.sql and social-plus.sql, in staging first.
-- Client-asserted educational scores: not suitable for money/prize competitions.
begin;
alter table public.candle_stage_completions drop constraint if exists candle_stage_completions_stage_id_check;
alter table public.candle_stage_completions add constraint candle_stage_completions_stage_id_check check(stage_id between 0 and 292);
create table if not exists public.candle_league_rounds(
 user_id uuid not null references auth.users(id) on delete cascade,
 stage_id integer not null check(stage_id between 0 and 292),
 correct integer not null,
 total integer not null check(total in(3,5)),
 recorded_at timestamptz not null default now(),
 primary key(user_id,stage_id),
 check(correct between 0 and total),
 check(total=case when stage_id<150 then 3 else 5 end)
);
alter table public.candle_league_rounds enable row level security;
revoke all on public.candle_league_rounds from public,anon,authenticated;
create or replace function public.candle_record_league_round(p_stage_id integer,p_correct integer,p_total integer)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid()is null then raise exception 'Sign in required';end if;
 if p_stage_id is null or p_stage_id not between 0 and 292 or p_total is null or p_total<>(case when p_stage_id<150 then 3 else 5 end) or p_correct is null or p_correct not between 0 and p_total then raise exception 'Invalid round';end if;
 insert into candle_league_rounds(user_id,stage_id,correct,total)values(auth.uid(),p_stage_id,p_correct,p_total)on conflict do nothing;
 insert into candle_stage_completions(user_id,stage_id)values(auth.uid(),p_stage_id)on conflict do nothing;
end $$;
-- Extend the existing idempotent XP endpoint without changing existing IDs.
create or replace function public.candle_complete_stage(p_stage_id integer,p_perfect boolean default false)
returns integer language plpgsql security definer set search_path=public,pg_temp as $$
declare award_points integer:=case when p_perfect then 40 else 25 end;inserted integer;
begin
 if auth.uid()is null then raise exception 'Sign in required';end if;
 if p_stage_id is null or p_stage_id not between 0 and 292 then raise exception 'Invalid stage';end if;
 insert into candle_xp_events(user_id,stage_id,points)values(auth.uid(),p_stage_id,award_points)on conflict do nothing returning candle_xp_events.points into inserted;
 if inserted is not null then
  insert into candle_scores(user_id,lifetime_xp)values(auth.uid(),inserted)on conflict(user_id)do update set lifetime_xp=candle_scores.lifetime_xp+excluded.lifetime_xp,updated_at=now();
 end if;
 return coalesce(inserted,0);
end $$;
create or replace function public.candle_league_board()
returns table(display_name text,completed bigint,accuracy numeric,points bigint,is_self boolean)
language sql security definer set search_path=public,pg_temp as $$
 with eligible as(
  select p.user_id,p.display_name from candle_profiles p
  where auth.uid()is not null and not candle_pair_blocked(auth.uid(),p.user_id)
  and(p.user_id=auth.uid()or exists(select 1 from candle_friends f where f.user_id=auth.uid()and f.friend_id=p.user_id))
 ),aggregated as(
  select e.user_id,e.display_name,count(r.stage_id)completed,coalesce(sum(r.correct),0)correct,coalesce(sum(r.total),0)total,coalesce(sum(r.correct)::numeric/nullif(sum(r.total),0),0)accuracy
  from eligible e left join candle_league_rounds r on r.user_id=e.user_id group by e.user_id,e.display_name
 )select a.display_name,a.completed,a.accuracy,case when a.total=0 then 0 else(a.completed*5*(a.total+a.correct))/a.total end,a.user_id=auth.uid()
 from aggregated a order by 4 desc,2 desc,a.display_name,a.user_id limit 100
$$;
revoke execute on function public.candle_record_league_round(integer,integer,integer),public.candle_league_board(),public.candle_complete_stage(integer,boolean)from public,anon;
grant execute on function public.candle_record_league_round(integer,integer,integer),public.candle_league_board(),public.candle_complete_stage(integer,boolean)to authenticated;
commit;
