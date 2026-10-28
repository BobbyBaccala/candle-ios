/* Recover browser saves defensively; local progress never grants paid access. */
const CandleStorage=(()=>{
 const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
 const count=x=>Number.isSafeInteger(x)&&x>=0?x:0;
 const date=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)?x:'';
 function normalize(raw){
  const s=object(raw)?{...raw}:{};
  for(const key of ['xp','streak','attempts','perfect','gameWins','bestStreak'])s[key]=count(s[key]);
  s.done=[...new Set((Array.isArray(s.done)?s.done:[]).filter(x=>Number.isInteger(x)&&x>=0&&x<1293))];
  s.last=date(s.last);s.dailyLessons=[...new Set((Array.isArray(s.dailyLessons)?s.dailyLessons:[]).map(date).filter(Boolean))];
  s.avatar=object(s.avatar)?{...s.avatar}:{};s.avatar.name=typeof s.avatar.name==='string'?s.avatar.name.slice(0,18):'Trader';
  for(const key of ['lessonScores','leagueRecords','leaguePending','reviews','arcadeProgress','chartProgress'])if(!object(s[key]))s[key]={};
  for(const key of ['lessonScores','leagueRecords','leaguePending'])for(const [id,row] of Object.entries(s[key]))if(!object(row)||!Number.isInteger(row.total)||row.total<1||row.total>18||!Number.isInteger(row.correct)||row.correct<0||row.correct>row.total)delete s[key][id];
  for(const [id,row] of Object.entries(s.reviews))if(!object(row))delete s.reviews[id];
  for(const [id,row] of Object.entries(s.arcadeProgress))if(!object(row)||!Array.isArray(row.answers)||row.answers.some(a=>!object(a)||typeof a.correct!=='boolean')||row.answers.length>3)delete s.arcadeProgress[id];
  for(const [id,row] of Object.entries(s.chartProgress))if(!Array.isArray(row)||row.length>3||row.some(a=>typeof a!=='boolean'))delete s.chartProgress[id];
  s.typeface=['utility','system','editorial'].includes(s.typeface)?s.typeface:'editorial';s.streakReminders=s.streakReminders===true;
  if(typeof s.path!=='string')delete s.path;
  return s;
 }
 return {normalize};
})();
if(typeof module!=='undefined')module.exports=CandleStorage;
