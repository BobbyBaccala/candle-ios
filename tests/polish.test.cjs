const test=require('node:test'),assert=require('node:assert/strict'),{boot}=require('./helpers/app.cjs');

const mockCloud=`globalThis.calls=[];cloudUser={id:"u1"};cloud={rpc:async(name,args)=>{calls.push({name,args});
  if(name==="candle_ensure_profile")return {data:[{friend_code:"ABCD1234",display_name:"Trader"}],error:null};
  if(name==="candle_complete_stage"&&args.p_stage_id>149)return {data:null,error:{message:"Invalid stage"}};
  if(name==="candle_leaderboard")return {data:[],error:null};
  return {data:null,error:null}}};`;
const day=offset=>{const d=new Date();d.setDate(d.getDate()+offset);return d.toLocaleDateString('en-CA')};

test('a day rollover mid-session still records bestStreak (expiry is left to depth-ui.js)',()=>{
  const app=boot({streak:2,last:day(0),done:[30]});
  app.run(`state.streak=5;state.last="2020-01-01";render();refreshStreakExpiry()`);
  assert.equal(app.run('state.streak'),0);
  assert.equal(app.run('state.bestStreak'),5);
});

test('replaying a completed lesson counts toward today\'s streak once',()=>{
  const app=boot({streak:3,last:day(-1),done:[30],xp:40});
  app.run('award(30)');
  assert.equal(app.run('state.streak'),4);
  assert.equal(app.run('state.last'),day(0));
  app.run('award(30)');
  assert.equal(app.run('state.streak'),4);
  assert.equal(app.run('state.xp'),40);
});

test('leaderboard backfill skips a rejected stage, keeps going and never resends',async()=>{
  const app=boot({done:[0,200,31],xp:75,avatar:{name:'Bobby'}});
  app.run(mockCloud);
  await app.run('cloudRefresh()');
  const sent=()=>app.run('JSON.stringify(calls.filter(c=>c.name==="candle_complete_stage").map(c=>c.args.p_stage_id))');
  assert.deepEqual(JSON.parse(sent()),[0,200,31]);
  assert.match(app.run('cloudError'),/1 earlier stage could not be added/);
  assert.ok(app.run('calls.some(c=>c.name==="candle_set_name"&&c.args.p_name==="Bobby")'));
  await app.run('cloudRefresh()');
  assert.deepEqual(JSON.parse(sent()),[0,200,31]);
  assert.deepEqual(JSON.parse(app.run('JSON.stringify(state.cloudSynced.u1)')),[0,31]);
});
