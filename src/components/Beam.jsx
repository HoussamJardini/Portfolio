import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// A laser, rendered in WebGL, that leaves from behind the portrait and travels
// down the page with the scroll. The route is measured from the live layout:
// it runs in the side lanes, sweeps across the page in the gaps between
// sections (bulging towards the camera as it goes), and swerves in to touch
// every [data-beam] element. Touching one reveals it.
//
// World space is page space: x = page x, y = -page y, z = depth in px. A
// perspective camera looks down -z and slides with the scroll, so anything at
// z = 0 lines up with the DOM exactly and anything off that plane gets real
// parallax.

const FOV = 18;

// ---------------------------------------------------------------- layout
function measure() {
  const hero = document.getElementById('top');
  const main = document.querySelector('main');
  const wrap = document.querySelector('main .wrap');
  if (!hero || !main || !wrap) return null;

  const W = document.documentElement.clientWidth;
  const sy = window.scrollY;
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { l: r.left, r: r.right, t: r.top + sy, b: r.bottom + sy, h: r.height };
  };
  const H = hero.offsetHeight;
  const docH = Math.ceil(main.getBoundingClientRect().bottom + sy);
  const wr = wrap.getBoundingClientRect();
  const contentL = wr.left + parseFloat(getComputedStyle(wrap).paddingLeft);
  const mobile = W < 900;
  const laneL = Math.max(9, contentL * 0.5);
  const laneR = W - laneL;
  const lane = (s) => (s === 'R' ? laneR : laneL);

  // camera distance for this viewport, and how far the beam may travel in depth
  const vh = window.innerHeight;
  const D = vh / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  const NEAR = Math.min(D * 0.22, mobile ? 220 : 520);
  const FAR = -D * (mobile ? 0.35 : 0.6);

  // out from behind his collar, towards the camera round his right side,
  // far away again behind his body, then off to the left lane
  let keys;
  let startY;
  const fig = document.querySelector('.hero-figure');
  if (mobile && fig) {
    // phone: the hero is stacked, so follow the portrait itself, then drop
    // into the left margin before the copy starts
    const f = box(fig);
    const fx = (f.l + f.r) / 2;
    // the portrait fills the width here, so the beam halos his head instead
    keys = [
      { x: fx + W * 0.02, y: f.t + f.h * 0.34, z: FAR * 0.5, hero: true },
      { x: W * 0.13, y: f.t + f.h * 0.22, z: NEAR * 0.7, hero: true },
      { x: fx - W * 0.02, y: f.t - f.h * 0.03, z: NEAR * 0.35, hero: true },
      { x: W * 0.84, y: f.t + f.h * 0.12, z: NEAR * 0.7, hero: true },
      { x: fx + W * 0.08, y: f.t + f.h * 0.6, z: FAR * 0.75, hero: true },
      { x: laneL, y: f.b + 40, z: 0 },
    ];
    startY = f.b + 40;
  } else {
    keys = [
      { x: W * 0.5, y: H * 0.3, z: FAR * 0.55, hero: true },
      { x: W * 0.765, y: H * 0.47, z: NEAR * 0.8, hero: true },
      { x: W * 0.725, y: H * 0.66, z: NEAR * 0.2, hero: true },
      { x: W * 0.47, y: H * 0.78, z: FAR * 0.7, hero: true },
      { x: W * 0.3, y: H * 0.95, z: FAR * 0.2, hero: true },
      { x: laneL, y: H + 160, z: 0 },
    ];
    startY = H + 160;
  }

  const els = [...document.querySelectorAll('[data-beam]')].filter((el) => el.getClientRects().length);
  const hits = [];
  let side = 'L';
  let lastY = startY;
  let prevBottom = startY - 40;
  els.forEach((el) => {
    // on a phone there is no room to cross the page: everything is hit from
    // the left margin, and depth comes from dives instead of sweeps
    const s = mobile && el.dataset.beam === 'R' ? 'L' : el.dataset.beam;
    const r = box(el);
    const target = s === 'end' ? 'L' : s;
    let hit;
    if (s === 'end') hit = { x: (r.l + r.r) / 2, y: (r.t + r.b) / 2 };
    else hit = { x: s === 'L' ? r.l - 1 : r.r + 1, y: r.t + Math.min(r.h * 0.4, 140) };
    if (target !== side) {
      // swing across the gap between two sections, arcing in towards the camera
      const y0 = Math.max(lastY + 60, prevBottom + 40);
      const y1 = Math.max(y0 + 220, Math.min(r.t - 40, y0 + 460));
      keys.push(
        { x: lane(side), y: y0, z: 0 },
        { x: W / 2, y: (y0 + y1) / 2, z: NEAR },
        { x: lane(target), y: y1, z: 0 },
      );
      lastY = y1;
      side = target;
    } else if (hits.length && hit.y - 160 - lastY > 260) {
      // same side: dive far away from the camera and come back
      keys.push({ x: lane(side), y: (lastY + hit.y - 160) / 2, z: FAR });
    }
    const inY = Math.max(lastY + 30, hit.y - (s === 'end' ? 230 : 160));
    hit.y = Math.max(hit.y, inY + (s === 'end' ? 110 : 70));
    keys.push({ x: lane(side), y: inY, z: 0 });
    if (s === 'end') keys.push({ x: hit.x, y: hit.y - 50, z: 0 });
    hits.push({ ...hit, side: s, key: keys.length, el, name: el.dataset.beamName || '' });
    keys.push({ ...hit, z: 0 });
    if (s !== 'end') {
      keys.push({ x: lane(side), y: hit.y + 160, z: 0 });
      lastY = hit.y + 160;
    }
    prevBottom = r.b;
  });

  // Keys are given where they should appear on screen. Move every key that is
  // off the z = 0 plane so that, seen from the camera at the moment the dot
  // passes it, it still lands there: depth then reads as size and light, not
  // as the line wandering over the content.
  keys.forEach((k) => {
    if (!k.z) return;
    const f = (D - k.z) / D;
    const cy = k.hero ? vh / 2 : k.y - vh * 0.22;
    k.x = W / 2 + (k.x - W / 2) * f;
    k.y = cy + (k.y - cy) * f;
  });

  return { W, H, docH, keys, hits, labels: contentL >= 200, mobile };
}

// ---------------------------------------------------------------- shaders
const VERT = /* glsl */ `
  attribute float aW;
  attribute float aD;
  uniform float uTime;
  uniform float uL;
  uniform float uAmp;
  varying float vU;
  varying float vD;
  varying float vDepth;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vU = uv.x;
    vD = aD;
    vec3 p = position;
    vDepth = clamp(1.0 + p.z / 1100.0, 0.22, 1.6);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const CORE = /* glsl */ `
  uniform float uHead;
  uniform float uL;
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying float vU;
  varying float vDepth;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float face = abs(dot(vN, vV));
    float ahead = (vU - uHead) * uL;
    if (ahead > 0.0) {
      // the route still to come: a faint dotted guide that flows forward
      float d = fract(vU * uL / 15.0 - uTime * 0.9);
      if (d > 0.2) discard;
      float fade = 1.0 - smoothstep(0.0, 2600.0, ahead);
      gl_FragColor = vec4(uColor * 0.55, 0.3 * fade * face * vDepth);
      return;
    }
    float comet = exp((vU - uHead) * uL / 150.0);
    vec3 col = mix(uColor, uHot, pow(face, 4.0) * 0.9 * min(vDepth, 1.0) + comet * 0.55);
    gl_FragColor = vec4(col * (0.75 + comet * 1.6) * vDepth, (0.6 + 0.4 * face) * min(vDepth * 1.1, 1.0));
  }
`;

const GLOW = /* glsl */ `
  uniform float uHead;
  uniform float uL;
  uniform vec3 uColor;
  uniform float uPower;
  varying float vU;
  varying float vDepth;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    if (vU > uHead) discard;
    float face = abs(dot(vN, vV));
    float comet = exp((vU - uHead) * uL / 220.0);
    gl_FragColor = vec4(uColor, pow(face, 2.2) * uPower * (1.0 + comet * 2.2) * vDepth * vDepth);
  }
`;

const SPHERE = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float face = abs(dot(vN, vV));
    vec3 col = mix(uColor, uHot, pow(face, 2.5));
    gl_FragColor = vec4(col * 1.6, 1.0);
  }
`;

const SPHERE_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const SPARK_VERT = /* glsl */ `
  attribute float aLife;
  uniform float uScale;
  varying float vLife;
  void main() {
    vLife = aLife;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uScale * (0.4 + aLife) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const SPARK_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying float vLife;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5 || vLife <= 0.0) discard;
    float a = smoothstep(0.5, 0.0, d) * vLife;
    gl_FragColor = vec4(mix(uColor, uHot, vLife), a);
  }
`;

function haloTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,235,228,1)');
  r.addColorStop(0.12, 'rgba(255,90,70,0.85)');
  r.addColorStop(0.4, 'rgba(227,20,28,0.25)');
  r.addColorStop(1, 'rgba(227,20,28,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------------------------------------------------------------- scene
function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 20000);
  const red = new THREE.Color('#ff2a1f');
  const hot = new THREE.Color('#fff0ea');
  const shared = {
    uTime: { value: 0 },
    uHead: { value: 0 },
    uL: { value: 1 },
    uAmp: { value: 0 },
  };
  const mat = (frag, extra = {}, vert = VERT) =>
    new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: { ...shared, uColor: { value: red }, uHot: { value: hot }, ...extra },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

  const materials = {
    core: mat(CORE),
    glow: mat(GLOW, { uPower: { value: 0.32 } }),
    aura: mat(GLOW, { uPower: { value: 0.09 } }),
  };

  // head: lit sphere, halo, pulse ring
  const head = new THREE.Group();
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5.5, 32, 20),
    new THREE.ShaderMaterial({
      vertexShader: SPHERE_VERT,
      fragmentShader: SPHERE,
      uniforms: { uColor: { value: red }, uHot: { value: hot } },
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: haloTexture(), blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, transparent: true }),
  );
  halo.scale.set(120, 120, 1);
  const pulseMat = new THREE.MeshBasicMaterial({ color: red, transparent: true, blending: THREE.AdditiveBlending, depthTest: false, side: THREE.DoubleSide });
  const pulse = new THREE.Mesh(new THREE.RingGeometry(1, 1.08, 64), pulseMat);
  head.add(halo, sphere, pulse);
  scene.add(head);

  // sparks shed by the head
  const SPARKS = 280;
  const sPos = new Float32Array(SPARKS * 3);
  const sVel = new Float32Array(SPARKS * 3);
  const sLife = new Float32Array(SPARKS);
  const sMax = new Float32Array(SPARKS);
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  sparkGeo.setAttribute('aLife', new THREE.BufferAttribute(sLife, 1));
  const sparkMat = new THREE.ShaderMaterial({
    vertexShader: SPARK_VERT,
    fragmentShader: SPARK_FRAG,
    uniforms: { uScale: { value: 9000 }, uColor: { value: red }, uHot: { value: hot } },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  sparks.frustumCulled = false;
  scene.add(sparks);
  let sparkIdx = 0;

  // shockwaves at the hit points, and the nodes they leave behind
  const rings = [];
  const ringGeo = new THREE.RingGeometry(1, 1.06, 72);
  const nodeGeo = new THREE.SphereGeometry(2.6, 16, 12);
  const nodeMat = new THREE.MeshBasicMaterial({ color: red, transparent: true, blending: THREE.AdditiveBlending, depthTest: false });

  let route = null;
  let meshes = [];
  const tmp = new THREE.Vector3();

  function weightAt(s) {
    const { L, hits } = route;
    let w = Math.min(1, s / 160, (L - s) / 160);
    for (const h of hits) w = Math.min(w, Math.max(0, (Math.abs(s - h.len) - 26) / 230));
    return Math.max(0, w);
  }

  function tube(curve, segs, radius, radial, depthAt) {
    const g = new THREE.TubeGeometry(curve, segs, radius, radial, false);
    const n = g.attributes.position.count;
    const aW = new Float32Array(n);
    const aD = new Float32Array(n);
    for (let i = 0; i <= segs; i++) {
      const s = (i / segs) * route.L;
      const w = weightAt(s);
      const d = depthAt ? depthAt(s) : 1;
      for (let j = 0; j <= radial; j++) {
        aW[i * (radial + 1) + j] = w;
        aD[i * (radial + 1) + j] = d;
      }
    }
    g.setAttribute('aW', new THREE.BufferAttribute(aW, 1));
    g.setAttribute('aD', new THREE.BufferAttribute(aD, 1));
    return g;
  }

  function setRoute(geo) {
    meshes.forEach((m) => {
      scene.remove(m);
      m.geometry.dispose();
    });
    meshes = [];

    const pts = geo.keys.map((k) => new THREE.Vector3(k.x, -k.y, k.z));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    const L = curve.getLength();
    const DIV = 8000;
    const lens = curve.getLengths(DIV);
    geo.hits.forEach((h) => {
      h.len = lens[Math.round((h.key / (pts.length - 1)) * DIV)];
    });

    // page y along the route (monotonic), for scroll -> length
    const N = Math.ceil(L / 6);
    const ym = new Float32Array(N + 1);
    let m = -Infinity;
    for (let i = 0; i <= N; i++) {
      curve.getPointAt(i / N, tmp);
      m = Math.max(m, -tmp.y);
      ym[i] = m;
    }
    route = { curve, L, ym, N, hits: geo.hits };
    shared.uL.value = L;

    const segs = Math.ceil(L / (geo.mobile ? 7 : 5));
    const add = (g, material) => {
      const mesh = new THREE.Mesh(g, material);
      mesh.frustumCulled = false;
      scene.add(mesh);
      meshes.push(mesh);
    };
    const r = geo.mobile ? 0.75 : 1;
    add(tube(curve, segs, 15 * r, 10), materials.aura);
    add(tube(curve, segs, 6 * r, 10), materials.glow);
    add(tube(curve, segs, 1.9 * r, 10), materials.core);

    return route;
  }

  function size(W, H) {
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }

  function pointAt(s, out) {
    const { curve, L } = route;
    return curve.getPointAt(Math.min(1, Math.max(0, s / L)), out);
  }

  function hit(h, t) {
    for (let k = 0; k < 2; k++) {
      const ring = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({ color: k ? hot : red, transparent: true, blending: THREE.AdditiveBlending, depthTest: false, side: THREE.DoubleSide }),
      );
      ring.position.set(h.x, -h.y, 0);
      ring.userData = { born: t + k * 0.16 };
      ring.scale.setScalar(0.001);
      scene.add(ring);
      rings.push(ring);
    }
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set(h.x, -h.y, 0);
    scene.add(node);
    meshes.push(node);
    // a burst of sparks at the point of impact
    for (let i = 0; i < 40; i++) emit(h.x, -h.y, 0, 90 + Math.random() * 160);
  }

  function emit(x, y, z, speed) {
    const i = sparkIdx++ % SPARKS;
    const a = Math.random() * Math.PI * 2;
    const b = (Math.random() - 0.5) * Math.PI;
    sPos[i * 3] = x;
    sPos[i * 3 + 1] = y;
    sPos[i * 3 + 2] = z;
    sVel[i * 3] = Math.cos(a) * Math.cos(b) * speed;
    sVel[i * 3 + 1] = Math.sin(a) * Math.cos(b) * speed;
    sVel[i * 3 + 2] = Math.sin(b) * speed;
    sMax[i] = 0.5 + Math.random() * 0.8;
    sLife[i] = 1;
  }

  let lastHead = null;
  function frame({ t, dt, scrollY, W, H, cur }) {
    if (!route) return;
    camera.position.set(W / 2, -(scrollY + H / 2), H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
    camera.lookAt(W / 2, -(scrollY + H / 2), 0);
    shared.uTime.value = t;
    shared.uHead.value = cur / route.L;

    pointAt(cur, head.position);
    const pulseT = (t * 0.7) % 1;
    pulse.scale.setScalar(8 + pulseT * 22);
    pulseMat.opacity = (1 - pulseT) * 0.8;
    sphere.scale.setScalar(1 + Math.sin(t * 6) * 0.08);

    // the head sheds sparks, more when it is moving
    const moved = lastHead ? head.position.distanceTo(lastHead) : 0;
    lastHead = (lastHead || new THREE.Vector3()).copy(head.position);
    const n = Math.min(6, 1 + Math.floor(moved / 6));
    for (let k = 0; k < n; k++) if (Math.random() < 0.7) emit(head.position.x, head.position.y, head.position.z, 20 + Math.random() * 70);
    for (let i = 0; i < SPARKS; i++) {
      if (sLife[i] <= 0) continue;
      sLife[i] -= dt / sMax[i];
      sVel[i * 3 + 1] -= 40 * dt;
      sPos[i * 3] += sVel[i * 3] * dt;
      sPos[i * 3 + 1] += sVel[i * 3 + 1] * dt;
      sPos[i * 3 + 2] += sVel[i * 3 + 2] * dt;
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparkGeo.attributes.aLife.needsUpdate = true;
    sparkMat.uniforms.uScale.value = 9000 * renderer.getPixelRatio();

    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      const age = t - ring.userData.born;
      if (age < 0) continue;
      const k = Math.min(1, age / 1.3);
      ring.scale.setScalar(6 + (1 - (1 - k) ** 3) * 70);
      ring.material.opacity = 1 - k;
      if (k >= 1) {
        scene.remove(ring);
        ring.material.dispose();
        rings.splice(i, 1);
      }
    }
    renderer.render(scene, camera);
  }

  function dispose() {
    meshes.forEach((m) => m.geometry.dispose());
    Object.values(materials).forEach((m) => m.dispose());
    sparkGeo.dispose();
    renderer.dispose();
  }

  return { setRoute, size, frame, hit, dispose };
}

// ---------------------------------------------------------------- component
export default function Beam() {
  const canvas = useRef(null);
  const hud = useRef(null);
  const layer = useRef(null);
  const [geo, setGeo] = useState(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !canvas.current) return undefined;
    let world;
    try {
      world = createScene(canvas.current);
    } catch {
      return undefined; // no WebGL: leave every section visible
    }
    document.documentElement.classList.add('beam-on');

    const st = { cur: 0, target: 0, route: null, hits: [], done: [], started: false };
    let vw = document.documentElement.clientWidth;
    let vh = window.innerHeight;
    world.size(vw, vh);

    let t0 = 0;
    const relayout = () => {
      clearTimeout(t0);
      t0 = setTimeout(() => {
        const g = measure();
        if (!g) return;
        st.route = world.setRoute(g);
        st.hits = g.hits;
        st.done = g.hits.map((h) => h.el.classList.contains('beam-hit'));
        setGeo(g);
      }, 120);
    };
    const onResize = () => {
      vw = document.documentElement.clientWidth;
      vh = window.innerHeight;
      world.size(vw, vh);
      relayout();
    };
    relayout();
    const ro = new ResizeObserver(relayout);
    const main = document.querySelector('main');
    if (main) ro.observe(main);
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(relayout);
    // let the hero settle before the beam comes out from behind him
    const intro = setTimeout(() => {
      st.started = true;
    }, 900);

    const lengthAtY = (y) => {
      const { ym, N, L } = st.route;
      if (y >= ym[N]) return L;
      let lo = 0;
      let hi = N;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (ym[mid] < y) lo = mid + 1;
        else hi = mid;
      }
      return (lo / N) * L;
    };

    let raf = 0;
    let last = performance.now();
    let station = -2;
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!st.route || document.hidden) return;
      const sy = window.scrollY;
      st.target = st.started ? Math.min(st.route.L, lengthAtY(sy + vh * 0.72)) : 0;
      const d = st.target - st.cur;
      st.cur = Math.abs(d) < 0.4 ? st.target : st.cur + Math.sign(d) * Math.min(Math.abs(d) * 0.075, 95);

      let now_station = -1;
      st.hits.forEach((h, i) => {
        if (st.cur >= h.len - 1) {
          now_station = i;
          if (!st.done[i]) {
            st.done[i] = true;
            h.el.classList.add('beam-hit');
            world.hit(h, now / 1000);
            layer.current?.querySelectorAll('.beam-label')[i]?.classList.add('on');
          }
        }
      });
      if (hud.current) {
        hud.current.querySelector('b').textContent = `${String(Math.round((st.cur / st.route.L) * 100)).padStart(2, '0')}%`;
        if (now_station !== station) {
          station = now_station;
          hud.current.querySelector('span').textContent = station < 0 ? 'Intro' : st.hits[station].name;
        }
      }
      world.frame({ t: now / 1000, dt, scrollY: sy, W: vw, H: vh, cur: st.cur });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t0);
      clearTimeout(intro);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      document.documentElement.classList.remove('beam-on');
      world.dispose();
    };
  }, []);

  return (
    <>
      <canvas className="beam-canvas" ref={canvas} aria-hidden="true" />
      <div className="beam-layer" ref={layer} style={{ height: geo?.docH || 0 }} aria-hidden="true">
        {geo?.labels &&
          geo.hits.map((h, i) =>
            h.side === 'end' ? (
              <span key={i} className="beam-label" />
            ) : (
              <span
                key={i}
                className={`beam-label ${h.side}`}
                style={h.side === 'L' ? { right: geo.W - h.x + 24, top: h.y - 14 } : { left: h.x + 24, top: h.y - 14 }}
              >
                <b>Signal {String(i + 1).padStart(2, '0')}</b>
                {h.name}
              </span>
            ),
          )}
      </div>
      <div className="beam-hud" ref={hud} aria-hidden="true">
        <i />
        Signal <b>00%</b>
        <span>Intro</span>
      </div>
    </>
  );
}
