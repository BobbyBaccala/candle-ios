-- Apply AFTER leaderboard.sql in a staging project first. This file does not
-- create paid subscriptions: only a trusted billing service may write them.
begin;
alter table public.candle_profiles add column if not exists username text;
alter table public.candle_profiles add column if not exists discoverable boolean not null default false;
alter table public.candle_profiles alter column display_name set default 'Trader';
create unique index if not exists candle_username_unique on public.candle_profiles(lower(username)) where username is not null;
do $$ begin
 if not exists(select 1 from pg_constraint where conname='candle_username_format') then
  alter table public.candle_profiles add constraint candle_username_format check(username is null or username ~ '^[a-z][a-z0-9_]{2,19}$');
 end if;
end $$;
create table if not exists public.candle_learning_days(
 user_id uuid not null references auth.users(id) on delete cascade,
 learning_day date not null default (now() at time zone 'UTC')::date,
 completed_at timestamptz not null default now(),
 primary key(user_id,learning_day)
);
create table if not exists public.candle_blocks(
 user_id uuid not null references auth.users(id) on delete cascade,
 blocked_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(user_id,blocked_id),check(user_id<>blocked_id)
);
create table if not exists public.candle_profile_reports(
 id bigint generated always as identity primary key,
 reporter uuid not null references auth.users(id) on delete cascade,
 target uuid not null references auth.users(id) on delete cascade,
 reason text not null default 'Profile reported in app',
 created_at timestamptz not null default now(),reviewed_at timestamptz,
 check(reporter<>target)
);
create table if not exists public.candle_plus_interests(
 user_id uuid primary key references auth.users(id) on delete cascade,
 opted_in boolean not null,updated_at timestamptz not null default now()
);
create table if not exists public.candle_entitlements(
 user_id uuid primary key references auth.users(id) on delete cascade,
 product text not null check(product='candle_plus'),
 status text not null check(status in ('active','grace','expired','revoked')),
 valid_until timestamptz not null,
 original_transaction_id text unique,
 updated_at timestamptz not null default now()
);
alter table public.candle_entitlements add column if not exists source text not null default 'storekit' check(source in('storekit','preview'));
create table if not exists public.candle_plus_previews(
 user_id uuid primary key references auth.users(id) on delete cascade,
 started_at timestamptz not null default now()
);
create table if not exists public.candle_social_events(
 id bigint generated always as identity primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 action text not null,created_at timestamptz not null default now()
);
create index if not exists candle_social_event_rate on public.candle_social_events(user_id,action,created_at);
create index if not exists candle_followers_lookup on public.candle_friends(friend_id,user_id);
alter table public.candle_learning_days enable row level security;
alter table public.candle_blocks enable row level security;
alter table public.candle_profile_reports enable row level security;
alter table public.candle_plus_interests enable row level security;
alter table public.candle_entitlements enable row level security;
alter table public.candle_social_events enable row level security;
alter table public.candle_plus_previews enable row level security;
revoke all on public.candle_learning_days,public.candle_blocks,public.candle_profile_reports,public.candle_plus_interests,public.candle_entitlements,public.candle_social_events,public.candle_plus_previews from anon,authenticated;
grant all on public.candle_entitlements to service_role;

-- Locking the caller's profile serializes concurrent rate checks. Internal only.
create or replace function public.candle_social_guard(p_action text,p_limit integer)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 perform 1 from candle_profiles where user_id=auth.uid() for update;
 if not found then raise exception 'Create a profile first'; end if;
 if (select count(*) from candle_social_events where user_id=auth.uid() and action=p_action and created_at>now()-interval '1 minute')>=p_limit then raise exception 'Please wait before trying again'; end if;
 insert into candle_social_events(user_id,action)values(auth.uid(),p_action);
end $$;
create or replace function public.candle_pair_blocked(a uuid,b uuid)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select exists(select 1 from candle_blocks where (user_id=a and blocked_id=b)or(user_id=b and blocked_id=a))
$$;
create or replace function public.candle_update_social_profile(p_name text,p_username text,p_discoverable boolean)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 perform candle_social_guard('profile',5);
 if char_length(trim(p_name)) not between 1 and 24 or p_username !~ '^[a-z][a-z0-9_]{2,19}$' or p_username is null then raise exception 'Invalid public profile'; end if;
 update candle_profiles set display_name=trim(p_name),username=p_username,discoverable=coalesce(p_discoverable,false)where user_id=auth.uid();
end $$;
create or replace function public.candle_search_people(p_query text)
returns table(user_id uuid,display_name text,username text,mutual boolean)
language plpgsql security definer set search_path=public,pg_temp as $$
begin
 perform candle_social_guard('search',20);
 if p_query is null or p_query !~ '^[a-z][a-z0-9_]{2,19}$' then raise exception 'Invalid search'; end if;
 return query select p.user_id,p.display_name,p.username,
 exists(select 1 from candle_friends f where f.user_id=auth.uid()and f.friend_id=p.user_id)and exists(select 1 from candle_friends f where f.user_id=p.user_id and f.friend_id=auth.uid())
 from candle_profiles p where p.discoverable and p.user_id<>auth.uid()and starts_with(p.username,p_query)and not candle_pair_blocked(auth.uid(),p.user_id)
 order by p.username limit 20;
end $$;
create or replace function public.candle_social_action(p_target uuid,p_action text)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 perform candle_social_guard('social',20);
 if p_target is null or p_target=auth.uid()or not exists(select 1 from candle_profiles where user_id=p_target)then raise exception 'Profile unavailable';end if;
 -- Pair-scoped lock prevents a concurrent follow racing with a block.
 perform pg_advisory_xact_lock(hashtextextended(least(auth.uid()::text,p_target::text)||greatest(auth.uid()::text,p_target::text),0));
 case p_action
 when 'follow' then
  if candle_pair_blocked(auth.uid(),p_target)then raise exception 'Profile unavailable';end if;
  if(select count(*)from candle_friends where user_id=auth.uid())>=500 then raise exception 'Following limit reached';end if;
  insert into candle_friends(user_id,friend_id)values(auth.uid(),p_target)on conflict do nothing;
 when 'unfollow' then delete from candle_friends where user_id=auth.uid()and friend_id=p_target;
 when 'block' then
  insert into candle_blocks(user_id,blocked_id)values(auth.uid(),p_target)on conflict do nothing;
  delete from candle_friends where(user_id=auth.uid()and friend_id=p_target)or(user_id=p_target and friend_id=auth.uid());
 when 'unblock' then delete from candle_blocks where user_id=auth.uid()and blocked_id=p_target;
 when 'report' then
  if not exists(select 1 from candle_profile_reports where reporter=auth.uid()and target=p_target and created_at>now()-interval '1 day')then insert into candle_profile_reports(reporter,target)values(auth.uid(),p_target);end if;
 else raise exception 'Invalid social action';
 end case;
end $$;

-- Replace old friend-code RPC so it cannot bypass blocks or throttling.
create or replace function public.candle_add_friend(p_code text)
returns text language plpgsql security definer set search_path=public,pg_temp as $$
declare target uuid;n text;
begin
 if auth.uid()is null then raise exception 'Sign in required';end if;
 select user_id,display_name into target,n from candle_profiles where friend_code=upper(trim(p_code));
 if target is null then raise exception 'Profile unavailable';end if;
 perform candle_social_action(target,'follow');return n;
end $$;
create or replace function public.candle_resolve_follow_link(p_code text)
returns table(user_id uuid,display_name text,username text,mutual boolean)
language plpgsql security definer set search_path=public,pg_temp as $$
begin
 perform candle_social_guard('invite',20);
 if p_code is null or p_code !~ '^[A-Za-z0-9]{8}$'then raise exception 'Invalid invitation';end if;
 return query select p.user_id,p.display_name,p.username,false from candle_profiles p
 where p.friend_code=upper(p_code)and p.user_id<>auth.uid()and not candle_pair_blocked(auth.uid(),p.user_id);
end $$;

-- Daily ledger uses server UTC, never a client-supplied date. Replays count once.
-- As with existing XP, completion is still client-asserted. Before competitive
-- production use, replace this with server-verified answer-session completion.
create or replace function public.candle_record_learning_day()
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid()is null then raise exception 'Sign in required';end if;
 insert into candle_learning_days(user_id)values(auth.uid())on conflict do nothing;
end $$;
create or replace function public.candle_friend_streak(a uuid,b uuid)
returns integer language plpgsql stable security definer set search_path=public,pg_temp as $$
declare cursor_day date:=(now()at time zone 'UTC')::date;started date;result integer:=0;
begin
 if auth.uid()is null or auth.uid()<>a or candle_pair_blocked(a,b)then return 0;end if;
 select greatest((f.created_at at time zone 'UTC')::date,(r.created_at at time zone 'UTC')::date)into started
 from candle_friends f join candle_friends r on r.user_id=f.friend_id and r.friend_id=f.user_id where f.user_id=a and f.friend_id=b;
 if started is null then return 0;end if;
 if not(exists(select 1 from candle_learning_days where user_id=a and learning_day=cursor_day)and exists(select 1 from candle_learning_days where user_id=b and learning_day=cursor_day))then cursor_day:=cursor_day-1;end if;
 while cursor_day>=started loop
  exit when not(exists(select 1 from candle_learning_days where user_id=a and learning_day=cursor_day)and exists(select 1 from candle_learning_days where user_id=b and learning_day=cursor_day));
  result:=result+1;cursor_day:=cursor_day-1;
 end loop;return result;
end $$;
create or replace function public.candle_social_snapshot()
returns jsonb language plpgsql stable security definer set search_path=public,pg_temp as $$
declare who uuid:=auth.uid();today date:=(now()at time zone 'UTC')::date;following jsonb;followers jsonb;blocked jsonb;
begin
 if who is null then raise exception 'Sign in required';end if;
 select coalesce(jsonb_agg(jsonb_build_object('user_id',p.user_id,'display_name',p.display_name,'username',p.username,'mutual',exists(select 1 from candle_friends r where r.user_id=p.user_id and r.friend_id=who),'streak',candle_friend_streak(who,p.user_id),'you_today',exists(select 1 from candle_learning_days where user_id=who and learning_day=today),'friend_today',exists(select 1 from candle_friends r where r.user_id=p.user_id and r.friend_id=who)and exists(select 1 from candle_learning_days where user_id=p.user_id and learning_day=today))order by p.display_name),'[]'::jsonb)into following
 from candle_friends f join candle_profiles p on p.user_id=f.friend_id where f.user_id=who and not candle_pair_blocked(who,p.user_id);
 select coalesce(jsonb_agg(jsonb_build_object('user_id',p.user_id,'display_name',p.display_name,'username',p.username,'mutual',exists(select 1 from candle_friends r where r.user_id=who and r.friend_id=p.user_id),'streak',candle_friend_streak(who,p.user_id),'you_today',exists(select 1 from candle_learning_days where user_id=who and learning_day=today),'friend_today',exists(select 1 from candle_friends r where r.user_id=who and r.friend_id=p.user_id)and exists(select 1 from candle_learning_days where user_id=p.user_id and learning_day=today))order by p.display_name),'[]'::jsonb)into followers
 from candle_friends f join candle_profiles p on p.user_id=f.user_id where f.friend_id=who and not candle_pair_blocked(who,p.user_id);
 select coalesce(jsonb_agg(jsonb_build_object('user_id',p.user_id,'display_name',p.display_name,'username',p.username)),'[]'::jsonb)into blocked from candle_blocks b join candle_profiles p on p.user_id=b.blocked_id where b.user_id=who;
 return jsonb_build_object('profile',(select jsonb_build_object('display_name',display_name,'username',username,'friend_code',friend_code,'discoverable',discoverable)from candle_profiles where user_id=who),'following',following,'followers',followers,'blocked',blocked,
 'entitlement',(select jsonb_build_object('user_id',user_id,'product',product,'status',status,'valid_until',valid_until,'source',source)from candle_entitlements where user_id=who and status in('active','grace')and valid_until>now()));
end $$;
-- A deliberately free, non-renewing preview. Never extend or overwrite a paid
-- entitlement. Verified email is necessary; marketing consent is separate.
create or replace function public.candle_start_plus_preview()
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 perform candle_social_guard('plus-preview',3);
 if not exists(select 1 from auth.users where id=auth.uid()and email_confirmed_at is not null)then raise exception 'Verify your email first';end if;
 if exists(select 1 from candle_entitlements where user_id=auth.uid()and status in('active','grace')and valid_until>now())then return;end if;
 if exists(select 1 from candle_entitlements where user_id=auth.uid()and source='storekit')then raise exception 'Preview is for accounts without a purchase history';end if;
 if exists(select 1 from candle_plus_previews where user_id=auth.uid())then raise exception 'Free preview already used';end if;
 insert into candle_plus_previews(user_id)values(auth.uid());
 insert into candle_entitlements(user_id,product,status,valid_until,source)values(auth.uid(),'candle_plus','active',now()+interval '7 days','preview')
 on conflict(user_id)do update set status='active',valid_until=excluded.valid_until,source='preview',original_transaction_id=null,updated_at=now();
end $$;
create or replace function public.candle_plus_interest(p_opt_in boolean)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 perform candle_social_guard('plus-list',5);
 insert into candle_plus_interests(user_id,opted_in)values(auth.uid(),coalesce(p_opt_in,false))on conflict(user_id)do update set opted_in=excluded.opted_in,updated_at=now();
end $$;
-- Existing public leaderboard must also respect blocks.
create or replace function public.candle_leaderboard(p_scope text default 'friends')
returns table(display_name text,friend_code text,weekly_xp bigint,lifetime_xp integer,is_self boolean)
language sql security definer set search_path=public,pg_temp as $$
 select p.display_name,p.friend_code,coalesce((select sum(e.points)from candle_xp_events e where e.user_id=p.user_id and e.earned_at>=date_trunc('week',now()at time zone 'UTC')at time zone 'UTC'),0)::bigint,coalesce(s.lifetime_xp,0),p.user_id=auth.uid()
 from candle_profiles p left join candle_scores s on s.user_id=p.user_id where auth.uid()is not null and not candle_pair_blocked(auth.uid(),p.user_id)and(p.user_id=auth.uid()or(p_scope='friends'and exists(select 1 from candle_friends f where f.user_id=auth.uid()and f.friend_id=p.user_id)))order by 3 desc,4 desc,p.display_name limit 100
$$;
revoke execute on function public.candle_social_guard(text,integer),public.candle_pair_blocked(uuid,uuid),public.candle_friend_streak(uuid,uuid)from public,anon,authenticated;
revoke execute on function public.candle_update_social_profile(text,text,boolean),public.candle_search_people(text),public.candle_social_action(uuid,text),public.candle_resolve_follow_link(text),public.candle_record_learning_day(),public.candle_social_snapshot(),public.candle_plus_interest(boolean),public.candle_start_plus_preview()from public,anon;
grant execute on function public.candle_update_social_profile(text,text,boolean),public.candle_search_people(text),public.candle_social_action(uuid,text),public.candle_resolve_follow_link(text),public.candle_record_learning_day(),public.candle_social_snapshot(),public.candle_plus_interest(boolean),public.candle_start_plus_preview()to authenticated;
commit;
