// Point-cloud specimens for the hero. Every shape is built from line
// segments (sampled densely) and joints (drawn as larger dots), and every
// shape returns exactly COUNT points so they can morph into each other.

export const COUNT = 2600;

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (v) => Math.hypot(v[0], v[1], v[2]);

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function circle(c, r, n = 28, plane = 'xy', from = 0, to = Math.PI * 2) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = from + ((to - from) * i) / n;
    const u = Math.cos(a) * r;
    const v = Math.sin(a) * r;
    pts.push(plane === 'xz' ? [c[0] + u, c[1], c[2] + v] : [c[0] + u, c[1] + v, c[2]]);
  }
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) segs.push([pts[i], pts[i + 1]]);
  return segs;
}

// segs: [[a,b],...], joints: [[x,y,z, accent?],...]
function build({ segs, joints, seed = 1, jitter = 0.012 }) {
  const rand = rng(seed);
  const out = [];
  const total = segs.reduce((s, [a, b]) => s + len(sub(b, a)), 0);
  const lineCount = COUNT - joints.length;

  for (const j of joints) out.push({ p: [j[0], j[1], j[2]], size: 5.6, accent: j[3] ? 1 : 0 });

  let made = 0;
  segs.forEach(([a, b], i) => {
    const share = len(sub(b, a)) / total;
    const n = i === segs.length - 1 ? lineCount - made : Math.round(share * lineCount);
    for (let k = 0; k < n; k++) {
      const t = rand();
      out.push({
        p: [
          a[0] + (b[0] - a[0]) * t + (rand() - 0.5) * jitter,
          a[1] + (b[1] - a[1]) * t + (rand() - 0.5) * jitter,
          a[2] + (b[2] - a[2]) * t + (rand() - 0.5) * jitter,
        ],
        size: 1 + rand() * 0.7,
        accent: 0,
      });
    }
    made += n;
  });

  // Order points left → right so morphs sweep instead of scrambling.
  const pts = out.slice(0, COUNT);
  pts.sort((m, n) => m.p[0] + m.p[1] * 0.15 - (n.p[0] + n.p[1] * 0.15));
  return pts;
}

// ---- MediaPipe hand: 21 landmarks -------------------------------------
function hand() {
  const L = [
    [0, -0.98], [-0.33, -0.74], [-0.57, -0.47], [-0.74, -0.22], [-0.9, -0.02],
    [-0.29, -0.06], [-0.35, 0.31], [-0.38, 0.56], [-0.4, 0.79],
    [-0.04, -0.01], [-0.05, 0.42], [-0.06, 0.69], [-0.07, 0.94],
    [0.2, -0.07], [0.25, 0.31], [0.28, 0.56], [0.3, 0.77],
    [0.4, -0.2], [0.5, 0.06], [0.56, 0.25], [0.62, 0.42],
  ].map(([x, y], i) => [x * 1.05, y * 1.05, Math.sin(i * 1.7) * 0.08 + (y > 0 ? -y * 0.12 : 0)]);
  const E = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
  ];
  const tips = new Set([4, 8, 12, 16, 20]);
  return build({
    segs: E.map(([a, b]) => [L[a], L[b]]),
    joints: L.map((p, i) => [...p, tips.has(i)]),
    seed: 11,
  });
}

// ---- Table structure: grid with merged cells, tilted --------------------
function table() {
  const cols = [-1.1, -0.55, -0.1, 0.35, 0.75, 1.1];
  const rows = [0.8, 0.5, 0.22, -0.06, -0.34, -0.62, -0.88];
  const tilt = (x, y) => [x, y * 0.92, -y * 0.38];
  const segs = [];
  // horizontal rules
  rows.forEach((y) => segs.push([tilt(cols[0], y), tilt(cols[5], y)]));
  // vertical rules; cols 2,3 skip the header row (span)
  cols.forEach((x, c) => {
    if (c === 2 || c === 3) segs.push([tilt(x, rows[1]), tilt(x, rows[6])]);
    else segs.push([tilt(x, rows[0]), tilt(x, rows[6])]);
  });
  const joints = [];
  for (let r = 1; r < rows.length; r++) {
    for (let c = 1; c < cols.length; c++) {
      if (r === 1 && (c === 2 || c === 3)) continue;
      const cx = (cols[c - 1] + cols[c]) / 2;
      const cy = (rows[r - 1] + rows[r]) / 2;
      joints.push([...tilt(cx, cy), r === 1 && c === 4]);
    }
  }
  joints.push([...tilt((cols[1] + cols[4]) / 2, (rows[0] + rows[1]) / 2), true]);
  return build({ segs, joints, seed: 23, jitter: 0.008 });
}

// ---- Body pose (MediaPipe-style skeleton), mid-squat with arms forward ----
function pose() {
  const P = {
    nose: [0.02, 0.86, 0.05],
    lsh: [-0.27, 0.56, 0], rsh: [0.27, 0.56, 0],
    lel: [-0.42, 0.28, 0.25], rel: [0.42, 0.28, 0.25],
    lwr: [-0.3, 0.2, 0.6], rwr: [0.3, 0.2, 0.6],
    lhip: [-0.18, -0.08, -0.12], rhip: [0.18, -0.08, -0.12],
    lkn: [-0.4, -0.42, 0.28], rkn: [0.4, -0.42, 0.28],
    lan: [-0.36, -0.95, 0.05], ran: [0.36, -0.95, 0.05],
    lft: [-0.42, -0.98, 0.3], rft: [0.42, -0.98, 0.3],
  };
  const E = [
    ['lsh', 'rsh'], ['lsh', 'lel'], ['lel', 'lwr'], ['rsh', 'rel'], ['rel', 'rwr'],
    ['lsh', 'lhip'], ['rsh', 'rhip'], ['lhip', 'rhip'],
    ['lhip', 'lkn'], ['lkn', 'lan'], ['rhip', 'rkn'], ['rkn', 'ran'], ['lan', 'lft'], ['ran', 'rft'],
  ];
  const segs = E.map(([a, b]) => [P[a], P[b]]);
  segs.push(...circle(P.nose, 0.14, 24));
  segs.push([[0, 0.56, 0], [0.02, 0.72, 0.03]]);
  const accent = new Set(['lkn', 'rkn', 'lel', 'rel']);
  return build({
    segs,
    joints: Object.entries(P).map(([k, p]) => [...p, accent.has(k)]),
    seed: 37,
  });
}

// ---- Football pitch in perspective, with line intersections -------------
function pitch() {
  const W = 1.15, H = 0.8;
  // seen from the stands: the far touchline sits higher and further away
  const P = (x, z) => [x * W, z * H * 0.6 - 0.08, -z * H * 0.75];
  const segs = [];
  const line = (x1, z1, x2, z2) => segs.push([P(x1, z1), P(x2, z2)]);
  line(-1, -1, 1, -1); line(1, -1, 1, 1); line(1, 1, -1, 1); line(-1, 1, -1, -1);
  line(0, -1, 0, 1);
  for (const s of [-1, 1]) {
    const bx = s * (1 - 0.31), gx = s * (1 - 0.105);
    line(s, -0.59, bx, -0.59); line(bx, -0.59, bx, 0.59); line(bx, 0.59, s, 0.59);
    line(s, -0.27, gx, -0.27); line(gx, -0.27, gx, 0.27); line(gx, 0.27, s, 0.27);
  }
  // centre circle and penalty arcs on the ground plane
  const ring = (cx, r, a0, a1, n) => {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      pts.push(P(cx + (Math.cos(a) * r) / W, (Math.sin(a) * r) / H));
    }
    for (let i = 0; i < n; i++) segs.push([pts[i], pts[i + 1]]);
  };
  ring(0, 0.25, 0, Math.PI * 2, 36);
  ring(-1 + 0.2, 0.25, -0.93, 0.93, 14);
  ring(1 - 0.2, 0.25, Math.PI - 0.93, Math.PI + 0.93, 14);

  const joints = [];
  const J = (x, z, a) => joints.push([...P(x, z), a]);
  J(-1, -1); J(1, -1); J(1, 1); J(-1, 1); J(0, -1, true); J(0, 1, true);
  for (const s of [-1, 1]) {
    const bx = s * (1 - 0.31), gx = s * (1 - 0.105);
    J(s, -0.59); J(s, 0.59); J(bx, -0.59, true); J(bx, 0.59, true);
    J(s, -0.27); J(s, 0.27); J(gx, -0.27); J(gx, 0.27);
  }
  J(0, 0.25 / H); J(0, -0.25 / H);
  return build({ segs, joints, seed: 53, jitter: 0.01 });
}

// ---- 4-DOF arm reaching a target ---------------------------------------
function arm() {
  const base = [0, -0.9, 0];
  const sh = [0, -0.55, 0];
  const el = [0.38, 0.22, 0.05];
  const wr = [0.86, 0.02, 0.22];
  const f1 = [1.06, -0.14, 0.34];
  const f2 = [1.02, 0.12, 0.3];
  const target = [1.12, -0.02, 0.36];
  const segs = [
    [base, sh], [sh, el], [el, wr], [wr, f1], [wr, f2],
    ...circle(base, 0.32, 30, 'xz'),
    ...circle([0, -0.97, 0], 0.42, 34, 'xz'),
    ...circle(target, 0.09, 16),
    ...circle(target, 0.09, 16, 'xz'),
  ];
  // a faint dotted reach trajectory
  for (let i = 0; i < 9; i++) {
    const t = i / 9;
    const a = [-0.7 + t * 1.6, 0.75 - Math.sin(t * Math.PI) * 0.1 - t * 0.6, -0.3 + t * 0.6];
    segs.push([a, [a[0] + 0.05, a[1] - 0.02, a[2] + 0.02]]);
  }
  return build({
    segs,
    joints: [[...base], [...sh], [...el, true], [...wr, true], [...f1], [...f2], [...target, true]],
    seed: 71,
  });
}

const makers = { hand, table, pose, pitch, arm };
export const shapeFor = (id) => makers[id]();
