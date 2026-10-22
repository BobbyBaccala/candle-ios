// Execute the real browser scripts with a small DOM boundary. This tests state
// transitions and generated markup; it is not a substitute for visual browser QA.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const {validate}=require('../scripts/validate-curriculum.cjs');
const {boot}=require('./helpers/app.cjs');
test('actual app has 150 mapped lessons, passing quality gates, and distinct Home/Learn',()=>{
  const app=boot();
  assert.deepEqual(validate(app.run('lessons')),[]);
  assert.match(app.elements.app.innerHTML,/YOUR LEARNING HQ/);
  app.run("go('Learn')");
  assert.match(app.elements.app.innerHTML,/Choose your adventure/);
  assert.match(app.elements.app.innerHTML,/four practice rounds/);
  assert.doesNotMatch(app.elements.app.innerHTML,/18 challenges/);
});
test('all 150 lessons render, grade, finish and store versioned scores at actual length',()=>{
  const app=boot();
  for(let i=0;i<150;i++){
    app.run(`state.done=Array.from({length:150},(_,i)=>i).filter(id=>id!==${i});state.energy=15;state.path=lessons[${i}].career||'personal';start(${i});`);
    assert.equal(app.run('lesson'),i);
    assert.match(app.elements.app.innerHTML,/No calculator needed/);
    assert.doesNotMatch(app.elements.app.innerHTML,/type="number"/);
    for(let q=0;q<3;q++){
      app.run('choose(lessons[lesson].qs[question].correct);check()');
      assert.match(app.elements.app.innerHTML,/Correct!/);
      assert.doesNotMatch(app.elements.app.innerHTML,/Explore the source material|Read the source material/);
      app.run('advance()');
    }
    assert.equal(app.run('lesson'),null);
    assert.equal(app.run(`state.lessonScores[${i}].total`),3);
    assert.equal(app.run(`state.lessonScores[${i}].correct`),3);
    assert.equal(app.run(`state.lessonScores[${i}].curriculumVersion`),'qualitative-v1');
    assert.match(app.elements.app.innerHTML,/3 \/ 3 correct/);
  }
});
test('empty checks, double checks and premature advance do not inflate scores or attempts',()=>{
  const app=boot();app.run('start(30);check();advance()');
  assert.equal(app.run('state.attempts'),0);assert.equal(app.run('question'),0);
  app.run('choose((lessons[lesson].qs[0].correct+1)%3);check();check()');
  assert.equal(app.run('state.attempts'),1);assert.equal(app.run('mistakes'),1);
  assert.equal(app.run('helpWrong.length'),1);
  app.run('advance();choose(lessons[lesson].qs[question].correct);check();advance();choose(lessons[lesson].qs[question].correct);check();advance()');
  assert.equal(app.run('state.xp'),25);assert.equal(app.run('state.lessonScores[30].correct'),2);
  assert.equal(app.run('state.streak'),1);
  app.run('advance();start(-1);start(999)');
  assert.equal(app.run('state.xp'),25);assert.equal(app.run('lesson'),null);
});
test('saved progress survives; replay updates score without awarding more XP',()=>{
  const saved={xp:250,done:[30],streak:4,last:'2026-10-20',attempts:90,perfect:2,gameWins:3,path:'personal',lessonScores:{30:{correct:18,total:18,at:1}}};
  const app=boot(saved);
  assert.equal(app.run('state.xp'),250);assert.equal(app.run('state.lessonScores[30].total'),18);
  app.run('start(30);for(let i=0;i<3;i++){choose(lessons[lesson].qs[question].correct);check();advance()}');
  assert.equal(app.run('state.xp'),250);assert.equal(app.run('state.perfect'),2);
  assert.equal(app.run('state.lessonScores[30].total'),3);
  assert.equal(JSON.parse(app.storage.get('candle-browser-v2')).done.length,1);
});
test('energy, unlock rules, hints, avatar, optional arcade and profile remain available',()=>{
  const app=boot();app.run('start(31)');
  assert.equal(app.run('lesson'),null);assert.equal(app.run('state.energy'),15);assert.equal(app.alerts.length,1);
  app.run('start(30);showHelp();showMoreHelp()');
  assert.equal(app.run('state.energy'),14);assert.equal(app.run('helpUsed'),2);
  assert.doesNotMatch(app.run('topicHelp(lessons[30],lessons[30].qs[0]).join(" ")'),/formula|calculate|decimal/);
  app.run("go('Play')");assert.match(app.elements.app.innerHTML,/Position|Chart|Arcade/i);
  app.run("go('Profile');openProfilePage('character')");assert.match(app.elements.app.innerHTML,/Make your trader yours/);
  app.run('state.energy=0;start(30)');assert.equal(app.run('lesson'),null);
});
test('first completion still sends the stable stage ID to cloud; replay does not',async()=>{
  const app=boot();
  app.run('globalThis.calls=[];cloudUser={id:"test"};cloud={rpc:async(name,args)=>{calls.push({name,args});return {data:null,error:null}}};start(30);for(let i=0;i<3;i++){choose(lessons[lesson].qs[question].correct);check();advance()}');
  await Promise.resolve();
  assert.equal(app.run('calls.filter(c=>c.name==="candle_complete_stage").length'),1);assert.equal(app.run('calls[0].name'),'candle_complete_stage');
  assert.equal(app.run('calls[0].args.p_stage_id'),30);assert.equal(app.run('calls[0].args.p_perfect'),true);
  app.run('start(30);for(let i=0;i<3;i++){choose(lessons[lesson].qs[question].correct);check();advance()}');
  await Promise.resolve();assert.equal(app.run('calls.filter(c=>c.name==="candle_complete_stage").length'),1);
});
