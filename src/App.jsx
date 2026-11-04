import { Fragment, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import OtslDecoder from './components/OtslDecoder';
import WorkIndex from './components/WorkIndex';
import CaseDrawer from './components/CaseDrawer';
import Figure from './components/Figure';
import Intro from './components/Intro';
import Count from './components/Count';
import { useActiveSection, useReveal, useSmoothScroll, scrollToId } from './hooks';
import { person, hero, specimens, about, flagship, projects, path, toolkit } from './data/portfolioData';
import { coverFor } from './data/media';
import portrait from './assets/portrait.webp';
import cutout from './assets/hero-cutout.webp';

const Specimen = lazy(() => import('./three/Specimen'));
const Beam = lazy(() => import('./components/Beam'));

const SECTIONS = [
  ['top', 'Home'],
  ['lab', 'Lab'],
  ['work', 'Work'],
  ['about', 'About'],
  ['path', 'Path'],
  ['contact', 'Contact'],
];
const SECTION_IDS = SECTIONS.map(([id]) => id);
const SPECIMEN_IDS = specimens.map((s) => s.id);
const CYCLE_MS = 5200;
const SELECTED = ['motionsync', 'rag-document-assistant', 'schemaforge'];

// ---------------------------------------------------------------- icons
const I = {
  arrow: <path d="M5 12h13M13 6l6 6-6 6" />,
  spark: <path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" strokeWidth="1" />,
  mail: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
  globe: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />,
  phone: <path d="M6 3h4l1.5 5-2.5 1.5a12 12 0 0 0 5.5 5.5l1.5-2.5 5 1.5v4a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2z" />,
  pin: <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  target: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 11.5v1" />,
  layers: <path d="m12 3 9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />,
  cpu: <path d="M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />,
  send: <path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7z" />,
};
const Icon = ({ name, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="ico">
    {I[name]}
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
        <b>AI / ML Engineer</b>
        <span>Houssam Jardini</span>
      </Link>
      <nav className="mast-nav" aria-label="Sections">
        {SECTIONS.slice(0, 5).map(([id, label]) => (
          <Link key={id} to={id} className={active === id ? 'on' : ''}>
            {label}
          </Link>
        ))}
      </nav>
      <Link to="contact" className="mast-status">
        {person.availability} <i className="star">✦</i>
      </Link>
    </header>
  );
}

// ---------------------------------------------------------------- hero
function Hero() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!el || !fine || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    let tx = 0;
    let cx = 0;
    const tick = () => {
      cx += (tx - cx) * 0.07;
      el.style.setProperty('--mx', cx.toFixed(4));
      raf = Math.abs(tx - cx) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const on = (e) => {
      tx = e.clientX / window.innerWidth - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    el.addEventListener('pointermove', on, { passive: true });
    return () => {
      el.removeEventListener('pointermove', on);
      cancelAnimationFrame(raf);
    };
  }, []);

  const [first, ...rest] = person.name.split(' ');
  return (
    <section id="top" className="hero" ref={ref}>
      <p className="hero-word" aria-hidden="true">
        {'PORTFOLIO'.split('').map((ch, i) => (
          <span key={i} style={{ '--i': i }}>
            {ch}
          </span>
        ))}
      </p>

      <div className="hero-figure" aria-hidden="true">
        <img src={cutout} alt="" width="1084" height="1250" fetchPriority="high" />
      </div>

      <div className="hero-left">
        <p className="hello load" style={{ '--d': 3 }}>
          Hello, I'm
        </p>
        <h1 className="hero-name load" style={{ '--d': 4 }}>
          {first}
          <br />
          {rest.join(' ')}
        </h1>
        <p className="hero-role load" style={{ '--d': 5 }}>
          AI / Machine Learning
          <br />
          Engineer
        </p>
        <p className="hero-intro load" style={{ '--d': 6 }}>
          {hero.intro}
        </p>
        <div className="hero-cta load" style={{ '--d': 7 }}>
          <Link to="work" className="btn btn-red">
            See the work <Icon name="arrow" size={16} />
          </Link>
          <a className="btn btn-line" href={person.cv.en} download>
            CV <small>EN</small>
          </a>
          <a className="btn btn-line" href={person.cv.fr} download>
            CV <small>FR</small>
          </a>
        </div>
        <p className="hero-where load" style={{ '--d': 8 }}>
          <Icon name="globe" size={15} /> {person.location} · {person.availabilityWhere}
        </p>
      </div>

      <div className="hero-right">
        <p className="hero-tag load" style={{ '--d': 6 }}>
          <span className="ring">
            <Icon name="spark" size={16} />
          </span>
          <span>
            {hero.lineA}
            <br />
            {hero.lineB}
          </span>
        </p>
        <dl className="hero-stats">
          {hero.proof.map((p, i) => (
            <div key={p.value} className="load" style={{ '--d': 7 + i * 0.5 }}>
              <dt>
                <Count value={p.value} />
              </dt>
              <dd>
                <b>{p.unit}</b>
                {p.note}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- selected projects
function Selected({ onOpen }) {
  const list = SELECTED.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean);
  return (
    <section className="selected wrap" aria-labelledby="selected-title">
      <div className="bar-head" data-reveal>
        <h2 id="selected-title">Selected projects</h2>
        <span className="bar-rule" />
        <Link to="work" className="bar-link">
          View all projects <Icon name="arrow" size={18} />
        </Link>
      </div>
      <div className="cards" data-beam="L" data-beam-name="Selected builds">
        {list.map((p, i) => {
          const cover = coverFor(p.slug);
          return (
            <button key={p.slug} className="card" onClick={() => onOpen(p.slug)} data-reveal style={{ '--rd': `${i * 90}ms` }}>
              <span className="card-shot">
                {cover ? <img src={cover} alt="" loading="lazy" /> : <Figure kind={p.figure} label="" />}
              </span>
              <span className="card-meta">
                <span className="card-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="card-text">
                  <b>{p.title}</b>
                  <small>
                    {p.field} · {p.metric}
                  </small>
                </span>
                <Icon name="arrow" size={20} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- split words
// Each word sits in its own mask and rises into place when the heading is
// revealed.
function Words({ text, from = 0 }) {
  const words = text.split(' ');
  return words.map((w, i) => (
    <Fragment key={i}>
      <span className="w">
        <span style={{ '--i': i + from }}>{w}</span>
      </span>
      {i < words.length - 1 ? ' ' : null}
    </Fragment>
  ));
}

// ---------------------------------------------------------------- section head
function Head({ n, kicker, title, children }) {
  return (
    <header className="head" data-reveal>
      <p className="head-n">
        <span>{n}</span> {kicker}
      </p>
      <h2 className="head-title split">
        <Words text={title} />
      </h2>
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

        <div className="lab-grid" data-beam="R" data-beam-name="Flagship · document AI">
          <article className="lab-card" data-reveal>
            <p className="lab-tag">System</p>
            <h3>{d.name}</h3>
            <p className="lab-blurb">{d.blurb}</p>
            <dl className="lab-stats">
              {d.stats.map((s) => (
                <div key={s.k}>
                  <dt>
                    <Count value={s.k} />
                  </dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>
            <button className="btn btn-line" onClick={() => onOpen('docstruct')}>
              Read the case <Icon name="arrow" size={16} />
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
            <button className="btn btn-line" onClick={() => onOpen('table-structure-model')}>
              Read the case <Icon name="arrow" size={16} />
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- specimens
function Specimens() {
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
    <section className="specimens wrap" aria-label="Structures from my projects">
      <div className="specimens-copy" data-reveal>
        <p className="head-n">
          <span>03</span> Specimens
        </p>
        <h2 className="head-title split">
          <Words text="Real structures from" />{' '}
          <em>
            <Words text="real projects" from={3} />
          </em>
        </h2>
        <p className="head-lede">
          Hand landmarks, table grids, body pose, pitch lines, a robot arm. Each shape is the kind of structure one of my models learned to read.
        </p>
      </div>
      <figure className="plate" data-beam="R" data-beam-name="Specimens" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
        <Suspense fallback={null}>
          <Specimen shapes={SPECIMEN_IDS} active={shape} onFrame={onFrame} onReady={() => setReady(true)} />
        </Suspense>
        <div className="plate-read" aria-hidden="true">
          <span>x {coords.x.toFixed(3)}</span>
          <span>y {coords.y.toFixed(3)}</span>
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
    </section>
  );
}

// ---------------------------------------------------------------- about
function About() {
  return (
    <section id="about" className="about wrap">
      <div className="about-grid">
        <figure className="portrait" data-beam="L" data-beam-name="The engineer">
          <img src={portrait} alt="Houssam Jardini" width="765" height="1024" loading="lazy" />
        </figure>
        <div className="about-text">
          <Head n="04" kicker="About" title="Constraints are where it gets interesting." />
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

// ---------------------------------------------------------------- path, method, skills
const METHOD = [
  ['target', 'Frame', 'Pick the one number that says it works, and the benchmark it is measured on.'],
  ['layers', 'Data', 'Collect it, synthesise it when there is none, label only what must be labelled.'],
  ['cpu', 'Model', 'Train small first. Change one variable per run and keep every log.'],
  ['code', 'Software', 'Wrap the model in the API, the app and the edge cases that make it useful.'],
  ['send', 'Ship', 'Run it on the hardware the client actually has, offline if it has to be.'],
];

function Path() {
  const jobs = path.filter((p) => !p.edu);
  const edu = path.filter((p) => p.edu);
  return (
    <section id="path" className="path">
      <div className="path-grid wrap">
        <div className="path-col" data-reveal>
          <h2 className="col-title">Experience</h2>
          <ol className="log">
            {jobs.map((p) => (
              <li key={p.when + p.what}>
                <div>
                  <h3>{p.what}</h3>
                  <p className="log-where">{p.where}</p>
                </div>
                <span className="log-when">{p.when}</span>
              </li>
            ))}
          </ol>
          <h2 className="col-title sub">Education</h2>
          <ol className="log">
            {edu.map((p) => (
              <li key={p.when + p.what}>
                <div>
                  <h3>{p.what}</h3>
                  <p className="log-where">{p.where}</p>
                </div>
                <span className="log-when">{p.when}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="path-col" data-reveal style={{ '--rd': '90ms' }}>
          <h2 className="col-title">How I work</h2>
          <ol className="method">
            {METHOD.map(([icon, name, text], i) => (
              <li key={name}>
                <span className="method-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="ring">
                  <Icon name={icon} size={18} />
                </span>
                <div>
                  <h3>{name}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="quote" data-beam="R" data-beam-name="Method">
          <span className="quote-mark">“</span>
          <p>A model is only as good as the number that proves it works.</p>
          <span className="sign">Houssam</span>
          <Link to="contact" className="quote-cta">
            Let's build something that holds up <Icon name="arrow" size={16} />
          </Link>
        </aside>
      </div>

      <div className="kit wrap" data-reveal>
        <h2 className="col-title">Skills</h2>
        <div className="kit-grid" data-beam="L" data-beam-name="Toolkit">
          {toolkit.map((t) => (
            <div key={t.area}>
              <h3>{t.area}</h3>
              <ul className="chips">
                {t.items.map((x, ci) => (
                  <li key={x} style={{ '--ci': ci }}>
                    {x}
                  </li>
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
function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };
  const rows = [
    ['mail', person.email, `mailto:${person.email}`],
    ['globe', 'linkedin.com/in/jardini-houssam', person.linkedin],
    ['code', 'github.com/HoussamJardini', person.github],
    ['phone', person.phone, `tel:${person.phone.replace(/\s/g, '')}`],
    ['pin', `${person.location} · ${person.availabilityWhere}`, null],
  ];
  return (
    <section id="contact" className="contact">
      <div className="contact-grid wrap">
        <div data-reveal>
          <h2 className="contact-title">
            Let's work{' '}
            <i className="star" data-beam="end" data-beam-name="Transmission end · say hi">
              ✦
            </i>
            <br />
            together
          </h2>
          <p className="contact-sub">
            I'm looking for an AI / ML engineering role in Morocco and can start immediately. Models that are too heavy, too slow or too wrong are my favourite kind of problem.
          </p>
          <div className="contact-cta">
            <button className="btn btn-red" onClick={copy} aria-live="polite">
              {copied ? 'Copied. Talk soon.' : 'Copy my email'}
            </button>
            <a className="btn btn-line" href={person.cv.en} download>
              <Icon name="download" size={16} /> CV EN
            </a>
            <a className="btn btn-line" href={person.cv.fr} download>
              <Icon name="download" size={16} /> CV FR
            </a>
          </div>
        </div>
        <ul className="reach" data-reveal style={{ '--rd': '90ms' }}>
          {rows.map(([icon, label, href]) => (
            <li key={icon}>
              <span className="ring">
                <Icon name={icon} size={17} />
              </span>
              {href ? (
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {label}
                </a>
              ) : (
                <span>{label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <footer className="foot wrap">
        <span>© {new Date().getFullYear()} Houssam Jardini</span>
        <span>Designed and built in Morocco.</span>
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

  return (
    <>
      <a className="skip" href="#work">
        Skip to projects
      </a>
      <Intro />
      <Masthead active={active} />
      <main>
        <Hero />
        <Selected onOpen={openCase} />
        <Lab onOpen={openCase} />
        <section id="work" className="work wrap">
          <Head n="02" kicker="Work" title={`All ${projects.length} projects, numbers included.`}>
            Each one with the number that told me it worked. Open any row for the full story.
          </Head>
          <WorkIndex projects={projects} onOpen={openCase} />
        </section>
        <Specimens />
        <About />
        <Path />
        <Contact />
      </main>
      <Suspense fallback={null}>
        <Beam />
      </Suspense>
      <CaseDrawer projects={projects} slug={open} onChange={openCase} />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
