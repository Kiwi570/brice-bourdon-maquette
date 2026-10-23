/* Colonne vertébrale en nuage de points (24 vertèbres, sacrum, coccyx).
   Elle commence inclinée et se redresse vertèbre par vertèbre selon `align` (0 → 1).
   WebGL via OGL ; version Canvas 2D si WebGL est indisponible. Visualisation illustrative. */

const LEVELS = [];
(function buildLevels() {
  const spec = [];
  for (let i = 1; i <= 7; i++) spec.push({ name: 'C' + i, kind: 'C', h: .72 });
  for (let i = 1; i <= 12; i++) spec.push({ name: 'T' + i, kind: 'T', h: .9 + i * .012 });
  for (let i = 1; i <= 5; i++) spec.push({ name: 'L' + i, kind: 'L', h: 1.18 + i * .02 });
  spec.push({ name: 'S', kind: 'S', h: 3.1 });
  spec.push({ name: 'Co', kind: 'Co', h: 1.1 });
  const total = spec.reduce((s, v) => s + v.h, 0);
  let acc = 0;
  spec.forEach((v, i) => {
    const t = (acc + v.h / 2) / total;
    acc += v.h;
    const dy = (v.h / total) * 2.4;
    let r;
    if (v.kind === 'C') r = .052 + (i / 6) * .016;
    else if (v.kind === 'T') r = .072 + ((i - 7) / 11) * .03;
    else if (v.kind === 'L') r = .112 + ((i - 19) / 4) * .022;
    else if (v.kind === 'S') r = .13;
    else r = .045;
    LEVELS.push({ ...v, t, dy, r });
  });
})();

const g = (t, m, s) => { const d = (t - m) / s; return Math.exp(-d * d); };
const sag = t => .07 * g(t, .13, .09) - .12 * g(t, .42, .14) + .1 * g(t, .74, .09) - .1 * g(t, .93, .06);
const dev = t => .2 * g(t, .4, .12) - .14 * g(t, .7, .085) + .05 * g(t, .08, .07);
const smooth = (e0, e1, x) => { const k = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return k * k * (3 - 2 * k); };
export const alignAt = (t, u) => smooth(0, 1, u * 1.6 - (1 - t) * .6);

function rnd(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function buildPoints() {
  const R = rnd(7);
  const pos = [], lev = [], kind = [], seed = [];
  const push = (x, y, z, t, k) => { pos.push(x, y, z); lev.push(t); kind.push(k); seed.push(R()); };
  LEVELS.forEach((L, idx) => {
    const { r, dy, t } = L;
    const hb = dy * .54;
    if (L.kind === 'S') {
      for (let i = 0; i < 420; i++) {
        const v = R(), u = (R() - .5);
        const w = (1.25 - v * .95) * r * 2;
        const y = dy * .48 - v * dy * .95;
        const x = u * w;
        const z = -Math.sin(v * Math.PI * .9) * r * .7 - r * .2 + (R() - .5) * r * .25 - Math.abs(u) * r * .3;
        push(x, y, z, t, 0);
      }
      for (let i = 0; i < 16; i++) {
        const v = (i % 4) / 4 + .12, side = i < 8 ? -1 : 1;
        const cx = side * (1.25 - v * .95) * r * .45, cy = dy * .48 - v * dy * .95;
        for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; push(cx + Math.cos(a) * r * .08, cy + Math.sin(a) * r * .08, -r * .1, t, 1); }
      }
      return;
    }
    if (L.kind === 'Co') {
      for (let s = 0; s < 3; s++) {
        const rr = r * (1 - s * .25), cy = dy * .3 - s * dy * .32;
        for (let i = 0; i < 26; i++) { const a = R() * Math.PI * 2; push(Math.cos(a) * rr, cy + (R() - .5) * dy * .2, Math.sin(a) * rr * .8 - r * .4 * s, t, 0); }
      }
      return;
    }
    const nBody = L.kind === 'C' ? 84 : L.kind === 'T' ? 112 : 150;
    for (let i = 0; i < nBody; i++) {
      const a = R() * Math.PI * 2;
      if (i % 5 === 0) {
        const rr = Math.sqrt(R()) * r * .96, y = (R() > .5 ? 1 : -1) * hb / 2;
        push(Math.cos(a) * rr, y, Math.sin(a) * rr * .8, t, 0);
      } else {
        const y = (R() - .5) * hb;
        const waist = 1 - .08 * (1 - (2 * y / hb) ** 2);
        push(Math.cos(a) * r * waist, y, Math.sin(a) * r * .8 * waist, t, 0);
      }
    }
    const zf = -r * .8 - r * .55;
    for (let i = 0; i < 48; i++) {
      const a = Math.PI * .08 + R() * Math.PI * 1.84;
      const rr = 1 + (R() - .5) * .25;
      push(Math.cos(a + Math.PI / 2) * r * .62 * rr, (R() - .5) * hb * .55, zf + Math.sin(a + Math.PI / 2) * r * .52 * rr - r * .02, t, 0);
    }
    const spLen = L.kind === 'C' ? 1.1 : L.kind === 'T' ? 2.1 : 1.7;
    const spDrop = L.kind === 'T' ? dy * .85 : dy * .3;
    for (let i = 0; i < 34; i++) {
      const s = R();
      push((R() - .5) * r * .18, -spDrop * s + (R() - .5) * r * .12, zf - r * .5 - s * spLen * r + (R() - .5) * r * .1, t, 0);
    }
    const tvLen = L.kind === 'C' ? 1.15 : L.kind === 'T' ? 1.6 : 1.85;
    const tvBack = L.kind === 'T' ? r * .85 : r * .35;
    for (const side of [-1, 1]) {
      for (let i = 0; i < 20; i++) {
        const s = R();
        push(side * (r * .55 + s * (tvLen - .55) * r), (R() - .5) * r * .14 + (L.kind === 'T' ? s * dy * .12 : 0), zf + r * .35 - s * tvBack + (R() - .5) * r * .1, t, 0);
      }
    }
    if (idx < LEVELS.length - 3) {
      for (let i = 0; i < 54; i++) {
        const a = R() * Math.PI * 2, rr = (.55 + Math.sqrt(R()) * .42) * r;
        push(Math.cos(a) * rr, -dy / 2, Math.sin(a) * rr * .8, t, 1);
      }
    }
  });
  return { pos: new Float32Array(pos), lev: new Float32Array(lev), kind: new Float32Array(kind), seed: new Float32Array(seed) };
}

export function tiltFor(u) {
  let s = 0;
  LEVELS.forEach(L => { s += 1 - alignAt(L.t, u); });
  return 6 * s / LEVELS.length;
}

const VERT = /* glsl */`
attribute vec3 position;
attribute float level;
attribute float kind;
attribute float seed;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uAlign;
uniform float uTime;
uniform float uSize;
uniform float uDpr;
varying float vHi;
varying float vKind;
varying float vDepth;
float g(float t, float m, float s) { float d = (t - m) / s; return exp(-d * d); }
float sag(float t) { return 0.07 * g(t, .13, .09) - 0.12 * g(t, .42, .14) + 0.10 * g(t, .74, .09) - 0.10 * g(t, .93, .06); }
float dev(float t) { return 0.20 * g(t, .40, .12) - 0.14 * g(t, .70, .085) + 0.05 * g(t, .08, .07); }
void main() {
  float a = smoothstep(0.0, 1.0, uAlign * 1.6 - (1.0 - level) * 0.6);
  float m = 1.0 - a;
  float d = dev(level) * m;
  float dd = (dev(level + 0.01) - dev(level - 0.01)) / 0.02 * m;
  float ds = (sag(level + 0.01) - sag(level - 0.01)) / 0.02;
  vec3 c = vec3(d, 1.2 - level * 2.4, sag(level));
  c.y += sin(uTime * 0.9 + level * 2.0) * 0.004;
  vec3 p = position;
  float jitter = (1.0 - a) * 0.004;
  p += vec3(sin(uTime * 2.0 + seed * 40.0), cos(uTime * 1.7 + seed * 31.0), sin(uTime * 1.3 + seed * 17.0)) * jitter;
  float ry = d * 2.4;
  p = vec3(p.x * cos(ry) + p.z * sin(ry), p.y, -p.x * sin(ry) + p.z * cos(ry));
  float rx = -atan(ds / 2.4);
  p = vec3(p.x, p.y * cos(rx) - p.z * sin(rx), p.y * sin(rx) + p.z * cos(rx));
  float rz = atan(dd / 2.4);
  p = vec3(p.x * cos(rz) - p.y * sin(rz), p.x * sin(rz) + p.y * cos(rz), p.z);
  vec3 world = c + p;
  float hi = smoothstep(0.02, 0.5, a) * (1.0 - smoothstep(0.5, 0.98, a));
  vHi = max(hi, kind * a * 0.95);
  vKind = kind;
  vec4 mv = modelViewMatrix * vec4(world, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uDpr * (kind > 0.5 ? 1.1 : 1.0) * (5.2 / -mv.z);
}`;

const FRAG = /* glsl */`
precision highp float;
uniform vec3 uInk;
uniform vec3 uSig;
varying float vHi;
varying float vKind;
varying float vDepth;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  float alpha = smoothstep(0.5, 0.28, r);
  vec3 col = mix(uInk, uSig, clamp(vHi, 0.0, 1.0));
  float fog = smoothstep(6.4, 4.8, vDepth);
  float a = alpha * mix(0.28, 0.92, fog) * (vKind > 0.5 ? 0.8 : 1.0);
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a);
}`;

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl') || c.getContext('experimental-webgl')); } catch (e) { return false; }
}

export async function createSpine(canvas, { calm = false, onTilt = null, forceFallback = false } = {}) {
  const data = buildPoints();
  const state = { align: calm ? 1 : 0, mx: 0, my: 0, time: 0, visible: true };
  const notify = () => onTilt?.(tiltFor(state.align));
  window.addEventListener('pointermove', e => { state.mx = e.clientX / innerWidth - .5; state.my = e.clientY / innerHeight - .5; }, { passive: true });
  const io = new IntersectionObserver(([en]) => { state.visible = en.isIntersecting; });
  io.observe(canvas);

  const useGL = !forceFallback && hasWebGL() && !new URLSearchParams(location.search).has('sans-webgl');
  let render;
  if (useGL) {
    const { Renderer, Camera, Program, Mesh, Geometry, Transform } = await import('../vendor/ogl.mjs');
    const renderer = new Renderer({ canvas, dpr: Math.min(devicePixelRatio || 1, 2), alpha: true, antialias: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const camera = new Camera(gl, { fov: 30, near: .1, far: 50 });
    camera.position.set(0, 0, 5.6);
    const scene = new Transform();
    const geometry = new Geometry(gl, {
      position: { size: 3, data: data.pos },
      level: { size: 1, data: data.lev },
      kind: { size: 1, data: data.kind },
      seed: { size: 1, data: data.seed }
    });
    const program = new Program(gl, {
      vertex: VERT, fragment: FRAG, transparent: true, depthTest: false, depthWrite: false,
      uniforms: { uAlign: { value: state.align }, uTime: { value: 0 }, uSize: { value: 2.7 }, uDpr: { value: renderer.dpr }, uInk: { value: [.106, .114, .122] }, uSig: { value: [.184, .357, 1] } }
    });
    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
    mesh.setParent(scene);
    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      camera.perspective({ aspect: r.width / Math.max(1, r.height) });
      const vh = 2 * 5.6 * Math.tan(15 * Math.PI / 180);
      const need = 2.75, needW = 1.3;
      const s = Math.min(vh / need, (vh * (r.width / r.height)) / needW);
      scene.scale.set(Math.min(1.15, s));
    };
    resize();
    window.addEventListener('resize', resize);
    let ry = .42, rx = 0;
    render = () => {
      program.uniforms.uAlign.value = state.align;
      program.uniforms.uTime.value = state.time;
      ry += ((.42 + Math.sin(state.time * .18) * .16 + state.mx * .5) - ry) * .05;
      rx += ((state.my * .12) - rx) * .05;
      mesh.rotation.y = ry;
      mesh.rotation.x = rx;
      renderer.render({ scene, camera });
    };
  } else {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1;
    const resize = () => { dpr = Math.min(devicePixelRatio || 1, 2); const r = canvas.parentElement.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = W * dpr; canvas.height = H * dpr; };
    resize();
    window.addEventListener('resize', resize);
    const N = data.lev.length;
    render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const scale = Math.min(H / 2.9, W / 1.4);
      const ry = .42 + Math.sin(state.time * .18) * .16 + state.mx * .5;
      const cr = Math.cos(ry), sr = Math.sin(ry);
      for (let i = 0; i < N; i += 2) {
        const t = data.lev[i], k = data.kind[i];
        const a = alignAt(t, state.align), m = 1 - a;
        const d = dev(t) * m;
        let x = data.pos[i * 3], y = data.pos[i * 3 + 1], z = data.pos[i * 3 + 2];
        const rz = Math.atan(((dev(t + .01) - dev(t - .01)) / .02) * m / 2.4);
        const x2 = x * Math.cos(rz) - y * Math.sin(rz), y2 = x * Math.sin(rz) + y * Math.cos(rz);
        x = x2 + d; y = y2 + 1.2 - t * 2.4; z += sag(t);
        const X = x * cr + z * sr, Z = -x * sr + z * cr;
        const hi = Math.max(smooth(.02, .5, a) * (1 - smooth(.5, .98, a)), k * a * .95);
        const depth = .35 + .55 * smooth(-.6, .6, Z);
        ctx.fillStyle = hi > .3 ? `rgba(47,91,255,${depth})` : `rgba(27,29,31,${depth})`;
        ctx.fillRect(W / 2 + X * scale - 1, H / 2 - y * scale - 1, 2, 2);
      }
    };
  }

  let last = performance.now();
  const loop = now => {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!calm) state.time += dt;
    if (state.visible) render();
    if (!calm) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  notify();
  return {
    mode: useGL ? 'webgl' : '2d',
    setAlign(u) { state.align = Math.min(1, Math.max(0, u)); notify(); if (calm) render(); },
    levels: LEVELS
  };
}
