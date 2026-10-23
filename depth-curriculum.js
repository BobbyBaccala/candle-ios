/* Structured transfer practice. 100 topic models × 10 business contexts ×
   six tasks = 6,000 contextual practice placements, NOT 6,000 independent
   concepts. Core reasoning and context-specific evidence stay explicit. */
const CandleDepth=(()=>{
 const models=[],contexts=[];
 const paths=[
  {id:'corporate',name:'Corporate Finance',emoji:'🏢',desc:'Capital allocation, funding, valuation and treasury'},
  {id:'accounting',name:'Accounting & Analysis',emoji:'📒',desc:'Statements, earnings quality and operating decisions'},
  {id:'economics',name:'Economics & Markets',emoji:'🌐',desc:'Incentives, cycles, monetary policy and competition'},
  {id:'banking',name:'Banking & Credit',emoji:'🏦',desc:'Lending, payments, liquidity and credit analysis'},
  {id:'protection',name:'Protection & Planning',emoji:'🛡️',desc:'Insurance, retirement, resilience and responsibilities'},
  {id:'digital',name:'Digital Finance',emoji:'🔐',desc:'Payments, custody, scams, data and digital products'}
 ];
 function pack(path,text){for(const block of text.trim().split('\n\n')){const [head,...rows]=block.split('\n'),[title,objective,refs]=head.split('|');if(rows.length!==3)throw Error('Three topic tasks required: '+title);models.push({path,title,objective,refs:refs.split(' '),rows:rows.map(r=>r.split('~'))})}}
 function contextPack(text){for(const block of text.trim().split('\n\n')){const [head,...rows]=block.split('\n'),[title,situation]=head.split('|');if(rows.length!==3)throw Error('Three context tasks required');contexts.push({title,situation,rows:rows.map(r=>r.split('~'))})}}
 function questions(rows,concept,id,context,refs,C){
  C.banks[concept]={objective:context,sources:refs,rows:rows.map((r,i)=>['facet-'+i,r[0],r[1],r[2],r[3],r[4]])};
  return C.questions(concept,id).map((q,i)=>({...q,id:'depth-v1-'+id+'-'+concept+'-'+i}));
 }
 function install(lessons,C,careerPaths){
  if(lessons.length!==293)throw Error('Depth expansion requires stable 293-slot base');
  for(const p of paths)if(!careerPaths.some(x=>x.id===p.id))careerPaths.push({...p,color:'#326755',lessons:[]});
  // Existing three-question sets become six-question mixed-concept refreshers.
  // Original question IDs and first-completion records are preserved.
  const baseBanks=Object.keys(C.banks).filter(id=>!id.startsWith('case-')&&!id.startsWith('depth-'));
  for(let id=0;id<150;id++){
   const l=lessons[id],first=l.qs[0].concept,position=baseBanks.indexOf(first),second=baseBanks[(position+1)%baseBanks.length];
   l.qs.push(...C.questions(second,id,1).map(q=>({...q,id:q.id+'-mixed'})));
   l.explain+=' Then apply a related second concept: '+C.banks[second].objective;
   l.sourceIds=[...new Set([...l.sourceIds,...C.banks[second].sources])];l.curriculumVersion='qualitative-v2';
  }
  for(const [mi,m] of models.entries())for(const [ci,c] of contexts.entries()){
   const id=lessons.length,context='Refresher focus: '+m.objective+' Workplace transfer: '+c.situation;
   const topicConcept='depth-topic-'+mi,contextConcept='depth-context-'+ci;
   const prefix=m.title+' · '+c.title+' — ';
   const topicRows=m.rows.map(r=>[prefix+r[0],...r.slice(1)]),contextRows=c.rows.map(r=>[prefix+r[0],...r.slice(1)]);
   const qs=[...questions(topicRows,topicConcept,id,context,m.refs,C),...questions(contextRows,contextConcept,id,context,['finance','cashflow','capital'],C).map((q,i)=>({...q,format:['decision','diagnosis','counterfactual'][i]}))].map(q=>({...q,taskPrompt:q.q.slice(prefix.length)}));
   lessons.push({unit:paths.find(p=>p.id===m.path).name,career:m.path,title:m.title+' · '+c.title,explain:context,caseContext:context,sourceIds:[...new Set([...m.refs,'finance','cashflow','capital'])],qs,curriculumVersion:'depth-v1',practiceVariant:true,coreTopic:mi,transferContext:ci});
  }
 }
 return {models,contexts,paths,pack,contextPack,install};
})();
if(typeof module!=='undefined')module.exports=CandleDepth;
