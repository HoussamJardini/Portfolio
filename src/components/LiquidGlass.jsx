import { Fragment, useEffect, useId, useRef } from 'react';

// A pill of liquid glass: the backdrop is refracted through a displacement map
// generated for the pill's exact shape, so the page bends at the rim like a
// thick lens, with a little chromatic fringe. Chromium renders the refraction;
// other browsers fall back to clear tinted glass (see .lg in index.css).
export default function LiquidGlass({ className = '', bend = 46, band = 20 }) {
  const ref = useRef(null);
  const raw = useId();
  const id = `lg${raw.replace(/[^a-zA-Z0-9]/g, '')}`;

  useEffect(() => {
    const el = ref.current;
    const svg = el?.previousElementSibling;
    if (!el || !svg) return undefined;
    const brands = navigator.userAgentData?.brands || [];
    if (!brands.some((b) => /Chromium/.test(b.brand))) return undefined;

    const build = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      if (!w || !h) return;
      // the map: R/G hold the outward normal of the nearest rim, weighted by how
      // close to the rim the pixel is (a lens profile — flat centre, steep edge)
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const g = c.getContext('2d');
      const img = g.createImageData(w, h);
      const d = img.data;
      const r = h / 2;
      const b = Math.min(band, r);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const px = x + 0.5;
          const py = y + 0.5;
          const cx = Math.min(Math.max(px, r), w - r);
          const dx = px - cx;
          const dy = py - r;
          const len = Math.hypot(dx, dy) || 1;
          const inside = r - len;
          let t = 1 - inside / b;
          t = t < 0 ? 0 : t > 1 ? 1 : t;
          const m = t * t * (3 - 2 * t) * t;
          const i = (y * w + x) * 4;
          d[i] = 128 + (dx / len) * m * 127;
          d[i + 1] = 128 + (dy / len) * m * 127;
          d[i + 2] = 128;
          d[i + 3] = 255;
        }
      }
      g.putImageData(img, 0, 0);
      const url = c.toDataURL();
      const filter = svg.querySelector('filter');
      const fe = svg.querySelector('feImage');
      for (const n of [filter, fe]) {
        n.setAttribute('width', w);
        n.setAttribute('height', h);
      }
      fe.setAttribute('href', url);
      el.classList.add('lg-on');
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => ro.disconnect();
  }, [band]);

  // three displacements of slightly different strength, one per colour channel
  const chan = [
    ['r', bend, '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'],
    ['g', bend * 0.92, '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'],
    ['b', bend * 0.84, '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'],
  ];
  return (
    <>
      <svg className="lg-defs" aria-hidden="true" width="0" height="0">
        <filter
          id={id}
          x="0"
          y="0"
          width="1"
          height="1"
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feImage x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
          {chan.map(([k, s, m]) => (
            <Fragment key={k}>
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale={-s}
                xChannelSelector="R"
                yChannelSelector="G"
                result={`d${k}`}
              />
              <feColorMatrix in={`d${k}`} type="matrix" values={m} result={`c${k}`} />
            </Fragment>
          ))}
          <feBlend in="cr" in2="cg" mode="screen" result="rg" />
          <feBlend in="rg" in2="cb" mode="screen" />
        </filter>
      </svg>
      <span ref={ref} className={`lg ${className}`} style={{ '--lg': `url(#${id})` }} aria-hidden="true" />
    </>
  );
}
