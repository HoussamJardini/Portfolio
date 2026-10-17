import { useEffect, useRef, useState } from 'react';
import Figure from './Figure';
import { coverFor } from '../data/media';

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

function Card({ project, onOpen, i }) {
  const cover = coverFor(project.slug);
  return (
    <li data-reveal style={{ '--rd': `${(i % 3) * 90}ms` }}>
      <button className="card" onClick={() => onOpen(project.slug)}>
        <span className="card-media">
          {cover ? <img src={cover} alt="" loading="lazy" /> : <Figure kind={project.figure} label="" />}
          <span className="card-tag">{project.metric}</span>
        </span>
        <span className="card-body">
          <span className="card-field">{project.field}</span>
          <span className="card-title">{project.title}</span>
          <span className="card-sum">{project.summary}</span>
          <span className="card-go">
            Read more <Arrow />
          </span>
        </span>
      </button>
    </li>
  );
}

function Preview({ project, pos }) {
  const ref = useRef(null);
  const cur = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let id;
    const tick = () => {
      cur.current.x += (pos.current.x - cur.current.x) * 0.16;
      cur.current.y += (pos.current.y - cur.current.y) * 0.16;
      if (ref.current) ref.current.style.transform = `translate3d(${cur.current.x + 28}px, ${cur.current.y - 90}px, 0)`;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [pos]);

  const cover = project && coverFor(project.slug);
  return (
    <div className={`peek ${project ? 'show' : ''}`} ref={ref} aria-hidden="true">
      {project && (cover ? <img src={cover} alt="" /> : <Figure kind={project.figure} label="" />)}
    </div>
  );
}

export default function WorkIndex({ projects, onOpen }) {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const [more, setMore] = useState(false);
  const [hover, setHover] = useState(null);
  const pos = useRef({ x: 0, y: 0 });
  const [fine] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches);

  useEffect(() => {
    if (!fine) return undefined;
    const on = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, [fine]);

  return (
    <>
      <ul className="cards">
        {featured.map((p, i) => (
          <Card key={p.slug} project={p} onOpen={onOpen} i={i} />
        ))}
      </ul>

      <div className="more">
        <button className="btn btn-line" aria-expanded={more} onClick={() => setMore((m) => !m)}>
          {more ? 'Show fewer projects' : `Show ${rest.length} more projects`}
          <span className={`more-icon ${more ? 'open' : ''}`} aria-hidden="true">+</span>
        </button>
      </div>

      {more && (
        <ol className="index" onPointerLeave={() => setHover(null)}>
          {rest.map((p) => (
            <li key={p.slug}>
              <button
                className="row"
                onClick={() => onOpen(p.slug)}
                onPointerEnter={() => fine && setHover(p)}
                onFocus={() => fine && setHover(p)}
                onBlur={() => setHover(null)}
              >
                <span className="row-title">{p.title}</span>
                <span className="row-sum">{p.summary}</span>
                <span className="row-metric">{p.metric}</span>
                <span className="row-go" aria-hidden="true">
                  <Arrow />
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
      {fine && <Preview project={hover} pos={pos} />}
    </>
  );
}
