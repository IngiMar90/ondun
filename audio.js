// Gentle, locally generated breath sounds; no microphone, downloads or recordings.
export function makeBreathNoise(context) {
 const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*4),context.sampleRate);
 const data=buffer.getChannelData(0);
 let smooth=0;
 for(let i=0;i<data.length;i++){
  const white=Math.random()*2-1;
  smooth=.97*smooth+.03*white;
  data[i]=.6*white+2*smooth;
 }
 return buffer;
}
export function scheduleBreaths(context,noise,mode,total,offset=0,when=context.currentTime) {
 const nodes=[];
 for(let phase=Math.floor(offset/4);phase*4<total;phase++){
  const index=phase%(mode==='box'?4:2);
  const inhale=index===0;
  if(mode==='box' && (index===1||index===3))continue;
  const from=Math.max(offset,phase*4),to=Math.min(total,(phase+1)*4);
  if(to<=from)continue;
  const at=when+from-offset,duration=to-from;
  const source=context.createBufferSource();source.buffer=noise;
  const high=context.createBiquadFilter();high.type='highpass';high.frequency.value=180;
  const low=context.createBiquadFilter();low.type='lowpass';low.Q.value=.6;
  const gain=context.createGain();
  const curve=new Float32Array(96);
  for(let i=0;i<curve.length;i++){
   const fraction=(from-phase*4+duration*i/(curve.length-1))/4;
   const swell=Math.pow(Math.max(0,Math.sin(Math.PI*fraction)),.7);
   curve[i]=swell*(inhale ? .6 : .68)*(inhale ? .65+.35*fraction : 1-.3*fraction);
  }
  // Short fades also protect partial phases on resuming or session completion.
  curve[0]=0;curve[curve.length-1]=0;
  gain.gain.setValueCurveAtTime(curve,at,duration);
  const startHz=inhale?650:1450,endHz=inhale?1900:450;
  const f0=(from-phase*4)/4,f1=(to-phase*4)/4;
  low.frequency.setValueAtTime(startHz+(endHz-startHz)*f0,at);
  low.frequency.linearRampToValueAtTime(startHz+(endHz-startHz)*f1,at+duration);
  source.connect(high).connect(low).connect(gain).connect(context.destination);
  source.onended=()=>{source.disconnect();high.disconnect();low.disconnect();gain.disconnect();};
  source.start(at,from-phase*4,duration);source.stop(at+duration);
  nodes.push(source);
 }
 return nodes;
}
export class BreathingAudio {
 constructor(){this.context=null;this.noise=null;this.nodes=[];this.active=false;}
 async prepare(){
  try{
   const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;
   if(!Audio)return false;
   if(!this.context){this.context=new Audio();this.noise=makeBreathNoise(this.context);}
   if(this.context.state!=='running')await this.context.resume();
   return this.context.state==='running';
  }catch{return false;}
 }
 play(mode,total,offset=0){
  this.stop();
  if(!this.context || this.context.state==='closed')return;
  if(this.context.state!=='running')this.context.resume().catch(()=>{});
  this.base=this.context.currentTime+.025;this.offset=offset;
  try{this.nodes=scheduleBreaths(this.context,this.noise,mode,total,offset,this.base);this.active=true;}catch{this.stop();}
 }
 position(){return this.offset+Math.max(0,this.context.currentTime-this.base);}
 stop(){
  this.active=false;
  for(const source of this.nodes){try{source.stop();}catch{}}
  this.nodes=[];
 }
}
