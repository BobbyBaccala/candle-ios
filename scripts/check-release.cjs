const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
function checkGates(manifest){
 const expected=['Independent curriculum review','Staging migrations and restore drill','Email callbacks, follows, blocking and deletion','Signed iOS build and real-device accessibility','Notification permission and timezone testing','StoreKit purchase, restore, refund and expiry','Published privacy/support pages and App Store disclosures','TestFlight acceptance and rollback rehearsal'];
 return expected.filter(name=>{const matches=manifest.gates?.filter(g=>g.name===name)||[];return matches.length!==1||matches[0].status!=='passed'||!matches[0].evidence?.trim()||!matches[0].reviewer?.trim()});
}
if(require.main===module){
 const gates=checkGates(JSON.parse(fs.readFileSync(path.join(root,'release-gates.json'),'utf8')));
 if(process.argv.includes('--production')){if(gates.length){console.error('PRODUCTION BLOCKED: '+gates.join('; '));process.exitCode=1}else console.log('Recorded release gates passed. Confirm evidence applies to the submitted build.');}
 else{
  const {buildPreview}=require('./build-preview.cjs');const html=buildPreview();
  if(/<script[^>]+src="(?!https:)/.test(html)||/<link[^>]+href="(?!https:)/.test(html))throw Error('Download still depends on local assets');
  const bytes=Buffer.byteLength(html);if(bytes>800000)throw Error('Preview exceeds the 800 kB uncompressed budget');
  const report={kind:'browser-preview',bytes,sha256:crypto.createHash('sha256').update(html).digest('hex'),productionReady:gates.length===0,pendingGates:gates};
  console.log(JSON.stringify(report,null,2));
 }
}
module.exports={checkGates};
