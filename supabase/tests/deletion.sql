-- Disposable/staging only; verifies database cascades, not the HTTP deletion service.
begin;
insert into auth.users(id,email,email_confirmed_at)values('66666666-6666-4666-8666-666666666666','delete@example.invalid',now());
select set_config('request.jwt.claim.sub','66666666-6666-4666-8666-666666666666',true);
set local role authenticated;
select public.candle_ensure_profile('Delete test');
select public.candle_record_learning_day();
select public.candle_complete_stage(1292,true);
select public.candle_record_league_round(1292,6,6);
reset role;
delete from auth.users where id='66666666-6666-4666-8666-666666666666';
do $$begin
 if exists(select 1 from public.candle_profiles where user_id='66666666-6666-4666-8666-666666666666')
 or exists(select 1 from public.candle_learning_days where user_id='66666666-6666-4666-8666-666666666666')
 or exists(select 1 from public.candle_league_rounds where user_id='66666666-6666-4666-8666-666666666666')
 or exists(select 1 from public.candle_scores where user_id='66666666-6666-4666-8666-666666666666')
 then raise exception 'Deleted identity retained learning data';end if;
end $$;
rollback;
