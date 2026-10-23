const fs=require('node:fs'),path=require('node:path');
const {fixture,validate}=require('./validate-curriculum.cjs');
const C=require('../curriculum.js');
const lessons=fixture(),errors=validate(lessons);if(errors.length)throw Error(errors.join('\n'));
const data=lessons.map((l,id)=>({id,subject:l.unit||({personal:"Personal Finance",investing:"Long-Term Investing",trading:"Trading & Risk"}[l.career])||"Finance foundations",title:l.title,objective:l.explain,questions:l.qs.map(q=>({id:q.id,skill:q.concept+':'+q.facet,prompt:q.taskPrompt||q.q,options:q.options,correct:q.correct,explanation:q.explain,sources:q.sources.map(key=>({id:key,title:C.sources[key].title||C.sources[key].name||key,url:C.sources[key].url}))}))}));
const dir=path.join(__dirname,'../ios/Resources');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'curriculum.json'),JSON.stringify(data));console.log('Exported '+data.length+' native lessons');
