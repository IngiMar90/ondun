import test from 'node:test';
import assert from 'node:assert/strict';
import {phaseAt,boxPoint,timeLabel} from '../breathing.js';
test('box follows inhale, hold, exhale, hold and loops',()=>{
 for(const [t,index,label,count] of [[0,0,'Anda inn',4],[3.9,0,'Anda inn',1],[4,1,'Halda',4],[8,2,'Anda út',4],[12,3,'Halda',4],[16,0,'Anda inn',4]]) {
 const p=phaseAt('box',t); assert.equal(p.index,index); assert.equal(p.label,label); assert.equal(p.count,count);
 }
});
test('equal breathing has no holds',()=>{
 assert.equal(phaseAt('equal',0).label,'Anda inn'); assert.equal(phaseAt('equal',4).label,'Anda út'); assert.equal(phaseAt('equal',8).label,'Anda inn');
});
test('square motion is continuous at all corners',()=>{
 for(let i=0;i<4;i++) assert.deepEqual(boxPoint(i,1),boxPoint((i+1)%4,0));
});
test('time display rounds up remaining seconds and never goes negative',()=>{
 assert.equal(timeLabel(300),'5:00'); assert.equal(timeLabel(59.2),'1:00'); assert.equal(timeLabel(.01),'0:01'); assert.equal(timeLabel(-1),'0:00');
});
