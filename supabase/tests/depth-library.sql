-- STAGING ONLY, after depth-library.sql; all fixtures roll back.
begin;
insert into auth.users(id,email,email_confirmed_at)values('55555555-5555-4555-8555-555555555555','depth-test@example.invalid',now());
insert into public.candle_profiles(user_id,display_name,friend_code)values('55555555-5555-4555-8555-555555555555','Depth test','DEPTH001');
-- A genuine legacy three-question record must survive the migration policy.
insert into public.candle_league_rounds(user_id,stage_id,correct,total)values('55555555-5555-4555-8555-555555555555',30,2,3);
set local role authenticated;
select set_config('request.jwt.claim.sub','55555555-5555-4555-8555-555555555555',true);
select public.candle_record_league_round(30,6,6);
select public.candle_record_league_round(1292,6,6);
do $$declare r record;begin
 select * into r from public.candle_league_board()where is_self;
 if r.completed<>2 or r.points<>18 then raise exception 'Legacy history, idempotency or expanded range failed';end if;
 begin perform public.candle_record_league_round(1293,6,6);raise exception 'Accepted invalid stage';exception when raise_exception then if SQLERRM='Accepted invalid stage'then raise;end if;end;
 begin perform public.candle_record_league_round(150,6,6);raise exception 'Accepted wrong case length';exception when raise_exception then if SQLERRM='Accepted wrong case length'then raise;end if;end;
 begin perform public.candle_record_league_round(293,5,5);raise exception 'Accepted wrong clinic length';exception when raise_exception then if SQLERRM='Accepted wrong clinic length'then raise;end if;end;
end $$;
select public.candle_record_league_round(31,6,6);
select public.candle_complete_stage(1292,true);
reset role;
do $$begin
 if(select total from public.candle_league_rounds where user_id='55555555-5555-4555-8555-555555555555'and stage_id=30)<>3 then raise exception 'Legacy result overwritten';end if;
 if(select lifetime_xp from public.candle_scores where user_id='55555555-5555-4555-8555-555555555555')<>40 then raise exception 'Expanded XP range failed';end if;
end $$;
rollback;
