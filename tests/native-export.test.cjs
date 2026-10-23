const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const {reviewPack}=require('../scripts/export-editorial-review.cjs');
test('native export preserves every lesson and answer with HTTPS sources',()=>{
 execFileSync(process.execPath,['scripts/export-ios.cjs'],{cwd:require('node:path').join(__dirname,'..')});
 const data=JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../ios/Resources/curriculum.json'),'utf8'));
 assert.equal(data.length,1293);assert.equal(new Set(data.map(l=>l.id)).size,1293);
 for(const l of data){assert.ok(typeof l.subject==='string'&&l.subject.length);assert.ok(l.questions.length>=5&&l.questions.length<=8);for(const q of l.questions){assert.ok(q.skill);assert.ok(q.options[q.correct]);assert.ok(q.explanation);assert.ok(q.sources.length);for(const s of q.sources)assert.equal(new URL(s.url).protocol,'https:')}}
});
test('editorial packet covers every placement without inventing approval',()=>{
 const items=reviewPack();assert.equal(items.length,1186);assert.equal(items.reduce((n,i)=>n+i.lessonIds.length,0),7615);
 assert.equal(new Set(items.map(i=>i.fingerprint)).size,items.length);
 assert.ok(items.every(i=>i.review.status==='pending'&&!i.review.reviewer&&i.lessonIds.every(id=>Number.isInteger(id)&&id>=0&&id<1293)));
});
