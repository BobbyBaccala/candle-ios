const fs=require('node:fs'),crypto=require('node:crypto');
const {fixture}=require('./validate-curriculum.cjs'),C=require('../curriculum.js');
function reviewPack(){
 const items=new Map();
 for(const [lessonId,lesson] of fixture().entries())for(const q of lesson.qs){
  const material={prompt:q.taskPrompt||q.q,answer:q.options[q.correct],distractors:q.options.filter((_,i)=>i!==q.correct).sort(),explanation:q.explain,sourceIds:[...q.sources].sort()};
  const fingerprint=crypto.createHash('sha256').update(JSON.stringify(material)).digest('hex');
  if(!items.has(fingerprint))items.set(fingerprint,{fingerprint,...material,sources:q.sources.map(id=>({id,...C.sources[id]})),lessonIds:[],review:{status:'pending',reviewer:'',reviewedAt:'',exactSourceSection:'',singleDefensibleAnswer:false,appropriateDistractors:false,jurisdictionChecked:false,notes:''}});
  items.get(fingerprint).lessonIds.push(lessonId);
 }
 return [...items.values()];
}
if(require.main===module){const destination=process.argv[2];if(!destination)throw Error('Provide output JSON path');const items=reviewPack();fs.writeFileSync(destination,JSON.stringify({scope:'Unique prompt/answer/explanation/source combinations; contextual transfer still requires review',items},null,2));console.log(items.length+' review records exported; none independently approved');}
module.exports={reviewPack};
