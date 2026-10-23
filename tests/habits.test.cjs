const test=require('node:test'),assert=require('node:assert/strict'),H=require('../habit-core.js'),{boot}=require('./helpers/app.cjs');
const q={concept:'risk',facet:'spread'};
test('mastery collapses repeated variants and requires a delayed correct answer',()=>{
 const h=H.normalize();H.answer(h,q,true,'sure',1000);H.answer(h,q,true,'sure',2000);
 assert.equal(H.summary(h).seen,1);assert.equal(H.summary(h).retained,0);
 H.answer(h,q,true,'fair',86402000);assert.equal(H.summary(h).retained,1);
 H.answer(h,q,false,'sure',86403000);assert.equal(H.summary(h).retained,0);assert.equal(H.summary(h).overconfident,1);
});
test('daily cosmetic rewards cannot be farmed by replay or restore',()=>{
 const h=H.normalize();H.finish(h,1,'2026-10-23');H.finish(h,1,'2026-10-23');assert.equal(H.sparks(h),1);
 H.finish(h,2,'2026-10-23');H.finish(h,3,'2026-10-23');H.finish(h,4,'2026-10-23');assert.equal(H.sparks(h),3);
 assert.equal(H.sparks(H.normalize(JSON.parse(JSON.stringify(h)))),3);H.finish(h,1,'2026-10-24');assert.equal(H.sparks(h),4);
});
test('confidence and reports are optional, private, escaped and idempotent',()=>{
 const a=boot();a.run("start(0);setAnswerConfidence('sure');choose((lessons[0].qs[0].correct+1)%3);check();check();reportCurrentQuestion('ambiguous');reportCurrentQuestion('ambiguous')");
 assert.equal(a.run('state.attempts'),1);assert.equal(a.run('state.habits.reports.length'),1);
 assert.equal(a.run('CandleHabits.summary(state.habits).seen'),1);assert.match(a.elements.app.innerHTML,/nothing has been sent/);
 a.run('advance()');assert.equal(a.run('answerConfidence'),null);
});
test('offers default to once daily with a working per-round option',()=>{
 const a=boot();const complete=id=>a.run(`state.energy=15;start(${id});for(let i=0;i<6;i++){choose(lessons[lesson].qs[question].correct);check();advance()}`);
 complete(0);assert.equal(a.run('roundOffer'),true);a.run('dismissRoundOffer()');complete(1);assert.equal(a.run('roundOffer'),false);
 assert.equal(a.run('CandleHabits.sparks(state.habits)'),1);a.run("setOfferFrequency('round')");complete(2);assert.equal(a.run('roundOffer'),true);assert.equal(a.run('CandleHabits.sparks(state.habits)'),3);
});
test('goals keep all lessons open and refresher targets an actual mistake',()=>{
 const a=boot();a.run("habitGoal('work')");assert.equal(a.run('state.path'),'corporate');a.run("start(1292);choose((lessons[1292].qs[0].correct+1)%3);check();go('Learn');habitGoal('sharp')");assert.equal(a.run('practiceSuggestion()'),1292);assert.match(a.elements.app.innerHTML,/Start a refresher/);assert.equal(a.run('canStartLearningStage(0)'),true);
});
test('buddy check-in requires fresh mutual synced progress and rejects duplicates/account races',async()=>{
 const a=boot();a.run("cloudUser={id:'a'};socialModel.following=[{user_id:'b',mutual:true}];cloudCall=async()=>({following:[{user_id:'b',mutual:true,you_today:true,friend_today:true}]})");
 await a.run('claimBuddyBoost(0)');await a.run('claimBuddyBoost(0)');assert.equal(a.run('Object.values(state.habits.buddy)[0].length'),1);
 a.run("cloudCall=async()=>{cloudUser={id:'other'};return {following:[{user_id:'b',mutual:true,you_today:true,friend_today:true}]}};");await a.run('claimBuddyBoost(0)');assert.equal(a.run('Object.keys(state.habits.buddy).length'),1);
});
test('buddy failures award nothing and weekly keys respect year boundaries',async()=>{
 const a=boot();a.run("cloudUser={id:'a'};socialModel.following=[{user_id:'b',mutual:true}];cloudCall=async()=>{throw Error('offline')}");await a.run('claimBuddyBoost(0)');assert.equal(a.run('Object.keys(state.habits.buddy).length'),0);
 assert.equal(H.week('2027-01-01'),'2026-12-28');assert.equal(H.week('2027-01-04'),'2027-01-04');
});
