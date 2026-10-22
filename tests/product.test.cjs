const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../product-core.js'),Character=require('../character.js'),C=require('../curriculum.js');
const {boot}=require('./helpers/app.cjs');
const {buildPreview}=require('../scripts/build-preview.cjs');
const now=new Date('2026-10-22T12:00:00Z');
test('shared streak grows only for intersecting days and allows the current day to finish',()=>{
  const a=['2026-10-19','2026-10-20','2026-10-21','2026-10-22'];
  assert.equal(P.sharedStreak(a,a,now).count,4);
  assert.deepEqual(P.sharedStreak(a,a.slice(0,3),now),{count:3,bothToday:false,youToday:true,friendToday:false});
  assert.equal(P.sharedStreak(a,['2026-10-19','2026-10-20'],now).count,0);
  assert.equal(P.sharedStreak(a,a,now,'2026-10-21').count,2);
  assert.equal(P.sharedStreak([...a,...a],a,now).count,4);
});
test('shared days cross leap years and are UTC even near midnight in another timezone',()=>{
  assert.equal(P.sharedStreak(['2024-02-28','2024-02-29','2024-03-01'],['2024-02-28','2024-02-29','2024-03-01'],new Date('2024-03-01T10:00:00Z')).count,3);
  assert.equal(P.day(new Date('2026-10-21T21:30:00-04:00')),'2026-10-22');
});
test('paid access requires a matching account, active/grace status and a future expiry',()=>{
  const e={user_id:'a',product:'candle_plus',status:'active',valid_until:'2026-11-01T00:00:00Z'};
  assert.equal(P.plusActive(e,'a',+now),true);
  assert.equal(P.plusActive({...e,status:'grace'},'a',+now),true);
  for(const value of [null,{...e,user_id:'b'},{...e,status:'revoked'},{...e,status:'expired'},{...e,valid_until:'2026-10-22T00:00:00Z'},{...e,valid_until:'invalid'},{...e,product:'anything'}])assert.equal(P.plusActive(value,'a',+now),false);
  assert.equal(P.plusActive(e,null,+now),false);
});
test('username validation and follow links reject unsafe or unsupported values',()=>{
  assert.equal(P.validUsername('finance_friend'),true);
  for(const value of ['ab','@name','Alice','a<script>','a b','1name','a'.repeat(21)])assert.equal(P.validUsername(value),false);
  assert.equal(P.followLink('file:///preview.html','ABCD1234'),null);
  assert.equal(P.followLink('https://example.test/app?secret=anything#fragment','ABCD1234'),'https://example.test/app?follow=ABCD1234');
  assert.equal(P.followLink('https://example.test','<script>'),null);
});
test('source directory maps references to concrete concept objectives',()=>{
  const groups=P.sourceGroups(C);assert.equal(groups.length,Object.keys(C.sources).length);
  assert.ok(groups.every(g=>g.concepts.length&&g.concepts.every(c=>c.objective&&c.facets.length===3)));
});
test('all character choices normalize old/malformed data and produce original vector markup',()=>{
  for(const [key,values]of Object.entries(Character.choices))for(let i=0;i<values.length;i++){
    const svg=Character.svg({[key]:i},120);
    assert.match(svg,/viewBox="0 0 160 200"/);assert.match(svg,/aria-label=/);
    assert.doesNotMatch(svg,/undefined|NaN|<image|<filter|clipPath|id=|http/);
  }
  const normalized=Character.normalized({face:-1,hairStyle:100,outfit:'red'});
  assert.equal(normalized.face,0);assert.equal(normalized.hairStyle,0);assert.equal(normalized.outfit,0);
});
test('profile settings, source directory and find-friends screens work without an account',()=>{
  const app=boot();app.run("go('Profile')");
  assert.match(app.elements.app.innerHTML,/Settings|Following|Followers|Edit character/);
  app.run("openProfilePage('settings')");assert.match(app.elements.app.innerHTML,/Sources &amp;|Sources & learning/);
  app.run("openProfilePage('sources')");assert.match(app.elements.app.innerHTML,/Section 15.2|Concepts|diversification/);
  app.run("openProfilePage('find')");for(const label of ['Search by username','Choose from contacts','Share your follow link'])assert.ok(app.elements.app.innerHTML.includes(label));
  app.run("openProfilePage('plus')");assert.match(app.elements.app.innerHTML,/No payment, automatic renewal/);
  assert.equal(app.run('hasPlus()'),false);
});
test('verified Plus bypasses energy only; expiry and signout restore the gate',()=>{
  const app=boot();app.run(`cloudUser={id:'test'};socialModel.entitlement={user_id:'test',product:'candle_plus',status:'active',valid_until:'2099-01-01T00:00:00Z'};state.energy=0;start(30)`);
  assert.equal(app.run('lesson'),30);assert.equal(app.run('state.energy'),0);
  assert.match(app.elements.energyTop.textContent,/∞ Candle/);
  app.run("go('Learn');start(32)");assert.equal(app.run('lesson'),null);
  app.run("socialModel.entitlement.valid_until='2000-01-01T00:00:00Z';start(30)");assert.equal(app.run('lesson'),null);
  app.run("socialModel.entitlement.valid_until='2099-01-01T00:00:00Z';cloudUser=null;start(30)");assert.equal(app.run('lesson'),null);
});
test('replayed lessons record daily activity without duplicating first-completion XP',async()=>{
  const app=boot();app.run(`globalThis.calls=[];cloudUser={id:'test'};cloud={rpc:async(name,args)=>{calls.push({name,args});return {data:null,error:null}}};start(30);for(let i=0;i<3;i++){choose(lessons[lesson].qs[question].correct);check();advance()}`);
  await Promise.resolve();const xp=app.run('state.xp');
  app.run('start(30);for(let i=0;i<3;i++){choose(lessons[lesson].qs[question].correct);check();advance()}');await Promise.resolve();
  assert.equal(app.run('state.xp'),xp);assert.equal(app.run('state.dailyLessons.length'),1);
  assert.equal(app.run('calls.filter(c=>c.name==="candle_record_learning_day").length'),2);
});
test('signup cannot grant Plus and malformed public profile values are escaped',()=>{
  const app=boot();app.run(`state.plus=true;state.premium=true;go('Profile');socialModel.profile={display_name:'<img src=x onerror=alert(1)>',username:'<script>'};renderProfile()`);
  assert.equal(app.run('hasPlus()'),false);
  assert.doesNotMatch(app.elements.app.innerHTML,/<img src=x|<script>/);
  assert.match(app.elements.app.innerHTML,/&lt;img/);
});
test('character controls save valid choices and ignore out-of-range choices',()=>{
  const app=boot();app.run("go('Profile');openProfilePage('character');setCharacterTab('face');setCharacterChoice(2)");
  assert.equal(app.run('state.avatar.face'),2);
  app.run('setCharacterChoice(999)');assert.equal(app.run('state.avatar.face'),2);
  assert.equal(JSON.parse(app.storage.get('candle-browser-v2')).avatar.face,2);
});
test('the deliverable is self-contained and runs its actual scripts with storage disabled',()=>{
  const html=buildPreview();assert.doesNotMatch(html,/<script src="(?!https:)|href="product.css"/);
  const app=boot(null,{html,blockStorage:true});
  assert.match(app.elements.app.innerHTML,/YOUR LEARNING HQ/);
  app.run("go('Profile');openProfilePage('character');setCharacterChoice(1);openProfilePage('settings');openProfilePage('sources')");
  assert.match(app.elements.app.innerHTML,/Sources &amp; learning standards/);
  app.run("go('Learn');start(30);choose(lessons[lesson].qs[question].correct);check();advance()");
  assert.equal(app.run('question'),1);
});
test('failed Plus signup never optimistically grants energy',async()=>{
  const app=boot();app.run("cloudUser={id:'test'};cloud={rpc:async()=>({error:{message:'offline'}})};state.energy=0");
  await app.run('startPlusPreview()');
  assert.equal(app.run('hasPlus()'),false);assert.equal(app.run('state.energy'),0);
  assert.match(app.elements.app.innerHTML,/could not be started/);
});
test('successful free preview requires a confirmed server entitlement',async()=>{
  const app=boot();app.run(`cloudUser={id:'test'};globalThis.calls=[];cloud={rpc:async(name,args)=>{calls.push({name,args});return {data:name==='candle_social_snapshot'?{profile:{},following:[],followers:[],blocked:[],entitlement:{user_id:'test',product:'candle_plus',source:'preview',status:'active',valid_until:'2099-01-01T00:00:00Z'}}:null,error:null}}}`);
  await app.run('startPlusPreview()');
  assert.equal(app.run('hasPlus()'),true);
  assert.equal(app.run('calls[0].name'),'candle_start_plus_preview');
  assert.equal(app.run('calls.some(c=>c.name==="candle_plus_interest")'),false);
});
test('signing out clears people, premium status and selected contact data',async()=>{
  const app=boot();app.run(`cloudUser={id:'test'};selectedContact={name:'Private'};socialModel.following=[{user_id:'a'}];socialModel.entitlement={user_id:'test',product:'candle_plus',status:'active',valid_until:'2099-01-01T00:00:00Z'}`);
  await app.run('productSignOut()');
  assert.equal(app.run('socialModel.following.length'),0);assert.equal(app.run('socialModel.entitlement'),null);assert.equal(app.run('selectedContact'),null);
});
test('an account switch cannot leave the previous account’s friends visible after a failed refresh',async()=>{
  const app=boot();app.run(`socialModel.accountId='old';socialModel.following=[{display_name:'Private old friend'}];cloudUser={id:'new'};cloud={rpc:async()=>({error:{message:'offline'}})}`);
  await app.run('refreshProduct()');
  assert.equal(app.run('socialModel.following.length'),0);assert.equal(app.run('socialModel.accountId'),'new');
});
test('contacts are selected one at a time and become an unsent invitation draft, with no RPC',async()=>{
  const app=boot();app.run(`cloudUser={id:'test'};socialModel.profile={friend_code:'ABCD1234'};window.CANDLE_CLOUD.publicAppUrl='https://example.test/candle/';globalThis.rpcCount=0;cloud={rpc:async()=>{rpcCount++;return {data:null,error:null}}};navigator.contacts={select:async(fields,options)=>{if(options.multiple!==false)throw Error('Unexpected bulk contacts');return [{name:['A friend'],email:['friend@example.invalid']}]}};go('Profile');openProfilePage('find')`);
  await app.run('chooseContact()');
  assert.equal(app.run('rpcCount'),0);
  assert.match(app.run('selectedContact.mailto'),/^mailto:friend%40example.invalid/);
  assert.ok(!app.storage.get('candle-browser-v2')?.includes('friend@example.invalid'));
  assert.match(app.elements.app.innerHTML,/Nothing has been sent/);
});
test('an invitation opens a profile for confirmation and never automatically follows',async()=>{
  const app=boot();app.run(`cloudUser={id:'test'};state.pendingFollow='ABCD1234';globalThis.calls=[];cloud={rpc:async(name,args)=>{calls.push({name,args});return {data:[{user_id:'22222222-2222-4222-8222-222222222222',display_name:'Friend',username:'friend'}],error:null}}}`);
  await app.run('resolveFollowInvitation()');
  assert.equal(app.run('calls.length'),1);assert.equal(app.run('calls[0].name'),'candle_resolve_follow_link');
  assert.match(app.elements.app.innerHTML,/Choose Follow to connect/);
});
