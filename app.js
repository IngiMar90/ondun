import {phaseAt, boxPoint, timeLabel} from './breathing.js';
const $ = id => document.getElementById(id);
let saved = {}; try { saved = JSON.parse(localStorage.getItem('ondun-settings')) || {}; } catch {}
let mode = saved.mode === 'equal' ? 'equal' : 'box';
let minutes = [1,2,3,4,5].includes(saved.minutes) ? saved.minutes : 1;
let status = 'idle', elapsed = 0, anchor = 0, frame = 0, lastPhase = -1, installPrompt;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function persist() { try { localStorage.setItem('ondun-settings', JSON.stringify({mode, minutes})); } catch {} }
function configure() {
 document.querySelectorAll('[data-mode]').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.mode === mode)); b.disabled = status === 'running' || status === 'paused'; });
 document.querySelectorAll('[data-minutes]').forEach(b => { b.setAttribute('aria-pressed', String(Number(b.dataset.minutes) === minutes)); b.disabled = status === 'running' || status === 'paused'; });
 $('box-visual').hidden = mode !== 'box'; $('balloon-visual').hidden = mode !== 'equal';
 $('rhythm').textContent = mode === 'box' ? '4 sek. inn · 4 halda · 4 út · 4 halda' : '4 sek. inn · 4 sek. út';
 $('progress').max = minutes * 60;
 $('remaining').textContent = timeLabel(minutes * 60 - elapsed);
}
function draw(t) {
 const p = phaseAt(mode, t);
 if (p.index !== lastPhase) { $('phase').textContent = p.label; lastPhase = p.index; }
 $('count').textContent = p.count;
 document.querySelectorAll('[data-phase]').forEach(e => e.classList.toggle('active', Number(e.dataset.phase) === p.index));
 const [x,y] = boxPoint(mode === 'box' ? p.index : 0, p.fraction);
 $('dot').setAttribute('cx', x); $('dot').setAttribute('cy', y);
 $('trail').style.strokeDashoffset = 1 - p.cycleFraction;
 // A reduced-motion setting keeps the balloon still; text and countdown remain available.
 const expansion = p.index === 0 ? p.fraction : 1-p.fraction;
 $('balloon').style.transform = `scale(${reducedMotion.matches ? .85 : .66 + .34*expansion})`;
 $('remaining').textContent = timeLabel(minutes*60-t); $('progress').value = t;
}
function tick(now) {
 if (status !== 'running') return;
 const t = elapsed + (now-anchor)/1000;
 if (t >= minutes*60) { finish(true); return; }
 draw(t); frame = requestAnimationFrame(tick);
}
function start() {
 if (status === 'running') { pause(); return; }
 if (status !== 'paused') elapsed = 0;
 status = 'running'; lastPhase = -1; anchor = performance.now();
 document.body.classList.add('running'); $('start').textContent = 'Gera hlé'; $('stop').hidden = false;
 $('state-label').textContent = 'Tími eftir'; configure(); draw(elapsed); frame = requestAnimationFrame(tick);
}
function pause() {
 if(status !== 'running') return;
 elapsed = Math.min(minutes*60, elapsed+(performance.now()-anchor)/1000); status='paused'; cancelAnimationFrame(frame);
 $('phase').textContent='Í hléi'; $('count').textContent=''; $('start').textContent='Halda áfram'; $('state-label').textContent='Andaðu eðlilega í hléinu';
 $('remaining').textContent=timeLabel(minutes*60-elapsed); $('progress').value=elapsed;
}
function finish(completed) {
 cancelAnimationFrame(frame); status='done'; elapsed = completed ? minutes*60 : 0;
 document.body.classList.remove('running'); configure();
 $('phase').textContent=completed ? 'Vel gert.' : 'Stundinni lokið'; $('count').textContent='';
 $('start').textContent='Byrja aftur'; $('stop').hidden=true; $('progress').value=elapsed;
 $('state-label').textContent=completed ? 'Æfingu lokið' : 'Andaðu eðlilega';
 document.querySelectorAll('[data-phase]').forEach(e=>e.classList.remove('active'));
}
function reset() {
 status='idle'; elapsed=0; lastPhase=-1; $('phase').textContent='Tilbúin?'; $('count').textContent='4';
 $('start').innerHTML='Byrja æfingu <span aria-hidden="true">→</span>'; $('state-label').textContent='Þín stund'; $('progress').value=0;
 $('trail').style.strokeDashoffset=1; $('dot').setAttribute('cx',28); $('dot').setAttribute('cy',28); $('balloon').style.transform='scale(.66)'; configure(); persist();
}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{ mode=b.dataset.mode; reset(); }));
document.querySelectorAll('[data-minutes]').forEach(b=>b.addEventListener('click',()=>{ minutes=Number(b.dataset.minutes); reset(); }));
$('start').addEventListener('click',start); $('stop').addEventListener('click',()=>finish(false));
document.addEventListener('visibilitychange',()=>{if(document.hidden) pause();});
if (!document.documentElement.requestFullscreen) $('fullscreen').hidden=true;
$('fullscreen').addEventListener('click',async()=>{try {if(document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen();}catch{}});
document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'Minnka skjá':'Fylla skjá';});
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
window.addEventListener('appinstalled',()=>{$('install').hidden=true; installPrompt=null;});
if(matchMedia('(display-mode: standalone)').matches || navigator.standalone) $('install').hidden=true;
$('install').addEventListener('click',async()=>{
 if(installPrompt){const prompt=installPrompt;installPrompt=null;await prompt.prompt();return;}
 $('install-help').showModal();
});
$('close-help').addEventListener('click',()=>{$('install-help').close();});
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
configure();
