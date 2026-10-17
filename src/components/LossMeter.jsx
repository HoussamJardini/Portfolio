import { useMemo } from 'react';

// Reading progress, drawn as a training-loss curve: the further you read,
// the lower the loss.
const W = 132;
const H = 34;
const N = 90;
const loss = (x, i) => 2.35 * Math.exp(-4.4 * x) + 0.035 + Math.sin(i * 2.7) * 0.05 * Math.exp(-2.5 * x);

export default function LossMeter({ progress, label }) {
  const pts = useMemo(
    () =>
      Array.from({ length: N + 1 }, (_, i) => {
        const x = i / N;
        return [x * W, H - 2 - (loss(x, i) / 2.45) * (H - 4)];
      }),
    [],
  );
  const upto = Math.max(1, Math.round(progress * N));
  const seen = pts.slice(0, upto + 1);
  const value = loss(progress, upto).toFixed(3);
  const [hx, hy] = seen[seen.length - 1];

  return (
    <div className="loss" aria-hidden="true">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <polyline points={pts.map((p) => p.join(',')).join(' ')} className="loss-ghost" />
        <polyline points={seen.map((p) => p.join(',')).join(' ')} className="loss-line" />
        <circle cx={hx} cy={hy} r="2.6" className="loss-head" />
      </svg>
      <div className="loss-text">
        <span>
          loss <b>{value}</b>
        </span>
        <span>{label}</span>
      </div>
    </div>
  );
}
