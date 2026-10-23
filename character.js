/* Original vector characters: smaller heads, tailored silhouettes and visible
   hands. Rank-locked wardrobes remain inside a padded 160 × 240 frame. */
const CandleCharacter = (() => {
  const wardrobe=[
    {name:'First Day on Wall Street',rank:0,kind:'suit',coat:'#202126',pants:'#202126',tie:'#17181c',shoes:'dress'},
    {name:'Budget Goblin Bargain Suit',rank:1,kind:'suit',coat:'#26374c',pants:'#26374c',tie:'#8a4b42',shoes:'dress'},
    {name:'Spreadsheet Pinstripes',rank:2,kind:'pinstripe',coat:'#4b505a',pants:'#4b505a',tie:'#384b62',shoes:'dress'},
    {name:'Market Muncher Double-Breasted',rank:3,kind:'double',coat:'#30313b',pants:'#30313b',tie:'#6c5b80',shoes:'dress'},
    {name:'Side Quest Blazer',rank:4,kind:'blazer',coat:'#3c5147',pants:'#b6a58a',tie:null,shoes:'loafers'},
    {name:'Chart Goblin Finance Vest',rank:5,kind:'vest',coat:'#374c43',pants:'#555b69',tie:null,shoes:'loafers'},
    {name:'Diamond Hands Dinner Suit',rank:6,kind:'tux',coat:'#272938',pants:'#272938',tie:'#b6bec9',shoes:'dress'},
    {name:'Portfolio Wizard Tweed',rank:7,kind:'tweed',coat:'#796a52',pants:'#494b48',tie:'#6d5448',shoes:'loafers'},
    {name:'Yieldmaxxer Quarter Zip',rank:8,kind:'quarterzip',coat:'#536d77',pants:'#b7a58b',tie:null,shoes:'loafers'},
    {name:'Risk Management Power Suit',rank:9,kind:'double',coat:'#283441',pants:'#283441',tie:'#ad4f4b',shoes:'dress'},
    {name:'Quant Brainrot Offsite',rank:10,kind:'quarterzip',coat:'#343d53',pants:'#878b7c',tie:null,shoes:'flipflops'},
    {name:'Ultra Giga Chad Friday',rank:11,kind:'linen',coat:'#e6dcc9',pants:'#b5ab95',tie:null,shoes:'flipflops'}
  ];
  const choices={
    skin:['#f6d8bd','#e7b78f','#cc916a','#b87550','#905b40','#704634','#50362c','#f2c6ae'],
    hair:['#25212b','#55372b','#95603c','#d4a65c','#dfd9d0','#a44b41','#615187','#266759'],
    eyes:['#29394c','#3d6a7d','#75503c','#4b7651','#685384'],
    outfit:['#197e64','#6460a6','#d27d50','#3b719b','#b95d7b','#343c50','#c49b44','#7b638c'],
    background:['#e2eee6','#e1eaf3','#f3e8d8','#ebe2f2','#dcece9'],
    hairStyle:['Sweep','Curls','Crop','Long waves','Coils','Buzz','Twin buns','Bob','Bald'],
    accessory:['None','Round glasses','Cap','Studs','Headphones','Scarf'],
    expression:['Smile','Calm','Curious','Wink'],
    face:['Soft','Round','Angular'],
    clothing:wardrobe.map(item=>item.name),
    brows:['Soft','Straight','Arched']
  };
  function unlocked(index,rank=0){return Number.isInteger(index)&&index>=0&&index<wardrobe.length&&wardrobe[index].rank<=Math.max(0,rank)}
  function normalized(value={},rank=0) {
    const result={...value};
    for(const [key,values] of Object.entries(choices))result[key]=Number.isInteger(value[key])&&value[key]>=0&&value[key]<values.length?value[key]:0;
    if(!unlocked(result.clothing,rank))result.clothing=0;
    return result;
  }
  function svg(value,size=120,rank=0) {
    const v=normalized(value,rank),skin=choices.skin[v.skin],hair=choices.hair[v.hair],outfit=choices.outfit[v.outfit],iris=choices.eyes[v.eyes],bg=choices.background[v.background],fit=wardrobe[v.clothing];
    const stroke='stroke="#3d3438" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
    const long=v.hairStyle===3||v.hairStyle===7;
    const back=long?`<path d="M42 68Q32 18 80 20Q127 17 120 73L124 125Q112 138 101 121L59 122Q45 137 34 123Z" fill="${hair}"/>`:'';
    const head=[`M47 53Q47 29 80 29Q113 29 113 53L111 82Q109 109 80 112Q51 109 49 82Z`,`M44 62Q43 28 80 28Q117 28 116 62L113 84Q109 111 80 113Q51 111 47 84Z`,`M48 53Q49 29 80 29Q111 29 112 53L109 88L96 106L80 114L64 106L51 88Z`][v.face];
    const hairFront=[
      'M45 64Q34 27 65 22Q99 8 116 39L115 66L104 53L98 36Q74 59 50 48Z',
      'M43 61Q31 51 40 39Q32 24 49 24Q51 10 66 19Q78 6 90 18Q109 9 115 29Q132 36 118 60L107 51Q79 37 51 53Z',
      'M46 52Q40 21 79 23Q119 21 114 53L105 45Q77 34 50 51Z',
      'M44 64Q38 24 77 22Q116 17 118 63L109 54Q96 37 92 33Q73 53 47 55Z',
      'M41 63Q30 57 37 45Q29 32 42 28Q38 13 54 17Q59 6 71 16Q82 7 93 16Q110 9 116 24Q131 24 125 40Q134 53 119 63L109 52Q82 40 51 52Z',
      'M47 49Q47 25 80 25Q112 25 113 49Q80 33 47 49Z',
      'M46 59Q40 31 66 25Q82 18 103 28Q120 37 114 60L104 47Q78 40 52 50Z',
      'M43 65Q34 20 79 21Q126 19 117 68L108 53L104 42Q74 54 47 54Z',
      ''
    ][v.hairStyle];
    const buns=v.hairStyle===6?`<circle cx="43" cy="30" r="17" fill="${hair}"/><circle cx="117" cy="30" r="17" fill="${hair}"/>`:'';
    const brows=[['M58 61Q64 57 70 60','M90 60Q96 57 102 61'],['M58 59L70 59','M90 59L102 59'],['M57 61Q63 53 71 59','M89 59Q97 53 103 61']][v.brows];
    const leftEye=v.expression===3?'<path d="M58 73Q64 68 70 73" fill="none" stroke="#39353e" stroke-width="2.6" stroke-linecap="round"/>':`<ellipse cx="64" cy="72" rx="7" ry="6.5" fill="#fffdf9"/><circle cx="65" cy="72" r="4" fill="${iris}"/><circle cx="66" cy="70" r="1.2" fill="white"/>`;
    const mouth=v.expression===1?'<path d="M73 94Q80 98 87 94" stroke="#905452" stroke-width="2.2" fill="none" stroke-linecap="round"/>':v.expression===2?'<ellipse cx="80" cy="96" rx="4" ry="5" fill="#925353"/>':'<path d="M69 91Q80 106 91 91Z" fill="#884c4b"/><path d="M72 93L88 93" stroke="#fff8ee" stroke-width="3"/>';
    const clothes=clothing(fit,skin);
    const accessories=[ '',
      '<g stroke="#393641" stroke-width="2.5" fill="none"><circle cx="64" cy="73" r="12"/><circle cx="96" cy="73" r="12"/><path d="M76 72Q80 68 84 72M52 70L45 67M108 70L115 67"/></g>',
      `<path d="M43 47Q43 15 80 15Q115 15 116 48Z" fill="${outfit}"/><path d="M45 47Q81 40 123 49Q113 58 86 53Z" fill="${outfit}" stroke="#3d3438" stroke-width="1.5"/><path d="M80 18V39" stroke="#ffffff70" stroke-width="2"/>`,
      '<circle cx="45" cy="88" r="3.5" fill="#d4ae57"/><circle cx="115" cy="88" r="3.5" fill="#d4ae57"/>',
      `<path d="M39 75V55Q38 13 80 13Q122 13 121 55V75" fill="none" stroke="#424558" stroke-width="7"/><rect x="32" y="62" width="14" height="29" rx="7" fill="${outfit}"/><rect x="114" y="62" width="14" height="29" rx="7" fill="${outfit}"/>`,
      '<path d="M61 114Q80 124 99 114L100 125Q80 134 59 124Z" fill="#dcaa65"/><path d="M90 126L100 128L98 151L88 148Z" fill="#dcaa65"/>'
    ][v.accessory];
    return `<svg class="avatar-svg character-v3" width="${size}" height="${Math.round(size*1.5)}" viewBox="0 0 160 240" role="img" aria-label="Your custom Candle character in ${fit.name}"><rect x="4" y="4" width="152" height="232" rx="42" fill="${bg}"/><ellipse cx="80" cy="225" rx="39" ry="5" fill="#293f3a15"/>${clothes}<g data-part="head" transform="translate(24 5) scale(.7)">${back}<ellipse cx="46" cy="76" rx="7" ry="11" fill="${skin}"/><ellipse cx="114" cy="76" rx="7" ry="11" fill="${skin}"/><path d="${head}" fill="${skin}"/><path d="M80 76L76 86Q80 89 84 86" fill="none" stroke="#654b443f" stroke-width="2" stroke-linecap="round"/><ellipse cx="56" cy="85" rx="7" ry="3.5" fill="#ce716e25"/><ellipse cx="104" cy="85" rx="7" ry="3.5" fill="#ce716e25"/>${buns}<path d="${hairFront}" fill="${hair}"/>${brows.map(d=>`<path d="${d}" stroke="${hair}" stroke-width="2.7" fill="none" stroke-linecap="round"/>`).join('')}${leftEye}<ellipse cx="96" cy="72" rx="7" ry="6.5" fill="#fffdf9"/><circle cx="95" cy="72" r="4" fill="${iris}"/><circle cx="96" cy="70" r="1.2" fill="white"/>${mouth}${accessories}</g></svg>`;
  }
  function clothing(fit,skin){
    const casual=['quarterzip','vest'].includes(fit.kind),shorts=fit.kind==='linen',coat=fit.coat,pants=fit.pants;
    const legs=shorts?`<path d="M56 158H104L108 187H86L81 174L76 187H53Z" fill="${pants}"/><path d="M57 187H74L73 215H56ZM87 187H104L105 215H87Z" fill="${skin}"/>`:`<path d="M55 157H105L104 213H86L80 170L74 213H55Z" fill="${pants}"/><path d="M80 168L77 195M63 170V204M96 170V204" fill="none" stroke="#00000024" stroke-width="1.5"/>`;
    const feet=fit.shoes==='flipflops'?`<g data-part="flipflops"><path d="M54 209H73V221H47Q44 216 54 209ZM87 209H106Q117 213 113 221H87Z" fill="${skin}"/><path d="M48 222H74M86 222H114" stroke="#353a3a" stroke-width="4" stroke-linecap="round"/><path d="M51 215L61 211L69 218M91 218L100 211L110 216" fill="none" stroke="#585a49" stroke-width="3"/></g>`:`<path d="M54 209H74V222H47Q43 216 54 209ZM86 209H106Q118 214 113 222H86Z" fill="${fit.shoes==='dress'?'#27292d':'#725641'}"/><path d="M48 221H74M86 221H113" stroke="#191d21" stroke-width="2"/>`;
    const sleeves=`<path d="M53 97Q41 100 37 121L32 148L44 151L57 120M107 97Q119 100 123 121L128 148L116 151L103 120" fill="${fit.kind==='vest'?'#e9e9e0':coat}" stroke="#33353a" stroke-width="1.2"/><path d="M33 146L45 149M115 149L127 146" stroke="#f0eee7" stroke-width="3"/>`;
    const hands=`<g data-part="hands" fill="${skin}" stroke="#634c434d" stroke-width="1"><path d="M34 150L44 152L45 159Q46 166 41 168Q36 171 32 165L31 157Q29 153 32 152L35 157Z"/><path d="M126 150L116 152L115 159Q114 166 119 168Q124 171 128 165L129 157Q131 153 128 152L125 157Z"/><path d="M35 160L37 166M39 160L40 166M125 160L123 166M121 160L120 166" fill="none"/></g>`;
    let torso='';
    if(casual){
      torso=`<path d="M53 97L68 91H92L107 97L106 160H54Z" fill="${coat}"/><path d="M68 91L70 104L80 110L90 104L92 91" fill="none" stroke="#ffffff8a" stroke-width="2"/><path d="M80 96V126" stroke="#263536" stroke-width="2"/><rect x="78.5" y="105" width="3" height="6" rx="1" fill="#c2c7c5"/><path d="M56 152H104" stroke="#00000025" stroke-width="2"/>`;
      if(fit.kind==='vest')torso+='<path d="M54 98L59 112L59 151M106 98L101 112L101 151" fill="none" stroke="#a8b8ab" stroke-width="2"/><path d="M64 143H73M88 143H97" stroke="#182c25" stroke-width="2"/>';
    }else{
      torso=`<path d="M52 97L67 91H93L108 97L108 163H52Z" fill="${coat}"/><path d="M68 92L80 103L92 92L90 151H70Z" fill="#f5f3eb"/><path d="M68 91L80 102L73 108L65 96M92 91L80 102L87 108L95 96" fill="#fffdf5" stroke="#deded6" stroke-width=".8"/>`;
      if(fit.tie)torso+=`<path data-part="tie" d="M77 101L83 101L85 107L82 112L85 143L80 150L75 143L78 112L75 107Z" fill="${fit.tie}"/>`;
      torso+=`<path d="M67 92L60 109L72 113L67 120L80 151L93 120L88 113L100 109L93 92L104 97L107 161H53L56 97Z" fill="${coat}" stroke="#ffffff29" stroke-width="1"/><path d="M80 150V161" stroke="#0005" stroke-width="1"/><circle cx="84" cy="148" r="1.6" fill="#c4bba6"/>`;
      if(fit.kind==='double')torso+='<path d="M70 115L88 158" stroke="#ffffff30" stroke-width="1.3"/><g fill="#a8a69f"><circle cx="73" cy="140" r="1.7"/><circle cx="90" cy="140" r="1.7"/><circle cx="74" cy="153" r="1.7"/><circle cx="91" cy="153" r="1.7"/></g>';
      if(fit.kind==='pinstripe')torso+='<path d="M56 116V154M62 126V155M99 124V155M104 114V154" stroke="#a4a7ad" stroke-width=".7"/>';
      if(fit.kind==='tweed')torso+='<path d="M55 131H67M93 131H105M57 136H69M91 136H103M58 141H70M90 141H102" stroke="#baa886" stroke-width="1"/>';
      if(fit.kind==='tux')torso+='<path d="M62 108L74 113L69 123L80 149L63 117Z" fill="#586073"/><path d="M98 108L86 113L91 123L80 149L97 117Z" fill="#586073"/><path d="M99 125L103 129L99 133L95 129Z" fill="#c4d5e4"/>';
    }
    return `<g data-part="body"><path d="M72 76H88V96Q80 103 72 96Z" fill="${skin}"/>${legs}${feet}${sleeves}${torso}${hands}</g>`;
  }
  return {choices,wardrobe,unlocked,normalized,svg};
})();
if(typeof module!=='undefined')module.exports=CandleCharacter;
