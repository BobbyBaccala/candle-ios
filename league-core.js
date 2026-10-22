/* Transparent, deterministic learning leagues. No simulated opponents. */
const CandleLeagues=(()=>{
 const titles=['Intern Energy','Spreadsheet Associate','Reply-All Analyst','Calendar Tetris Manager','Deck Goblin Director','Vice President of Vibes','C-Suite Side Quest','CEO of Doing the Work'];
 const thresholds=[0,100,300,650,1000,1400,1800,2300];
 function stats(records){
  let completed=0,correct=0,total=0;
  for(const r of Object.values(records||{}))if(r&&r.version==='league-v1'&&Number.isInteger(r.total)&&r.total>0&&Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=r.total){completed++;correct+=r.correct;total+=r.total}
  const accuracy=total?correct/total:0,points=total?Math.floor(completed*5*(total+correct)/total):0;
  let index=0;while(index<titles.length-1&&points>=thresholds[index+1])index++;
  const next=thresholds[index+1]??null,progress=next===null?100:Math.min(100,(points-thresholds[index])/(next-thresholds[index])*100);
  return {completed,correct,total,accuracy,points,index,name:titles[index]+' League',next,progress};
 }
 function due(reviews,now=Date.now()){return Object.entries(reviews||{}).filter(([,r])=>Number.isFinite(r?.due)&&r.due<=now).sort((a,b)=>a[1].due-b[1].due).map(([id])=>Number(id))}
 function review(previous,correct,total,now=Date.now()){
  // No same-day interval inflation. Errors get a shorter next review.
  const last=previous?.at||0,days=correct===total?(now-last<20*3600000&&last?previous.days||1:Math.min(30,(previous?.days||0)*2+1)):1;
  return {at:now,days,due:now+days*86400000};
 }
 return {titles,thresholds,stats,due,review};
})();
if(typeof module!=='undefined')module.exports=CandleLeagues;
