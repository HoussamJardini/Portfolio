import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { COUNT, shapeFor } from './shapes';

// Hero point cloud. WebGL (three.js) when available, otherwise the same
// morph drawn on a 2D canvas so every visitor sees the specimen.

const MORPH_MS = 1700;
const SPREAD = 0.45; // share of the morph used to stagger points
const SWIRL = 0.42;
const CAM_Z = 5;
const FOV = 32;

const vertex = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec2 aSize;
  attribute vec2 aAccent;
  attribute vec4 aRand;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseOn;
  uniform float uAspect;
  uniform float uScale;
  varying float vAccent;
  varying float vFade;
  varying float vNear;

  float ease(float t) { return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0; }

  void main() {
    float t = ease(clamp((uProgress - aRand.w * ${SPREAD.toFixed(2)}) / ${(1 - SPREAD).toFixed(2)}, 0.0, 1.0));
    vec3 p = mix(aFrom, aTo, t) + aRand.xyz * sin(t * 3.14159) * ${SWIRL.toFixed(2)};
    p += 0.007 * vec3(sin(uTime * 1.1 + aRand.w * 37.0), cos(uTime * 0.9 + aRand.w * 23.0), 0.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    vec2 d = (ndc - uMouse) * vec2(uAspect, 1.0);
    float f = smoothstep(0.32, 0.0, length(d)) * uMouseOn;
    ndc += normalize(d + 1e-5) / vec2(uAspect, 1.0) * f * 0.06;
    clip.xy = ndc * clip.w;
    gl_Position = clip;

    float size = mix(aSize.x, aSize.y, t);
    gl_PointSize = size * uScale / -mv.z * (1.0 + f * 0.8);
    vAccent = mix(aAccent.x, aAccent.y, t);
    vFade = clamp((-mv.z - 4.2) / 1.6, 0.0, 1.0);
    vNear = f;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uPaper;
  uniform vec3 uSignal;
  varying float vAccent;
  varying float vFade;
  varying float vNear;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.36, r);
    vec3 col = mix(uInk, uSignal, max(vAccent, vNear * 0.85));
    col = mix(col, uPaper, vFade * 0.6);
    gl_FragColor = vec4(col, a);
  }
`;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const css = (name, fallback) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

// ---------------------------------------------------------------- morph state
function createState(first) {
  const from = new Float32Array(COUNT * 3);
  const to = new Float32Array(COUNT * 3);
  const size = new Float32Array(COUNT * 2);
  const accent = new Float32Array(COUNT * 2);
  const rand = new Float32Array(COUNT * 4);
  for (let i = 0; i < COUNT; i++) {
    const p = first[i];
    from.set(p.p, i * 3);
    to.set(p.p, i * 3);
    size.set([p.size, p.size], i * 2);
    accent.set([p.accent, p.accent], i * 2);
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    rand.set([Math.sin(ph) * Math.cos(th), Math.sin(ph) * Math.sin(th), Math.cos(ph), Math.random()], i * 4);
  }
  return { from, to, size, accent, rand, progress: 1 };
}

const localT = (s, i) => ease(Math.min(1, Math.max(0, (s.progress - s.rand[i * 4 + 3] * SPREAD) / (1 - SPREAD))));

function retarget(s, next) {
  for (let i = 0; i < COUNT; i++) {
    const t = localT(s, i);
    const sw = Math.sin(t * Math.PI) * SWIRL;
    for (let k = 0; k < 3; k++) {
      const j = i * 3 + k;
      s.from[j] = s.from[j] + (s.to[j] - s.from[j]) * t + s.rand[i * 4 + k] * sw;
    }
    s.size[i * 2] += (s.size[i * 2 + 1] - s.size[i * 2]) * t;
    s.accent[i * 2] += (s.accent[i * 2 + 1] - s.accent[i * 2]) * t;
    s.size[i * 2 + 1] = next[i].size;
    s.accent[i * 2 + 1] = next[i].accent;
    s.to.set(next[i].p, i * 3);
  }
  s.progress = 0;
}

// ---------------------------------------------------------------- WebGL
function webglBackend(el, s) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.set(0, 0, CAM_Z);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  geo.setAttribute('aFrom', new THREE.BufferAttribute(s.from, 3));
  geo.setAttribute('aTo', new THREE.BufferAttribute(s.to, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(s.size, 2));
  geo.setAttribute('aAccent', new THREE.BufferAttribute(s.accent, 2));
  geo.setAttribute('aRand', new THREE.BufferAttribute(s.rand, 4));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 3);

  const uniforms = {
    uProgress: { value: 1 },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(9, 9) },
    uMouseOn: { value: 0 },
    uAspect: { value: 1 },
    uScale: { value: 1 },
    uInk: { value: new THREE.Color(css('--ink', '#16150f')) },
    uPaper: { value: new THREE.Color(css('--paper-2', '#e5e1d7')) },
    uSignal: { value: new THREE.Color(css('--signal', '#ff4f1f')) },
  };
  const mat = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, transparent: true, depthWrite: false });
  const group = new THREE.Group();
  group.add(new THREE.Points(geo, mat));
  scene.add(group);

  return {
    resize(w, h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w / h < 0.9 ? CAM_Z / Math.max(0.62, w / h / 0.9) : CAM_Z;
      camera.updateProjectionMatrix();
      uniforms.uAspect.value = w / h;
      uniforms.uScale.value = h * dpr * 0.012;
    },
    dirty() {
      ['aFrom', 'aTo', 'aSize', 'aAccent'].forEach((n) => (geo.attributes[n].needsUpdate = true));
    },
    draw({ time, rx, ry, mouse, mouseOn }) {
      uniforms.uProgress.value = s.progress;
      uniforms.uTime.value = time;
      uniforms.uMouse.value.set(mouse.x, mouse.y);
      uniforms.uMouseOn.value = mouseOn;
      group.rotation.set(rx, ry, 0);
      renderer.render(scene, camera);
    },
    dispose() {
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

// ---------------------------------------------------------------- Canvas 2D
function canvasBackend(el, s) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  el.appendChild(canvas);
  const dpr = Math.min(window.devicePixelRatio, 2);
  const ink = css('--ink', '#16150f');
  const signal = css('--signal', '#ff4f1f');
  let W = 1;
  let H = 1;
  let camZ = CAM_Z;

  return {
    resize(w, h) {
      W = w;
      H = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      camZ = w / h < 0.9 ? CAM_Z / Math.max(0.62, w / h / 0.9) : CAM_Z;
    },
    dirty() {},
    draw({ time, rx, ry, mouse, mouseOn }) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const focal = H / 2 / Math.tan((FOV / 2) * (Math.PI / 180));
      const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      const mx = W / 2 + (mouse.x * W) / 2;
      const my = H / 2 - (mouse.y * H) / 2;
      const reach = 0.16 * H;
      for (let i = 0; i < COUNT; i++) {
        const t = localT(s, i);
        const sw = Math.sin(t * Math.PI) * SWIRL;
        const r4 = i * 4;
        let x = s.from[i * 3] + (s.to[i * 3] - s.from[i * 3]) * t + s.rand[r4] * sw + 0.007 * Math.sin(time * 1.1 + s.rand[r4 + 3] * 37);
        let y = s.from[i * 3 + 1] + (s.to[i * 3 + 1] - s.from[i * 3 + 1]) * t + s.rand[r4 + 1] * sw + 0.007 * Math.cos(time * 0.9 + s.rand[r4 + 3] * 23);
        let z = s.from[i * 3 + 2] + (s.to[i * 3 + 2] - s.from[i * 3 + 2]) * t + s.rand[r4 + 2] * sw;
        // rotate Y then X
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y1 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        x = x1; y = y1; z = z2;
        const depth = camZ - z;
        let px = W / 2 + (x * focal) / depth;
        let py = H / 2 - (y * focal) / depth;
        let near = 0;
        if (mouseOn) {
          const dx = px - mx, dy = py - my;
          const d = Math.hypot(dx, dy);
          if (d < reach) {
            near = 1 - d / reach;
            near = near * near * (3 - 2 * near);
            px += (dx / (d || 1)) * near * 0.03 * H;
            py += (dy / (d || 1)) * near * 0.03 * H;
          }
        }
        const sz = (s.size[i * 2] + (s.size[i * 2 + 1] - s.size[i * 2]) * t) * (H * 0.012) / depth * 0.5 * (1 + near * 0.8);
        const acc = Math.max(s.accent[i * 2] + (s.accent[i * 2 + 1] - s.accent[i * 2]) * t, near * 0.85);
        ctx.globalAlpha = 1 - Math.min(1, Math.max(0, (depth - 4.2) / 1.6)) * 0.6;
        ctx.fillStyle = acc > 0.5 ? signal : ink;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, sz), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
    dispose() {
      canvas.remove();
    },
  };
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- component
export default function Specimen({ shapes, active, onFrame, onReady }) {
  const mount = useRef(null);
  const api = useRef(null);

  useEffect(() => {
    const el = mount.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cache = new Map();
    const get = (id) => {
      if (!cache.has(id)) cache.set(id, shapeFor(id));
      return cache.get(id);
    };
    const s = createState(get(shapes[active] ?? shapes[0]));

    let gfx;
    try {
      if (!hasWebGL()) throw new Error('no webgl');
      gfx = webglBackend(el, s);
    } catch {
      gfx = canvasBackend(el, s);
      el.dataset.renderer = '2d';
    }

    let morphStart = -1;
    const morphTo = (id) => {
      retarget(s, get(id));
      gfx.dirty();
      if (reduced) s.progress = 1;
      else morphStart = performance.now();
      wake();
    };

    // ---- pointer ----
    const target = { x: 0, y: 0 };
    const look = { x: 0, y: 0 };
    const mouse = { x: 9, y: 9 };
    let mouseOn = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      target.x = Math.max(-1.5, Math.min(1.5, x));
      target.y = Math.max(-1.5, Math.min(1.5, y));
      const inside = Math.abs(x) <= 1 && Math.abs(y) <= 1;
      mouse.x = x;
      mouse.y = y;
      mouseOn = inside && e.pointerType !== 'touch' ? 1 : 0;
      onFrame?.({ x, y, inside });
      wake();
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // ---- sizing ----
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      gfx.resize(w, h);
      wake();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // ---- loop (sleeps when off-screen) ----
    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    const frame = () => {
      raf = 0;
      const time = reduced ? 0 : (performance.now() - t0) / 1000;
      if (morphStart >= 0) {
        const p = (performance.now() - morphStart) / MORPH_MS;
        s.progress = Math.min(1, p);
        if (p >= 1) morphStart = -1;
      }
      look.x += (target.x - look.x) * 0.05;
      look.y += (target.y - look.y) * 0.05;
      const drift = reduced ? 0 : Math.sin(time * 0.22) * 0.32;
      gfx.draw({ time, ry: drift + look.x * 0.45, rx: -look.y * 0.22, mouse, mouseOn });
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    function wake() {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', wake);

    resize();
    wake();
    api.current = { morphTo };
    onReady?.();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', wake);
      gfx.dispose();
      api.current = null;
    };
    // the scene is built once; shape changes go through morphTo below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = useRef(active);
  useEffect(() => {
    if (shown.current === active) return;
    shown.current = active;
    api.current?.morphTo(shapes[active]);
  }, [active, shapes]);

  return <div className="specimen" ref={mount} aria-hidden="true" />;
}
