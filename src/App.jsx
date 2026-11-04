import { Fragment, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import OtslDecoder from './components/OtslDecoder';
import WorkIndex from './components/WorkIndex';
import CaseDrawer from './components/CaseDrawer';
import Figure from './components/Figure';
import Intro from './components/Intro';
import Count from './components/Count';
import { useActiveSection, useReveal, useSmoothScroll, scrollToId } from './hooks';
import { person, hero, about, flagship, projects, path, toolkit } from './data/portfolioData';
import { coverFor } from './data/media';
import cutout from './assets/hero-cutout.webp';

const Swarm = lazy(() => import('./components/Swarm'));

const SECTIONS = [
  ['top', 'Home'],
  ['lab', 'Lab'],
  ['work', 'Work'],
  ['about', 'About'],
  ['path', 'Path'],
  ['contact', 'Contact'],
];
const SECTION_IDS = SECTIONS.map(([id]) => id);
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
    <section id="top" className="hero" ref={ref} data-swarm="core" data-side="C">
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

// ---------------------------------------------------------------- type
// Each word sits in its own mask and rises into place when revealed.
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

// A statement whose words light up one by one as it scrolls through.
function ScrubText({ text, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const words = [...el.querySelectorAll('.sw')];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((w) => {
        w.style.opacity = '1';
      });
      return undefined;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const lit = p * words.length * 1.12;
      words.forEach((w, i) => {
        const o = Math.min(1, Math.max(0.13, lit - i)).toFixed(2);
        if (w.style.opacity !== o) w.style.opacity = o;
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span className="sw">{w}</span>{' '}
        </Fragment>
      ))}
    </p>
  );
}

function Kicker({ n, children }) {
  return (
    <p className="kicker" data-reveal>
      <span>{n}</span> {children}
    </p>
  );
}

// ---------------------------------------------------------------- chapters
// Every chapter tells the swarm which shape to become and which side of the
// screen to take (the text takes the other).
function Statement() {
  const line = hero.intro.split('. ').slice(1).join('. ');
  return (
    <section className="chapter" data-swarm="sphere" data-side="R" data-n="01" aria-label="What I do">
      <div className="col">
        <Kicker n="01">What I do</Kicker>
        <ScrubText className="statement" text={line.charAt(0).toUpperCase() + line.slice(1)} />
      </div>
    </section>
  );
}

function LabChapter({ onOpen }) {
  const { docstruct: d, tsr: t } = flagship;
  const maxP = Math.max(...t.compare.map((c) => c.params));
  return (
    <section id="lab" className="chapter" data-swarm="table" data-side="L" data-n="02">
      <div className="col">
        <Kicker n="02">
          {flagship.org} · {flagship.period}
        </Kicker>
        <h2 className="ch-title split" data-reveal>
          <Words text={flagship.title} />
        </h2>
        <p className="ch-lede" data-reveal>
          {flagship.lede}
        </p>

        <div className="ch-block" data-reveal>
          <p className="lab-tag">System</p>
          <h3 className="ch-h3">{d.name}</h3>
          <p className="ch-text">{d.blurb}</p>
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
        </div>

        <div className="ch-block" data-reveal>
          <p className="lab-tag">Model</p>
          <h3 className="ch-h3">{t.name}</h3>
          <p className="ch-text">{t.blurb}</p>
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
        </div>
      </div>
    </section>
  );
}

function WorkChapter({ onOpen }) {
  const list = SELECTED.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean);
  return (
    <section id="work" className="chapter full" data-swarm="field" data-side="C" data-dim="0.55">
      <div className="wrap">
        <Kicker n="03">Work</Kicker>
        <h2 className="ch-title split" data-reveal>
          <Words text={`${projects.length} projects, numbers included.`} />
        </h2>
        <p className="ch-lede narrow" data-reveal>
          Each one with the number that told me it worked. Open any of them for the full story.
        </p>
        <div className="cards">
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
        <div className="ch-index">
          <WorkIndex projects={projects} onOpen={onOpen} />
        </div>
      </div>
    </section>
  );
}

function AboutChapter() {
  return (
    <section id="about" className="chapter" data-swarm="face" data-side="L" data-n="04">
      <div className="col">
        <Kicker n="04">About</Kicker>
        <h2 className="ch-title split" data-reveal>
          <Words text="Constraints are where it gets interesting." />
        </h2>
        <div className="ch-body">
          {about.paragraphs.map((p, i) => (
            <p key={i} data-reveal style={{ '--rd': `${i * 80}ms` }}>
              {p}
            </p>
          ))}
        </div>
        <dl className="facts" data-reveal>
          {about.facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const METHOD = [
  ['target', 'Frame', 'Pick the one number that says it works, and the benchmark it is measured on.'],
  ['layers', 'Data', 'Collect it, synthesise it when there is none, label only what must be labelled.'],
  ['cpu', 'Model', 'Train small first. Change one variable per run and keep every log.'],
  ['code', 'Software', 'Wrap the model in the API, the app and the edge cases that make it useful.'],
  ['send', 'Ship', 'Run it on the hardware the client actually has, offline if it has to be.'],
];

function Log({ rows }) {
  return (
    <ol className="log">
      {rows.map((p) => (
        <li key={p.when + p.what}>
          <div>
            <h3>{p.what}</h3>
            <p className="log-where">{p.where}</p>
          </div>
          <span className="log-when">{p.when}</span>
        </li>
      ))}
    </ol>
  );
}

function PathChapter() {
  return (
    <section id="path" className="chapter" data-swarm="pose" data-side="R" data-n="05">
      <div className="col">
        <Kicker n="05">Path</Kicker>
        <h2 className="ch-title split" data-reveal>
          <Words text="Where I have been, newest first." />
        </h2>
        <div className="ch-block" data-reveal>
          <h3 className="col-title">Experience</h3>
          <Log rows={path.filter((p) => !p.edu)} />
        </div>
        <div className="ch-block" data-reveal>
          <h3 className="col-title">Education</h3>
          <Log rows={path.filter((p) => p.edu)} />
        </div>
      </div>
    </section>
  );
}

function MethodChapter() {
  return (
    <section className="chapter" data-swarm="arm" data-side="L" data-n="06" aria-label="How I work">
      <div className="col">
        <Kicker n="06">Method</Kicker>
        <ScrubText className="statement small" text="A model is only as good as the number that proves it works." />
        <ol className="method" data-reveal>
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
    </section>
  );
}

function SkillsChapter() {
  return (
    <section className="chapter" data-swarm="pitch" data-side="R" data-n="07" aria-label="Toolkit">
      <div className="col">
        <Kicker n="07">Toolkit</Kicker>
        <h2 className="ch-title split" data-reveal>
          <Words text="What I build with." />
        </h2>
        <div className="kit-list" data-reveal>
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
    <section id="contact" className="contact" data-swarm="core" data-side="C">
      <div className="contact-grid wrap">
        <div data-reveal>
          <h2 className="contact-title">
            Let's work <i className="star">✦</i>
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
      <main className="story">
        <Hero />
        <Statement />
        <LabChapter onOpen={openCase} />
        <WorkChapter onOpen={openCase} />
        <AboutChapter />
        <PathChapter />
        <MethodChapter />
        <SkillsChapter />
        <Contact />
      </main>
      <Suspense fallback={null}>
        <Swarm />
      </Suspense>
      <CaseDrawer projects={projects} slug={open} onChange={openCase} />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
