import { useEffect, useRef, useState } from 'react';
import Figure from './Figure';
import { coverFor } from '../data/media';

const GROUPS = {
  All: () => true,
  Vision: (p) => ['hand', 'pose'].includes(p.figure) || /Vision|Robotics/.test(p.field),
  'Language & documents': (p) => /Document|Research|NLP|LLM|Agents|Automation/.test(p.field),
  'Learning & control': (p) => /Reinforcement|Robotics/.test(p.field),
  Products: (p) => /Product|Startup|Game/.test(p.field),
};

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
      {project &&
        (cover ? <img src={cover} alt="" /> : <Figure kind={project.figure} label="" />)}
    </div>
  );
}

export default function WorkIndex({ projects, onOpen }) {
  const [group, setGroup] = useState('All');
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

  const list = projects.map((p, i) => ({ ...p, n: i + 1 })).filter(GROUPS[group]);

  return (
    <>
      <div className="filters" role="tablist" aria-label="Filter projects">
        {Object.keys(GROUPS).map((g) => {
          const count = projects.filter(GROUPS[g]).length;
          return (
            <button key={g} role="tab" aria-selected={group === g} className={group === g ? 'on' : ''} onClick={() => setGroup(g)}>
              {g} <sup>{count}</sup>
            </button>
          );
        })}
      </div>

      <ol
        className="index"
        onPointerLeave={() => setHover(null)}
      >
        {list.map((p) => (
          <li key={p.slug} data-reveal>
            <button
              className="row"
              onClick={() => onOpen(p.slug)}
              onPointerEnter={() => fine && setHover(p)}
              onFocus={() => fine && setHover(p)}
              onBlur={() => setHover(null)}
            >
              <span className="row-n">{String(p.n).padStart(2, '0')}</span>
              <span className="row-title">
                {p.title}
                {p.award && <i className="row-award">Award</i>}
              </span>
              <span className="row-sum">{p.summary}</span>
              <span className="row-field">{p.field}</span>
              <span className="row-metric">{p.metric}</span>
              <span className="row-year">{p.year || ''}</span>
              <span className="row-go" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
              </span>
            </button>
          </li>
        ))}
      </ol>
      {fine && <Preview project={hover} pos={pos} />}
    </>
  );
}
