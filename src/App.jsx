import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import OtslDecoder from './components/OtslDecoder';
import WorkIndex from './components/WorkIndex';
import CaseDrawer from './components/CaseDrawer';
import LossMeter from './components/LossMeter';
import { useActiveSection, useReveal, useScrollProgress, useSmoothScroll, scrollToId } from './hooks';
import { person, hero, specimens, about, flagship, projects, path, toolkit } from './data/portfolioData';
import portrait from './assets/portrait.webp';

const Specimen = lazy(() => import('./three/Specimen'));

const SECTIONS = [
  ['top', 'Intro'],
  ['lab', 'Lab'],
  ['work', 'Work'],
  ['about', 'About'],
  ['path', 'Path'],
  ['contact', 'Contact'],
];
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
      setSolid(y > 40);
      setHidden(y > 500 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`mast ${hidden ? 'away' : ''} ${solid ? 'solid' : ''}`}>
      <Link to="top" className="mast-name">
        Houssam Jardini
      </Link>
      <nav className="mast-nav" aria-label="Sections">
        {SECTIONS.slice(1, 5).map(([id, label]) => (
          <Link key={id} to={id} className={active === id ? 'on' : ''}>
            {label}
          </Link>
        ))}
      </nav>
      <Link to="contact" className="mast-status">
        <i className="pulse" aria-hidden="true" />
        <span>
          {person.availability}
          <span className="where"> · {person.availabilityWhere}</span>
        </span>
      </Link>
    </header>
  );
}

// ---------------------------------------------------------------- hero
function Hero() {
  const [shape, setShape] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!ready || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setTimeout(() => setShape((s) => (s + 1) % specimens.length), CYCLE_MS);
    return () => clearTimeout(id);
  }, [shape, paused, ready]);

  const onFrame = useCallback(({ x, y, inside }) => {
    if (inside) setCoords({ x, y });
  }, []);

  const s = specimens[shape];
  return (
    <section id="top" className="hero">
      <div className="hero-copy">
        <p className="eyebrow load" style={{ '--d': 0 }}>
          {person.role} <span className="sep">/</span> {person.location}
        </p>
        <h1 className="hero-title">
          <span className="line">
            <span className="load" style={{ '--d': 1 }}>{hero.lineA}</span>
          </span>
          <span className="line">
            <span className="load" style={{ '--d': 2 }}>
              {hero.lineB.split(' ').slice(0, -1).join(' ')} <em>{hero.lineB.split(' ').slice(-1)}</em>
            </span>
          </span>
        </h1>
        <p className="hero-intro load" style={{ '--d': 3 }}>
          {hero.intro}
        </p>
        <div className="hero-cta load" style={{ '--d': 4 }}>
          <Link to="lab" className="btn btn-solid">
            See the work <Arrow />
          </Link>
          <a className="btn btn-line" href={person.cv.en} download>
            CV (EN)
          </a>
          <a className="btn btn-line" href={person.cv.fr} download>
            CV (FR)
          </a>
        </div>
      </div>

      <figure
        className="plate load"
        style={{ '--d': 2 }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <span className="crop tl" /><span className="crop tr" /><span className="crop bl" /><span className="crop br" />
        <Suspense fallback={null}>
          <Specimen shapes={SPECIMEN_IDS} active={shape} onFrame={onFrame} onReady={() => setReady(true)} />
        </Suspense>
        <div className="plate-read" aria-hidden="true">
          <span>x {coords.x.toFixed(3)}</span>
          <span>y {coords.y.toFixed(3)}</span>
          <span>n 2600</span>
        </div>
        <figcaption className="plate-cap">
          <span className="plate-fig">Fig. {String(shape + 1).padStart(2, '0')}</span>
          <span className="plate-label" key={s.id}>
            {s.label} <small>{s.source}</small>
          </span>
        </figcaption>
        <div className="plate-tabs" role="tablist" aria-label="Specimens from my projects">
          {specimens.map((sp, i) => (
            <button
              key={sp.id}
              role="tab"
              aria-selected={i === shape}
              aria-label={`${sp.label}, ${sp.source}`}
              className={i === shape ? 'on' : ''}
              onClick={() => setShape(i)}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              <i style={{ animationDuration: `${CYCLE_MS}ms`, animationPlayState: paused || !ready ? 'paused' : 'running' }} />
            </button>
          ))}
        </div>
      </figure>

      <dl className="proof">
        {hero.proof.map((p, i) => (
          <div key={p.value} className="load" style={{ '--d': 5 + i * 0.5 }}>
            <dt>
              {p.value} <small>{p.unit}</small>
            </dt>
            <dd>{p.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// ---------------------------------------------------------------- section head
function Head({ n, kicker, title, children }) {
  return (
    <header className="head" data-reveal>
      <p className="head-n">
        <span>§{n}</span> {kicker}
      </p>
      <h2 className="head-title">{title}</h2>
      {children && <p className="head-lede">{children}</p>}
    </header>
  );
}

// ---------------------------------------------------------------- lab
function Lab({ onOpen }) {
  const { docstruct: d, tsr: t } = flagship;
  const maxP = Math.max(...t.compare.map((c) => c.params));
  return (
    <section id="lab" className="lab">
      <div className="wrap">
        <Head n="01" kicker={`${flagship.org} · ${flagship.period}`} title={flagship.title}>
          {flagship.lede}
        </Head>

        <div className="lab-grid">
          <article className="lab-card" data-reveal>
            <p className="lab-tag">System</p>
            <h3>{d.name}</h3>
            <p className="lab-blurb">{d.blurb}</p>
            <dl className="lab-stats">
              {d.stats.map((s) => (
                <div key={s.k}>
                  <dt>{s.k}</dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>
            <button className="btn btn-ghost" onClick={() => onOpen('docstruct')}>
              Read the case <Arrow />
            </button>
          </article>

          <article className="lab-card" data-reveal style={{ '--rd': '120ms' }}>
            <p className="lab-tag">Model</p>
            <h3>{t.name}</h3>
            <p className="lab-blurb">{t.blurb}</p>
            <OtslDecoder />
            <div className="versus">
              {t.compare.map((c, i) => (
                <div key={c.name} className={`vs-row ${i === 0 ? 'mine' : ''}`}>
                  <span className="vs-name">{c.name}</span>
                  <span className="vs-bar">
                    <i style={{ '--w': c.params / maxP }} />
                  </span>
                  <span className="vs-num">{c.params}M</span>
                  <span className="vs-score">{c.steds.toFixed(3)}</span>
                </div>
              ))}
              <p className="vs-legend">
                <span>parameters</span>
                <span>S-TEDS on real scanned tables</span>
              </p>
            </div>
            <ul className="lab-notes">
              {t.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <button className="btn btn-ghost" onClick={() => onOpen('table-structure-model')}>
              Read the case <Arrow />
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- about
function About() {
  return (
    <section id="about" className="about wrap">
      <Head n="03" kicker="About" title="Constraints are where it gets interesting." />
      <div className="about-grid">
        <figure className="portrait" data-reveal>
          <img src={portrait} alt="Houssam Jardini" width="830" height="1037" loading="lazy" />
          <figcaption>Houssam Jardini</figcaption>
        </figure>
        <div className="about-text">
          {about.paragraphs.map((p, i) => (
            <p key={i} data-reveal style={{ '--rd': `${i * 80}ms` }}>
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

// ---------------------------------------------------------------- path + toolkit
function Path() {
  return (
    <section id="path" className="path wrap">
      <Head n="04" kicker="Path" title="Where I've been, newest first." />
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
        <p className="head-n">
          <span>§05</span> Toolkit
        </p>
        <div className="kit-grid">
          {toolkit.map((t) => (
            <div key={t.area}>
              <h3>{t.area}</h3>
              <p>{t.items.join(' / ')}</p>
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
        <p className="head-n" data-reveal>
          <span>§06</span> Contact
        </p>
        <h2 className="contact-title" data-reveal>
          Have a model that is too heavy, too slow or too wrong? <em>Let's fix it.</em>
        </h2>
        <p className="contact-sub" data-reveal>
          I'm looking for an AI / ML engineering role in Morocco and can start immediately. It's {time} in Kénitra right now.
        </p>
        <div className="mail" data-reveal>
          <a href={`mailto:${person.email}`} className="mail-link">
            {person.email}
          </a>
          <button className="btn btn-signal" onClick={copy} aria-live="polite">
            {copied ? 'Copied. Talk soon.' : 'Copy address'}
          </button>
        </div>
        <ul className="elsewhere" data-reveal>
          <li><a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
          <li><a href={person.github} target="_blank" rel="noreferrer">GitHub ↗</a></li>
          <li><a href={`tel:${person.phone.replace(/\s/g, '')}`}>{person.phone}</a></li>
          <li><a href={person.cv.en} download>CV, English ↓</a></li>
          <li><a href={person.cv.fr} download>CV, français ↓</a></li>
        </ul>
      </div>
      <footer className="foot wrap">
        <span>© {new Date().getFullYear()} Houssam Jardini</span>
        <span>Designed and built in Kénitra. Set in Archivo and JetBrains Mono.</span>
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

  const epoch = Math.max(1, SECTION_IDS.indexOf(active) + 1);

  return (
    <>
      <a className="skip" href="#work">Skip to projects</a>
      <Masthead active={active} />
      <main>
        <Hero />
        <Lab onOpen={openCase} />
        <section id="work" className="work wrap">
          <Head n="02" kicker="Work" title={`${projects.length} projects. Numbers included.`}>
            Each one with the number that told me it worked. Open any row for the full story.
          </Head>
          <WorkIndex projects={projects} onOpen={openCase} />
        </section>
        <About />
        <Path />
        <Contact />
      </main>
      <LossMeter progress={progress} epoch={epoch} epochs={SECTIONS.length} label={SECTIONS[epoch - 1][1]} />
      <CaseDrawer projects={projects} slug={open} onChange={openCase} />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
