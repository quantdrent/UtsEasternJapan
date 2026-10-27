// extra shader effects: power on/off and static inside the screen, glow on the room
// only renders when something changes
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const VERTEX = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  // keep hash inputs small so the noise doesn't break over time
  const COMMON = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float vnoise(float x){float i=floor(x),f=fract(x);return mix(hash(vec2(i,.5)),hash(vec2(i+1.,.5)),f*f*(3.-2.*f));}
`;

  // signal layer (inside the screen)
  const SIGNAL = COMMON + `
uniform vec2 r;        // canvas size
uniform float t;       // time
uniform vec2 seed;     // random offset for the static
uniform float d;       // device pixel ratio
uniform float power;   // 0 = off, 1 = on
uniform float glitch;  // static strength
vec4 over(vec4 base, vec3 c, float a){return vec4(c*a + base.rgb*(1.-a), a + base.a*(1.-a));}
void main(){
  vec2 uv = gl_FragCoord.xy / r;
  vec2 px = gl_FragCoord.xy / d;
  vec4 col = vec4(0.0);

  // static when switching pages
  if (glitch > 0.001) {
    float bands = smoothstep(0.5, 0.78, vnoise(uv.y * 7.0 + t * 19.0));
    float snow = hash(floor(px / 1.5) + seed);
    float row = floor(px.y / 2.0);
    float line = step(0.975, hash(vec2(row, seed.x)));
    vec3 tint = mix(vec3(1.0, 0.15, 0.3), vec3(0.2, 0.65, 1.0), hash(vec2(row, 3.0)));
    col = over(col, vec3(0.0), glitch * 0.16);
    col = over(col, vec3(snow), glitch * (0.1 + 0.45 * bands) * snow);
    col = over(col, tint, glitch * line * 0.35);
  }

  // power on/off animation
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

  // room layer (soft-light, 0.5 grey = no change)
  const ROOM = COMMON + `
uniform vec2 r;        // canvas size
uniform vec4 s;        // screen position and size
uniform float glow;    // glow strength
uniform vec3 tint;     // glow color
float box(vec2 p, vec2 b, float rad){vec2 q = abs(p) - b + rad; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - rad;}
void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / r;
  float dist = box(fc - (s.xy + s.zw * 0.5), s.zw * 0.5, 8.0);
  float inside = 1.0 - step(0.0, dist);

  // glow around the screen
  float size = max(s.z, s.w);
  float spill = exp(-max(dist, 0.0) / (size * 0.32));
  vec3 light = tint * spill * glow * 0.2;

  // vignette
  vec2 v = uv - 0.5;
  v.x *= r.x / r.y;
  float vignette = smoothstep(0.35, 1.05, length(v)) * 0.2;

  vec3 val = vec3(0.5) + light - vignette + vec3(0.008, 0.0, -0.01);
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
          return true;
        }
        return false;
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

  // signal canvas goes inside the screen
  let signal = null;
  if (!still.matches) {
    const canvas = document.createElement('canvas');
    canvas.className = 'crt-signal';
    canvas.setAttribute('aria-hidden', 'true');
    signal = createLayer(canvas, SIGNAL, { alpha: true, premultipliedAlpha: true });
    if (signal) screen.append(canvas);
  }

  // room canvas covers the whole page
  const roomCanvas = document.createElement('canvas');
  roomCanvas.className = 'room-fx';
  roomCanvas.setAttribute('aria-hidden', 'true');
  const room = createLayer(roomCanvas, ROOM, { alpha: false });
  if (room) document.body.insertBefore(roomCanvas, stage || null);

  if (!signal && !room) return;

  // trigger static and power effects from page changes
  const monitor = screen.closest('.monitor');
  const portal = document.getElementById('portal');
  const powerBtn = document.getElementById('power-button');
  const switchEl = monitor && monitor.querySelector('.switch');
  let powerOn = true, powerFrom = 0, powerTarget = 1, powerStart = performance.now(), powerDuration = 1000;
  let currentPower = 0, renderFrame = 0;
  let glitchAt = -1e9, glitchStrength = 0;
  // render state
  let awakeUntil = 0, signalDirty = true, signalShown = true, roomDirty = true;
  const lastRoom = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
  const POWER_ON_MS = 1000, POWER_OFF_MS = 460, GLITCH_MS = 280, WAKE_MS = 1800;
  // keep rendering for a bit after something moves
  function wake(ms = WAKE_MS) { awakeUntil = Math.max(awakeUntil, performance.now() + ms); scheduleRender(); }
  function kick(strength) { glitchAt = performance.now(); glitchStrength = strength; wake(); }
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
    signalDirty = true;
    wake(powerDuration + 100);
  }
  if (powerBtn) powerBtn.addEventListener('click', togglePower);
  if (switchEl) switchEl.addEventListener('click', togglePower);

  function sizeSignal() {
    if (!signal) return;
    if (stage && !stage.hidden) return;
    const pixels = Math.max(1, screen.clientWidth * screen.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(700000 / pixels));
    signal.dpr = dpr;
    // resizing clears the canvas so redraw
    if (signal.size(Math.max(1, Math.round(screen.clientWidth * dpr)), Math.max(1, Math.round(screen.clientHeight * dpr)))) {
      signalDirty = true; scheduleRender();
    }
  }
  function sizeRoom() {
    const scale = Math.min(1, 1280 / innerWidth, 720 / innerHeight);
    if (room && room.size(Math.max(1, Math.round(innerWidth * scale)), Math.max(1, Math.round(innerHeight * scale)))) {
      roomDirty = true; scheduleRender();
    }
  }
  new ResizeObserver(sizeSignal).observe(screen);
  window.addEventListener('resize', () => { sizeSignal(); sizeRoom(); wake(); });
  sizeSignal(); sizeRoom();

  // glow color follows the hovered card
  const defaultTint = [1.0, 0.9, 0.88];
  let targetTint = defaultTint.slice(), curTint = defaultTint.slice();
  function parseHex(hex) {
    const h = (hex || '').trim().replace('#', '');
    if (h.length !== 6) return defaultTint;
    return [
      0.35 + 0.65 * (parseInt(h.slice(0, 2), 16) / 255),
      0.35 + 0.65 * (parseInt(h.slice(2, 4), 16) / 255),
      0.35 + 0.65 * (parseInt(h.slice(4, 6), 16) / 255)
    ];
  }
  screen.addEventListener('pointerover', e => {
    const era = e.target.closest('.era');
    targetTint = era ? parseHex(era.style.getPropertyValue('--tile')) : defaultTint;
    scheduleRender();
  });
  screen.addEventListener('pointerleave', () => { targetTint = defaultTint; scheduleRender(); });

  // retro cursor inside the screen
  const CUR_B64 = {
    arrow: 'AAACAAEAICAAAAoACgAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAgAAAAIAAAAAAAAA////AAAAAAAAAAAAAAAwAAAAMAAAAGAAAABgAAAAwAAAEMAAABmAAAAdgAAAH4AAAB/wAAAf4AAAH8AAAB+AAAAfAAAAHgAAABwAAAAYAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////z////4f///+H////D///3w///84f///GH///wD///8A////AA///wAf//8AP///AH///wD///8B////A////wf///8P////H////z////9////////////////////////////////////////////////////////8=',
    helpsel: 'AAACAAEAICAAAAoACgAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAgAAAAIAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAGDgAABhEAAAwggAAMEQAAGA4AARgRAAGwEQAB8BEAAf4IgAH99EAB+RIgAfESEAHhEhABwRIQAYCMIAEAQEAAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////+f////Dx///w4P//4cB//eHg//zD8f/8Q+D//Afg//wAYP/8APB//AAIP/wCDB/8BgwP/A4MD/weDA/8PwAf/H+AP/z/wH/9////////////////////////////////////////////////////////8=',
    wait: 'AAACAAEAICAAAAoACgAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAgAAAAIAAAAAAAAA////AAAAAAAAAAAAAAAwAAAAMAAAAGAAAABg/AAAwAAAEMBUABmArAAdgNwAH4B4AB/wMAAf4BAAH8AwAB+AWAAfAOwAHgD8ABwA/AAYAAAAEAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////z////4f///+H////DAD/3wwA/84cAP/GHgH/wD4B/8A+Af/AAgH/wAcD/8APh//AHwP/wD4B/8B+Af/A/gH/wf4B/8P8AP/H/AD/z/wA/9////////////////////////////////////////////////////////8='
  };
  function decodeCur(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const hotX = bytes[10] | (bytes[11] << 8);
    const hotY = bytes[12] | (bytes[13] << 8);
    const img = new ImageData(32, 32);
    const d = img.data;
    for (let y = 0; y < 32; y++) {
      const r = 31 - y;
      for (let x = 0; x < 32; x++) {
        const idx = r * 4 + (x >> 3), mask = 0x80 >> (x & 7);
        const xor = (bytes[70 + idx] & mask) ? 1 : 0;
        const and = (bytes[198 + idx] & mask) ? 1 : 0;
        const o = (y * 32 + x) * 4;
        if (and && !xor) { d[o + 3] = 0; }
        else if (xor) { d[o] = 255; d[o + 1] = 255; d[o + 2] = 255; d[o + 3] = 255; }
        else { d[o] = 0; d[o + 1] = 0; d[o + 2] = 0; d[o + 3] = 255; }
      }
    }
    return { img, hotX, hotY };
  }
  const curSprites = {
    arrow: decodeCur(CUR_B64.arrow),
    helpsel: decodeCur(CUR_B64.helpsel),
    wait: decodeCur(CUR_B64.wait)
  };
  const curCanvas = document.createElement('canvas');
  curCanvas.className = 'crt-cursor';
  curCanvas.width = 32; curCanvas.height = 32;
  curCanvas.setAttribute('aria-hidden', 'true');
  const curCtx = curCanvas.getContext('2d');
  screen.append(curCanvas);

  let curState = '', insideScreen = false, lastTarget = null;
  let curX = screen.clientWidth * 0.54, curY = screen.clientHeight * 0.56;
  const connEl = document.getElementById('connection');

  function setCursorSprite(name) {
    if (curState === name) return;
    curState = name;
    const sp = curSprites[name] || curSprites.arrow;
    curCtx.clearRect(0, 0, 32, 32);
    curCtx.putImageData(sp.img, 0, 0);
    updateCursorTransform();
  }
  function updateCursorTransform() {
    const sp = curSprites[curState] || curSprites.arrow;
    curCanvas.style.transform = `translate(${Math.round(curX - sp.hotX)}px,${Math.round(curY - sp.hotY)}px)`;
  }
  function clampToScreen(x, y) {
    const w = screen.clientWidth || 1, h = screen.clientHeight || 1;
    curX = Math.max(2, Math.min(w - 14, x));
    curY = Math.max(2, Math.min(h - 18, y));
    updateCursorTransform();
  }
  setCursorSprite('arrow');
  clampToScreen(curX, curY);

  let cursorFrame = 0, pendingPointer = null;
  window.addEventListener('pointermove', e => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    pendingPointer = {clientX:e.clientX, clientY:e.clientY, target:e.target};
    if (!cursorFrame) cursorFrame = requestAnimationFrame(flushCursor);
    wake();
  }, {passive:true});
  function flushCursor() {
    cursorFrame = 0;
    if (document.hidden || (stage && !stage.hidden)) return;
    const e = pendingPointer;
    lastTarget = e.target;
    const rect = screen.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const w = screen.clientWidth, h = screen.clientHeight;
    const lx = ((e.clientX - rect.left) / rect.width) * w;
    const ly = ((e.clientY - rect.top) / rect.height) * h;
    const isInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (isInside) {
      insideScreen = true;
      clampToScreen(lx, ly);
      const loading = document.body.classList.contains('zoom-active') || (connEl && !connEl.hidden);
      if (loading) setCursorSprite('wait');
      else if (e.target && e.target.closest && e.target.closest('#screen a, #screen button')) setCursorSprite('helpsel');
      else setCursorSprite('arrow');
    } else if (insideScreen) {
      insideScreen = false;
      clampToScreen(lx, ly);
      setCursorSprite('arrow');
    }
  }
  watch(document.body, () => {
    const loading = document.body.classList.contains('zoom-active') || (connEl && !connEl.hidden);
    if (loading) setCursorSprite('wait');
    else if (insideScreen && lastTarget && lastTarget.closest && lastTarget.closest('#screen a, #screen button')) setCursorSprite('helpsel');
    else setCursorSprite('arrow');
    wake();
  }, { attributes: true, attributeFilter: ['class'] });
  new ResizeObserver(() => clampToScreen(curX, curY)).observe(screen);

  let lastSeed = 0;
  function visible() { return !document.hidden && (!stage || stage.hidden); }
  function scheduleRender() {
    if (!renderFrame && visible() && ((signal && !signal.lost) || (room && !room.lost))) renderFrame = requestAnimationFrame(render);
  }
  function refreshVisibility() {
    cancelAnimationFrame(renderFrame); renderFrame = 0;
    if (visible()) { sizeSignal(); sizeRoom(); wake(); }
  }
  function render(now) {
    renderFrame = 0;
    if (!visible()) return;
    const tPower = powerDuration > 0 ? Math.min(1, Math.max(0, (now - powerStart) / powerDuration)) : 1;
    currentPower = still.matches ? powerTarget : powerFrom + (powerTarget - powerFrom) * tPower;
    const asleep = currentPower <= 0.001;
    if (monitor && monitor.classList.contains('screen-asleep') !== asleep) monitor.classList.toggle('screen-asleep', asleep);
    const glitch = glitchStrength * Math.max(0, 1 - (now - glitchAt) / GLITCH_MS);
    let tintShift = 0;
    for (let i = 0; i < 3; i++) {
      curTint[i] += (targetTint[i] - curTint[i]) * 0.12;
      if (still.matches || Math.abs(targetTint[i] - curTint[i]) < 0.001) curTint[i] = targetTint[i];
      tintShift += Math.abs(targetTint[i] - curTint[i]);
    }
    const signalBusy = !still.matches && (tPower < 1 || glitch > 0);
    const awake = !still.matches && now < awakeUntil;

    // only draw static/power while it's happening, hide the canvas when idle
    if (signal && !signal.lost && (signalBusy || signalDirty)) {
      const idleOn = !signalBusy && currentPower >= 1;
      if (idleOn) {
        if (signalShown) { signal.canvas.hidden = true; signalShown = false; }
      } else {
        if (!signalShown) { signal.canvas.hidden = false; signalShown = true; }
        // new static pattern every ~33ms
        if (now - lastSeed > 33) { lastSeed = now; signal.seedX = Math.floor(Math.random() * 256); signal.seedY = Math.floor(Math.random() * 256); }
        signal.set('r', signal.canvas.width, signal.canvas.height);
        signal.set('t', (now / 1000) % 100);
        signal.set('seed', signal.seedX || 0, signal.seedY || 0);
        signal.set('d', signal.dpr);
        signal.set('power', currentPower);
        signal.set('glitch', glitch);
        signal.draw();
      }
      signalDirty = signalBusy;
    }

    // only redraw the glow if something changed
    if (room && !room.lost && (roomDirty || awake || signalBusy || tintShift > 0)) {
      const rect = screen.getBoundingClientRect();
      const sx = roomCanvas.width / innerWidth, sy = roomCanvas.height / innerHeight;
      const next = [rect.left * sx, (innerHeight - rect.bottom) * sy, rect.width * sx, rect.height * sy,
        currentPower, curTint[0], curTint[1], curTint[2]];
      let changed = roomDirty;
      for (let i = 0; i < next.length && !changed; i++) changed = Math.abs(next[i] - lastRoom[i]) > (i < 4 ? 0.05 : 0.0005);
      if (changed) {
        room.set('r', roomCanvas.width, roomCanvas.height);
        room.set('s', next[0], next[1], next[2], next[3]);
        room.set('glow', currentPower);
        room.set('tint', curTint[0], curTint[1], curTint[2]);
        room.draw();
        for (let i = 0; i < next.length; i++) lastRoom[i] = next[i];
        roomDirty = false;
      }
    }

    // stop looping when nothing is moving
    if (signalBusy || awake || (!still.matches && tintShift > 0)) scheduleRender();
  }
  window.addEventListener('wheel', () => wake(), {passive:true});
  window.addEventListener('mousedown', () => wake(), {passive:true});
  scheduleRender();
  still.addEventListener('change', refreshVisibility);
  document.addEventListener('visibilitychange', refreshVisibility);
  watch(stage, refreshVisibility, {attributes:true, attributeFilter:['hidden']});
})();
