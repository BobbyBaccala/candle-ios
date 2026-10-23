const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {boot}=require('./helpers/app.cjs'),{fixture,validate}=require('../scripts/validate-curriculum.cjs');
const R=require('../reminder-core.js'),E=require('../league-emblems.js');
test('all 1293 lessons contain 5–8 tasks and the expansion has exactly 6000 contextual placements',()=>{
 const all=fixture();assert.equal(all.length,1293);assert.ok(all.every(l=>l.qs.length>=5&&l.qs.length<=8));
 const depth=all.filter(l=>l.curriculumVersion==='depth-v1');assert.equal(depth.length,1000);assert.equal(depth.reduce((n,l)=>n+l.qs.length,0),6000);
 assert.equal(new Set(depth.map(l=>l.coreTopic)).size,100);assert.equal(new Set(depth.map(l=>l.transferContext)).size,10);
 assert.deepEqual(validate(all),[]);
});
test('every new six-question clinic renders, grades and finishes at actual length',()=>{
 const a=boot();
 for(let id=293;id<1293;id++){
  a.run(`lesson=null;state.energy=15;start(${id})`);assert.equal(a.run('lesson'),id);
  for(let q=0;q<6;q++)a.run('choose(lessons[lesson].qs[question].correct);check();advance()');
  assert.equal(a.run('lesson'),null);assert.equal(a.run(`state.lessonScores[${id}].correct`),6);assert.equal(a.run(`state.lessonScores[${id}].total`),6);
 }
});
test('open access supports arbitrary jumps without consuming energy on invalid IDs',()=>{
 const a=boot();a.run('start(1292)');assert.equal(a.run('lesson'),1292);assert.equal(a.run('state.energy'),14);
 a.run("go('Learn');start(700)");assert.equal(a.run('lesson'),700);
 a.run("go('Learn');start(9000);start(-1)");assert.equal(a.run('lesson'),null);assert.equal(a.run('state.energy'),13);
});
test('arcade grades once, cannot skip, ends at three rounds, persists and explicitly restarts',()=>{
 const a=boot();a.elements.answer={value:''};a.run('nextGame()');assert.equal(a.run('gameRound'),0);
 for(let i=0;i<3;i++){
  a.elements.answer.value=String(a.run('games.find(g=>g.id===game).rounds[gameRound][1]'));
  a.run('checkGame();checkGame()');assert.equal(a.run('state.gameWins'),i+1);
  if(i<2)a.run('nextGame()');
 }
 assert.match(a.elements.app.innerHTML,/GAME COMPLETE/);assert.doesNotMatch(a.elements.app.innerHTML,/Next round/);
 a.run('nextGame();nextGame()');assert.equal(a.run('state.arcadeProgress[game].answers.length'),3);
 const b=boot(JSON.parse(a.storage.get('candle-browser-v2')));b.run("go('Play')");assert.match(b.elements.app.innerHTML,/GAME COMPLETE/);
 b.run('restartArcade()');assert.equal(b.run('state.arcadeProgress[game].answers.length'),0);
});
test('chart lab ends without wrapping and retains independent progress for each chart',()=>{
 const a=boot();a.elements.chartAnswer={value:''};a.run('selectChart(0)');
 for(let i=0;i<3;i++){a.elements.chartAnswer.value=String(a.run('charts[activeChart].tasks[chartTask][1]'));a.run('checkChart();checkChart()');if(i<2)a.run('nextChart()')}
 assert.match(a.elements.app.innerHTML,/CHART COMPLETE/);a.run('nextChart()');assert.equal(a.run('state.chartProgress[0].length'),3);
 a.run('selectChart(1)');assert.equal(a.run('chartTask'),0);a.run('selectChart(0)');assert.match(a.elements.app.innerHTML,/CHART COMPLETE/);
});
test('8pm reminder is on the expiry day, suppressed after expiry, and calendar based',()=>{
 const now=new Date(2026,9,22,12);const r=R.next('2026-10-22',1,now);const at=new Date(r.at);
 assert.equal(at.getDate(),23);assert.equal(at.getHours(),20);assert.equal(new Date(r.expires).getDate(),24);
 assert.equal(R.next('2026-10-21',1,new Date(2026,9,22,21)),null);assert.equal(R.next('2026-10-22',0,now),null);
 assert.equal(R.next('2026-02-31',2,now),null);
 const leap=R.next('2028-02-28',2,new Date(2028,1,28,18));assert.equal(new Date(leap.at).getDate(),29);
});
test('expired personal streaks clear on reopening while best history is retained',()=>{
 const a=boot({streak:9,last:'2020-01-01',xp:40,done:[30]});assert.equal(a.run('state.streak'),0);assert.equal(a.run('state.bestStreak'),9);
 const date=new Date(2026,9,23,0,0);assert.equal(R.active('2026-10-22',date),true);assert.equal(R.active('2026-10-21',date),false);
});
test('no native bridge means no fake notification opt-in or browser permission request',async()=>{
 const a=boot();a.run("go('Profile');openProfilePage('settings')");await a.run('enableStreakReminder()');
 assert.equal(a.run('state.streakReminders'),false);assert.match(a.elements.app.innerHTML,/No permission or delivery was enabled/);
});
test('reminder permission denial and bridge errors leave opt-in off',async()=>{
 const a=boot();a.run("go('Profile');openProfilePage('settings');window.CandleNative={configureStreakReminder:async()=>false}");
 await a.run('enableStreakReminder()');assert.equal(a.run('state.streakReminders'),false);
 a.run('window.CandleNative.configureStreakReminder=async()=>{throw Error("unavailable")}');await a.run('enableStreakReminder()');assert.equal(a.run('state.streakReminders'),false);
});
test('notification worker ignores malformed/expired payloads and fixes its destination',async()=>{
 const handlers={},shown=[];const ctx=vm.createContext({URL,Date,self:{addEventListener:(k,f)=>handlers[k]=f,registration:{scope:'https://candle.test/',showNotification:async(...args)=>shown.push(args)},location:{origin:'https://candle.test'},clients:{}}});
 vm.runInContext(fs.readFileSync(require.resolve('../notification-worker.js'),'utf8'),ctx);
 handlers.push({data:{json:()=>({type:'other'})}});assert.equal(shown.length,0);
 await new Promise(resolve=>handlers.push({data:{json:()=>({type:'streak-reminder',localDay:'2026-10-22',expires:new Date(Date.now()+10000).toISOString(),url:'https://evil.test'})},waitUntil:p=>p.then(resolve)}));
 assert.equal(shown.length,1);assert.equal(shown[0][1].data.destination,'learn');
});
test('font choices persist and unrecognized style values are rejected',()=>{
 const a=boot();a.run("setTypeface('editorial')");assert.equal(a.run('state.typeface'),'editorial');a.run("setTypeface('url(evil)')");assert.equal(a.run('state.typeface'),'editorial');
});
test('all eight emblem vectors are original self-contained markup with explicit bounds',()=>{
 for(let i=0;i<8;i++){const svg=E.svg(i);assert.match(svg,/width="180" height="150"/);assert.doesNotMatch(svg,/<image|<filter|foreignObject|undefined/)}
 assert.match(E.svg(0),/MY NAME IS/);assert.match(E.svg(7),/CEO red roadster/);
});
