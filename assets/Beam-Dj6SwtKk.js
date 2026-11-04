import{r as J,j}from"./index-C-xd5fNH.js";import{W as pe,S as ge,P as ye,C as se,c as te,G as we,M as Q,f as ie,A as I,g as xe,h as be,i as oe,D as ce,R as le,B as Me,a as Z,e as Se,V as ne,j as Le,k as Ce,l as ze,m as de,T as Re}from"./three.module-eYZesA4j.js";const ae=18;function Ae(){const R=document.getElementById("top"),h=document.querySelector("main"),m=document.querySelector("main .wrap");if(!R||!h||!m)return null;const a=document.documentElement.clientWidth,P=window.scrollY,c=e=>{const o=e.getBoundingClientRect();return{l:o.left,r:o.right,t:o.top+P,b:o.bottom+P,h:o.height}},t=R.offsetHeight,N=Math.ceil(h.getBoundingClientRect().bottom+P),g=m.getBoundingClientRect().left+parseFloat(getComputedStyle(m).paddingLeft),C=a<900,G=Math.max(9,g*.5),U=a-G,V=e=>e==="R"?U:G,A=window.innerHeight,w=A/2/Math.tan(de.degToRad(ae/2)),x=Math.min(w*.22,C?220:520),M=-w*(C?.35:.6);let y,b;const _=document.querySelector(".hero-figure");if(C&&_){const e=c(_),o=(e.l+e.r)/2;y=[{x:o+a*.02,y:e.t+e.h*.34,z:M*.5,hero:!0},{x:a*.13,y:e.t+e.h*.22,z:x*.7,hero:!0},{x:o-a*.02,y:e.t-e.h*.03,z:x*.35,hero:!0},{x:a*.84,y:e.t+e.h*.12,z:x*.7,hero:!0},{x:o+a*.08,y:e.t+e.h*.6,z:M*.75,hero:!0},{x:G,y:e.b+40,z:0}],b=e.b+40}else y=[{x:a*.5,y:t*.3,z:M*.55,hero:!0},{x:a*.765,y:t*.47,z:x*.8,hero:!0},{x:a*.725,y:t*.66,z:x*.2,hero:!0},{x:a*.47,y:t*.78,z:M*.7,hero:!0},{x:a*.3,y:t*.95,z:M*.2,hero:!0},{x:G,y:t+160,z:0}],b=t+160;const v=[...document.querySelectorAll("[data-beam]")].filter(e=>e.getClientRects().length),H=[];let p="L",S=b,E=b-40;return v.forEach(e=>{const o=C&&e.dataset.beam==="R"?"L":e.dataset.beam,f=c(e),Y=o==="end"?"L":o;let L;if(o==="end"?L={x:(f.l+f.r)/2,y:(f.t+f.b)/2}:L={x:o==="L"?f.l-1:f.r+1,y:f.t+Math.min(f.h*.4,140)},Y!==p){const k=Math.max(S+60,E+40),$=Math.max(k+220,Math.min(f.t-40,k+460));y.push({x:V(p),y:k,z:0},{x:a/2,y:(k+$)/2,z:x},{x:V(Y),y:$,z:0}),S=$,p=Y}else H.length&&L.y-160-S>260&&y.push({x:V(p),y:(S+L.y-160)/2,z:M});const O=Math.max(S+30,L.y-(o==="end"?230:160));L.y=Math.max(L.y,O+(o==="end"?110:70)),y.push({x:V(p),y:O,z:0}),o==="end"&&y.push({x:L.x,y:L.y-50,z:0}),H.push({...L,side:o,key:y.length,el:e,name:e.dataset.beamName||""}),y.push({...L,z:0}),o!=="end"&&(y.push({x:V(p),y:L.y+160,z:0}),S=L.y+160),E=f.b}),y.forEach(e=>{if(!e.z)return;const o=(w-e.z)/w,f=e.hero?A/2:e.y-A*.22;e.x=a/2+(e.x-a/2)*o,e.y=f+(e.y-f)*o}),{W:a,H:t,docH:N,keys:y,hits:H,labels:g>=200,mobile:C}}const Ee=`
  attribute float aW;
  attribute float aD;
  uniform float uTime;
  uniform float uL;
  uniform float uAmp;
  varying float vU;
  varying float vD;
  varying float vDepth;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vU = uv.x;
    vD = aD;
    vec3 p = position;
    vDepth = clamp(1.0 + p.z / 1100.0, 0.22, 1.6);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`,Te=`
  uniform float uHead;
  uniform float uL;
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying float vU;
  varying float vDepth;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float face = abs(dot(vN, vV));
    float ahead = (vU - uHead) * uL;
    if (ahead > 0.0) {
      // the route still to come: a faint dotted guide that flows forward
      float d = fract(vU * uL / 15.0 - uTime * 0.9);
      if (d > 0.2) discard;
      float fade = 1.0 - smoothstep(0.0, 2600.0, ahead);
      gl_FragColor = vec4(uColor * 0.55, 0.3 * fade * face * vDepth);
      return;
    }
    float comet = exp((vU - uHead) * uL / 150.0);
    vec3 col = mix(uColor, uHot, pow(face, 4.0) * 0.9 * min(vDepth, 1.0) + comet * 0.55);
    gl_FragColor = vec4(col * (0.75 + comet * 1.6) * vDepth, (0.6 + 0.4 * face) * min(vDepth * 1.1, 1.0));
  }
`,ue=`
  uniform float uHead;
  uniform float uL;
  uniform vec3 uColor;
  uniform float uPower;
  varying float vU;
  varying float vDepth;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    if (vU > uHead) discard;
    float face = abs(dot(vN, vV));
    float comet = exp((vU - uHead) * uL / 220.0);
    gl_FragColor = vec4(uColor, pow(face, 2.2) * uPower * (1.0 + comet * 2.2) * vDepth * vDepth);
  }
`,Pe=`
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float face = abs(dot(vN, vV));
    vec3 col = mix(uColor, uHot, pow(face, 2.5));
    gl_FragColor = vec4(col * 1.6, 1.0);
  }
`,He=`
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`,De=`
  attribute float aLife;
  uniform float uScale;
  varying float vLife;
  void main() {
    vLife = aLife;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uScale * (0.4 + aLife) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`,Ve=`
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying float vLife;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5 || vLife <= 0.0) discard;
    float a = smoothstep(0.5, 0.0, d) * vLife;
    gl_FragColor = vec4(mix(uColor, uHot, vLife), a);
  }
`;function Fe(){const R=document.createElement("canvas");R.width=R.height=128;const h=R.getContext("2d"),m=h.createRadialGradient(64,64,0,64,64,64);m.addColorStop(0,"rgba(255,235,228,1)"),m.addColorStop(.12,"rgba(255,90,70,0.85)"),m.addColorStop(.4,"rgba(227,20,28,0.25)"),m.addColorStop(1,"rgba(227,20,28,0)"),h.fillStyle=m,h.fillRect(0,0,128,128);const a=new Le(R);return a.colorSpace=Ce,a}function je(R){const h=new pe({canvas:R,alpha:!0,antialias:!0,powerPreference:"high-performance"});h.setClearColor(0,0),h.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));const m=new ge,a=new ye(ae,1,10,2e4),P=new se("#ff2a1f"),c=new se("#fff0ea"),t={uTime:{value:0},uHead:{value:0},uL:{value:1},uAmp:{value:0}},N=(n,i={},l=Ee)=>new te({vertexShader:l,fragmentShader:n,uniforms:{...t,uColor:{value:P},uHot:{value:c},...i},transparent:!0,depthWrite:!1,depthTest:!1,blending:I}),D={core:N(Te),glow:N(ue,{uPower:{value:.32}}),aura:N(ue,{uPower:{value:.09}})},g=new we,C=new Q(new ie(5.5,32,20),new te({vertexShader:He,fragmentShader:Pe,uniforms:{uColor:{value:P},uHot:{value:c}},transparent:!0,depthTest:!1,blending:I})),G=new xe(new be({map:Fe(),blending:I,depthTest:!1,depthWrite:!1,transparent:!0}));G.scale.set(120,120,1);const U=new oe({color:P,transparent:!0,blending:I,depthTest:!1,side:ce}),V=new Q(new le(1,1.08,64),U);g.add(G,C,V),m.add(g);const A=280,w=new Float32Array(A*3),x=new Float32Array(A*3),M=new Float32Array(A),y=new Float32Array(A),b=new Me;b.setAttribute("position",new Z(w,3)),b.setAttribute("aLife",new Z(M,1));const _=new te({vertexShader:De,fragmentShader:Ve,uniforms:{uScale:{value:9e3},uColor:{value:P},uHot:{value:c}},transparent:!0,depthWrite:!1,depthTest:!1,blending:I}),v=new Se(b,_);v.frustumCulled=!1,m.add(v);let H=0;const p=[],S=new le(1,1.06,72),E=new ie(2.6,16,12),e=new oe({color:P,transparent:!0,blending:I,depthTest:!1});let o=null,f=[];const Y=new ne;function L(n){const{L:i,hits:l}=o;let r=Math.min(1,n/160,(i-n)/160);for(const u of l)r=Math.min(r,Math.max(0,(Math.abs(n-u.len)-26)/230));return Math.max(0,r)}function O(n,i,l,r,u){const T=new Re(n,i,l,r,!1),z=T.attributes.position.count,q=new Float32Array(z),W=new Float32Array(z);for(let s=0;s<=i;s++){const F=s/i*o.L,B=L(F),d=1;for(let K=0;K<=r;K++)q[s*(r+1)+K]=B,W[s*(r+1)+K]=d}return T.setAttribute("aW",new Z(q,1)),T.setAttribute("aD",new Z(W,1)),T}function k(n){f.forEach(d=>{m.remove(d),d.geometry.dispose()}),f=[];const i=n.keys.map(d=>new ne(d.x,-d.y,d.z)),l=new ze(i,!1,"centripetal"),r=l.getLength(),u=8e3,T=l.getLengths(u);n.hits.forEach(d=>{d.len=T[Math.round(d.key/(i.length-1)*u)]});const z=Math.ceil(r/6),q=new Float32Array(z+1);let W=-1/0;for(let d=0;d<=z;d++)l.getPointAt(d/z,Y),W=Math.max(W,-Y.y),q[d]=W;o={curve:l,L:r,ym:q,N:z,hits:n.hits},t.uL.value=r;const s=Math.ceil(r/(n.mobile?7:5)),F=(d,K)=>{const ee=new Q(d,K);ee.frustumCulled=!1,m.add(ee),f.push(ee)},B=n.mobile?.75:1;return F(O(l,s,15*B,10),D.aura),F(O(l,s,6*B,10),D.glow),F(O(l,s,1.9*B,10),D.core),o}function $(n,i){h.setSize(n,i,!1),a.aspect=n/i,a.updateProjectionMatrix()}function me(n,i){const{curve:l,L:r}=o;return l.getPointAt(Math.min(1,Math.max(0,n/r)),i)}function fe(n,i){for(let r=0;r<2;r++){const u=new Q(S,new oe({color:r?c:P,transparent:!0,blending:I,depthTest:!1,side:ce}));u.position.set(n.x,-n.y,0),u.userData={born:i+r*.16},u.scale.setScalar(.001),m.add(u),p.push(u)}const l=new Q(E,e);l.position.set(n.x,-n.y,0),m.add(l),f.push(l);for(let r=0;r<40;r++)re(n.x,-n.y,0,90+Math.random()*160)}function re(n,i,l,r){const u=H++%A,T=Math.random()*Math.PI*2,z=(Math.random()-.5)*Math.PI;w[u*3]=n,w[u*3+1]=i,w[u*3+2]=l,x[u*3]=Math.cos(T)*Math.cos(z)*r,x[u*3+1]=Math.sin(T)*Math.cos(z)*r,x[u*3+2]=Math.sin(z)*r,y[u]=.5+Math.random()*.8,M[u]=1}let X=null;function he({t:n,dt:i,scrollY:l,W:r,H:u,cur:T}){if(!o)return;a.position.set(r/2,-(l+u/2),u/2/Math.tan(de.degToRad(ae/2))),a.lookAt(r/2,-(l+u/2),0),t.uTime.value=n,t.uHead.value=T/o.L,me(T,g.position),g.visible=T>2;const z=n*.7%1;V.scale.setScalar(8+z*22),U.opacity=(1-z)*.8,C.scale.setScalar(1+Math.sin(n*6)*.08);const q=X?g.position.distanceTo(X):0;X=(X||new ne).copy(g.position);const W=Math.min(6,1+Math.floor(q/6));if(g.visible)for(let s=0;s<W;s++)Math.random()<.7&&re(g.position.x,g.position.y,g.position.z,20+Math.random()*70);for(let s=0;s<A;s++)M[s]<=0||(M[s]-=i/y[s],x[s*3+1]-=40*i,w[s*3]+=x[s*3]*i,w[s*3+1]+=x[s*3+1]*i,w[s*3+2]+=x[s*3+2]*i);b.attributes.position.needsUpdate=!0,b.attributes.aLife.needsUpdate=!0,_.uniforms.uScale.value=9e3*h.getPixelRatio();for(let s=p.length-1;s>=0;s--){const F=p[s],B=n-F.userData.born;if(B<0)continue;const d=Math.min(1,B/1.3);F.scale.setScalar(6+(1-(1-d)**3)*70),F.material.opacity=1-d,d>=1&&(m.remove(F),F.material.dispose(),p.splice(s,1))}h.render(m,a)}function ve(){f.forEach(n=>n.geometry.dispose()),Object.values(D).forEach(n=>n.dispose()),b.dispose(),h.dispose()}return{setRoute:k,size:$,frame:he,hit:fe,dispose:ve}}function _e(){const R=J.useRef(null),h=J.useRef(null),m=J.useRef(null),[a,P]=J.useState(null);return J.useEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!R.current)return;let c;try{c=je(R.current)}catch{return}document.documentElement.classList.add("beam-on");const t={cur:0,target:0,route:null,hits:[],done:[],started:!1};let N=document.documentElement.clientWidth,D=window.innerHeight;c.size(N,D);let g=0;const C=()=>{clearTimeout(g),g=setTimeout(()=>{N=document.documentElement.clientWidth,D=window.innerHeight,c.size(N,D);const v=Ae();v&&(t.route=c.setRoute(v),t.hits=v.hits,t.done=v.hits.map(H=>H.el.classList.contains("beam-hit")),P(v))},120)},G=C;C();const U=new ResizeObserver(C),V=document.querySelector("main");V&&U.observe(V),window.addEventListener("resize",G),document.fonts?.ready.then(C);let A=0;const w=()=>{C(),A=setTimeout(()=>{t.started=!0},1100)};document.documentElement.classList.contains("intro-done")?w():window.addEventListener("intro:done",w,{once:!0});const x=v=>{const{ym:H,N:p,L:S}=t.route;if(v>=H[p])return S;let E=0,e=p;for(;E<e;){const o=E+e>>1;H[o]<v?E=o+1:e=o}return E/p*S};let M=0,y=performance.now(),b=-2;const _=v=>{M=requestAnimationFrame(_);const H=Math.min(.05,(v-y)/1e3);if(y=v,!t.route||document.hidden)return;const p=window.scrollY;t.target=t.started?Math.min(t.route.L,x(p+D*.72)):0;const S=t.target-t.cur;t.cur=Math.abs(S)<.4?t.target:t.cur+Math.sign(S)*Math.min(Math.abs(S)*.075,95);let E=-1;t.hits.forEach((e,o)=>{t.cur>=e.len-1&&(E=o,t.done[o]||(t.done[o]=!0,e.el.classList.add("beam-hit"),c.hit(e,v/1e3),m.current?.querySelectorAll(".beam-label")[o]?.classList.add("on")))}),h.current&&(h.current.querySelector("b").textContent=`${String(Math.round(t.cur/t.route.L*100)).padStart(2,"0")}%`,E!==b&&(b=E,h.current.querySelector("span").textContent=b<0?"Intro":t.hits[b].name)),c.frame({t:v/1e3,dt:H,scrollY:p,W:N,H:D,cur:t.cur})};return M=requestAnimationFrame(_),()=>{cancelAnimationFrame(M),clearTimeout(g),clearTimeout(A),window.removeEventListener("intro:done",w),U.disconnect(),window.removeEventListener("resize",G),document.documentElement.classList.remove("beam-on"),c.dispose()}},[]),j.jsxs(j.Fragment,{children:[j.jsx("canvas",{className:"beam-canvas",ref:R,"aria-hidden":"true"}),j.jsx("div",{className:"beam-layer",ref:m,style:{height:a?.docH||0},"aria-hidden":"true",children:a?.labels&&a.hits.map((c,t)=>c.side==="end"?j.jsx("span",{className:"beam-label"},t):j.jsxs("span",{className:`beam-label ${c.side}`,style:c.side==="L"?{right:a.W-c.x+24,top:c.y-14}:{left:c.x+24,top:c.y-14},children:[j.jsxs("b",{children:["Signal ",String(t+1).padStart(2,"0")]}),c.name]},t))}),j.jsxs("div",{className:"beam-hud",ref:h,"aria-hidden":"true",children:[j.jsx("i",{}),"Signal ",j.jsx("b",{children:"00%"}),j.jsx("span",{children:"Intro"})]})]})}export{_e as default};
