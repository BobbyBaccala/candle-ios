-- STAGING ONLY. Run after both schema files, as postgres with ON_ERROR_STOP=1.
-- All fixture identities and changes are rolled back. This suite is not run by
-- the Node CI job; it requires an actual Supabase-compatible Postgres instance.
begin;
insert into auth.users(id,email,email_confirmed_at)values
 ('11111111-1111-4111-8111-111111111111','candle-test-a@example.invalid',now()),
 ('22222222-2222-4222-8222-222222222222','candle-test-b@example.invalid',now());
insert into public.candle_profiles(user_id,display_name,username,discoverable,friend_code)values
 ('11111111-1111-4111-8111-111111111111','Test A','candle_test_a',true,'TEST000A'),
 ('22222222-2222-4222-8222-222222222222','Test B','candle_test_b',true,'TEST000B');
insert into public.candle_friends(user_id,friend_id,created_at)values
 ('11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222',now()-interval '2 days'),
 ('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111',now()-interval '2 days');
insert into public.candle_learning_days(user_id,learning_day)
 select id,(now()at time zone 'UTC')::date-offset_days
 from (values('11111111-1111-4111-8111-111111111111'::uuid),('22222222-2222-4222-8222-222222222222'::uuid))users(id)
 cross join generate_series(0,2)offset_days;
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$declare snap jsonb;begin
 snap:=public.candle_social_snapshot();
 if jsonb_array_length(snap->'following')<>1 or(snap->'following'->0->>'streak')::integer<>3 then raise exception 'Mutual three-day streak failed';end if;
 if snap::text like '%example.invalid%'then raise exception 'Snapshot leaked email';end if;
 if(select count(*)from public.candle_search_people('candle_test_b'))<>1 then raise exception 'Username search failed';end if;
end $$;
select public.candle_record_learning_day();
select public.candle_record_learning_day();
select public.candle_start_plus_preview();
select public.candle_start_plus_preview(); -- Active preview is idempotent, not extended.
do $$declare snap jsonb;begin
 snap:=public.candle_social_snapshot();
 if snap->'entitlement'->>'source'<>'preview' then raise exception 'Preview was not granted';end if;
 begin
  update public.candle_entitlements set valid_until=now()+interval '100 years';
  raise exception 'Client wrote its own premium entitlement';
 exception when insufficient_privilege then null;
 end;
end $$;
select public.candle_social_action('22222222-2222-4222-8222-222222222222','block');
do $$declare snap jsonb;begin
 snap:=public.candle_social_snapshot();
 if jsonb_array_length(snap->'following')<>0 or jsonb_array_length(snap->'followers')<>0 then raise exception 'Block failed to remove both directions';end if;
 if(select count(*)from public.candle_search_people('candle_test_b'))<>0 then raise exception 'Blocked account appeared in search';end if;
 if(select count(*)from public.candle_resolve_follow_link('TEST000B'))<>0 then raise exception 'Blocked invitation resolved';end if;
end $$;
reset role;
update public.candle_entitlements set valid_until=now()-interval '1 minute'where user_id='11111111-1111-4111-8111-111111111111';
set local role authenticated;
do $$begin
 if(public.candle_social_snapshot()->'entitlement')is distinct from 'null'::jsonb then raise exception 'Expired entitlement still returned';end if;
 begin
  perform public.candle_start_plus_preview();
  raise exception 'Preview restarted after expiry';
 exception when others then
  if SQLERRM='Preview restarted after expiry'then raise;end if;
 end;
end $$;
reset role;
rollback;
