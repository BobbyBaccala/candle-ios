const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function buildPreview(){
  let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  for(const file of ['product-core.js','ai-icons.js','ai-review.js','character.js','curriculum.js','league-core.js','cases.js','case-data.js','case-investing.js','case-trading.js','cloud-config.js','product.js','growth.js','depth-curriculum.js','depth-topics.js','depth-topics-more.js','depth-topics-planning.js','depth-contexts.js','league-emblems.js','reminder-core.js','depth-ui.js']){
    const tag=`<script src="${file}"></script>`,source=fs.readFileSync(path.join(root,file),'utf8');
    if(!html.includes(tag)||/<\/script/i.test(source))throw Error('Unsafe or missing script '+file);
    html=html.replace(tag,()=>`<script>\n${source}\n</script>`);
  }
  html=html.replace('<link rel="stylesheet" href="product.css">',()=>'<style>'+fs.readFileSync(path.join(root,'product.css'),'utf8')+'</style>');
  // A visible marker survives the old theme's hidden subtitle rule.
  html=html.replace('</header><main','</header><div style="text-align:center;padding:10px;color:#36543d;font-size:12px">Candle · Open library & refresher preview</div><main');
  return html;
}
if(require.main===module){
  const destination=process.argv[2];
  if(!destination)throw Error('Provide an output HTML path. Example: node scripts/build-preview.cjs ./preview/index.html');
  fs.mkdirSync(path.dirname(path.resolve(destination)),{recursive:true});fs.writeFileSync(destination,buildPreview());console.log('Built self-contained preview: '+path.resolve(destination));
}
module.exports={buildPreview};
