import {phaseAt, boxPoint} from './breathing.js';
const $ = id => document.getElementById(id);
let saved = {}; try { saved = JSON.parse(localStorage.getItem('ondun-settings')) || {}; } catch {}
let mode = saved.mode === 'equal' ? 'equal' : 'box';
let minutes = [1,2,3,4,5].includes(saved.minutes) ? saved.minutes : 1;
let status = 'idle', elapsed = 0, anchor = 0, frame = 0, lastPhase = -1, installPrompt;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function configure() {
 document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
 document.querySelectorAll('[data-minutes]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.minutes) === minutes)));
 $('box-visual').hidden = mode !== 'box'; $('balloon-visual').hidden = mode !== 'equal';
 try { localStorage.setItem('ondun-settings', JSON.stringify({mode, minutes})); } catch {}
}
function reset() {
 cancelAnimationFrame(frame); status='idle'; elapsed=0; lastPhase=-1;
 $('phase').textContent=''; $('action').textContent='Byrja';
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
  $('balloon').style.transform=`scale(${reducedMotion.matches ? .85 : .66 + .34*expansion})`;
 }
}
function complete(){
 cancelAnimationFrame(frame);status='done';$('phase').textContent='Æfingu lokið';
 // Leave the calm screen in place until the student chooses to leave.
}
function tick(now){
 if(status!=='running')return;
 const t=elapsed+(now-anchor)/1000;
 if(t>=minutes*60){complete();return;}
 draw(t);frame=requestAnimationFrame(tick);
}
function start(){
 status='running';elapsed=0;lastPhase=-1;anchor=performance.now();
 $('action').textContent='Enda';draw(0);frame=requestAnimationFrame(tick);
}
$('choices').addEventListener('submit',event=>{event.preventDefault();location.hash='aefing';});
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;configure();}));
document.querySelectorAll('[data-minutes]').forEach(b=>b.addEventListener('click',()=>{minutes=Number(b.dataset.minutes);configure();}));
$('action').addEventListener('click',()=>{
 if(status==='idle')start();
 else { history.replaceState(null,'',location.pathname+location.search);route(); }
});
window.addEventListener('hashchange',route);
// Hidden tabs pause silently; returning continues from the same point.
document.addEventListener('visibilitychange',()=>{
 if(document.hidden&&status==='running'){
  elapsed=Math.min(minutes*60,elapsed+(performance.now()-anchor)/1000);
  status='suspended';cancelAnimationFrame(frame);
 }else if(!document.hidden&&status==='suspended'){
  status='running';anchor=performance.now();frame=requestAnimationFrame(tick);
 }
});
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
window.addEventListener('appinstalled',()=>{$('install').hidden=true;installPrompt=null;});
if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)$('install').hidden=true;
$('install').addEventListener('click',async()=>{
 if(installPrompt){const prompt=installPrompt;installPrompt=null;await prompt.prompt();return;}
 $('install-help').showModal();
});
$('close-help').addEventListener('click',()=>{$('install-help').close();});
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
route();
