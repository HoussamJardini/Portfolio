import{r as J,j as N}from"./index-CAZpfed2.js";import{W as pe,S as ge,P as ye,C as se,c as te,G as we,M as Q,f as ie,A as I,g as xe,h as be,i as oe,D as ce,R as le,B as Me,a as Z,e as Se,V as ne,j as Le,k as Ce,l as ze,m as de,T as Re}from"./three.module-eYZesA4j.js";const ae=18;function Ae(){const z=document.getElementById("top"),p=document.querySelector("main"),m=document.querySelector("main .wrap");if(!z||!p||!m)return null;const n=document.documentElement.clientWidth,A=window.scrollY,c=e=>{const a=e.getBoundingClientRect();return{l:a.left,r:a.right,t:a.top+A,b:a.bottom+A,h:a.height}},t=z.offsetHeight,G=Math.ceil(p.getBoundingClientRect().bottom+A),x=m.getBoundingClientRect().left+parseFloat(getComputedStyle(m).paddingLeft),R=n<900,_=Math.max(9,x*.5),U=n-_,V=e=>e==="R"?U:_,E=window.innerHeight,M=E/2/Math.tan(de.degToRad(ae/2)),g=Math.min(M*.22,R?220:520),S=-M*(R?.35:.6);let f,L;const h=document.querySelector(".hero-figure");if(R&&h){const e=c(h),a=(e.l+e.r)/2;f=[{x:a+n*.02,y:e.t+e.h*.34,z:S*.5,hero:!0},{x:n*.13,y:e.t+e.h*.22,z:g*.7,hero:!0},{x:a-n*.02,y:e.t-e.h*.03,z:g*.35,hero:!0},{x:n*.84,y:e.t+e.h*.12,z:g*.7,hero:!0},{x:a+n*.08,y:e.t+e.h*.6,z:S*.75,hero:!0},{x:_,y:e.b+40,z:0}],L=e.b+40}else f=[{x:n*.5,y:t*.3,z:S*.55,hero:!0},{x:n*.765,y:t*.47,z:g*.8,hero:!0},{x:n*.725,y:t*.66,z:g*.2,hero:!0},{x:n*.47,y:t*.78,z:S*.7,hero:!0},{x:n*.3,y:t*.95,z:S*.2,hero:!0},{x:_,y:t+160,z:0}],L=t+160;const F=[...document.querySelectorAll("[data-beam]")].filter(e=>e.getClientRects().length),T=[];let y="L",w=L,P=L-40;return F.forEach(e=>{const a=R&&e.dataset.beam==="R"?"L":e.dataset.beam,v=c(e),Y=a==="end"?"L":a;let b;if(a==="end"?b={x:(v.l+v.r)/2,y:(v.t+v.b)/2}:b={x:a==="L"?v.l-1:v.r+1,y:v.t+Math.min(v.h*.4,140)},Y!==y){const k=Math.max(w+60,P+40),$=Math.max(k+220,Math.min(v.t-40,k+460));f.push({x:V(y),y:k,z:0},{x:n/2,y:(k+$)/2,z:g},{x:V(Y),y:$,z:0}),w=$,y=Y}else T.length&&b.y-160-w>260&&f.push({x:V(y),y:(w+b.y-160)/2,z:S});const O=Math.max(w+30,b.y-(a==="end"?230:160));b.y=Math.max(b.y,O+(a==="end"?110:70)),f.push({x:V(y),y:O,z:0}),a==="end"&&f.push({x:b.x,y:b.y-50,z:0}),T.push({...b,side:a,key:f.length,el:e,name:e.dataset.beamName||""}),f.push({...b,z:0}),a!=="end"&&(f.push({x:V(y),y:b.y+160,z:0}),w=b.y+160),P=v.b}),f.forEach(e=>{if(!e.z)return;const a=(M-e.z)/M,v=e.hero?E/2:e.y-E*.22;e.x=n/2+(e.x-n/2)*a,e.y=v+(e.y-v)*a}),{W:n,H:t,docH:G,keys:f,hits:T,labels:x>=200,mobile:R}}const Ee=`
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
`;function Fe(){const z=document.createElement("canvas");z.width=z.height=128;const p=z.getContext("2d"),m=p.createRadialGradient(64,64,0,64,64,64);m.addColorStop(0,"rgba(255,235,228,1)"),m.addColorStop(.12,"rgba(255,90,70,0.85)"),m.addColorStop(.4,"rgba(227,20,28,0.25)"),m.addColorStop(1,"rgba(227,20,28,0)"),p.fillStyle=m,p.fillRect(0,0,128,128);const n=new Le(z);return n.colorSpace=Ce,n}function je(z){const p=new pe({canvas:z,alpha:!0,antialias:!0,powerPreference:"high-performance"});p.setClearColor(0,0),p.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));const m=new ge,n=new ye(ae,1,10,2e4),A=new se("#ff2a1f"),c=new se("#fff0ea"),t={uTime:{value:0},uHead:{value:0},uL:{value:1},uAmp:{value:0}},G=(o,i={},l=Ee)=>new te({vertexShader:l,fragmentShader:o,uniforms:{...t,uColor:{value:A},uHot:{value:c},...i},transparent:!0,depthWrite:!1,depthTest:!1,blending:I}),D={core:G(Te),glow:G(ue,{uPower:{value:.32}}),aura:G(ue,{uPower:{value:.09}})},x=new we,R=new Q(new ie(5.5,32,20),new te({vertexShader:He,fragmentShader:Pe,uniforms:{uColor:{value:A},uHot:{value:c}},transparent:!0,depthTest:!1,blending:I})),_=new xe(new be({map:Fe(),blending:I,depthTest:!1,depthWrite:!1,transparent:!0}));_.scale.set(120,120,1);const U=new oe({color:A,transparent:!0,blending:I,depthTest:!1,side:ce}),V=new Q(new le(1,1.08,64),U);x.add(_,R,V),m.add(x);const E=280,M=new Float32Array(E*3),g=new Float32Array(E*3),S=new Float32Array(E),f=new Float32Array(E),L=new Me;L.setAttribute("position",new Z(M,3)),L.setAttribute("aLife",new Z(S,1));const h=new te({vertexShader:De,fragmentShader:Ve,uniforms:{uScale:{value:9e3},uColor:{value:A},uHot:{value:c}},transparent:!0,depthWrite:!1,depthTest:!1,blending:I}),F=new Se(L,h);F.frustumCulled=!1,m.add(F);let T=0;const y=[],w=new le(1,1.06,72),P=new ie(2.6,16,12),e=new oe({color:A,transparent:!0,blending:I,depthTest:!1});let a=null,v=[];const Y=new ne;function b(o){const{L:i,hits:l}=a;let r=Math.min(1,o/160,(i-o)/160);for(const u of l)r=Math.min(r,Math.max(0,(Math.abs(o-u.len)-26)/230));return Math.max(0,r)}function O(o,i,l,r,u){const H=new Re(o,i,l,r,!1),C=H.attributes.position.count,q=new Float32Array(C),W=new Float32Array(C);for(let s=0;s<=i;s++){const j=s/i*a.L,B=b(j),d=1;for(let K=0;K<=r;K++)q[s*(r+1)+K]=B,W[s*(r+1)+K]=d}return H.setAttribute("aW",new Z(q,1)),H.setAttribute("aD",new Z(W,1)),H}function k(o){v.forEach(d=>{m.remove(d),d.geometry.dispose()}),v=[];const i=o.keys.map(d=>new ne(d.x,-d.y,d.z)),l=new ze(i,!1,"centripetal"),r=l.getLength(),u=8e3,H=l.getLengths(u);o.hits.forEach(d=>{d.len=H[Math.round(d.key/(i.length-1)*u)]});const C=Math.ceil(r/6),q=new Float32Array(C+1);let W=-1/0;for(let d=0;d<=C;d++)l.getPointAt(d/C,Y),W=Math.max(W,-Y.y),q[d]=W;a={curve:l,L:r,ym:q,N:C,hits:o.hits},t.uL.value=r;const s=Math.ceil(r/(o.mobile?7:5)),j=(d,K)=>{const ee=new Q(d,K);ee.frustumCulled=!1,m.add(ee),v.push(ee)},B=o.mobile?.75:1;return j(O(l,s,15*B,10),D.aura),j(O(l,s,6*B,10),D.glow),j(O(l,s,1.9*B,10),D.core),a}function $(o,i){p.setSize(o,i,!1),n.aspect=o/i,n.updateProjectionMatrix()}function me(o,i){const{curve:l,L:r}=a;return l.getPointAt(Math.min(1,Math.max(0,o/r)),i)}function fe(o,i){for(let r=0;r<2;r++){const u=new Q(w,new oe({color:r?c:A,transparent:!0,blending:I,depthTest:!1,side:ce}));u.position.set(o.x,-o.y,0),u.userData={born:i+r*.16},u.scale.setScalar(.001),m.add(u),y.push(u)}const l=new Q(P,e);l.position.set(o.x,-o.y,0),m.add(l),v.push(l);for(let r=0;r<40;r++)re(o.x,-o.y,0,90+Math.random()*160)}function re(o,i,l,r){const u=T++%E,H=Math.random()*Math.PI*2,C=(Math.random()-.5)*Math.PI;M[u*3]=o,M[u*3+1]=i,M[u*3+2]=l,g[u*3]=Math.cos(H)*Math.cos(C)*r,g[u*3+1]=Math.sin(H)*Math.cos(C)*r,g[u*3+2]=Math.sin(C)*r,f[u]=.5+Math.random()*.8,S[u]=1}let X=null;function he({t:o,dt:i,scrollY:l,W:r,H:u,cur:H}){if(!a)return;n.position.set(r/2,-(l+u/2),u/2/Math.tan(de.degToRad(ae/2))),n.lookAt(r/2,-(l+u/2),0),t.uTime.value=o,t.uHead.value=H/a.L,me(H,x.position);const C=o*.7%1;V.scale.setScalar(8+C*22),U.opacity=(1-C)*.8,R.scale.setScalar(1+Math.sin(o*6)*.08);const q=X?x.position.distanceTo(X):0;X=(X||new ne).copy(x.position);const W=Math.min(6,1+Math.floor(q/6));for(let s=0;s<W;s++)Math.random()<.7&&re(x.position.x,x.position.y,x.position.z,20+Math.random()*70);for(let s=0;s<E;s++)S[s]<=0||(S[s]-=i/f[s],g[s*3+1]-=40*i,M[s*3]+=g[s*3]*i,M[s*3+1]+=g[s*3+1]*i,M[s*3+2]+=g[s*3+2]*i);L.attributes.position.needsUpdate=!0,L.attributes.aLife.needsUpdate=!0,h.uniforms.uScale.value=9e3*p.getPixelRatio();for(let s=y.length-1;s>=0;s--){const j=y[s],B=o-j.userData.born;if(B<0)continue;const d=Math.min(1,B/1.3);j.scale.setScalar(6+(1-(1-d)**3)*70),j.material.opacity=1-d,d>=1&&(m.remove(j),j.material.dispose(),y.splice(s,1))}p.render(m,n)}function ve(){v.forEach(o=>o.geometry.dispose()),Object.values(D).forEach(o=>o.dispose()),L.dispose(),p.dispose()}return{setRoute:k,size:$,frame:he,hit:fe,dispose:ve}}function _e(){const z=J.useRef(null),p=J.useRef(null),m=J.useRef(null),[n,A]=J.useState(null);return J.useEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!z.current)return;let c;try{c=je(z.current)}catch{return}document.documentElement.classList.add("beam-on");const t={cur:0,target:0,route:null,hits:[],done:[],started:!1};let G=document.documentElement.clientWidth,D=window.innerHeight;c.size(G,D);let x=0;const R=()=>{clearTimeout(x),x=setTimeout(()=>{const h=Ae();h&&(t.route=c.setRoute(h),t.hits=h.hits,t.done=h.hits.map(F=>F.el.classList.contains("beam-hit")),A(h))},120)},_=()=>{G=document.documentElement.clientWidth,D=window.innerHeight,c.size(G,D),R()};R();const U=new ResizeObserver(R),V=document.querySelector("main");V&&U.observe(V),window.addEventListener("resize",_),document.fonts?.ready.then(R);const E=setTimeout(()=>{t.started=!0},900),M=h=>{const{ym:F,N:T,L:y}=t.route;if(h>=F[T])return y;let w=0,P=T;for(;w<P;){const e=w+P>>1;F[e]<h?w=e+1:P=e}return w/T*y};let g=0,S=performance.now(),f=-2;const L=h=>{g=requestAnimationFrame(L);const F=Math.min(.05,(h-S)/1e3);if(S=h,!t.route||document.hidden)return;const T=window.scrollY;t.target=t.started?Math.min(t.route.L,M(T+D*.72)):0;const y=t.target-t.cur;t.cur=Math.abs(y)<.4?t.target:t.cur+Math.sign(y)*Math.min(Math.abs(y)*.075,95);let w=-1;t.hits.forEach((P,e)=>{t.cur>=P.len-1&&(w=e,t.done[e]||(t.done[e]=!0,P.el.classList.add("beam-hit"),c.hit(P,h/1e3),m.current?.querySelectorAll(".beam-label")[e]?.classList.add("on")))}),p.current&&(p.current.querySelector("b").textContent=`${String(Math.round(t.cur/t.route.L*100)).padStart(2,"0")}%`,w!==f&&(f=w,p.current.querySelector("span").textContent=f<0?"Intro":t.hits[f].name)),c.frame({t:h/1e3,dt:F,scrollY:T,W:G,H:D,cur:t.cur})};return g=requestAnimationFrame(L),()=>{cancelAnimationFrame(g),clearTimeout(x),clearTimeout(E),U.disconnect(),window.removeEventListener("resize",_),document.documentElement.classList.remove("beam-on"),c.dispose()}},[]),N.jsxs(N.Fragment,{children:[N.jsx("canvas",{className:"beam-canvas",ref:z,"aria-hidden":"true"}),N.jsx("div",{className:"beam-layer",ref:m,style:{height:n?.docH||0},"aria-hidden":"true",children:n?.labels&&n.hits.map((c,t)=>c.side==="end"?N.jsx("span",{className:"beam-label"},t):N.jsxs("span",{className:`beam-label ${c.side}`,style:c.side==="L"?{right:n.W-c.x+24,top:c.y-14}:{left:c.x+24,top:c.y-14},children:[N.jsxs("b",{children:["Signal ",String(t+1).padStart(2,"0")]}),c.name]},t))}),N.jsxs("div",{className:"beam-hud",ref:p,"aria-hidden":"true",children:[N.jsx("i",{}),"Signal ",N.jsx("b",{children:"00%"}),N.jsx("span",{children:"Intro"})]})]})}export{_e as default};
