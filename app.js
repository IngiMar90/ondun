import {phaseAt, boxPoint} from './breathing.js';
import {BreathingAudio,volumeRange} from './audio.js';
const $ = id => document.getElementById(id);
let saved = {}; try { saved = JSON.parse(localStorage.getItem('ondun-settings')) || {}; } catch {}
let mode = saved.mode === 'equal' ? 'equal' : 'box';
let minutes = [1,2,3,4,5].includes(saved.minutes) ? saved.minutes : 1;
let soundEnabled=saved.sound!==false;
let volume=typeof saved.volume==='number'&&Number.isFinite(saved.volume)?Math.max(0,Math.min(1,saved.volume)):.2;
let previewId=0,previewTimer=0;
const breathAudio=new BreathingAudio();
let audioReady=false, sessionId=0;
let countdownElapsed=0, countdownAnchor=0;
let status = 'idle', elapsed = 0, anchor = 0, frame = 0, lastPhase = -1, installPrompt;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function configure() {
 document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
 document.querySelectorAll('[data-minutes]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.minutes) === minutes)));
 $('box-visual').hidden = mode !== 'box'; $('balloon-visual').hidden = mode !== 'equal';
 $('sound').checked=soundEnabled;
 const {low,high}=volumeRange(volume);
 const range=low===high?`${Math.round(low*100)}%`:`${Math.round(low*100)}–${Math.round(high*100)}%`;
 $('volume').value=Math.round(volume*100);$('volume-value').textContent=range;
 $('volume').setAttribute('aria-valuetext',range);
 $('volume').disabled=!soundEnabled;$('preview-sound').disabled=!soundEnabled;
 breathAudio.setVolume(volume);
 try { localStorage.setItem('ondun-settings', JSON.stringify({mode, minutes, sound:soundEnabled,volume})); } catch {}
}
function stopPreview(){
 previewId++;clearTimeout(previewTimer);breathAudio.stop();$('preview-sound').textContent='Prófa hljóð';
}
function reset() {
 sessionId++; stopPreview();
 cancelAnimationFrame(frame); status='idle'; elapsed=0; lastPhase=-1;
 $('phase').textContent=''; $('action').textContent='Byrja';
 countdownElapsed=0;$('countdown').hidden=true;$('countdown').textContent='';
 $('trail').style.strokeDashoffset=1; $('dot').setAttribute('cx',28); $('dot').setAttribute('cy',28);
 $('balloon').style.transform='scale(.66)';
}
function route() {
 reset(); const exercise = location.hash === '#aefing';
 $('selection-screen').hidden=exercise; $('exercise-screen').hidden=!exercise;
 configure();
 if(exercise) $('action').focus({preventScroll:true});
 else if(document.activeElement === $('action')) document.querySelector('#choices .primary').focus({preventScroll:true});
}
function draw(t) {
 const p=phaseAt(mode,t);
 if(p.index!==lastPhase){$('phase').textContent=p.label;lastPhase=p.index;}
 if(mode==='box'){
  const [x,y]=boxPoint(p.index,p.fraction);
  $('dot').setAttribute('cx',x);$('dot').setAttribute('cy',y);
  $('trail').style.strokeDashoffset=1-p.cycleFraction;
 } else {
  const expansion=p.index===0?p.fraction:1-p.fraction;
  $('balloon').style.transform=`scale(${reducedMotion.matches ? 1.1 : .66 + .64*expansion})`;
 }
}
function complete(){
 breathAudio.stop();
 cancelAnimationFrame(frame);status='done';$('phase').textContent='Æfingu lokið';
 // Leave the calm screen in place until the student chooses to leave.
}
function tick(now){
 if(status!=='running')return;
 const t=breathAudio.active ? breathAudio.position() : elapsed+(now-anchor)/1000;
 if(t>=minutes*60){complete();return;}
 draw(t);frame=requestAnimationFrame(tick);
}
function enterFullscreen(){
 // Installed apps request fullscreen through the manifest. Browsers that fall
 // back to a window can enter fullscreen after the student's existing click.
 if(document.fullscreenElement || matchMedia('(display-mode: fullscreen)').matches) return;
 if(!document.documentElement.requestFullscreen || document.fullscreenEnabled === false) return;
 try {
  const request = document.documentElement.requestFullscreen({navigationUI:'hide'});
  if(request && typeof request.catch === 'function') request.catch(()=>{});
 } catch {} // Unsupported or denied fullscreen must never block the exercise.
}
function beginExercise(){
 $('countdown').hidden=true;$('countdown').textContent='';
 status='running';elapsed=0;lastPhase=-1;anchor=performance.now();
 if(audioReady)breathAudio.play(mode,minutes*60);
 draw(0);frame=requestAnimationFrame(tick);
}
function countdownTick(now){
 if(status!=='countdown')return;
 const t=countdownElapsed+(now-countdownAnchor)/1000;
 if(t>=3){beginExercise();return;}
 $('countdown').textContent=String(Math.ceil(3-t));
 frame=requestAnimationFrame(countdownTick);
}
function beginCountdown(){
 countdownElapsed=0;countdownAnchor=performance.now();
 $('countdown').textContent='3';$('countdown').hidden=false;
 status=document.hidden?'countdown-suspended':'countdown';
 if(status==='countdown')frame=requestAnimationFrame(countdownTick);
}
async function start(){
 const session=++sessionId;
 status='starting';$('action').textContent='Enda';
 // Unlock sound in the original click; countdown itself remains silent.
 const ready=soundEnabled ? breathAudio.prepare() : Promise.resolve(false);
 enterFullscreen();
 const prepared=await ready;
 if(session!==sessionId||status!=='starting')return;
 audioReady=prepared;
 beginCountdown();
}
$('sound').addEventListener('change',()=>{soundEnabled=$('sound').checked;if(!soundEnabled)stopPreview();configure();});
$('volume').addEventListener('input',()=>{volume=Number($('volume').value)/100;configure();});
$('preview-sound').addEventListener('click',async()=>{
 if($('preview-sound').textContent==='Stöðva hljóð'){stopPreview();return;}
 const preview=++previewId;$('preview-sound').textContent='Stöðva hljóð';
 const ready=await breathAudio.prepare();
 if(preview!==previewId)return;
 if(!ready){$('preview-sound').textContent='Prófa hljóð';return;}
 breathAudio.play('equal',8);
 previewTimer=setTimeout(stopPreview,8100);
});
$('choices').addEventListener('submit',event=>{event.preventDefault();enterFullscreen();location.hash='aefing';});
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;configure();}));
document.querySelectorAll('[data-minutes]').forEach(b=>b.addEventListener('click',()=>{minutes=Number(b.dataset.minutes);configure();}));
$('action').addEventListener('click',()=>{
 if(status==='idle')start();
 else { history.replaceState(null,'',location.pathname+location.search);route(); }
});
window.addEventListener('hashchange',route);
// Hidden tabs pause silently; returning continues from the same point.
document.addEventListener('visibilitychange',()=>{
 if(document.hidden&&!$('selection-screen').hidden)stopPreview();
 if(document.hidden&&status==='countdown'){
  countdownElapsed+=(performance.now()-countdownAnchor)/1000;
  status='countdown-suspended';cancelAnimationFrame(frame);
 }else if(!document.hidden&&status==='countdown-suspended'){
  status='countdown';countdownAnchor=performance.now();
  frame=requestAnimationFrame(countdownTick);
 }else if(document.hidden&&status==='running'){
  elapsed=Math.min(minutes*60,breathAudio.active ? breathAudio.position() : elapsed+(performance.now()-anchor)/1000);
  breathAudio.stop();
  status='suspended';cancelAnimationFrame(frame);
 }else if(!document.hidden&&status==='suspended'){
  status='running';anchor=performance.now();
  if(audioReady)breathAudio.play(mode,minutes*60,elapsed);
  frame=requestAnimationFrame(tick);
 }
});
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
window.addEventListener('appinstalled',()=>{$('install').hidden=true;installPrompt=null;});
if(matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone)$('install').hidden=true;
$('install').addEventListener('click',async()=>{
 if(installPrompt){const prompt=installPrompt;installPrompt=null;await prompt.prompt();return;}
 $('install-help').showModal();
});
$('close-help').addEventListener('click',()=>{$('install-help').close();});
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
route();
