/* Append-only curriculum expansion and a round -> offer -> recap flow. */
CandleCases.install(lessons,CandleCurriculum);
state.leagueRecords ||= {};
state.reviews ||= {};
let roundRecap=null,roundOffer=false,learnChapter=0,leagueBoard=[],leagueMessage='',leagueBoardOwner=null;
function leagueStats(){return CandleLeagues.stats(state.leagueRecords)}
function canStartLearningStage(id){
 if(!Number.isInteger(id)||id<0||id>=lessons.length)return false;
 if(id<newLessonStart||state.done.includes(id))return true;
 const ids=careerLessonIndices(lessons[id].career),foundations=ids.filter(i=>i<150),cases=ids.filter(i=>i>=150);
 if(id<150)return foundations.slice(0,foundations.indexOf(id)).every(i=>state.done.includes(i));
 return foundations.slice(0,10).every(i=>state.done.includes(i))&&cases.slice(0,cases.indexOf(id)).every(i=>state.done.includes(i));
}
currentCareerLevel=function(){
 const ids=careerLessonIndices(state.path),foundations=ids.filter(i=>i<150),cases=ids.filter(i=>i>=150);
 return foundations.slice(0,10).find(i=>!state.done.includes(i))??cases.find(i=>!state.done.includes(i))??foundations.slice(10).find(i=>!state.done.includes(i))??ids[ids.length-1];
};
careerStage=function(i,ids,next){
 const complete=state.done.includes(i),locked=!canStartLearningStage(i),pos=i===next,offset=[0,58,18,-50][ids.indexOf(i)%4];
 return '<div class="stage-row" style="--shift:'+offset+'px"><div class="stage-wrap">'+(pos?'<div class="walking-avatar">'+avatarSVG(58)+'</div>':'')+'<button class="stage '+(complete?'complete':locked?'locked':'current')+'" '+(locked?'disabled':'onclick="start('+i+')"')+' aria-label="'+esc(lessons[i].title)+'">'+(complete?'✓':locked?'🔒':'⚡')+'</button><div class="stage-caption"><strong>'+esc(lessons[i].title)+'</strong><small>'+(complete?'Completed · Replay':locked?'Unlock by playing':'START · '+lessons[i].qs.length+' questions')+'</small></div></div></div>';
};
function progressMeter(label,value,note){const n=Math.max(0,Math.min(100,value));return '<div class="growth-meter"><strong>'+esc(label)+'</strong><div role="progressbar" aria-label="'+esc(label)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.round(n)+'" class="bar"><div style="width:'+n+'%"></div></div><small>'+esc(note)+'</small></div>'}
function leagueShield(index){return '<span class="league-shield league-'+index+'" aria-hidden="true">'+['I','II','III','IV','V','VI','VII','VIII'][index]+'</span>'}
renderCompete=function(){
 if(leagueBoardOwner!==cloudUser?.id){leagueBoard=[];leagueMessage='';leagueBoardOwner=cloudUser?.id||null}
 const s=leagueStats();
 app.innerHTML='<div class="eyebrow">THE CORPORATE CLIMB</div><h2>Compete</h2><p class="product-note">Your device league · friend comparisons sync separately when signed in.</p><section class="card league-hero">'+leagueShield(s.index)+'<h2>'+esc(s.name)+'</h2><p>'+s.points+' league points · '+s.completed+' scored '+(s.completed===1?'lesson':'lessons')+'</p>'+progressMeter(s.next===null?'CEO league reached':'Next: '+CandleLeagues.titles[s.index+1],s.progress,s.next===null?'Keep learning and reviewing.':(s.next-s.points)+' points to promotion')+'<div class="product-stats"><div><strong>'+s.completed+'</strong><small>Distinct lessons</small></div><div><strong>'+(s.total?Math.round(s.accuracy*100)+'%':'—')+'</strong><small>First-round accuracy</small></div></div></section><details class="card"><summary>How leagues work</summary><p>Points = distinct scored lessons × 10 × (half completion credit + half accuracy). Accuracy pools correct answers across first completed rounds. A five-question case counts as one lesson, just like a foundation round.</p><p>Replays help you learn and refresh review dates, but never add league points. Earlier progress is preserved; older lessons without a first-round record can earn one scored review. These are permanent point leagues, not weekly elimination groups or a claim of professional ability.</p></details><section class="card"><h3>Your league ladder</h3>'+CandleLeagues.titles.map((title,i)=>'<div class="league-rung '+(i===s.index?'current':'')+'">'+leagueShield(i)+'<span><strong>'+esc(title)+'</strong><small>'+CandleLeagues.thresholds[i]+' points'+(i===s.index?' · You are here':'')+'</small></span></div>').join('')+'</section><section class="card"><h3>Friends in the climb</h3><p class="product-note">'+(cloudUser?'Compare first-round learning points with accounts you follow.':'Sign in from Profile to compare with friends. Your device league works now.')+'</p>'+(!cloudUser?'<button class="btn" onclick="go(\'Profile\')">Find your people</button>':'<button class="soft-button" onclick="refreshLeagues()">Refresh friend leagues</button><button class="soft-button" onclick="syncDeviceLeague()">Sync this device’s eligible results</button>')+(leagueMessage?'<p role="status">'+esc(leagueMessage)+'</p>':'')+'<ol class="league-friends">'+leagueBoard.map(p=>'<li><strong>'+esc(p.display_name)+'</strong><span>'+Number(p.points)+' points · '+Number(p.completed)+' lessons · '+Math.round(Number(p.accuracy)*100)+'%</span></li>').join('')+'</ol></section>';
};
async function refreshLeagues(){
 const user=cloudUser?.id;leagueBoard=[];leagueMessage='';
 leagueBoardOwner=user||null;
 if(!user)return renderCompete();
 try{await retryLeagueSync(user);const rows=await cloudCall('candle_league_board');if(cloudUser?.id!==user)return;leagueBoardOwner=user;leagueBoard=(rows||[]).filter(p=>typeof p.display_name==='string'&&Number.isFinite(Number(p.points))&&Number(p.points)>=0&&Number.isInteger(Number(p.completed))&&Number(p.completed)>=0&&Number(p.accuracy)>=0&&Number(p.accuracy)<=1);leagueMessage=leagueBoard.length?'First-round scores, ordered by league points.':'No scored rounds yet.'}
 catch(error){leagueMessage='Friend leagues need the latest server setup. Your device league is saved.'}
 if(tab==='Compete')renderCompete();
}
const growthSignOut=productSignOut;
productSignOut=async function(){leagueBoard=[];leagueMessage='';await growthSignOut()};
const growthAdvance=advance;
advance=function(){
 const finishing=lesson!==null&&checked&&question===lessons[lesson].qs.length-1;
 const id=lesson,before=rankInfo(),oldLeague=leagueStats();
 growthAdvance();
 if(!finishing||lesson!==null)return;
 const result=state.lessonScores[id];
 const firstScored=!state.leagueRecords[id];
 if(firstScored)state.leagueRecords[id]={correct:result.correct,total:result.total,version:'league-v1',owner:cloudUser?.id||null};
 state.reviews[id]=CandleLeagues.review(state.reviews[id],result.correct,result.total);
 save();
 roundRecap={id,correct:result.correct,total:result.total,before,oldLeague,firstScored,unlocks:app.innerHTML.match(/<section class="card outfit-unlock">[\s\S]*$/)?.[0]||''};
 if(firstScored&&cloudUser)void syncLeagueRound(id,result,cloudUser.id);
 roundOffer=!hasPlus()&&(!state.habits||state.habits.offers==='round'||state.habits.lastOffer!==today());if(roundOffer&&state.habits){state.habits.lastOffer=today();save()}renderRoundEnd();
};
async function syncLeagueRound(id,result,user){
 if(cloudUser?.id!==user)return;
 try{await cloudCall('candle_record_league_round',{p_stage_id:id,p_correct:result.correct,p_total:result.total});if(cloudUser?.id===user){leagueBoard=[];if(state.leagueRecords[id])state.leagueRecords[id].owner=user;if(state.leaguePending)delete state.leaguePending[id];save()}}
 catch(error){if(cloudUser?.id===user){state.leaguePending ||= {};state.leaguePending[id]={correct:result.correct,total:result.total,user};save()}}
}
async function retryLeagueSync(user){for(const [id,r] of Object.entries(state.leaguePending||{})){if(cloudUser?.id!==user)return;if(r.user===user)await syncLeagueRound(Number(id),r,user)}}
async function syncDeviceLeague(){
 const user=cloudUser?.id;if(!user)return;
 for(const [id,r] of Object.entries(state.leagueRecords)){if(cloudUser?.id!==user)return;if(!r.owner||r.owner===user)await syncLeagueRound(Number(id),r,user)}
 await refreshLeagues();
 if(cloudUser?.id===user&&tab==='Compete'){leagueMessage+=' Device results have been submitted where available; pending rounds retry when you refresh.';renderCompete()}
}
function dismissRoundOffer(){if(!roundRecap)return;roundOffer=false;tab='Learn';lesson=null;updateHeader();renderRoundEnd()}
function roundPlus(){roundOffer=false;openProfilePage('plus')}
function renderRoundEnd(){
 if(!roundRecap)return;
 if(roundOffer){app.innerHTML='<section class="card round-offer" aria-labelledby="offerTitle"><div class="offer-top"><span class="plan-badge">CANDLE+ · PROMOTION</span><button class="soft-button" aria-label="Close Candle Plus offer" onclick="dismissRoundOffer()">✕ Close</button></div><h2 id="offerTitle">Curiosity doesn’t need a refill.</h2><p>Unlimited learning energy with Candle+. Keep exploring at your own pace.</p><p class="product-note">Paid subscriptions are preparing for launch. A verified account can try a free seven-day preview; no payment or automatic renewal.</p><button class="btn" onclick="roundPlus()">Explore Candle+</button><button class="soft-button" onclick="dismissRoundOffer()">Continue to my progress →</button></section>';productScrollTop();return}
 const r=roundRecap,rank=rankInfo(),s=leagueStats(),max=rank.index===levelNames.length-1;
 app.innerHTML='<section class="card"><div class="eyebrow">ROUND COMPLETE</div><h2>That’s another step forward.</h2><p>'+esc(lessons[r.id].title)+'</p><strong>'+r.correct+' / '+r.total+' correct</strong><p>'+(r.firstScored?'First-round result saved for leagues.':'Review complete. Your original league result stays fixed.')+'</p>'+progressMeter('Profile level '+rank.level+' · '+rank.name,max?100:rank.score%850/850*100,max?'Highest outfit rank unlocked':(rank.next-rank.score)+' points to the next outfit rank')+progressMeter(s.name,s.progress,s.next===null?'CEO league reached':(s.next-s.points)+' league points to '+CandleLeagues.titles[s.index+1])+'<p class="product-note">'+(s.index>r.oldLeague.index?'Promotion unlocked! ':'')+'Next suggested review: '+new Date(state.reviews[r.id].due).toLocaleDateString()+'. You can stop here and return later.</p><div class="compact-actions"><button class="btn" onclick="go(\'Learn\')">Learning path</button><button class="soft-button" onclick="go(\'Compete\')">View leagues</button></div></section>'+r.unlocks;
 productScrollTop();
}
function selectLearnChapter(index){learnChapter=index;renderLearn();productScrollTop()}
const growthChoose=choosePath;
choosePath=function(id){learnChapter=0;growthChoose(id)};
const growthGo=go;
go=function(page){if(page==='Learn'){const ids=careerLessonIndices(state.path);learnChapter=Math.max(0,Math.floor(ids.indexOf(currentCareerLevel())/10))}growthGo(page)};
const growthPlus=renderPlus;
renderPlus=function(){return growthPlus()+(roundRecap?'<button class="soft-button" onclick="dismissRoundOffer()">Back to my round progress</button>':'')};
renderLearn=function(){
 const path=careerPaths.find(p=>p.id===state.path)||careerPaths[0],ids=careerLessonIndices(path.id),next=currentCareerLevel();
 const chapters=Math.ceil(ids.length/10),chapter=Math.min(learnChapter,chapters-1),slice=ids.slice(chapter*10,chapter*10+10),completed=ids.filter(i=>state.done.includes(i)).length;
 const due=CandleLeagues.due(state.reviews).filter(id=>lessons[id]&&state.done.includes(id));
 app.innerHTML='<div class="eyebrow">YOUR LEARNING JOURNEY</div><h2>Choose your adventure</h2><p class="product-note">293 lessons · 856 distinct qualitative questions. Foundations lead into five-question real-life cases. Ten foundations unlock the case files. The other foundation rounds are optional review.</p>'+pathSelect()+'<section class="quest-banner"><div class="eyebrow">YOUR NEXT STEP · '+esc(path.name)+'</div><h2>'+esc(lessons[next].title)+'</h2><p>'+completed+' / '+ids.length+' lessons complete</p><button class="btn" onclick="start('+next+')">'+(completed===ids.length?'Replay final lesson':'Continue learning →')+'</button></section><section class="card review-shelf"><h3>Keep it fresh</h3><p>'+(due.length?due.length+' completed lessons are ready for a spaced review.':'No reviews due. Finish a lesson and we’ll suggest when to revisit it.')+'</p>'+(due.length?due.slice(0,3).map(id=>'<button class="soft-button" onclick="start('+id+')">Review: '+esc(lessons[id].title)+'</button>').join(''):'')+'<small>Suggested dates adapt to your last result. Reviews are optional and do not affect league points.</small></section><h3>Pick a chapter</h3><div class="chapter-selector" aria-label="Learning chapters">'+Array.from({length:chapters},(_,i)=>'<button class="soft-button" aria-pressed="'+(chapter===i)+'" onclick="selectLearnChapter('+i+')">'+(i<4?['First steps','Practice','Revisit','Reflect'][i]:'Case files '+(i-3))+'</button>').join('')+'</div><div class="world-banner world-'+chapter%6+'"><span class="world-emoji">'+(chapter<4?'🌱':'💼')+'</span><div><small>CHAPTER '+(chapter+1)+' / '+chapters+'</small><h2>'+esc(path.name)+'</h2><p>'+slice.filter(id=>state.done.includes(id)).length+' / '+slice.length+' completed</p></div></div><div class="game-path">'+slice.map(id=>careerStage(id,ids,next)).join('')+'</div><section class="card"><h3>Learn in your own rhythm</h3><p>Try one round, explain the idea in your own words, and come back for a review. Your progress stays saved.</p><button class="soft-button" onclick="go(\'Play\')">Optional arcade</button></section>';
};
const growthLessonRender=renderLesson;
renderLesson=function(){growthLessonRender();if(lesson!==null){const l=lessons[lesson];app.innerHTML=app.innerHTML.replace('Three distinct questions.',l.qs.length+' distinct questions.');if(l.caseContext)app.innerHTML=app.innerHTML.replace('<details>','<div class="case-context"><strong>Case file</strong><p>'+esc(l.caseContext)+'</p></div><details>')}};
