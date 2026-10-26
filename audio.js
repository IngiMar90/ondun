// Pure, steady sine tones with short click-prevention fades only at the edges.
export function makeBell(context,frequency){
 const duration=4;
 const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate);
 const data=buffer.getChannelData(0);
 for(let i=0;i<data.length;i++){
  const t=i/context.sampleRate;
  const attack=Math.min(1,t/.15);
  const fade=Math.min(1,(duration-t)/.12);
  data[i]=.12*Math.sin(2*Math.PI*frequency*t)*attack*fade;
 }
 data[data.length-1]=0;
 return buffer;
}
export function scheduleBreaths(context,buffers,mode,total,offset=0,when=context.currentTime,output=context.destination){
 const nodes=[];
 for(let phase=Math.floor(offset/4);phase*4<total;phase++){
  const index=phase%(mode==='box'?4:2);
  if(mode==='box'&&(index===1||index===3))continue;
  const from=Math.max(offset,phase*4);
  const within=from-phase*4;
  const at=when+from-offset;
  const source=context.createBufferSource();
  source.buffer=index===0?buffers.inhale:buffers.exhale;
  const duration=Math.min(source.buffer.duration-within,total-from);
  if(duration<=0)continue;
  const gain=context.createGain();
  if(within>0){
   gain.gain.setValueAtTime(0,at);
   gain.gain.linearRampToValueAtTime(.85,at+Math.min(.02,duration/3));
  }else gain.gain.setValueAtTime(.85,at);
  // Also fade if the overall session cuts a bell short.
  const fade=Math.min(.02,duration/2);
  gain.gain.setValueAtTime(.85,at+duration-fade);
  gain.gain.linearRampToValueAtTime(0,at+duration);
  source.connect(gain).connect(output);
  source.onended=()=>{source.disconnect();gain.disconnect();};
  source.start(at,within,duration);source.stop(at+duration);
  nodes.push(source);
 }
 return nodes;
}
export class BreathingAudio {
 constructor(){this.context=null;this.buffers=null;this.nodes=[];this.active=false;this.volume=.2;this.master=null;}
 async prepare(){
  try{
   const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;
   if(!Audio)return false;
   if(!this.context){
    this.context=new Audio();
    this.master=this.context.createGain();
    this.master.gain.value=this.volume;
    this.master.connect(this.context.destination);
    this.buffers={inhale:makeBell(this.context,220),exhale:makeBell(this.context,196)};
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
  try{this.nodes=scheduleBreaths(this.context,this.buffers,mode,total,offset,this.base,this.master);this.active=true;}catch{this.stop();}
 }
 setVolume(value){
  this.volume=Math.max(0,Math.min(1,Number(value)||0));
  if(this.master)this.master.gain.setTargetAtTime(this.volume,this.context.currentTime,.03);
 }
 position(){return this.offset+Math.max(0,this.context.currentTime-this.base);}
 stop(){
  this.active=false;
  for(const source of this.nodes){try{source.stop();}catch{}}
  this.nodes=[];
 }
}
