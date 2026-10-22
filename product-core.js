/* Pure rules shared by the UI and regression tests. Server records are the
   authority for social activity and paid access; browser state is never one. */
const CandleProduct = (() => {
  const day = date => new Date(date).toISOString().slice(0,10);
  function sharedStreak(ownDays,friendDays,now=new Date(),since='0000-00-00') {
    const own=new Set(ownDays),other=new Set(friendDays),today=day(now);
    let cursor=new Date(today+'T00:00:00Z');
    const bothToday=own.has(today)&&other.has(today)&&today>=since;
    if(!bothToday)cursor.setUTCDate(cursor.getUTCDate()-1);
    let count=0;
    for(let i=0;i<36600;i++){
      const d=day(cursor);
      if(d<since||!own.has(d)||!other.has(d))break;
      count++;cursor.setUTCDate(cursor.getUTCDate()-1);
    }
    return {count,bothToday,youToday:own.has(today),friendToday:other.has(today)};
  }
  function validUsername(name) { return /^[a-z][a-z0-9_]{2,19}$/.test(name); }
  function plusActive(entitlement,userId,now=Date.now()) {
    return Boolean(userId&&entitlement?.user_id===userId&&entitlement?.product==='candle_plus'&&
      ['active','grace'].includes(entitlement.status)&&Number.isFinite(Date.parse(entitlement.valid_until))&&
      Date.parse(entitlement.valid_until)>now);
  }
  function followLink(base,code) {
    const url=new URL(base);
    if(!['http:','https:'].includes(url.protocol)||!/^\w{8}$/.test(code||''))return null;
    url.search='';url.hash='';url.searchParams.set('follow',code);return url.href;
  }
  function sourceGroups(curriculum) {
    return Object.entries(curriculum.sources).map(([id,source])=>({id,...source,
      concepts:Object.entries(curriculum.banks).filter(([,b])=>b.sources.includes(id)).map(([key,b])=>({key,objective:b.objective,facets:b.rows.map(r=>r[0])}))}));
  }
  return {day,sharedStreak,validUsername,plusActive,followLink,sourceGroups};
})();
if(typeof module!=='undefined')module.exports=CandleProduct;
