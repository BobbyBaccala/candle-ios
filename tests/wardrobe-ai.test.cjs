const test=require('node:test'),assert=require('node:assert/strict');
const Character=require('../character.js'),AI=require('../ai-review.js'),icons=require('../ai-icons.js'),C=require('../curriculum.js');
const {boot}=require('./helpers/app.cjs'),{fixture}=require('../scripts/validate-curriculum.cjs');
test('the starting uniform is a black suit and tie, with visible hands and a smaller head',()=>{
  const svg=Character.svg({},120);
  assert.equal(Character.wardrobe[0].coat,'#202126');assert.equal(Character.wardrobe[0].kind,'suit');
  assert.match(svg,/data-part="hands"/);assert.match(svg,/data-part="tie"/);
  assert.match(svg,/data-part="head" transform="translate\(24 5\) scale\(\.7\)"/);
  assert.match(svg,/viewBox="0 0 160 240"/);
});
test('each of the 12 meme ranks has an outfit, and locked fits cannot be equipped or rendered as earned',()=>{
  assert.equal(Character.wardrobe.length,12);
  Character.wardrobe.forEach((fit,i)=>{
    assert.equal(fit.rank,i);assert.equal(Character.unlocked(i,i),true);
    if(i>0){assert.equal(Character.unlocked(i,i-1),false);assert.equal(Character.normalized({clothing:i},i-1).clothing,0)}
    assert.ok(Character.svg({clothing:i},120,i).includes(fit.name));
  });
  assert.equal(Character.wardrobe[8].kind,'quarterzip');assert.equal(Character.wardrobe[10].shoes,'flipflops');
});
test('wardrobe UI gates outfits by learning rank and keeps cosmetic purchases out',()=>{
  const app=boot();app.run("go('Profile');openProfilePage('character');setCharacterTab('clothing');setCharacterChoice(8)");
  assert.equal(app.run('state.avatar.clothing'),0);
  assert.match(app.elements.app.innerHTML,/Yieldmaxxer/);assert.match(app.elements.app.innerHTML,/never paid/);
  app.run('state.xp=6800;setCharacterChoice(8)');assert.equal(app.run('state.avatar.clothing'),8);
  assert.match(app.run('avatarSVG()'),/Yieldmaxxer Quarter Zip/);
  app.run('state.xp=0');assert.match(app.run('avatarSVG()'),/First Day on Wall Street/);
});
test('crossing a rank boundary reveals the new fit without silently equipping it',()=>{
  const app=boot();app.run("state.xp=800;start(30);for(let i=0;i<3;i++){choose(lessons[lesson].qs[question].correct);check();advance()}");
  assert.equal(app.run('rankInfo().index'),1);assert.equal(app.run('state.avatar.clothing'),0);
  app.run('dismissRoundOffer()');
  assert.match(app.elements.app.innerHTML,/OUTFIT UNLOCKED/);assert.match(app.elements.app.innerHTML,/Budget Goblin/);
});
test('the AI tray is absent before reveal and appears with four provider marks after checking',()=>{
  const app=boot();app.run('start(30)');
  assert.doesNotMatch(app.elements.app.innerHTML,/ai-review-tray|Study this question with/);
  app.run('choose(lessons[lesson].qs[question].correct);check()');
  assert.match(app.elements.app.innerHTML,/Go deeper with AI/);
  for(const p of AI.providers){assert.ok(app.elements.app.innerHTML.includes('Study this question with '+p.name));assert.ok(icons[p.id].startsWith('<svg'))}
  assert.match(app.elements.app.innerHTML,/noopener noreferrer external/);
  app.run('advance()');assert.doesNotMatch(app.elements.app.innerHTML,/ai-review-tray/);
});
test('every question produces a complete, qualitative prompt and valid allowlisted provider URL',()=>{
  for(const lesson of fixture())for(const q of lesson.qs){
    const prompt=AI.prompt(lesson,q,C.sources);
    assert.ok(prompt.includes(q.q));assert.ok(prompt.includes(q.options[q.correct]));assert.ok(prompt.includes(q.explain));
    assert.match(prompt,/one short check-for-understanding question and wait/);
    for(const p of AI.providers){
      const target=AI.destination(p.id,prompt),url=new URL(target.url);
      assert.equal(url.protocol,'https:');assert.equal(url.origin,new URL(p.base).origin);
      if(target.prefilled)assert.equal(url.searchParams.get('q'),prompt);
      else assert.equal(target.url,p.base);
    }
  }
});
test('links encode special characters exactly and long prompts use an intact copy fallback',()=>{
  const text='Why A & B? € “quoted” # <tag>\nnew line';
  const target=AI.destination('chatgpt',text);assert.equal(new URL(target.url).searchParams.get('q'),text);
  assert.equal(AI.destination('gemini',text).copyFirst,true);
  assert.equal(AI.destination('claude','x'.repeat(10000)).prefilled,false);
  assert.throws(()=>AI.destination('javascript:alert(1)',text),/Unknown provider/);
});
test('handoff whitelists curriculum fields instead of account, progress or chosen-answer data',()=>{
  const lesson=fixture()[30],q=lesson.qs[0];
  const prompt=AI.prompt({...lesson,email:'private@example.invalid',xp:987654},{...q,selected:'private-choice',user_id:'secret-user'},C.sources);
  for(const sensitive of ['private@example.invalid','987654','private-choice','secret-user'])assert.ok(!prompt.includes(sensitive));
});
test('copying a revealed study prompt writes only that content and never opens/submits a chat',async()=>{
  const app=boot();app.run("globalThis.copied=[];navigator.clipboard={writeText:async(text)=>copied.push(text)};start(30);choose(lessons[lesson].qs[question].correct);check()");
  assert.equal(await app.run('copyAIStudyPrompt()'),true);
  assert.equal(app.run('copied.length'),1);assert.match(app.run('copied[0]'),/Your work hours vary each month/);
  app.run('advance()');assert.equal(await app.run('copyAIStudyPrompt()'),false);assert.equal(app.run('copied.length'),1);
});
test('clipboard denial retains a usable manual prompt and does not break the lesson',async()=>{
  const app=boot();app.run('start(30);choose(lessons[lesson].qs[question].correct);check()');
  assert.equal(await app.run('copyAIStudyPrompt()'),false);
  assert.match(app.elements.app.innerHTML,/View \/ copy study prompt/);assert.match(app.elements.app.innerHTML,/readonly/);
  app.run('advance()');assert.equal(app.run('question'),1);
});
