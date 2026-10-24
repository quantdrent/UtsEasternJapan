// Extra GLSL fragment-shader layers (runs alongside crt.js, never touches app.js state):
//  1. Signal  - inside the monitor: CRT power-on beam, signal-drop static on navigation, rare phosphor specks.
//  2. Room    - over the whole scene (soft-light): light spilling from the screen onto the bezel/desk,
//               a gentle lens vignette and film grain.
// All layers ignore pointer input and are skipped entirely when WebGL is unavailable.
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const VERTEX = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const COMMON = `
precision mediump float;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vnoise(float x){float i=floor(x),f=fract(x);return mix(hash(vec2(i,.5)),hash(vec2(i+1.,.5)),f*f*(3.-2.*f));}
`;

  // ---------- 1. Signal layer (normal alpha blend, premultiplied output) ----------
  const SIGNAL = COMMON + `
uniform vec2 r;        // canvas size, device px
uniform float t;       // seconds
uniform float d;       // device pixel ratio
uniform float power;   // 0 = tube off -> 1 = picture fully on
uniform float glitch;  // 0..1 signal-drop intensity
vec4 over(vec4 base, vec3 c, float a){return vec4(c*a + base.rgb*(1.-a), a + base.a*(1.-a));}
void main(){
  vec2 uv = gl_FragCoord.xy / r;
  vec2 px = gl_FragCoord.xy / d;
  float frame = floor(t * 30.0);
  vec4 col = vec4(0.0);

  // Idle: very rare phosphor specks, like dust on the signal.
  float speck = step(0.9993, hash(floor(px / 1.5) + frame * vec2(7.0, 13.0)));
  col = over(col, vec3(1.0), speck * 0.2);

  // Signal drop: drifting bands of snow, a few chroma scan lines, a brief brightness dip.
  if (glitch > 0.001) {
    float bands = smoothstep(0.5, 0.78, vnoise(uv.y * 7.0 + t * 19.0));
    float snow = hash(floor(px / 1.5) + frame * vec2(31.0, 17.0));
    float row = floor(px.y / 2.0);
    float line = step(0.975, hash(vec2(row, frame)));
    vec3 tint = mix(vec3(1.0, 0.15, 0.3), vec3(0.2, 0.65, 1.0), hash(vec2(row, 3.0)));
    col = over(col, vec3(0.0), glitch * 0.16);
    col = over(col, vec3(snow), glitch * (0.1 + 0.45 * bands) * snow);
    col = over(col, tint, glitch * line * 0.35);
  }

  // Power-on: a thin horizontal beam stretches out, then the picture opens vertically.
  if (power < 1.0) {
    float wide = smoothstep(0.0, 0.22, power);
    float tall = smoothstep(0.2, 0.7, power);
    float halfW = 0.52 * wide;
    float halfH = mix(0.003, 0.52, tall * tall);
    vec2 q = abs(uv - 0.5);
    float inX = 1.0 - smoothstep(halfW - 0.02, halfW, q.x);
    float lit = (1.0 - smoothstep(halfH - 0.004, halfH + 0.004, q.y)) * inX;
    float beam = exp(-q.y / max(halfH, 0.003) * 2.0) * (1.0 - tall) * wide * inX;
    float flash = 1.0 - smoothstep(0.3, 1.0, power);
    vec4 tube = vec4(0.0, 0.0, 0.0, 1.0 - lit);
    tube = over(tube, vec3(0.92, 0.97, 1.0), clamp(lit * flash * 0.85 + beam * 0.7, 0.0, 1.0));
    col = tube + col * (1.0 - tube.a);
  }
  gl_FragColor = col;
}`;

  // ---------- 2. Room layer (soft-light: 0.5 grey = no change) ----------
  const ROOM = COMMON + `
uniform vec2 r;        // canvas size, px
uniform float t;
uniform vec4 s;        // screen rect: x, y (from bottom), w, h in canvas px
uniform float glow;    // screen light strength
float box(vec2 p, vec2 b, float rad){vec2 q = abs(p) - b + rad; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - rad;}
void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / r;
  float dist = box(fc - (s.xy + s.zw * 0.5), s.zw * 0.5, 8.0);
  float inside = 1.0 - step(0.0, dist);

  // Light spill from the glass, with a faint mains-hum flicker.
  float size = max(s.z, s.w);
  float spill = exp(-max(dist, 0.0) / (size * 0.32));
  float hum = 0.94 + 0.06 * (0.5 + 0.5 * sin(t * 7.0)) * (0.8 + 0.2 * hash(vec2(floor(t * 15.0), 3.0)));
  vec3 light = vec3(1.0, 0.9, 0.88) * spill * glow * hum * 0.17;

  // Lens vignette and film grain over the room photo.
  vec2 v = uv - 0.5;
  v.x *= r.x / r.y;
  float vignette = smoothstep(0.35, 1.05, length(v)) * 0.2;
  float grain = (hash(fc + floor(t * 24.0) * vec2(13.0, 7.0)) - 0.5) * 0.08;

  vec3 val = vec3(0.5) + light - vignette + grain + vec3(0.008, 0.0, -0.01);
  gl_FragColor = vec4(mix(val, vec3(0.5), inside), 1.0);
}`;

  function createLayer(canvas, fragment, attributes) {
    const gl = canvas.getContext('webgl', Object.assign({
      antialias: false, depth: false, stencil: false, powerPreference: 'low-power'
    }, attributes));
    if (!gl) return null;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    const program = gl.createProgram();
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    } catch (error) {
      console.warn('FX shader disabled:', error);
      return null;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const locations = {};
    const layer = {
      canvas, lost: false,
      set(name, ...values) {
        if (!(name in locations)) locations[name] = gl.getUniformLocation(program, name);
        gl[`uniform${values.length}f`](locations[name], ...values);
      },
      size(width, height) {
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width; canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      },
      draw() {
        if (layer.lost) return;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    };
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      layer.lost = true;
      canvas.remove();
    });
    return layer;
  }

  const screen = document.getElementById('screen');
  const stage = document.getElementById('zoom-stage');
  if (!screen) return;

  // Signal layer lives inside the screen, under the crt.js tube layer so scanlines cover it too.
  let signal = null;
  if (!still.matches) {
    const canvas = document.createElement('canvas');
    canvas.className = 'crt-signal';
    canvas.setAttribute('aria-hidden', 'true');
    signal = createLayer(canvas, SIGNAL, { alpha: true, premultipliedAlpha: true });
    if (signal) screen.append(canvas);
  }

  // Room layer covers the viewport, below the zoomed period page.
  const roomCanvas = document.createElement('canvas');
  roomCanvas.className = 'room-fx';
  roomCanvas.setAttribute('aria-hidden', 'true');
  const room = createLayer(roomCanvas, ROOM, { alpha: false });
  if (room) document.body.insertBefore(roomCanvas, stage || null);

  if (!signal && !room) return;

  // Event-driven signal effects, observed from the DOM so app.js stays untouched.
  const monitor = screen.closest('.monitor');
  const portal = document.getElementById('portal');
  const powerBtn = document.getElementById('power-button');
  const switchEl = monitor && monitor.querySelector('.switch');
  let powerOn = true, powerFrom = 0, powerTarget = 1, powerStart = performance.now(), powerDuration = 1000;
  let currentPower = 0;
  let glitchAt = -1e9, glitchStrength = 0;
  const POWER_ON_MS = 1000, POWER_OFF_MS = 460, GLITCH_MS = 280;
  function kick(strength) { glitchAt = performance.now(); glitchStrength = strength; }
  const watch = (element, handler, options) => element && new MutationObserver(handler).observe(element, options);
  watch(document.getElementById('connection'), () => kick(1), { attributes: true, attributeFilter: ['hidden'] });
  watch(document.getElementById('info-window'), () => kick(0.55), { attributes: true, attributeFilter: ['hidden'] });
  watch(document.getElementById('socket'), records => {
    if (records.some(record => [...record.addedNodes].includes(screen))) kick(0.8);
  }, { childList: true });

  function togglePower() {
    if (document.body.classList.contains('zoom-active')) return;
    const now = performance.now();
    powerOn = !powerOn;
    powerFrom = currentPower;
    powerTarget = powerOn ? 1 : 0;
    powerDuration = (powerOn ? POWER_ON_MS : POWER_OFF_MS) * Math.max(0.25, Math.abs(powerTarget - powerFrom));
    powerStart = now;
    if (powerBtn) powerBtn.setAttribute('aria-pressed', String(powerOn));
    if (monitor) {
      monitor.classList.toggle('power-off', !powerOn);
      if (powerOn) monitor.classList.remove('screen-asleep');
    }
    if (portal) portal.inert = !powerOn;
    if (still.matches) {
      currentPower = powerTarget;
      if (monitor) monitor.classList.toggle('screen-asleep', !powerOn);
    }
    requestAnimationFrame(render);
  }
  if (powerBtn) powerBtn.addEventListener('click', togglePower);
  if (switchEl) switchEl.addEventListener('click', togglePower);

  function sizeSignal() {
    if (!signal) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    signal.dpr = dpr;
    signal.size(Math.max(1, Math.round(screen.clientWidth * dpr)), Math.max(1, Math.round(screen.clientHeight * dpr)));
  }
  function sizeRoom() {
    if (room) room.size(Math.max(1, innerWidth), Math.max(1, innerHeight));
  }
  new ResizeObserver(sizeSignal).observe(screen);
  window.addEventListener('resize', () => { sizeSignal(); sizeRoom(); });
  sizeSignal(); sizeRoom();

  let lastIdle = 0;
  function render(now) {
    const seconds = (now / 1000) % 1000;
    const tPower = powerDuration > 0 ? Math.min(1, Math.max(0, (now - powerStart) / powerDuration)) : 1;
    currentPower = still.matches ? powerTarget : powerFrom + (powerTarget - powerFrom) * tPower;
    if (monitor) monitor.classList.toggle('screen-asleep', currentPower <= 0.001);
    const glitch = glitchStrength * Math.max(0, 1 - (now - glitchAt) / GLITCH_MS);
    const busy = tPower < 1 || glitch > 0;
    // Full frame rate during power-on / power-off / glitches, ~30fps otherwise.
    const idleTick = now - lastIdle > 33;
    if (idleTick) lastIdle = now;

    if (signal && !signal.lost && signal.canvas.offsetWidth && (busy || idleTick)) {
      signal.set('r', signal.canvas.width, signal.canvas.height);
      signal.set('t', seconds);
      signal.set('d', signal.dpr);
      signal.set('power', currentPower);
      signal.set('glitch', glitch);
      signal.draw();
    }
    if (room && !room.lost && (busy || idleTick) && (!stage || stage.hidden)) {
      const rect = screen.getBoundingClientRect();
      room.set('r', roomCanvas.width, roomCanvas.height);
      room.set('t', seconds);
      room.set('s', rect.left, innerHeight - rect.bottom, rect.width, rect.height);
      room.set('glow', currentPower);
      room.draw();
    }
    if (!still.matches) requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  still.addEventListener('change', () => { if (!still.matches) requestAnimationFrame(render); });
})();
