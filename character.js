/* Original vector character system. No external imagery, filters, masks or
   duplicated SVG IDs. All accessories remain inside a padded 160 × 200 frame. */
const CandleCharacter = (() => {
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
    clothing:['Crewneck','Hoodie','Jacket'],
    brows:['Soft','Straight','Arched']
  };
  function normalized(value={}) {
    const result={...value};
    for(const [key,values] of Object.entries(choices))result[key]=Number.isInteger(value[key])&&value[key]>=0&&value[key]<values.length?value[key]:0;
    return result;
  }
  function svg(value,size=120) {
    const v=normalized(value),skin=choices.skin[v.skin],hair=choices.hair[v.hair],outfit=choices.outfit[v.outfit],iris=choices.eyes[v.eyes],bg=choices.background[v.background];
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
    const clothes=[`<path d="M54 125Q80 139 106 125L112 171H48Z" fill="${outfit}"/><path d="M68 125Q80 141 92 125" fill="none" stroke="#ffffff70" stroke-width="3"/>`,
      `<path d="M53 128Q52 113 65 113L95 113Q108 114 107 128L114 172H46Z" fill="${outfit}"/><path d="M65 120L80 135L95 120M73 137V150M87 137V150M66 158Q80 151 94 158" fill="none" stroke="#ffffff85" stroke-width="2.2"/>`,
      `<path d="M54 124L68 119L80 137L92 119L106 124L113 172H47Z" fill="${outfit}"/><path d="M67 121L80 138L93 121L89 171H71Z" fill="#f8f0e3"/><path d="M80 138V171" stroke="#3d3438" stroke-width="1.5"/>`][v.clothing];
    const accessories=[ '',
      '<g stroke="#393641" stroke-width="2.5" fill="none"><circle cx="64" cy="73" r="12"/><circle cx="96" cy="73" r="12"/><path d="M76 72Q80 68 84 72M52 70L45 67M108 70L115 67"/></g>',
      `<path d="M43 47Q43 15 80 15Q115 15 116 48Z" fill="${outfit}"/><path d="M45 47Q81 40 123 49Q113 58 86 53Z" fill="${outfit}" stroke="#3d3438" stroke-width="1.5"/><path d="M80 18V39" stroke="#ffffff70" stroke-width="2"/>`,
      '<circle cx="45" cy="88" r="3.5" fill="#d4ae57"/><circle cx="115" cy="88" r="3.5" fill="#d4ae57"/>',
      `<path d="M39 75V55Q38 13 80 13Q122 13 121 55V75" fill="none" stroke="#424558" stroke-width="7"/><rect x="32" y="62" width="14" height="29" rx="7" fill="${outfit}"/><rect x="114" y="62" width="14" height="29" rx="7" fill="${outfit}"/>`,
      '<path d="M61 114Q80 124 99 114L100 125Q80 134 59 124Z" fill="#dcaa65"/><path d="M90 126L100 128L98 151L88 148Z" fill="#dcaa65"/>'
    ][v.accessory];
    return `<svg class="avatar-svg character-v2" width="${size}" height="${Math.round(size*1.25)}" viewBox="0 0 160 200" role="img" aria-label="Your custom Candle character"><rect x="4" y="4" width="152" height="192" rx="48" fill="${bg}"/><ellipse cx="80" cy="184" rx="37" ry="6" fill="#293f3a15"/>${back}<path d="M55 163L76 164L74 183H53Z" fill="#3e4558"/><path d="M84 164L105 163L107 183H86Z" fill="#3e4558"/><path d="M51 180H75V189H47Q44 184 51 180ZM85 180H108Q117 184 112 189H85Z" fill="#fff9f0" ${stroke}/><path d="M52 128Q37 132 35 159Q39 168 45 160L55 144M107 128Q121 132 125 159Q122 168 115 160L105 144" fill="${skin}" ${stroke}/><path d="M69 105H91V125Q80 133 69 125Z" fill="${skin}"/>${clothes}<ellipse cx="46" cy="76" rx="7" ry="11" fill="${skin}"/><ellipse cx="114" cy="76" rx="7" ry="11" fill="${skin}"/><path d="${head}" fill="${skin}"/><path d="M80 76L76 86Q80 89 84 86" fill="none" stroke="#654b443f" stroke-width="2" stroke-linecap="round"/><ellipse cx="56" cy="85" rx="7" ry="3.5" fill="#ce716e25"/><ellipse cx="104" cy="85" rx="7" ry="3.5" fill="#ce716e25"/>${buns}<path d="${hairFront}" fill="${hair}"/>${brows.map(d=>`<path d="${d}" stroke="${hair}" stroke-width="2.7" fill="none" stroke-linecap="round"/>`).join('')}${leftEye}<ellipse cx="96" cy="72" rx="7" ry="6.5" fill="#fffdf9"/><circle cx="95" cy="72" r="4" fill="${iris}"/><circle cx="96" cy="70" r="1.2" fill="white"/>${mouth}${accessories}</svg>`;
  }
  return {choices,normalized,svg};
})();
if(typeof module!=='undefined')module.exports=CandleCharacter;
