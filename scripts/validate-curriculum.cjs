const curriculum = require('../curriculum.js');
const normalize = text => text.toLowerCase().normalize('NFKC').replace(/\d+(?:[.,]\d+)*/g,'#').replace(/[^a-z# ]/g,' ').replace(/\s+/g,' ').trim();
const tokens = text => new Set(normalize(text).split(' ').filter(w=>w.length>3));
function similarity(a,b) {
  const x=tokens(a),y=tokens(b),union=new Set([...x,...y]);
  return union.size ? [...x].filter(w=>y.has(w)).length/union.size : 1;
}
function validate(lessons, sources=curriculum.sources) {
  const errors=[],ids=new Set(),globalPrompts=new Map(),answerCounts=[0,0,0];
  const fail=(where,message)=>errors.push(`${where}: ${message}`);
  lessons.forEach((l,li)=>{
    const where=`lesson ${li} (${l.title})`;
    if(!l.explain?.trim()||!l.curriculumVersion)fail(where,'missing objective or version');
    if(!Array.isArray(l.qs)||l.qs.length<3){fail(where,'at least three distinct tasks required');return}
    const prompts=new Set(),facets=new Set(),styles=new Set();
    l.qs.forEach((q,qi)=>{
      const loc=`${where}, question ${qi}`,prompt=normalize(q.q||'');
      if(!q.id||ids.has(q.id))fail(loc,'missing or duplicate question ID');
      ids.add(q.id);
      if(prompt.length<30||prompt.length>420)fail(loc,'prompt length outside editorial bounds');
      if(prompts.has(prompt))fail(loc,'duplicate normalized prompt');
      prompts.add(prompt);
      if(!q.concept||!q.facet)fail(loc,'missing concept or facet');
      const facet=`${q.concept}:${q.facet}`;
      if(facets.has(facet))fail(loc,'duplicate concept/facet');
      facets.add(facet);
      const style=`${q.concept}:${q.format}`;
      if(styles.has(style))fail(loc,'repeated task style on the same concept');
      styles.add(style);
      if(!curriculum.formats.includes(q.format)||q.kind!=='choice')fail(loc,'unsupported qualitative format');
      if(!Array.isArray(q.options)||q.options.length!==3||q.options.some(o=>typeof o!=='string'||!o.trim()||o.length>200))fail(loc,'three readable options required');
      else if(new Set(q.options.map(normalize)).size!==q.options.length)fail(loc,'duplicate normalized options');
      if(!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.options?.length)fail(loc,'invalid answer key');
      if(q.correct>=0&&q.correct<3)answerCounts[q.correct]++;
      if(typeof q.explain!=='string'||q.explain.length<70||q.explain.length>550)fail(loc,'substantive explanation required');
      if(!Array.isArray(q.hints)||q.hints.length!==2||q.hints.some(h=>!h?.trim()))fail(loc,'two qualitative hints required');
      if(!q.sources?.length||q.sources.some(id=>!sources[id]||!/^https:\/\//.test(sources[id].url)))fail(loc,'unresolved source');
      if(/\b(calculate|compute|how many dollars|exact real return|end value|enter a number)\b|\$\s*\d|\d\s*[%×÷]|[=÷]/i.test(q.q))fail(loc,'possible calculator requirement');
      const prior=globalPrompts.get(prompt);
      if(prior&&prior!==facet)fail(loc,'same global prompt has conflicting facet labels');
      globalPrompts.set(prompt,facet);
      for(let j=0;j<qi;j++)if(similarity(q.q,l.qs[j].q)>=0.67)fail(loc,`possible near duplicate of question ${j}`);
    });
  });
  const total=answerCounts.reduce((a,b)=>a+b,0);
  if(total>=30&&answerCounts.some(n=>n/total<0.2||n/total>0.45))fail('curriculum','correct-answer positions are not varied across the curriculum');
  return errors;
}
function fixture() {
  const lessons=Array.from({length:150},(_,i)=>({title:`slot ${i}`,career:i<30?undefined:['personal','investing','trading'][Math.floor((i-30)/40)],tier:i<30?undefined:Math.floor(((i-30)%40)/10)}));
  curriculum.install(lessons,30,Object.keys(curriculum.career).map(id=>({id,lessons:Array.from({length:10},()=>['topic'])})));
  return lessons;
}
if(require.main===module) {
  const lessons=fixture(),errors=validate(lessons);
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1}
  else console.log(`PASS: ${lessons.length} stable lesson slots, ${lessons.reduce((n,l)=>n+l.qs.length,0)} qualitative question placements, ${Object.keys(curriculum.banks).length} concept banks. Cross-lesson review is intentional; see docs/CURRICULUM.md.`);
}
module.exports={validate,fixture,normalize,similarity};
