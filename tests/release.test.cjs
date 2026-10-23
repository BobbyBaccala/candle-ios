const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm');
const {boot}=require('./helpers/app.cjs'),{buildPreview}=require('../scripts/build-preview.cjs');
const S=require('../storage-core.js');
test('damaged saves recover without losing valid progress or legacy scores',()=>{
 const raw={xp:250,done:[0,0,-1,1292,99999,'1'],avatar:'bad',dailyLessons:{},lessonScores:{30:{correct:18,total:18},2:null},arcadeProgress:{position:{answers:[null]}},chartProgress:{0:'bad'},reviews:{1:null},streak:-2};
 const a=boot(raw);assert.equal(a.run('state.xp'),250);assert.equal(a.run('state.done.join()'),'0,1292');assert.equal(a.run('state.lessonScores[30].total'),18);assert.equal(a.run('state.avatar.name'),'Trader');
 for(const page of ['Home','Learn','Play','Compete','Profile'])a.run('go('+JSON.stringify(page)+')');
 assert.equal(raw.avatar,'bad');
});
test('primitive and array save roots start safely',()=>{for(const raw of [true,42,'broken',[]])assert.equal(S.normalize(raw).xp,0)});
test('downloaded artifact boots offline, navigates and completes a full lesson',()=>{
 const html=buildPreview();assert.ok(!/<script src="(?!https:)/.test(html));assert.ok(!/<link[^>]+href="product.css"/.test(html));
 const a=boot(null,{html});for(const page of ['Home','Learn','Play','Compete','Profile']){a.run('go('+JSON.stringify(page)+')');assert.ok(a.elements.app.innerHTML.length>100)}
 a.run('start(1292);for(let i=0;i<6;i++){choose(lessons[lesson].qs[question].correct);check();advance()}');assert.equal(a.run('state.done.includes(1292)'),true);
});
test('storage failure displays an honest status without preventing learning',()=>{
 const a=boot(null,{blockStorage:true});let warning; a.run('document.body.appendChild = e => window.lastWarning=e');a.run('save()');warning=a.run('window.lastWarning');assert.match(warning.textContent,/cannot be saved/);a.run('start(0)');assert.equal(a.run('lesson'),0);
});

const {checkGates}=require('../scripts/check-release.cjs');
test('production gate fails closed for pending, missing and unsupported signoffs',()=>{
 const m=require('../release-gates.json');assert.equal(checkGates(m).length,8);assert.equal(checkGates({gates:[]}).length,8);
 const approved={gates:m.gates.map(g=>({...g,status:'passed',evidence:'staging report and build reference',reviewer:'Release owner'}))};assert.equal(checkGates(approved).length,0);approved.gates[0].evidence='';assert.equal(checkGates(approved).length,1);
});
