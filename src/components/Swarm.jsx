import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { shapeFor } from '../three/shapes';
import portraitUrl from '../assets/portrait.webp';

// One particle carries the whole page.
//
// In the hero it is a single light circling behind the portrait. When you
// scroll out of the hero it bursts into a swarm, and the swarm becomes the
// structure each chapter is about: a turning sphere, the table grid the model
// reads, hand landmarks, a body pose, the author's own face. It sits behind
// the text, on the side the text leaves free, and drifts across the page as
// the chapters alternate. At the end it pulls back together into one point.
//
// Chapters are plain sections marked with data-swarm="shape" and
// data-side="L|R|C". The scroll scrubs everything: the morph between the two
// chapters around the middle of the screen, the drift, the burst.

const N = 7800;
const FOV = 32;
const CAM_Z = 5;

const smoother = (x) => x * x * x * (x * (x * 6 - 15) + 10);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

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

// every shape is N points: xyz + size + accent
function fromSpecimen(id, seed) {
  const src = shapeFor(id);
  const r = rng(seed);
  const out = new Float32Array(N * 5);
  for (let i = 0; i < N; i++) {
    const q = src[i % src.length];
    const j = i < src.length ? 0 : 0.03;
    out.set(
      [q.p[0] + (r() - 0.5) * j, q.p[1] + (r() - 0.5) * j, q.p[2] + (r() - 0.5) * j, q.size * (i < src.length ? 1 : 0.7), q.accent],
      i * 5,
    );
  }
  return out;
}

function sphere(seed) {
  const r = rng(seed);
  const out = new Float32Array(N * 5);
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = ga * i;
    const shell = 0.86 + (r() - 0.5) * 0.05;
    out.set([Math.cos(th) * rad * shell, y * shell, Math.sin(th) * rad * shell, 0.6 + r() * 0.7, r() < 0.04 ? 1 : 0], i * 5);
  }
  return out;
}

// no figure at all: a wide, faint field of drifting dust
function field(seed) {
  const r = rng(seed);
  const out = new Float32Array(N * 5);
  for (let i = 0; i < N; i++) {
    out.set([(r() - 0.5) * 7.5, (r() - 0.5) * 4.2, (r() - 0.5) * 3.2 - 0.6, 0.35 + r() * 0.5, r() < 0.03 ? 1 : 0], i * 5);
  }
  return out;
}

function core(seed) {
  const r = rng(seed);
  const out = new Float32Array(N * 5);
  for (let i = 0; i < N; i++) {
    // a tight, bright ball: gaussian around the centre
    const u = Math.max(1e-6, r());
    const g = Math.sqrt(-2 * Math.log(u)) * 0.035;
    const a = r() * Math.PI * 2;
    const b = Math.acos(2 * r() - 1);
    out.set([Math.sin(b) * Math.cos(a) * g, Math.sin(b) * Math.sin(a) * g, Math.cos(b) * g, 0.5 + r() * 0.5, r() < 0.2 ? 1 : 0], i * 5);
  }
  return out;
}

// the portrait, turned into a relief of light
function face(img, seed) {
  const r = rng(seed);
  const W = 180;
  const H = Math.round((W * img.naturalHeight) / img.naturalWidth);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0, W, H);
  const d = g.getImageData(0, 0, W, H).data;
  // normalise to the brightest pixel: the portrait is low-key
  let max = 0;
  for (let k = 0; k < d.length; k += 4) max = Math.max(max, 0.3 * d[k] + 0.59 * d[k + 1] + 0.11 * d[k + 2]);
  const cells = [];
  let total = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const k = (y * W + x) * 4;
      const l = (0.3 * d[k] + 0.59 * d[k + 1] + 0.11 * d[k + 2]) / (max || 255);
      if (l < 0.1) continue;
      // the face matters more than the t-shirt
      const w = l ** 1.15 * (y < H * 0.6 ? 1.5 : 0.45);
      cells.push([x, y, l, w]);
      total += w;
    }
  }
  const out = new Float32Array(N * 5);
  const scale = 2.3 / H;
  for (let i = 0; i < N; i++) {
    let t = r() * total;
    let cell = cells[cells.length - 1];
    for (let j = 0; j < cells.length; j++) {
      t -= cells[j][3];
      if (t <= 0) {
        cell = cells[j];
        break;
      }
    }
    const [x, y, l] = cell;
    out.set(
      [(x - W / 2 + r() - 0.5) * scale, (H / 2 - y + r() - 0.5) * scale + 0.15, (l - 0.45) * 0.6, 0.55 + l * 1.25, l > 0.5 ? 1 : 0],
      i * 5,
    );
  }
  return out;
}

// ---------------------------------------------------------------- shaders
const VERT = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec2 aSize;
  attribute vec2 aAccent;
  attribute vec4 aRand;
  uniform float uMix;
  uniform float uTime;
  uniform float uScale;
  uniform float uBurst;
  uniform vec2 uMouse;
  uniform float uMouseOn;
  uniform vec2 uPulsePos;
  uniform float uPulse;
  uniform float uAspect;
  varying float vAccent;
  varying float vAlpha;
  varying float vCoc;

  float ease(float t) { return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0; }

  void main() {
    // each point leaves at its own moment, so the shape dissolves and
    // re-forms rather than sliding
    float t = ease(clamp((uMix - aRand.w * 0.4) / 0.6, 0.0, 1.0));
    vec3 p = mix(aFrom, aTo, t);
    // scatter outwards mid-morph, and on the burst out of the hero
    p += aRand.xyz * (sin(t * 3.14159) * 0.55 + uBurst * 1.6);
    // a slow living drift
    p += 0.012 * vec3(sin(uTime * 0.9 + aRand.w * 40.0), cos(uTime * 0.7 + aRand.w * 31.0), sin(uTime * 0.5 + aRand.w * 17.0));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    vec2 d = (ndc - uMouse) * vec2(uAspect, 1.0);
    float f = smoothstep(0.28, 0.0, length(d)) * uMouseOn;
    ndc += normalize(d + 1e-5) / vec2(uAspect, 1.0) * f * 0.05;
    // a tap sends a ring outwards through the swarm
    vec2 dp = (ndc - uPulsePos) * vec2(uAspect, 1.0);
    float ring = uPulse * exp(-abs(length(dp) - (1.0 - uPulse) * 0.9) * 7.0);
    ndc += normalize(dp + 1e-5) / vec2(uAspect, 1.0) * ring * (0.08 + aRand.w * 0.12);
    clip.xy = ndc * clip.w;
    gl_Position = clip;

    // depth of field: points away from the focus plane grow and fade
    float dz = -mv.z;
    vCoc = clamp(abs(dz - ${CAM_Z.toFixed(1)}) * 1.3, 0.0, 2.5);
    float size = mix(aSize.x, aSize.y, t);
    gl_PointSize = size * uScale / dz * (1.0 + vCoc * 1.6) * (1.0 + f);
    vAccent = mix(aAccent.x, aAccent.y, t);
    vAlpha = 1.0 / (1.0 + vCoc * vCoc * 1.8);
  }
`;

const FRAG = /* glsl */ `
  uniform float uOpacity;
  varying float vAccent;
  varying float vAlpha;
  varying float vCoc;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float sharp = smoothstep(0.5, 0.05, d);
    float disc = smoothstep(0.5, 0.42, d) * 0.7;
    float a = mix(sharp, disc, clamp(vCoc, 0.0, 1.0)) * vAlpha * uOpacity;
    vec3 base = vec3(1.0, 0.2, 0.15);
    vec3 hot = vec3(1.0, 0.9, 0.86);
    gl_FragColor = vec4(mix(base, hot, vAccent * 0.85 + 0.15), a);
  }
`;

const TRAIL_VERT = /* glsl */ `
  attribute float aAlong;
  attribute float aAcross;
  varying float vAlong;
  varying float vAcross;
  void main() {
    vAlong = aAlong;
    vAcross = aAcross;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const TRAIL_FRAG = /* glsl */ `
  uniform float uOpacity;
  varying float vAlong;
  varying float vAcross;
  void main() {
    float core = exp(-vAcross * vAcross * 9.0);
    float glow = exp(-vAcross * vAcross * 2.0) * 0.35;
    float fade = pow(1.0 - vAlong, 1.7);
    vec3 col = mix(vec3(1.0, 0.16, 0.1), vec3(1.0, 0.93, 0.9), core * (1.0 - vAlong));
    gl_FragColor = vec4(col, (core + glow) * fade * uOpacity);
  }
`;

function haloTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,240,234,1)');
  r.addColorStop(0.1, 'rgba(255,90,70,0.9)');
  r.addColorStop(0.38, 'rgba(227,20,28,0.25)');
  r.addColorStop(1, 'rgba(227,20,28,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const additive = { transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending };

// ---------------------------------------------------------------- component
export default function Swarm() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return undefined;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(DPR);
    renderer.setClearColor(0, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.set(0, 0, CAM_Z);

    // ---- shapes
    const shapes = { core: core(3), sphere: sphere(5), field: field(8) };
    ['hand', 'table', 'pose', 'pitch', 'arm'].forEach((id, i) => {
      shapes[id] = fromSpecimen(id, 11 + i);
    });
    shapes.face = shapes.sphere; // replaced once the portrait has loaded
    const img = new Image();
    img.src = portraitUrl;
    img.decode?.().then(() => {
      shapes.face = face(img, 9);
      if (pair.a === 'face' || pair.b === 'face') setPair(pair.a, pair.b, true);
    }).catch(() => {});

    // ---- the swarm
    const geo = new THREE.BufferGeometry();
    const aFrom = new Float32Array(N * 3);
    const aTo = new Float32Array(N * 3);
    const aSize = new Float32Array(N * 2);
    const aAccent = new Float32Array(N * 2);
    const aRand = new Float32Array(N * 4);
    const r = rng(77);
    for (let i = 0; i < N; i++) {
      const a = r() * Math.PI * 2;
      const b = Math.acos(2 * r() - 1);
      const m = 0.4 + r() * 0.8;
      aRand.set([Math.sin(b) * Math.cos(a) * m, Math.sin(b) * Math.sin(a) * m, Math.cos(b) * m, r()], i * 4);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(aFrom, 3));
    geo.setAttribute('aFrom', new THREE.BufferAttribute(aFrom, 3));
    geo.setAttribute('aTo', new THREE.BufferAttribute(aTo, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(aSize, 2));
    geo.setAttribute('aAccent', new THREE.BufferAttribute(aAccent, 2));
    geo.setAttribute('aRand', new THREE.BufferAttribute(aRand, 4));
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uScale: { value: 1 },
        uBurst: { value: 0 },
        uMouse: { value: new THREE.Vector2(9, 9) },
        uMouseOn: { value: 0 },
        uPulsePos: { value: new THREE.Vector2(0, 0) },
        uPulse: { value: 0 },
        uAspect: { value: 1 },
        uOpacity: { value: 1 },
      },
      ...additive,
    });
    const swarm = new THREE.Points(geo, mat);
    swarm.frustumCulled = false;
    const group = new THREE.Group();
    group.add(swarm);
    scene.add(group);

    const pair = { a: null, b: null };
    function setPair(a, b, force) {
      if (!force && pair.a === a && pair.b === b) return;
      pair.a = a;
      pair.b = b;
      const A = shapes[a];
      const B = shapes[b];
      for (let i = 0; i < N; i++) {
        aFrom[i * 3] = A[i * 5];
        aFrom[i * 3 + 1] = A[i * 5 + 1];
        aFrom[i * 3 + 2] = A[i * 5 + 2];
        aTo[i * 3] = B[i * 5];
        aTo[i * 3 + 1] = B[i * 5 + 1];
        aTo[i * 3 + 2] = B[i * 5 + 2];
        aSize[i * 2] = A[i * 5 + 3];
        aSize[i * 2 + 1] = B[i * 5 + 3];
        aAccent[i * 2] = A[i * 5 + 4];
        aAccent[i * 2 + 1] = B[i * 5 + 4];
      }
      ['aFrom', 'aTo', 'aSize', 'aAccent'].forEach((k) => {
        geo.attributes[k].needsUpdate = true;
      });
    }

    // ---- the single light of the hero, with its trail
    const head = new THREE.Group();
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTexture(), ...additive }));
    halo.scale.set(0.42, 0.42, 1);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 20, 14), new THREE.MeshBasicMaterial({ color: 0xfff1ec, ...additive }));
    head.add(halo, dot);
    scene.add(head);
    const TRAIL = 80;
    const hist = [];
    const tPos = new Float32Array(TRAIL * 6);
    const tAlong = new Float32Array(TRAIL * 2);
    const tAcross = new Float32Array(TRAIL * 2);
    const idx = [];
    for (let j = 0; j < TRAIL; j++) {
      tAlong[j * 2] = tAlong[j * 2 + 1] = j / (TRAIL - 1);
      tAcross[j * 2] = -1;
      tAcross[j * 2 + 1] = 1;
      if (j < TRAIL - 1) idx.push(j * 2, j * 2 + 1, j * 2 + 2, j * 2 + 1, j * 2 + 3, j * 2 + 2);
    }
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
    trailGeo.setAttribute('aAlong', new THREE.BufferAttribute(tAlong, 1));
    trailGeo.setAttribute('aAcross', new THREE.BufferAttribute(tAcross, 1));
    trailGeo.setIndex(idx);
    const trailMat = new THREE.ShaderMaterial({
      vertexShader: TRAIL_VERT,
      fragmentShader: TRAIL_FRAG,
      uniforms: { uOpacity: { value: 1 } },
      side: THREE.DoubleSide,
      ...additive,
    });
    const trail = new THREE.Mesh(trailGeo, trailMat);
    trail.frustumCulled = false;
    scene.add(trail);

    // ---- chapters
    let chapters = [];
    let vw = 1;
    let vh = 1;
    let halfW = 1;
    let halfH = 1;
    const measure = () => {
      vw = document.documentElement.clientWidth;
      vh = window.innerHeight;
      renderer.setSize(vw, vh, false);
      camera.aspect = vw / vh;
      camera.updateProjectionMatrix();
      halfH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAM_Z;
      halfW = halfH * camera.aspect;
      mat.uniforms.uAspect.value = camera.aspect;
      mat.uniforms.uScale.value = vh * DPR * 0.0105;
      const sy = window.scrollY;
      chapters = [...document.querySelectorAll('[data-swarm]')].map((el) => {
        const b = el.getBoundingClientRect();
        return {
          el,
          shape: el.dataset.swarm,
          side: el.dataset.side === 'L' ? -1 : el.dataset.side === 'R' ? 1 : 0,
          dim: el.dataset.dim ? parseFloat(el.dataset.dim) : 1,
          col: el.querySelector('.col'),
          top: b.top + sy,
          bottom: b.bottom + sy,
        };
      });
    };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);

    // ---- pointer
    const mouse = new THREE.Vector2(9, 9);
    let mouseOn = 0;
    const onMove = (e) => {
      mouse.set((e.clientX / vw) * 2 - 1, -(e.clientY / vh) * 2 + 1);
      mouseOn = 1;
    };
    const onLeave = () => {
      mouseOn = 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    const onDown = (e) => {
      mat.uniforms.uPulsePos.value.set((e.clientX / vw) * 2 - 1, -(e.clientY / vh) * 2 + 1);
      mat.uniforms.uPulse.value = 1;
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    let started = document.documentElement.classList.contains('intro-done');
    const onIntro = () => {
      started = true;
    };
    window.addEventListener('intro:done', onIntro, { once: true });

    // ---- state, smoothed
    const sm = { g: 0, x: 0, y: 0, mix: 0, burst: 0, op: 0, head: 1, scale: 1, rot: 0 };
    const hp = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    const side = new THREE.Vector3();
    let raf = 0;
    let last = performance.now();

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || !chapters.length) return;
      const t = now / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const mid = window.scrollY + vh * 0.5;

      // Where we are in the story: one step per chapter boundary. Each
      // morph plays while the boundary crosses the middle of the screen
      // (from 35% of a screen before it to 35% after), so a shape is held
      // for as long as its chapter is being read, however tall it is.
      let G = 0;
      for (let j = 0; j < chapters.length - 1; j++) {
        G += smoother(clamp01((mid - (chapters[j].bottom - vh * 0.35)) / (vh * 0.7)));
      }

      // Smooth that ONE position along the whole sequence, then read the
      // pair and the blend from
      // it. A pair always hands over to the next at exactly the shape they
      // share, so nothing jumps when you cross from one chapter to the next.
      const k = 1 - Math.pow(0.0008, dt); // frame-rate independent smoothing
      sm.g += (G - sm.g) * k;
      if (reduced || Math.abs(G - sm.g) < 1e-4) sm.g = G;
      const gi = Math.min(chapters.length - 1, Math.max(0, Math.floor(sm.g)));
      const gm = gi >= chapters.length - 1 ? 0 : sm.g - gi;
      const CA = chapters[gi];
      const CB = chapters[Math.min(gi + 1, chapters.length - 1)];
      setPair(CA.shape, CB.shape);
      sm.mix = gm;
      const sideX = CA.side + (CB.side - CA.side) * gm;
      const dim = CA.dim + (CB.dim - CA.dim) * gm;
      const narrow = vw < 900;
      let stage = 1;
      if (narrow) {
        const cur = gm < 0.5 ? CA : CB;
        if (cur.col) {
          const top = cur.col.getBoundingClientRect().top / vh;
          stage = clamp01((top - 0.08) / 0.5);
        }
      }
      sm.stage = (sm.stage ?? 1) + (stage - (sm.stage ?? 1)) * k;
      const tx = narrow ? 0 : sideX * halfW * 0.48;
      sm.x += (tx - sm.x) * k * 0.8;
      const ty = narrow ? halfH * (0.2 + (1 - sm.stage) * 0.25) : 0;
      sm.y += (ty + Math.sin(t * 0.3) * 0.05 - sm.y) * k;

      // the hero: one light circling behind the portrait, bursting into the
      // swarm as you scroll away from it
      const heroEl = chapters[0];
      const heroOut = clamp01((window.scrollY - (heroEl.bottom - vh) * 0.35) / (vh * 0.75));
      const a = t * 0.8;
      hp.set(Math.cos(a) * halfW * (narrow ? 0.62 : 0.44), Math.sin(a * 2) * halfH * 0.2 + halfH * 0.1, Math.sin(a) * 1.1 - 0.9);
      const inHero = gi === 0 && gm < 0.5 ? 1 - heroOut : 0;
      sm.head += ((started ? inHero : 0) - sm.head) * k;
      sm.burst += ((gi === 0 ? Math.sin(Math.min(1, heroOut * 1.4) * Math.PI) * 0.35 : 0) - sm.burst) * k;

      group.position.set(sm.x * (1 - sm.head) + hp.x * sm.head, sm.y * (1 - sm.head) + hp.y * sm.head, hp.z * sm.head);
      sm.rot += dt * (0.12 + (CA.shape === 'sphere' || CB.shape === 'sphere' ? 0.18 : 0));
      const facing = CA.shape === 'face' || CB.shape === 'face' ? 0.25 : 1;
      swarm.rotation.y = Math.sin(sm.rot) * 0.55 * facing;
      swarm.rotation.x = Math.sin(sm.rot * 0.7) * 0.1 * facing;
      const sc = narrow ? Math.min(0.78, (halfW / 1.25) * 0.95) * (0.72 + sm.stage * 0.28) : 1;
      sm.scale += (sc - sm.scale) * k;
      swarm.scale.setScalar(sm.scale);

      mat.uniforms.uMix.value = sm.mix;
      mat.uniforms.uTime.value = t;
      mat.uniforms.uBurst.value = sm.burst;
      mat.uniforms.uMouse.value.lerp(mouse, 0.2);
      mat.uniforms.uMouseOn.value += (mouseOn - mat.uniforms.uMouseOn.value) * 0.08;
      mat.uniforms.uPulse.value = Math.max(0, mat.uniforms.uPulse.value - dt * 0.9);
      const targetOp = (started ? 1 : 0) * dim * (narrow ? 0.18 + sm.stage * 0.82 : 1);
      sm.op += (targetOp - sm.op) * k * 0.6;
      // while it is still the single light of the hero, the cloud stays faint
      mat.uniforms.uOpacity.value = sm.op * (1 - 0.82 * sm.head);

      // the hero light and its trail
      head.position.copy(group.position);
      head.visible = sm.head > 0.02;
      halo.material.opacity = sm.head;
      trailMat.uniforms.uOpacity.value = sm.head;
      if (!hist.length || hist[0].distanceToSquared(head.position) > 0.0002) {
        hist.unshift(head.position.clone());
        if (hist.length > TRAIL) hist.pop();
      }
      for (let j = 0; j < TRAIL; j++) {
        const p = hist[Math.min(j, hist.length - 1)] || head.position;
        const pa = hist[Math.max(0, Math.min(j - 1, hist.length - 1))] || p;
        const pb = hist[Math.min(j + 1, hist.length - 1)] || p;
        tmp.subVectors(pa, pb);
        side.subVectors(camera.position, p).cross(tmp);
        if (side.lengthSq() < 1e-9) side.set(0, 1, 0);
        side.normalize().multiplyScalar(0.012 * (1 - j / TRAIL) + 0.002);
        tPos.set([p.x + side.x, p.y + side.y, p.z + side.z, p.x - side.x, p.y - side.y, p.z - side.z], j * 6);
      }
      trailGeo.attributes.position.needsUpdate = true;
      trail.visible = head.visible;

      // a slight camera sway with the pointer gives the whole thing depth
      camera.position.x += ((mouse.x * mouseOn) * 0.12 - camera.position.x) * 0.04;
      camera.position.y += ((mouse.y * mouseOn) * 0.08 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('intro:done', onIntro);
      geo.dispose();
      trailGeo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas className="swarm" ref={canvasRef} aria-hidden="true" />;
}
