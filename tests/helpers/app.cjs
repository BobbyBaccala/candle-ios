const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function boot(saved,options={}) {
  const storage=new Map(saved?[['candle-browser-v2',JSON.stringify(saved)]]:[]);
  function element(){return {innerHTML:'',textContent:'',style:{setProperty(){}},dataset:{},classList:{toggle(){}},setAttribute(){},appendChild(){},addEventListener(){},insertAdjacentElement(){},querySelector(){return element()}}}
  const elements=Object.fromEntries(['app','nav','xpTop','energyTop'].map(id=>[id,element()]));
  const alerts=[];
  const context=vm.createContext({console,Date,Math,JSON,Number,String,Boolean,Object,Array,Set,Map,
    localStorage:{getItem:k=>{if(options.blockStorage)throw Error('Storage denied');return storage.get(k)||null},setItem:(k,v)=>{if(options.blockStorage)throw Error('Storage denied');storage.set(k,v)}},
    document:{getElementById:id=>elements[id]||null,createElement:element,body:element(),readyState:'loading',addEventListener(){}},
    window:{},navigator:{},URL,location:{origin:'http://localhost',pathname:'/',protocol:'http:',href:'http://localhost/'},confirm:()=>true,setInterval(){},setTimeout(){},alert:x=>alerts.push(x)});
  const root=path.join(__dirname,'../..');
  const html=options.html||fs.readFileSync(path.join(root,'index.html'),'utf8');
  for(const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
    const src=match[1].match(/src="([^"]+)"/)?.[1];
    if(src?.startsWith('https:'))continue;
    const script=src?fs.readFileSync(path.join(root,src),'utf8'):match[2];
    if(script.trim())vm.runInContext(script,context);
  }
  return {run:code=>vm.runInContext(code,context),elements,storage,alerts};
}

module.exports={boot};
