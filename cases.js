/* Original qualitative case files. A case is five different reasoning tasks,
   not five numerical reskins. See docs/RETENTION-AND-LEAGUES.md. */
const CandleCases=(()=>{
 const cases=[];
 const prompts=['Which response best fits the situation?','What is the most important risk to recognize?','Which evidence is most useful before acting?','Which underlying principle best explains this case?','What change would most justify revisiting the plan?'];
 const facets=['decision','risk','evidence','mechanism','revision'];
 const styles=['decision','diagnosis','evidence','explanation','counterfactual'];
 // Each task has an authored key, a plausible misconception and a rationale.
 // The third option is a domain-specific competing misconception, not another key.
 const wrong={
  personal:['Commit before checking recurring obligations','Assume a familiar provider cannot cause loss','Use a friend’s outcome instead of your contract','A larger account balance always means greater wealth','A new social-media recommendation alone'],
  investing:['Choose solely by the latest winning return','Treat diversification as a guarantee against loss','Use the product name instead of its disclosures','Past performance fixes the next outcome','Only a decorative app icon changes'],
  trading:['Increase exposure before validating the premise','Assume a planned exit guarantees its execution price','Use a profit screenshot without the losing trades','A profitable outcome proves a sound process','Only a chart’s decorative colors change']
 };
 function add(path,title,context,source,rows){
  if(rows.length!==5)throw Error('Five facets required: '+title);
  cases.push({path,title,context,source,rows});
 }
 function install(lessons,C){
  if(lessons.length!==150)throw Error('Case append requires the stable 150-slot base');
  for(const style of ['explanation','counterfactual'])if(!C.formats.includes(style))C.formats.push(style);
  C.labels.explanation='Explain the mechanism';C.labels.counterfactual='Revisit a changed situation';
  for(const [n,c] of cases.entries()){
   const id=lessons.length,concept='case-'+n,refs=c.source.split(' ');
   if(c.path==='personal')refs.unshift(/card|transfer|minimum|installment|credit/i.test(c.title)?'cards':/scam|identity|loss|recipient/i.test(c.title)?'fraud':/deposit|bank|overdraft|savings bonus/i.test(c.title)?'bank':/car/i.test(c.title)?'auto':'consumer');
   if(c.path==='investing')refs.unshift(/revenue|profit|inventory/i.test(c.title)?'accounting':/cash|dividend/i.test(c.title)?'cashflow':/debt|dilution|buyback/i.test(c.title)?'capital':/valuation|multiple|expensive|moat/i.test(c.title)?'equityvalue':'products');
   if(c.path==='trading'&&/impulse|missing|anchored|confirmation|hindsight|lucky|journal|no-trade/i.test(c.title)){refs.splice(0,refs.length,'bias','testing');}
   if(c.path==='trading'&&/option|volatility before/i.test(c.title))refs.unshift('options');
   if(c.path==='trading'&&/leveraged fund/i.test(c.title))refs.unshift('leveraged');
   if(c.path==='trading'&&/session/i.test(c.title))refs.unshift('sessions');
   const bank={objective:c.context,sources:[...new Set(refs)],rows:c.rows.map((r,i)=>[facets[i],c.title+': '+prompts[i],r[0],r[1],wrong[c.path][i],r[2]])};
   C.banks[concept]=bank;
   const qs=C.questions(concept,id).map((q,i)=>({...q,id:'case-v1-'+id+'-'+facets[i],format:styles[i]}));
   lessons.push({unit:{personal:'Personal Finance',investing:'Long-Term Investing',trading:'Trading & Risk'}[c.path],career:c.path,title:c.title,caseContext:c.context,explain:c.context,qs,sourceIds:[...bank.sources],curriculumVersion:'cases-v1'});
  }
 }
 return {cases,add,install};
})();
if(typeof module!=='undefined')module.exports=CandleCases;
