import { useEffect, useRef, useState } from 'react';

// A small replay of how the table model writes a table: one OTSL token per
// cell (C = new cell, L = merge left, U = merge up, NL = end of row).
// Twice a candidate is masked out by the grammar before it can be emitted.

const ROWS = [
  ['C', 'L', 'L', 'C', 'C'],
  ['C', 'C', 'C', 'C', 'C'],
  ['C', 'C', 'C', 'C', 'C'],
  ['U', 'C', 'C', 'C', 'C'],
];
const REJECT = {
  '0-0': { token: 'U', why: 'no cell above row 0' },
  '1-0': { token: 'L', why: 'no cell left of column 0' },
};

const steps = [];
ROWS.forEach((row, r) => {
  row.forEach((tok, c) => {
    const rej = REJECT[`${r}-${c}`];
    if (rej) steps.push({ r, c, tok: rej.token, rejected: rej.why });
    steps.push({ r, c, tok });
  });
  steps.push({ r, c: ROWS[0].length, tok: 'NL' });
});

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function OtslDecoder() {
  const box = useRef(null);
  const [step, setStep] = useState(() => (reduced() ? steps.length : 0));
  const [live, setLive] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.4 });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live || reduced()) return undefined;
    const cur = steps[step];
    const wait = step >= steps.length ? 2600 : cur?.rejected ? 1300 : cur?.tok === 'NL' ? 380 : 210;
    const id = setTimeout(() => setStep((s) => (s >= steps.length ? 0 : s + 1)), wait);
    return () => clearTimeout(id);
  }, [live, step]);

  const emitted = steps.slice(0, step).filter((s) => !s.rejected);
  const placed = new Set(emitted.filter((s) => s.tok !== 'NL').map((s) => `${s.r}-${s.c}`));
  const pending = steps[step];

  return (
    <div className="otsl" ref={box}>
      <div className="otsl-grid" style={{ gridTemplateColumns: `repeat(${ROWS[0].length}, 1fr)` }}>
        {ROWS.map((row, r) =>
          row.map((tok, c) => {
            const on = placed.has(`${r}-${c}`);
            const cls = ['otsl-cell', on && 'on', tok === 'L' && 'merge-l', tok === 'U' && 'merge-u'];
            return (
              <div key={`${r}-${c}`} className={cls.filter(Boolean).join(' ')}>
                <span>{on ? tok : ''}</span>
              </div>
            );
          }),
        )}
      </div>
      <div className="otsl-tape" aria-label="Decoded token sequence">
        {emitted.map((s, i) => (
          <span key={i} className={s.tok === 'NL' ? 'nl' : s.tok === 'C' ? '' : 'merge'}>
            {s.tok}
          </span>
        ))}
        {pending?.rejected ? (
          <span className="rejected" title={pending.rejected}>
            {pending.tok}
          </span>
        ) : (
          <span className="caret" />
        )}
      </div>
      <p className="otsl-note">
        {pending?.rejected ? (
          <>
            <b>Masked:</b> {pending.tok}, {pending.rejected}
          </>
        ) : step >= steps.length ? (
          'Done. The grammar guarantees a valid table, every time.'
        ) : (
          'Decoding row by row. Illegal tokens are masked before sampling.'
        )}
      </p>
    </div>
  );
}
