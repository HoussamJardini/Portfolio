import { useEffect, useRef } from 'react';

// Counts a figure like "9.71M", "−98%" or "+6.5 pts" up from zero the first
// time it is actually on screen: after the intro, and after the beam has
// revealed the panel it sits in. Anything without a number is left alone.
const PARTS = /^([^\d]*?)(\d+(?:\.\d+)?)(.*)$/;

export default function Count({ value }) {
  const ref = useRef(null);
  const m = String(value).match(PARTS);

  useEffect(() => {
    const el = ref.current;
    if (!el || !m || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const [, pre, num, post] = m;
    const target = parseFloat(num);
    const decimals = (num.split('.')[1] || '').length;
    const pad = num.split('.')[0].length;
    const fmt = (v) => {
      const s = v.toFixed(decimals);
      const [i, d] = s.split('.');
      return `${pre}${i.padStart(Math.min(pad, 3), '0')}${d !== undefined ? `.${d}` : ''}${post}`;
    };

    let raf = 0;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const t0 = performance.now();
      const dur = 1500;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        const e = 1 - 2 ** (-10 * k);
        el.textContent = k >= 1 ? value : fmt(target * e);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const station = el.closest('[data-beam]');
    const visible = () =>
      document.documentElement.classList.contains('intro-done') &&
      (!station || !document.documentElement.classList.contains('beam-on') || station.classList.contains('beam-hit'));

    let inView = false;
    const tryRun = () => inView && visible() && run();
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        tryRun();
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    const mo = new MutationObserver(tryRun);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    if (station) mo.observe(station, { attributes: true, attributeFilter: ['class'] });
    el.textContent = fmt(0);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
    };
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref}>{value}</span>;
}
