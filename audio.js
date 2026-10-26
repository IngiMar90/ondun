// Soft bell cues made locally with Web Audio; no recordings or network requests.
export function makeBell(context,frequency){
 const duration=1.8;
 const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate);
 const data=buffer.getChannelData(0);
 for(let i=0;i<data.length;i++){
  const t=i/context.sampleRate;
  const attack=Math.min(1,t/.025);
  const fade=Math.min(1,(duration-t)/.25);
  const fundamental=.28*Math.sin(2*Math.PI*frequency*t)*Math.exp(-t/.55);
  const overtone=.055*Math.sin(2*Math.PI*frequency*2.01*t)*Math.exp(-t/.3);
  data[i]=(fundamental+overtone)*attack*fade;
 }
 data[data.length-1]=0;
 return buffer;
}
export function scheduleBreaths(context,buffers,mode,total,offset=0,when=context.currentTime){
 const nodes=[];
 for(let phase=Math.ceil(offset/4);phase*4<total;phase++){
  const index=phase%(mode==='box'?4:2);
  if(mode==='box'&&(index===1||index===3))continue;
  const at=when+phase*4-offset;
  const source=context.createBufferSource();
  source.buffer=index===0?buffers.inhale:buffers.exhale;
  const duration=Math.min(source.buffer.duration,total-phase*4);
  if(duration<=0)continue;
  const gain=context.createGain();
  gain.gain.setValueAtTime(.85,at);
  // Also fade if the overall session cuts a bell short.
  const fade=Math.min(.02,duration/2);
  gain.gain.setValueAtTime(.85,at+duration-fade);
  gain.gain.linearRampToValueAtTime(0,at+duration);
  source.connect(gain).connect(context.destination);
  source.onended=()=>{source.disconnect();gain.disconnect();};
  source.start(at,0,duration);source.stop(at+duration);
  nodes.push(source);
 }
 return nodes;
}
export class BreathingAudio {
 constructor(){this.context=null;this.buffers=null;this.nodes=[];this.active=false;}
 async prepare(){
  try{
   const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;
   if(!Audio)return false;
   if(!this.context){
    this.context=new Audio();
    this.buffers={inhale:makeBell(this.context,660),exhale:makeBell(this.context,528)};
   }
   if(this.context.state!=='running')await this.context.resume();
   return this.context.state==='running';
  }catch{return false;}
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
