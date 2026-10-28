-- STAGING ONLY, after all three migrations. Run as postgres, ON_ERROR_STOP=1.
-- All identities and data roll back. Not executed by the Node CI suite.
begin;
insert into auth.users(id,email,email_confirmed_at)values
 ('33333333-3333-4333-8333-333333333333','league-a@example.invalid',now()),
 ('44444444-4444-4444-8444-444444444444','league-b@example.invalid',now());
insert into public.candle_profiles(user_id,display_name,friend_code)values
 ('33333333-3333-4333-8333-333333333333','League A','LEAG000A'),
 ('44444444-4444-4444-8444-444444444444','League B','LEAG000B');
insert into public.candle_friends(user_id,friend_id)values('33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444');
set local role authenticated;
select set_config('request.jwt.claim.sub','33333333-3333-4333-8333-333333333333',true);
select public.candle_record_league_round(30,2,3);
select public.candle_record_league_round(30,3,3);
select public.candle_record_league_round(150,4,5);
do $$declare r record;begin
 select * into r from public.candle_league_board()where is_self;
 if r.completed<>2 or r.accuracy<>0.75 or r.points<>17 then raise exception 'First-round formula or replay immutability failed';end if;
 begin perform public.candle_record_league_round(293,3,3);raise exception 'Accepted invalid stage';exception when raise_exception then if SQLERRM='Accepted invalid stage'then raise;end if;end;
 begin perform public.candle_record_league_round(150,3,3);raise exception 'Accepted wrong length';exception when raise_exception then if SQLERRM='Accepted wrong length'then raise;end if;end;
 begin perform public.candle_record_league_round(151,6,5);raise exception 'Accepted invalid key count';exception when raise_exception then if SQLERRM='Accepted invalid key count'then raise;end if;end;
 begin perform public.candle_record_league_round(null,3,3);raise exception 'Accepted null stage';exception when raise_exception then if SQLERRM='Accepted null stage'then raise;end if;end;
end $$;
select public.candle_complete_stage(292,true);
select public.candle_complete_stage(292,true);
select set_config('request.jwt.claim.sub','44444444-4444-4444-8444-444444444444',true);
do $$declare r record;begin
 select * into r from public.candle_league_board()where is_self;
 if r.completed<>0 or r.points<>0 then raise exception 'Account isolation failed';end if;
end $$;
reset role;
insert into public.candle_blocks(user_id,blocked_id)values('44444444-4444-4444-8444-444444444444','33333333-3333-4333-8333-333333333333');
set local role authenticated;
select set_config('request.jwt.claim.sub','33333333-3333-4333-8333-333333333333',true);
do $$begin
 if(select count(*)from public.candle_league_board())<>1 then raise exception 'Blocked friend leaked';end if;
end $$;
reset role;
do $$begin
 if(select lifetime_xp from public.candle_scores where user_id='33333333-3333-4333-8333-333333333333')<>40 then raise exception 'XP duplicate or extended bounds failed';end if;
 if has_table_privilege('authenticated','public.candle_league_rounds','INSERT')then raise exception 'Direct writes allowed';end if;
 if has_function_privilege('anon','public.candle_league_board()','EXECUTE')then raise exception 'Anonymous board access allowed';end if;
end $$;
rollback;
