import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import WorkIndex from './components/WorkIndex';
import CaseDrawer from './components/CaseDrawer';
import LossMeter from './components/LossMeter';
import { useActiveSection, useReveal, useScrollProgress, useSmoothScroll, scrollToId } from './hooks';
import { person, hero, specimens, about, highlight, projects, path, toolkit } from './data/portfolioData';
import portrait from './assets/portrait.webp';

const Specimen = lazy(() => import('./three/Specimen'));

const SECTIONS = [
  ['top', 'Intro'],
  ['highlight', 'Latest'],
  ['work', 'Work'],
  ['about', 'About'],
  ['path', 'Experience'],
  ['contact', 'Contact'],
];
const NAV = ['work', 'about', 'path', 'contact'];
const SECTION_IDS = SECTIONS.map(([id]) => id);
const SPECIMEN_IDS = specimens.map((s) => s.id);
const CYCLE_MS = 5200;

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

function Link({ to, children, className, ...rest }) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        scrollToId(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

// ---------------------------------------------------------------- masthead
function Masthead({ active }) {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.75);
      setHidden(y > 500 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const label = Object.fromEntries(SECTIONS);
  return (
    <header className={`mast ${hidden ? 'away' : ''} ${solid ? 'solid' : 'over-blue'}`}>
      <Link to="top" className="mast-name">
        Houssam Jardini
      </Link>
      <nav className="mast-nav" aria-label="Sections">
        {NAV.map((id) => (
          <Link key={id} to={id} className={active === id ? 'on' : ''}>
            {label[id]}
          </Link>
        ))}
      </nav>
      <Link to="contact" className="mast-status">
        <i className="pulse" aria-hidden="true" />
        <span>{person.availability}</span>
      </Link>
    </header>
  );
}

// ---------------------------------------------------------------- hero
function Hero() {
  const [shape, setShape] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setTimeout(() => setShape((s) => (s + 1) % specimens.length), CYCLE_MS);
    return () => clearTimeout(id);
  }, [shape, paused, ready]);

  const s = specimens[shape];
  const [l1, l2] = hero.title;
  const plain = l2.slice(0, l2.length - hero.highlight.length);
  return (
    <section id="top" className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow load" style={{ '--d': 0 }}>
            {hero.eyebrow}
          </p>
          <h1 className="hero-title">
            <span className="line">
              <span className="load" style={{ '--d': 1 }}>{l1}</span>
            </span>
            <span className="line">
              <span className="load" style={{ '--d': 2 }}>
                {plain}
                <em>{hero.highlight}</em>
              </span>
            </span>
          </h1>
          <p className="hero-intro load" style={{ '--d': 3 }}>
            {hero.intro}
          </p>
          <div className="hero-cta load" style={{ '--d': 4 }}>
            <Link to="highlight" className="btn btn-sun">
              See my work <Arrow />
            </Link>
            <a className="btn btn-white" href={person.cv.en} download>
              Download CV
            </a>
            <a className="hero-fr" href={person.cv.fr} download>
              Version française
            </a>
          </div>
          <ul className="trust load" style={{ '--d': 5 }}>
            {hero.trust.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <figure
          className="plate load"
          style={{ '--d': 2 }}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <span className="crop tl" /><span className="crop tr" /><span className="crop bl" /><span className="crop br" />
          <Suspense fallback={null}>
            <Specimen shapes={SPECIMEN_IDS} active={shape} onReady={() => setReady(true)} />
          </Suspense>
          <figcaption className="plate-cap" key={s.id}>
            <span className="plate-label">{s.label}</span>
            <span className="plate-src">from {s.source}</span>
          </figcaption>
          <div className="plate-tabs" role="tablist" aria-label="Shapes from my projects">
            {specimens.map((sp, i) => (
              <button
                key={sp.id}
                role="tab"
                aria-selected={i === shape}
                aria-label={`${sp.label}, from ${sp.source}`}
                className={i === shape ? 'on' : ''}
                onClick={() => setShape(i)}
              >
                <i style={{ animationDuration: `${CYCLE_MS}ms`, animationPlayState: paused || !ready ? 'paused' : 'running' }} />
              </button>
            ))}
          </div>
        </figure>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- section head
function Head({ kicker, title, children }) {
  return (
    <header className="head" data-reveal>
      <p className="kicker">{kicker}</p>
      <h2 className="head-title">{title}</h2>
      {children && <p className="head-lede">{children}</p>}
    </header>
  );
}

// ---------------------------------------------------------------- highlight
function Bars({ rows, field, label, max }) {
  return (
    <div className="bars">
      <p className="bars-label">{label}</p>
      {rows.map((r, i) => (
        <div key={r.name} className={`bar ${i === 0 ? 'mine' : ''}`}>
          <span className="bar-name">{r.name}</span>
          <span className="bar-track">
            <i style={{ '--w': r[field] / max }} />
          </span>
          <span className="bar-val">{r[field]}</span>
        </div>
      ))}
    </div>
  );
}

function Highlight({ onOpen }) {
  const c = highlight.compare;
  return (
    <section id="highlight" className="highlight wrap">
      <Head kicker={`Latest project · ${highlight.where}`} title={highlight.title} />

      <ol className="steps">
        {highlight.steps.map((st, i) => (
          <li key={st.label} data-reveal style={{ '--rd': `${i * 110}ms` }}>
            <span className="step-n">{i + 1}</span>
            <p className="step-label">{st.label}</p>
            <p className="step-text">{st.text}</p>
            <p className="step-big">
              {st.big} <small>{st.unit}</small>
            </p>
          </li>
        ))}
      </ol>

      <div className="compare" data-reveal>
        <p className="compare-title">{c.title}</p>
        <div className="compare-grid">
          <Bars rows={c.rows} field="size" label={c.sizeLabel} max={53} />
          <Bars rows={c.rows} field="score" label={c.scoreLabel} max={100} />
        </div>
        <p className="compare-note">{highlight.outcome}</p>
        <div className="compare-cta">
          <button className="btn btn-blue" onClick={() => onOpen('docstruct')}>
            How DocStruct works <Arrow />
          </button>
          <button className="btn btn-line" onClick={() => onOpen('table-structure-model')}>
            How the model works <Arrow />
          </button>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- about
function About() {
  return (
    <section id="about" className="about">
      <div className="wrap about-grid">
        <figure className="portrait" data-reveal>
          <img src={portrait} alt="Houssam Jardini" width="900" height="1115" loading="lazy" />
        </figure>
        <div className="about-text">
          <p className="kicker" data-reveal>About me</p>
          <h2 className="head-title" data-reveal>
            Hi, I'm Houssam.
          </h2>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="about-p" data-reveal style={{ '--rd': `${i * 80}ms` }}>
              {p}
            </p>
          ))}
          <dl className="facts" data-reveal>
            {about.facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- experience + tools
function Path() {
  return (
    <section id="path" className="path wrap">
      <Head kicker="Experience" title="Where I've worked and studied." />
      <ol className="log">
        {path.map((p) => (
          <li key={p.when + p.what} className={p.edu ? 'edu' : ''} data-reveal>
            <span className="log-when">{p.when}</span>
            <div className="log-what">
              <h3>
                {p.what}
                {p.edu && <i className="tag">Education</i>}
              </h3>
              <p className="log-where">{p.where}</p>
            </div>
            <p className="log-detail">{p.detail}</p>
          </li>
        ))}
      </ol>

      <div className="kit" data-reveal>
        <p className="kicker">Tools I use most</p>
        <div className="kit-grid">
          {toolkit.map((t) => (
            <div key={t.area}>
              <h3>{t.area}</h3>
              <ul>
                {t.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- contact
function useKenitraTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Casablanca' }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const time = useKenitraTime();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <p className="kicker" data-reveal>Contact</p>
        <h2 className="contact-title" data-reveal>
          Have a role or a project in mind? <em>Let's talk.</em>
        </h2>
        <p className="contact-sub" data-reveal>
          I'm looking for an AI engineering job in Morocco and can start right away. It's {time} in Kénitra.
        </p>
        <div className="mail" data-reveal>
          <a href={`mailto:${person.email}`} className="mail-link">
            {person.email}
          </a>
          <button className="btn btn-sun" onClick={copy} aria-live="polite">
            {copied ? 'Copied. Talk soon.' : 'Copy email'}
          </button>
        </div>
        <ul className="elsewhere" data-reveal>
          <li><a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
          <li><a href={person.github} target="_blank" rel="noreferrer">GitHub ↗</a></li>
          <li><a href={`tel:${person.phone.replace(/\s/g, '')}`}>{person.phone}</a></li>
          <li><a href={person.cv.en} download>CV in English ↓</a></li>
          <li><a href={person.cv.fr} download>CV en français ↓</a></li>
        </ul>
      </div>
      <footer className="foot wrap">
        <span>© {new Date().getFullYear()} Houssam Jardini</span>
        <span>Designed and built by me, in Kénitra.</span>
        <Link to="top">Back to top ↑</Link>
      </footer>
    </section>
  );
}

// ---------------------------------------------------------------- app
const slugFromHash = () => {
  const m = window.location.hash.match(/^#work\/(.+)$/);
  return m && projects.some((p) => p.slug === m[1]) ? m[1] : null;
};

export default function App() {
  useSmoothScroll();
  useReveal();
  const progress = useScrollProgress();
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(slugFromHash);

  const openCase = useCallback((slug) => {
    setOpen(slug);
    const url = slug ? `#work/${slug}` : window.location.pathname + window.location.search;
    window.history.replaceState(null, '', url);
  }, []);

  useEffect(() => {
    const on = () => setOpen(slugFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const idx = Math.max(0, SECTION_IDS.indexOf(active));

  return (
    <>
      <a className="skip" href="#work">Skip to projects</a>
      <Masthead active={active} />
      <main>
        <Hero />
        <Highlight onOpen={openCase} />
        <section id="work" className="work wrap">
          <Head kicker="Selected work" title="Things I've built.">
            Click any project to see how it works.
          </Head>
          <WorkIndex projects={projects} onOpen={openCase} />
        </section>
        <About />
        <Path />
        <Contact />
      </main>
      <LossMeter progress={progress} label={SECTIONS[idx][1]} />
      <CaseDrawer projects={projects} slug={open} onChange={openCase} />
    </>
  );
}
