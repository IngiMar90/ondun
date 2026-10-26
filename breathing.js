export function phaseAt(mode, elapsed, seconds = 4) {
  const labels = mode === 'box' ? ['Anda inn', 'Halda', 'Anda út', 'Halda'] : ['Anda inn', 'Anda út'];
  const cycle = seconds * labels.length;
  const position = ((elapsed % cycle) + cycle) % cycle;
  const index = Math.floor(position / seconds);
  return { index, label: labels[index], fraction: (position % seconds) / seconds, count: Math.max(1, Math.ceil(seconds - position % seconds)), cycleFraction: position / cycle };
}
export function boxPoint(index, fraction) {
  const corners = [[28,28], [292,28], [292,292], [28,292], [28,28]];
  const a = corners[index], b = corners[index + 1];
  return [a[0] + (b[0]-a[0])*fraction, a[1] + (b[1]-a[1])*fraction];
}
export function timeLabel(seconds) { const s = Math.max(0, Math.ceil(seconds)); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }
