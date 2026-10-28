/* Device learning evidence and cosmetic rewards. Not a professional qualification. */
const CandleHabits=(()=>{
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 function normalize(v){const h=object(v)?v:{};return {evidence:Object.fromEntries(Object.entries(object(h.evidence)?h.evidence:{}).filter(([,r])=>object(r))),days:Object.fromEntries(Object.entries(object(h.days)?h.days:{}).filter(([d,r])=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&Array.isArray(r)).map(([d,r])=>[d,[...new Set(r.filter(id=>Number.isInteger(id)&&id>=0&&id<1293))]])),buddy:Object.fromEntries(Object.entries(object(h.buddy)?h.buddy:{}).filter(([,r])=>Array.isArray(r)).map(([k,r])=>[k,[...new Set(r.filter(d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)))]])),reports:Array.isArray(h.reports)?h.reports.filter(r=>object(r)&&typeof r.question==='string').slice(-100):[],goal:['everyday','investing','work','sharp'].includes(h.goal)?h.goal:'everyday',offers:h.offers==='round'?'round':'daily',lastOffer:typeof h.lastOffer==='string'?h.lastOffer:''}}
 const key=q=>q.concept+':'+q.facet;
 function answer(h,q,correct,confidence,now=Date.now()){
  const id=key(q),old=object(h.evidence[id])?h.evidence[id]:{},prior=Number.isFinite(old.lastCorrect)?old.lastCorrect:null;
  const delayed=correct&&prior!==null&&now-prior>=86400000;
  h.evidence[id]={seen:(Number(old.seen)||0)+1,correct:(Number(old.correct)||0)+(correct?1:0),last:now,lastCorrect:correct?now:prior,retained:correct&&(delayed||old.retained===true),confidence:['guess','fair','sure'].includes(confidence)?confidence:null,lastWasCorrect:correct,lesson:old.lesson};
  return h.evidence[id];
 }
 function finish(h,id,day){const ids=Array.isArray(h.days[day])?h.days[day]:[];if(!ids.includes(id))ids.push(id);h.days[day]=ids;return {lessons:ids.length,sparks:ids.length>=3?3:ids.length?1:0}}
 function sparks(h){return Object.values(h.days).reduce((n,ids)=>n+(Array.isArray(ids)?ids.length>=3?3:ids.length?1:0:0),0)}
 function summary(h){const rows=Object.values(h.evidence).filter(object);return {seen:rows.length,retained:rows.filter(r=>r.retained).length,repair:rows.filter(r=>r.lastWasCorrect===false).length,overconfident:rows.filter(r=>r.lastWasCorrect===false&&r.confidence==='sure').length}}
 function week(day){const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d.toISOString().slice(0,10)}
 function buddyKey(user,friend,day){return user+':'+friend+':'+week(day)}
 function checkIn(h,user,friend,day,verified){if(!user||!friend||user===friend||!verified)return false;const k=buddyKey(user,friend,day),days=Array.isArray(h.buddy[k])?h.buddy[k]:[];if(days.includes(day))return false;h.buddy[k]=[...days,day];return true}
 return {normalize,key,answer,finish,sparks,summary,week,buddyKey,checkIn};
})();
if(typeof module!=='undefined')module.exports=CandleHabits;
