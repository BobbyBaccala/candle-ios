const CandleReminders=(()=>{
 function day(date){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-')}
 function next(last,streak,now=new Date()){
  if(!Number.isInteger(streak)||streak<1||!/^\d{4}-\d{2}-\d{2}$/.test(last||''))return null;
  const [y,m,d]=last.split('-').map(Number),completed=new Date(y,m-1,d,12);
  if(day(completed)!==last)return null;
  const target=new Date(y,m-1,d+1,20),expires=new Date(y,m-1,d+2,0);
  return target>now?{at:target.toISOString(),expires:expires.toISOString(),localDay:day(target)}:null;
 }
 function active(last,now=new Date()){const prior=new Date(now.getFullYear(),now.getMonth(),now.getDate()-1,12);return last===day(now)||last===day(prior)}
 return {day,next,active};
})();
if(typeof module!=='undefined')module.exports=CandleReminders;
