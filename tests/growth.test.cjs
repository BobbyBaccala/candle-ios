const test=require('node:test'),assert=require('node:assert/strict');
const L=require('../league-core.js'),{boot}=require('./helpers/app.cjs');
const {fixture,validate,normalize}=require('../scripts/validate-curriculum.cjs');
const record=(correct=3,total=3)=>({correct,total,version:'league-v1'});
test('the expansion supplies 856 unique questions, 143 new cases and stable original slots',()=>{
 const all=fixture();assert.equal(all.length,293);assert.equal(all.slice(150).length,143);
 assert.equal(new Set(all.flatMap(l=>l.qs.map(q=>normalize(q.q)))).size,856);
 assert.ok(856>=141*6);assert.deepEqual(validate(all),[]);
 assert.ok(all.slice(0,150).every(l=>l.curriculumVersion==='qualitative-v1'&&l.qs.length===3));
 assert.ok(all.slice(150).every(l=>l.qs.length===5&&new Set(l.qs.map(q=>q.format)).size===5));
 assert.equal(new Set(all.slice(150).map(l=>normalize(l.caseContext))).size,143);
 assert.equal(all[150].title,'Payday timing');assert.equal(all[292].title,'The no-trade decision');
});
test('every appended lesson renders all five questions and can finish at its actual length',()=>{
 const a=boot();
 for(let id=150;id<293;id++){
  a.run(`state.done=Array.from({length:${id}},(_,i)=>i);state.energy=15;start(${id})`);
  assert.equal(a.run('lesson'),id);assert.match(a.elements.app.innerHTML,/Case file/);
  for(let i=0;i<5;i++)a.run('choose(lessons[lesson].qs[question].correct);check();advance()');
  assert.equal(a.run(`state.lessonScores[${id}].total`),5);
  assert.equal(a.run(`state.leagueRecords[${id}].correct`),5);
  assert.equal(a.run('lesson'),null);assert.match(a.elements.app.innerHTML,/Close Candle Plus offer/);
  a.run('dismissRoundOffer()');assert.match(a.elements.app.innerHTML,/5 \/ 5 correct/);
 }
});
test('league points combine distinct rounds and pooled first-round accuracy',()=>{
 assert.equal(L.stats({}).name,'Intern Energy League');
 assert.equal(L.stats({0:record()}).points,10);
 assert.equal(L.stats({0:record(0)}).points,5);
 const s=L.stats({0:record(2),1:record(4,5)});assert.equal(s.accuracy,.75);assert.equal(s.points,17);
 assert.equal(L.stats(Object.fromEntries(Array.from({length:230},(_,i)=>[i,record()]))).index,7);
 assert.equal(L.stats({a:record(-1),b:record(4),c:{...record(),version:'old'}}).completed,0);
});
test('a lesson replay updates practice scores but cannot farm league points or XP',()=>{
 const a=boot();a.run('start(30);for(let i=0;i<3;i++){choose((lessons[lesson].qs[question].correct+1)%3);check();advance()}');
 const points=a.run('leagueStats().points'),xp=a.run('state.xp');
 a.run('dismissRoundOffer();start(30);for(let i=0;i<3;i++){choose(lessons[lesson].qs[question].correct);check();advance()}');
 assert.equal(a.run('leagueStats().points'),points);assert.equal(a.run('state.xp'),xp);
 assert.equal(a.run('state.leagueRecords[30].correct'),0);assert.equal(a.run('state.lessonScores[30].correct'),3);
});
test('free round completion shows an immediately closable offer, then both progress bars',()=>{
 const a=boot();a.run('start(30);for(let i=0;i<3;i++){choose(lessons[lesson].qs[question].correct);check();advance()}');
 assert.match(a.elements.app.innerHTML,/Close Candle Plus offer/);assert.doesNotMatch(a.elements.app.innerHTML,/disabled|countdown|setTimeout/);
 a.run('dismissRoundOffer()');assert.match(a.elements.app.innerHTML,/Profile level/);assert.match(a.elements.app.innerHTML,/Intern Energy League/);
 assert.equal((a.elements.app.innerHTML.match(/role="progressbar"/g)||[]).length,2);
});
test('active Candle Plus skips the offer and keeps scoring and recap',()=>{
 const a=boot();a.run(`cloudUser={id:'member'};socialModel.entitlement={user_id:'member',product:'candle_plus',status:'active',valid_until:new Date(Date.now()+86400000).toISOString()};start(30);for(let i=0;i<3;i++){choose(lessons[lesson].qs[question].correct);check();advance()}`);
 assert.equal(a.run('roundOffer'),false);assert.match(a.elements.app.innerHTML,/ROUND COMPLETE/);assert.doesNotMatch(a.elements.app.innerHTML,/PROMOTION/);
});
test('older XP survives and unscored completed stages can receive exactly one scored review',()=>{
 const a=boot({xp:240,done:[30],perfect:2,lessonScores:{30:{correct:18,total:18}}});
 assert.equal(a.run('leagueStats().completed'),0);
 a.run('start(30);for(let i=0;i<3;i++){choose(lessons[lesson].qs[question].correct);check();advance()}');
 assert.equal(a.run('state.xp'),240);assert.equal(a.run('leagueStats().completed'),1);
 const b=boot(JSON.parse(a.storage.get('candle-browser-v2')));assert.equal(b.run('leagueStats().points'),10);
});
test('spaced review uses expanding intervals, errors reset, and same-day replay cannot inflate spacing',()=>{
 const now=1800000000000;let r=L.review(null,3,3,now);assert.equal(r.days,1);
 assert.deepEqual(L.due({30:r},now),[]);assert.deepEqual(L.due({30:r},r.due),[30]);
 assert.equal(L.review(r,3,3,now+1000).days,1);
 r=L.review(r,3,3,r.due);assert.equal(r.days,3);
 r=L.review(r,3,3,r.due);assert.equal(r.days,7);
 assert.equal(L.review(r,2,3,r.due).days,1);
});
test('Learn paginates chapters, shows actual path counts, and suggests only completed due reviews',()=>{
 const a=boot();a.run("state.reviews={30:{due:1},999:{due:1}};state.done=[30];go('Learn')");
 assert.match(a.elements.app.innerHTML,/856 distinct/);assert.match(a.elements.app.innerHTML,/1\/88 stages/);
 assert.match(a.elements.app.innerHTML,/START · 3 questions/);assert.doesNotMatch(a.elements.app.innerHTML,/lessons\[i\]/);
 a.run('state.done=Array.from({length:10},(_,i)=>30+i)');
 assert.match(a.run("careerStage(150,careerLessonIndices('personal'),150)"),/START · 5 questions/);
 a.run('state.done=[30]');
 assert.match(a.elements.app.innerHTML,/Review: Budget Builder/);assert.doesNotMatch(a.elements.app.innerHTML,/start\(999\)/);
 a.run('selectLearnChapter(4)');assert.match(a.elements.app.innerHTML,/Payday timing/);
 a.run('start(150)');assert.equal(a.run('lesson'),null);
});
test('ten foundations unlock fresh cases without requiring all repeated review rounds',()=>{
 const a=boot();a.run('state.done=Array.from({length:10},(_,i)=>30+i)');
 assert.equal(a.run('currentCareerLevel()'),150);
 a.run('start(151)');assert.equal(a.run('lesson'),null);
 a.run('start(150)');assert.equal(a.run('lesson'),150);
 a.run("go('Learn');selectLearnChapter(1)");
 assert.equal(a.run('canStartLearningStage(40)'),true);assert.equal(a.run('canStartLearningStage(41)'),false);
});
test('friend league fetch fails honestly before server deployment and never shows fabricated players',async()=>{
 const a=boot();a.run("cloudUser={id:'u'};cloud={rpc:async()=>({error:{message:'Missing migration'},data:null})};tab='Compete'");
 await a.run('refreshLeagues()');assert.match(a.elements.app.innerHTML,/latest server setup/);assert.equal(a.run('leagueBoard.length'),0);
});
test('friend scores are escaped and cleared across account changes',async()=>{
 const a=boot();a.run(`cloudUser={id:'a'};cloud={rpc:async()=>({data:[{display_name:'<script>bad</script>',points:10,completed:1,accuracy:1}],error:null})};tab='Compete'`);
 await a.run('refreshLeagues()');assert.doesNotMatch(a.elements.app.innerHTML,/<script>bad/);assert.match(a.elements.app.innerHTML,/&lt;script&gt;/);
 a.run("cloudUser={id:'b'};renderCompete()");assert.equal(a.run('leagueBoard.length'),0);
});
test('failed score submissions are queued for the completing account and retry idempotently',async()=>{
 const a=boot();a.run(`cloudUser={id:'u'};cloud={rpc:async()=>({data:null,error:{message:'offline'}})};state.leagueRecords[30]={correct:2,total:3,version:'league-v1',owner:'u'}`);
 await a.run("syncLeagueRound(30,state.leagueRecords[30],'u')");assert.equal(a.run('state.leaguePending[30].user'),'u');
 a.run("globalThis.submits=0;cloud={rpc:async()=>{submits++;return {data:null,error:null}}};cloudUser={id:'other'}");
 await a.run("retryLeagueSync('other')");assert.equal(a.run('submits'),0);
 a.run("cloudUser={id:'u'}");await a.run("retryLeagueSync('u')");assert.equal(a.run('submits'),1);assert.equal(a.run('state.leaguePending[30]'),undefined);
});
