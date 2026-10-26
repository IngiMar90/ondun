// Real human breathing recordings. Source and CC0 provenance: sounds/SOURCES.md.
export function scheduleBreaths(context,buffers,mode,total,offset=0,when=context.currentTime) {
 const nodes=[];
 for(let phase=Math.floor(offset/4);phase*4<total;phase++){
  const index=phase%(mode==='box'?4:2);
  if(mode==='box' && (index===1||index===3))continue;
  const from=Math.max(offset,phase*4),to=Math.min(total,(phase+1)*4);
  if(to<=from)continue;
  const at=when+from-offset,duration=to-from;
  const source=context.createBufferSource();
  source.buffer=index===0?buffers.inhale:buffers.exhale;
  const gain=context.createGain();
  // Brief edge fades avoid clicks when resuming midway through a recording.
  const fade=Math.min(.02,duration/3);
  gain.gain.setValueAtTime(0,at);
  gain.gain.linearRampToValueAtTime(.85,at+fade);
  gain.gain.setValueAtTime(.85,at+duration-fade);
  gain.gain.linearRampToValueAtTime(0,at+duration);
  source.connect(gain).connect(context.destination);
  source.onended=()=>{source.disconnect();gain.disconnect();};
  source.start(at,from-phase*4,duration);source.stop(at+duration);
  nodes.push(source);
 }
 return nodes;
}
export class BreathingAudio {
 constructor(){this.context=null;this.buffers=null;this.loading=null;this.nodes=[];this.active=false;}
 async prepare(){
  try{
   const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;
   if(!Audio)return false;
   if(!this.context)this.context=new Audio();
   // Resume immediately in the click handler, before waiting for file loading.
   const resumed=this.context.state==='running'?Promise.resolve():this.context.resume().catch(()=>{});
   if(!this.buffers){
    if(!this.loading)this.loading=Promise.all(['inhale','exhale'].map(async name=>{
     const response=await fetch(new URL(`./sounds/${name}.wav`,import.meta.url));
     if(!response.ok)throw new Error('Breathing recording unavailable');
     return this.context.decodeAudioData(await response.arrayBuffer());
    }));
    const [inhale,exhale]=await this.loading;
    this.buffers={inhale,exhale};
   }
   await resumed;
   return this.context.state==='running';
  }catch{this.loading=null;return false;}
 }
 play(mode,total,offset=0){
  this.stop();
  if(!this.context || !this.buffers || this.context.state==='closed')return;
  if(this.context.state!=='running')this.context.resume().catch(()=>{});
  this.base=this.context.currentTime+.025;this.offset=offset;
  try{this.nodes=scheduleBreaths(this.context,this.buffers,mode,total,offset,this.base);this.active=true;}catch{this.stop();}
 }
 position(){return this.offset+Math.max(0,this.context.currentTime-this.base);}
 stop(){
  this.active=false;
  for(const source of this.nodes){try{source.stop();}catch{}}
  this.nodes=[];
 }
}
