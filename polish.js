/* Candle polish layer: bug fixes carried over from PR #2 (Claude).
   Loaded last, so it only wraps existing globals; remove the <script> tag
   to switch everything here off. Each fix is independent. */
(function(){
 'use strict';

 /* 1. Streaks: replaying a lesson counts toward today's streak (first
    completions already did). Expiry is handled by refreshStreakExpiry() in
    depth-ui.js, which also records bestStreak, so it isn't repeated here. */
 function dayKey(offset){const d=new Date();d.setDate(d.getDate()+(offset||0));return d.toLocaleDateString('en-CA')}
 const awardBase=award;
 award=function(id){
  const first=awardBase(id);
  if(!first&&state.last!==dayKey(0)){state.streak=state.last===dayKey(-1)?(state.streak||0)+1:1;state.last=dayKey(0);save()}
  return first;
 };

 /* 2. Leaderboard: stages finished before signing in were never sent to the
    server, and renaming your trader never changed your leaderboard name.
    Each stage is sent on its own: a stage the server rejects (for example
    IDs above 149 before supabase/depth-library.sql is applied) is skipped
    for this session instead of blocking every stage after it. */
 state.cloudSynced=state.cloudSynced&&typeof state.cloudSynced==='object'?state.cloudSynced:{};
 let catchingUp=false;const rejectedThisSession=new Set();
 function syncedIds(){const k=cloudUser&&cloudUser.id;if(!k)return null;if(!Array.isArray(state.cloudSynced[k]))state.cloudSynced[k]=[];return state.cloudSynced[k]}
 async function cloudCatchUp(){
  if(typeof cloud==='undefined'||!cloud||!cloudUser||catchingUp)return false;
  catchingUp=true;let changed=false;
  try{
   const want=String(state.avatar&&state.avatar.name||'Trader').trim().slice(0,24)||'Trader';
   if(cloudProfile&&cloudProfile.display_name&&cloudProfile.display_name!==want){
    await cloudCall('candle_set_name',{p_name:want});cloudProfile.display_name=want;changed=true;
   }
   const synced=syncedIds()||[];
   const todo=(state.done||[]).filter(id=>Number.isInteger(id)&&id>=0&&id<lessons.length&&!synced.includes(id)&&!rejectedThisSession.has(id));
   let failed=0,lastError='';
   for(const id of todo){
    const sc=state.lessonScores&&state.lessonScores[id],perfect=Boolean(sc&&sc.total&&sc.correct===sc.total);
    try{await cloudCall('candle_complete_stage',{p_stage_id:id,p_perfect:perfect});synced.push(id);changed=true}
    catch(e){rejectedThisSession.add(id);failed++;lastError=e.message}
   }
   if(failed)cloudError=failed+' earlier stage'+(failed===1?'':'s')+' could not be added to the leaderboard ('+lastError+').';
  }catch(e){cloudError='Score sync failed: '+e.message}
  finally{if(changed)save();catchingUp=false}
  return changed;
 }
 const refreshBase=cloudRefresh;
 cloudRefresh=async function(){
  await refreshBase.apply(this,arguments);
  if(await cloudCatchUp()){try{cloudBoard=await cloudCall('candle_leaderboard',{p_scope:'friends'})}catch(e){cloudError=e.message}if(tab==='Compete')render()}
 };
 const syncStageBase=cloudSyncStage;
 cloudSyncStage=async function(id){
  const before=cloudError;await syncStageBase.apply(this,arguments);
  const s=syncedIds();if(s&&cloudError===before&&!s.includes(id)){s.push(id);save()}
 };
 const renameBase=renameAvatar;
 renameAvatar=function(){renameBase.apply(this,arguments);if(cloudUser&&cloudProfile)void cloudCatchUp()};

 /* 3. Phones: after Check answer, bring the explanation (and the
    "Go deeper with AI" buttons inside it) into view instead of leaving it
    below the fold. */
 const renderBase=render;
 render=function(){
  renderBase.apply(this,arguments);
  try{
   if(lesson!==null&&checked&&typeof window.innerHeight==='number'){
    const fb=app.querySelector('.feedback');
    if(fb&&fb.getBoundingClientRect&&fb.scrollIntoView){
     const r=fb.getBoundingClientRect(),calm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
     if(r.bottom>window.innerHeight||r.top<0)fb.scrollIntoView({block:'nearest',behavior:calm?'auto':'smooth'});
    }
   }
  }catch(_){/* scrolling is a nicety; never break a lesson over it */}
 };

 /* 4. Keyboard: Enter checks the selected answer, then Enter again continues. */
 document.addEventListener('keydown',function(e){
  if(e.key!=='Enter'||e.isComposing||e.defaultPrevented||lesson===null)return;
  const t=e.target;
  if(t&&/^(BUTTON|A|INPUT|TEXTAREA|SELECT|SUMMARY)$/.test(t.tagName))return;
  if(document.querySelector('[role="dialog"][aria-modal="true"]'))return;
  e.preventDefault();
  if(checked)advance();else if(selected!==null)check();
 });
})();
