import { useEffect, useRef } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import Figure from './Figure';
import OtslDecoder from './OtslDecoder';
import { mediaFor } from '../data/media';
import { lockScroll } from '../hooks';

const EASE = [0.22, 1, 0.36, 1];

function Body({ project, index, total, onNav, onClose }) {
  const media = mediaFor(project.slug);
  const scroller = useRef(null);

  useEffect(() => {
    scroller.current?.scrollTo(0, 0);
  }, [project.slug]);

  return (
    <div className="case-scroll" ref={scroller} data-lenis-prevent>
      <header className="case-head">
        <div className="case-meta">
          <span>
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span>{[project.field, project.year].filter(Boolean).join(' · ')}</span>
        </div>
        <button className="case-close" onClick={onClose} aria-label="Close project">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </header>

      <h2 className="case-title">{project.title}</h2>
      <p className="case-sum">{project.summary}</p>
      {project.award && <p className="case-award">{project.award}</p>}

      <dl className="case-numbers">
        {project.numbers.map(([k, v]) => (
          <div key={v}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="case-media">
        {media.length ? (
          media.map((m) =>
            m.type === 'video' ? (
              <figure key={m.url}>
                <video src={m.url} poster={m.poster} controls muted playsInline preload="none" />
                <figcaption>{m.caption}</figcaption>
              </figure>
            ) : (
              <figure key={m.url}>
                <img src={m.url} alt={`${project.title}: ${m.caption}`} loading="lazy" />
                <figcaption>{m.caption}</figcaption>
              </figure>
            ),
          )
        ) : (
          <figure>
            <Figure kind={project.figure} label={`${project.title} diagram`} />
            <figcaption>Schematic</figcaption>
          </figure>
        )}
      </div>

      {project.slug === 'table-structure-model' && (
        <div className="case-demo">
          <p className="case-demo-title">How the model writes a table, one token per cell</p>
          <OtslDecoder />
        </div>
      )}

      <div className="case-body">
        {project.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      <ul className="case-stack">
        {project.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      {project.links?.code && (
        <a className="btn btn-line case-link" href={project.links.code} target="_blank" rel="noreferrer">
          Source on GitHub <span aria-hidden="true">↗</span>
        </a>
      )}

      <nav className="case-nav">
        <button onClick={() => onNav(-1)}>
          <small>Previous</small>
          <span>← {project.prevTitle}</span>
        </button>
        <button onClick={() => onNav(1)}>
          <small>Next</small>
          <span>{project.nextTitle} →</span>
        </button>
      </nav>
    </div>
  );
}

export default function CaseDrawer({ projects, slug, onChange }) {
  const index = projects.findIndex((p) => p.slug === slug);
  const open = index >= 0;
  const total = projects.length;

  useEffect(() => {
    if (!open) return undefined;
    lockScroll(true);
    const onKey = (e) => {
      if (e.key === 'Escape') onChange(null);
      if (e.key === 'ArrowRight') onChange(projects[(index + 1) % total].slug);
      if (e.key === 'ArrowLeft') onChange(projects[(index - 1 + total) % total].slug);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [open, index, total, projects, onChange]);

  const project = open && {
    ...projects[index],
    prevTitle: projects[(index - 1 + total) % total].title,
    nextTitle: projects[(index + 1) % total].title,
  };

  return (
    <AnimatePresence>
      {open && (
        <Motion.div className="case" key="case" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <button className="case-veil" aria-label="Close project" onClick={() => onChange(null)} />
          <Motion.aside
            className="case-panel"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Body
              project={project}
              index={index}
              total={total}
              onClose={() => onChange(null)}
              onNav={(d) => onChange(projects[(index + d + total) % total].slug)}
            />
          </Motion.aside>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
