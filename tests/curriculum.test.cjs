const test=require('node:test');
const assert=require('node:assert/strict');
const C=require('../curriculum.js');
const {validate,fixture}=require('../scripts/validate-curriculum.cjs');
test('all production slots pass quality rules and avoid a fixed answer-position pattern',()=>{
  const lessons=fixture();
  assert.deepEqual(validate(lessons),[]);
  for(const l of lessons)assert.equal(l.qs.length,l.curriculumVersion==='cases-v1'?5:3);
  assert.ok(new Set(lessons.map(l=>l.qs.map(q=>q.correct).join(''))).size>15);
  const prompts=new Set(lessons.flatMap(l=>l.qs.map(q=>q.q)));
  assert.equal(prompts.size,Object.values(C.banks).reduce((n,b)=>n+b.rows.length,0));
});
for(const [name,mutate,pattern] of [
  ['duplicate IDs',l=>l[0].qs[1].id=l[0].qs[0].id,/duplicate question ID/],
  ['identical prompt',l=>l[0].qs[1].q=l[0].qs[0].q,/duplicate normalized prompt/],
  ['number substitution',l=>{l[0].qs[0].q='A student has 20 dollars saved for a future financial goal. What is the best plan?';l[0].qs[1].q='A student has 30 dollars saved for a future financial goal. What is the best plan?'},/duplicate normalized prompt/],
  ['near duplicate',l=>{l[0].qs[0].q='A student needs savings for tuition next semester and wants a safe plan for that goal.';l[0].qs[1].q='A student needs savings for tuition next semester and wants a secure plan for that goal.'},/near duplicate/],
  ['semantic facet repeat',l=>l[0].qs[1].facet=l[0].qs[0].facet,/duplicate concept\/facet/],
  ['task style repeat',l=>l[0].qs[1].format=l[0].qs[0].format,/repeated task style/],
  ['duplicate options',l=>l[0].qs[0].options[1]=l[0].qs[0].options[0],/duplicate normalized options/],
  ['bad key',l=>l[0].qs[0].correct=3,/invalid answer key/],
  ['missing source',l=>l[0].qs[0].sources=['unknown'],/unresolved source/],
  ['no explanation',l=>l[0].qs[0].explain='',/substantive explanation/],
  ['numeric exercise',l=>l[0].qs[0].q='Calculate the exact real return on $100 after fees and inflation.',/calculator requirement/],
  ['fixed answer position',l=>l.forEach(lesson=>lesson.qs.forEach(q=>q.correct=0)),/positions are not varied/]
])test(`quality gate rejects ${name}`,()=>{const lessons=fixture();mutate(lessons);assert.match(validate(lessons).join('\n'),pattern)});
test('rotation preserves each authored answer and varies its position',()=>{
  for(const [bankId,bank] of Object.entries(C.banks))for(let lessonId=0;lessonId<6;lessonId++)for(let round=0;round<4;round++){
    const qs=C.questions(bankId,lessonId,round);
    qs.forEach((q,i)=>assert.equal(q.options[q.correct],bank.rows[i][2]));
  }
});
test('migration refuses an unknown slot layout',()=>assert.throws(()=>C.install([],30,[]),/slot mapping changed/));
