/* Outbound study handoff, not an API integration. Browser query links are
   best-effort; the full copyable prompt is the cross-provider fallback. */
const CandleAI = (() => {
  const providers=[
    {id:'chatgpt',name:'ChatGPT',base:'https://chatgpt.com/',query:'q'},
    {id:'claude',name:'Claude',base:'https://claude.ai/new',query:'q'},
    {id:'gemini',name:'Gemini',base:'https://gemini.google.com/app',query:null},
    {id:'perplexity',name:'Perplexity',base:'https://www.perplexity.ai/search',query:'q'}
  ];
  function prompt(lesson,question,sources={}) {
    if(!lesson||!question||!Array.isArray(question.options)||!Number.isInteger(question.correct)||!question.options[question.correct])throw Error('A revealed, keyed lesson question is required');
    const references=(question.sources||[]).map(id=>sources[id]).filter(Boolean).slice(0,2).map(s=>`${s.title}: ${s.url}`).join('\n');
    return [
      'Act as a patient financial-literacy tutor. Help me understand this Candle lesson in depth, without a calculator.',
      `Lesson: ${lesson.title}\nLearning goal: ${lesson.explain}`,
      `Question: ${question.q}\nChoices:\n${question.options.map((o,i)=>`${String.fromCharCode(65+i)}. ${o}`).join('\n')}`,
      `Candle's keyed answer: ${question.options[question.correct]}\nCandle's explanation: ${question.explain}`,
      'Explain the underlying concept in plain language, then work through why each option is stronger or weaker under the stated assumptions. Use a new everyday qualitative example. Point out important exceptions or oversimplifications; do not assume the keyed answer is beyond criticism. Distinguish established principles from uncertain predictions.',
      'Keep this educational, without personalized investment advice, stock picks or promises of profit. Begin with a clear explanation, then ask me one short check-for-understanding question and wait for my reply. No calculator exercises.',
      references?'Background references (verify before citing):\n'+references:''
    ].filter(Boolean).join('\n\n');
  }
  function destination(providerId,text) {
    const provider=providers.find(p=>p.id===providerId);
    if(!provider)throw Error('Unknown provider');
    const url=new URL(provider.base);
    if(provider.query)url.searchParams.set(provider.query,text);
    const prefilled=Boolean(provider.query)&&url.href.length<=7500;
    return {url:prefilled?url.href:provider.base,prefilled,copyFirst:!prefilled};
  }
  return {providers,prompt,destination};
})();
if(typeof module!=='undefined')module.exports=CandleAI;
