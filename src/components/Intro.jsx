import { useEffect, useRef, useState } from 'react';
import { lockScroll } from '../hooks';
import cutout from '../assets/hero-cutout.webp';

// Loading screen. The name decodes letter by letter while a red laser grows
// across the seam of the screen; when the page is really ready the laser
// flashes and the screen splits open along it. The hero waits for
// html.intro-done before it plays, and the beam waits for 'intro:done'.

const NAME = 'HOUSSAM JARDINI';
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%/<>*';
const STATUS = [
  [0, 'Loading weights'],
  [28, 'Calibrating the beam'],
  [56, 'Indexing projects'],
  [84, 'Rendering'],
  [100, 'Ready'],
];

function finishIntro() {
  const html = document.documentElement;
  if (html.classList.contains('intro-done')) return;
  html.classList.add('intro-done');
  window.dispatchEvent(new Event('intro:done'));
}

export default function Intro() {
  const [phase, setPhase] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'gone' : 'load',
  );
  const nameRef = useRef(null);
  const countRef = useRef(null);
  const statusRef = useRef(null);
  const laserRef = useRef(null);

  useEffect(() => {
    if (phase === 'gone') {
      finishIntro();
      return undefined;
    }
    if (phase !== 'load') return undefined;

    let seen = false;
    try {
      seen = sessionStorage.getItem('hj-intro') === '1';
      sessionStorage.setItem('hj-intro', '1');
    } catch {
      /* private mode */
    }
    const MIN = seen ? 900 : 2600;
    lockScroll(true);

    let ready = false;
    const img = new Image();
    img.src = cutout;
    const pageLoaded = new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })));
    Promise.all([document.fonts?.ready, img.decode?.().catch(() => {}), pageLoaded]).finally(() => {
      ready = true;
    });
    // never hold the visitor hostage
    const bail = setTimeout(() => {
      ready = true;
    }, 6000);

    const letters = nameRef.current ? [...nameRef.current.children] : [];
    const start = performance.now();
    let shown = 0;
    let raf = 0;
    const tick = (now) => {
      const t = Math.max(0, now - start);
      const cap = ready ? 100 : 92;
      const goal = Math.min(cap, (t / MIN) * 100);
      shown += (goal - shown) * 0.12;
      if (goal >= 100 && shown > 99.5) shown = 100;
      const p = shown / 100;

      if (countRef.current) countRef.current.textContent = String(Math.floor(shown)).padStart(3, '0');
      if (laserRef.current) laserRef.current.style.setProperty('--p', p.toFixed(4));
      if (statusRef.current) {
        const s = (STATUS.filter(([at]) => shown >= at).pop() || STATUS[0])[1];
        if (statusRef.current.textContent !== s) statusRef.current.textContent = s;
      }
      letters.forEach((el, i) => {
        const ch = NAME[i];
        if (ch === ' ') return;
        const settle = 0.15 + (i / NAME.length) * 0.65;
        const next = p >= settle ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        if (el.textContent !== next) el.textContent = next;
        el.classList.toggle('set', p >= settle);
      });

      if (shown >= 100) {
        setPhase('out');
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // animation frames can be throttled or paused (battery saver, low-power
    // mode, a tab opened in the background): a plain timer opens the page anyway
    const failsafe = setTimeout(() => setPhase('out'), MIN + 4500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(bail);
      clearTimeout(failsafe);
    };
  }, [phase]);

  // the release lives in its own effect: a timer started in the load effect
  // would be cleared by that effect's own cleanup the moment the phase changes,
  // which left the page locked (overflow: hidden) — fatal for touch scrolling
  useEffect(() => {
    if (phase !== 'out') return undefined;
    const release = setTimeout(() => {
      lockScroll(false);
      finishIntro();
    }, 520);
    const id = setTimeout(() => setPhase('gone'), 1700);
    return () => {
      clearTimeout(release);
      clearTimeout(id);
    };
  }, [phase]);

  // whatever happens above, once the intro is gone the page must scroll
  useEffect(() => {
    if (phase === 'gone') lockScroll(false);
  }, [phase]);

  if (phase === 'gone') return null;
  return (
    <div className={`intro ${phase === 'out' ? 'out' : ''}`} aria-hidden="true">
      <div className="intro-panel top" />
      <div className="intro-panel bottom" />
      <div className="intro-seam">
        <i ref={laserRef} className="intro-laser" />
      </div>
      <div className="intro-content">
        <div className="intro-corner tl">
          <b>HJ</b> Portfolio · 2026
        </div>
        <div className="intro-corner tr">AI / ML Engineer</div>
        <p className="intro-name" ref={nameRef}>
          {NAME.split('').map((c, i) => (
            <span key={i} className={c === ' ' ? 'sp' : ''}>
              {c === ' ' ? ' ' : GLYPHS[i % GLYPHS.length]}
            </span>
          ))}
        </p>
        <div className="intro-foot">
          <span className="intro-status">
            <i /> <span ref={statusRef}>Loading weights</span>
          </span>
          <span className="intro-count" ref={countRef}>
            000
          </span>
        </div>
      </div>
    </div>
  );
}
