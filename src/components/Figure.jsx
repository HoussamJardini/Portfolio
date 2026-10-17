// Line drawings used where a project has no screenshot. Same stroke,
// same grid, so they read as one set of plates.

const Dot = ({ x, y, r = 2.6, hot }) => <circle cx={x} cy={y} r={r} className={hot ? 'fig-hot' : 'fig-dot'} />;

const drawings = {
  document: (
    <>
      <rect x="70" y="28" width="120" height="150" rx="2" />
      <path d="M86 50h60M86 62h88M86 74h72" />
      <rect x="86" y="88" width="88" height="44" />
      <path d="M86 103h88M86 118h88M115 88v44M145 88v44" />
      <path d="M86 146h80M86 158h50" />
      <path d="M200 103h30" className="fig-hot-line" />
      <path d="M224 97l6 6-6 6" className="fig-hot-line" />
      <text x="236" y="99">{'{'}</text>
      <text x="244" y="112">"total":</text>
      <text x="244" y="124">"date":</text>
      <text x="236" y="137">{'}'}</text>
      <Dot x={115} y={103} hot />
    </>
  ),
  table: (
    <>
      <rect x="40" y="40" width="240" height="120" />
      <path d="M40 70h240M40 100h240M40 130h240M88 40v120M184 70v90M232 40v120M136 70v90" />
      <text x="58" y="59">C</text><text x="150" y="59">C</text><text x="198" y="59" className="fig-mute">L</text>
      <text x="250" y="59">C</text>
      <text x="58" y="89">C</text><text x="106" y="89">C</text><text x="154" y="89">C</text>
      <text x="202" y="89">C</text><text x="250" y="89">C</text>
      <text x="58" y="119">C</text><text x="58" y="149" className="fig-mute">U</text>
      <path d="M136 40v30" className="fig-faint" />
      <rect x="88" y="40" width="144" height="30" className="fig-hot-line" />
      <text x="40" y="186" className="fig-mute">C L L C C NL · C C C C C NL · …</text>
    </>
  ),
  phone: (
    <>
      <rect x="120" y="20" width="86" height="164" rx="12" />
      <path d="M150 30h26" />
      <rect x="132" y="48" width="62" height="40" rx="2" />
      <path d="M132 100h62M132 112h48M132 124h56" />
      <rect x="132" y="146" width="62" height="18" rx="9" className="fig-hot-line" />
      <path d="M60 70h40M60 82h28M226 110h44M226 122h30" className="fig-faint" />
    </>
  ),
  hand: (
    <>
      {(() => {
        const L = [[160, 176], [128, 154], [106, 128], [90, 104], [76, 86], [130, 112], [124, 78], [121, 56], [119, 36], [156, 108], [155, 68], [154, 44], [153, 22], [178, 112], [183, 76], [186, 54], [188, 36], [196, 124], [206, 98], [212, 82], [218, 66]];
        const E = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
        return (
          <>
            {E.map(([a, b]) => <line key={`${a}-${b}`} x1={L[a][0]} y1={L[a][1]} x2={L[b][0]} y2={L[b][1]} />)}
            {L.map(([x, y], i) => <Dot key={i} x={x} y={y} hot={[4, 8, 12, 16, 20].includes(i)} />)}
          </>
        );
      })()}
      <text x="236" y="40" className="fig-mute">21 pts</text>
    </>
  ),
  pose: (
    <>
      <circle cx="160" cy="34" r="13" />
      <path d="M134 62h52M134 62l-18 34 22 26M186 62l18 34-22 26M134 62l8 60h36l8-60M142 122l-22 36 4 26M178 122l22 36-4 26" />
      {[[134, 62], [186, 62], [116, 96], [204, 96], [142, 122], [178, 122], [120, 158], [200, 158]].map(([x, y], i) => (
        <Dot key={i} x={x} y={y} hot={i === 6 || i === 7} />
      ))}
      <path d="M212 158a20 20 0 0 0-12-18" className="fig-hot-line" />
      <text x="218" y="150" className="fig-mute">92°</text>
    </>
  ),
  bars: (
    <>
      {[0.98, 0.95, 0.97, 0.99, 0.93, 0.96, 0.99, 0.91, 0.98, 0.97, 0.94, 0.99].map((v, i) => (
        <rect key={i} x={46 + i * 20} y={170 - v * 120} width="10" height={v * 120} className={i === 3 ? 'fig-hot-fill' : 'fig-fill'} />
      ))}
      <path d="M40 170h250" />
      <text x="46" y="190" className="fig-mute">en fr ar es zh ja de ru …</text>
    </>
  ),
  chat: (
    <>
      <path d="M60 40h140a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H84l-14 12V82h-10a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8z" />
      <path d="M120 104h140a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8h-10v12l-14-12H120a8 8 0 0 1-8-8v-40a8 8 0 0 1 8-8z" />
      <path d="M72 56h110M72 68h70M128 122h116M128 134h90" className="fig-faint" />
      <rect x="128" y="142" width="34" height="10" className="fig-hot-line" />
    </>
  ),
  arm: (
    <>
      <path d="M100 176h80M116 176l8-20h32l8 20" />
      <path d="M140 156v-30l46-56 52 22" />
      <path d="M238 92l16 6M238 92l12 14" />
      <Dot x={140} y={126} /><Dot x={186} y={70} hot /><Dot x={238} y={92} hot />
      <circle cx="262" cy="108" r="9" className="fig-hot-line" />
      <path d="M60 60q60-40 120-10" className="fig-faint" strokeDasharray="3 5" />
    </>
  ),
  flow: (
    <>
      {[[40, 'mail'], [110, 'pdf'], [180, 'score']].map(([x, t]) => (
        <g key={t}>
          <rect x={x} y="84" width="52" height="32" rx="3" />
          <text x={x + 8} y="104" className="fig-mute">{t}</text>
        </g>
      ))}
      <path d="M92 100h18M162 100h18M232 100h14" />
      <path d="M246 100l20-40h20M246 100h40M246 100l20 40h20" />
      <Dot x={286} y={60} hot /><Dot x={286} y={100} /><Dot x={286} y={140} />
    </>
  ),
  graph: (
    <>
      {[[50, 40], [190, 30], [120, 120], [230, 130]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="72" height="48" />
          <path d={`M${x} ${y + 14}h72`} />
          <path d={`M${x + 8} ${y + 26}h40M${x + 8} ${y + 36}h28`} className="fig-faint" />
        </g>
      ))}
      <path d="M122 64h68M158 64v56M226 78v52" />
      <Dot x={190} y={64} hot /><Dot x={158} y={120} />
    </>
  ),
  maze: (
    <>
      <rect x="80" y="20" width="160" height="160" />
      <path d="M80 60h80M200 20v80M120 100h120M80 140h60M160 140v40M200 140h40M120 60v40" />
      <path d="M100 40h40v40h80v40h-60v40h50" className="fig-hot-line" strokeDasharray="4 4" />
      <Dot x={100} y={40} /><Dot x={210} y={160} hot />
    </>
  ),
};

export default function Figure({ kind, label }) {
  return (
    <svg className="figure" viewBox="0 0 320 200" role="img" aria-label={label}>
      <defs>
        <pattern id="fig-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" className="fig-gridline" />
        </pattern>
      </defs>
      <rect width="320" height="200" fill="url(#fig-grid)" className="fig-bg" />
      <g className="fig-ink">{drawings[kind] || drawings.document}</g>
    </svg>
  );
}
