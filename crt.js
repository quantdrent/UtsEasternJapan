// Retro CRT post-process: a WebGL fragment shader multiplied over the in-monitor page.
// Curves scanlines, aperture grille, and tube glass edges using true barrel-distortion UVs,
// never intercepts input, and falls back to the CSS CRT layers when WebGL is unavailable.
(() => {
  const screen = document.getElementById('screen');
  if (!screen) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'crt-shader';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', {
    alpha: false, antialias: false, depth: false, stencil: false,
    premultipliedAlpha: false, powerPreference: 'low-power'
  });
  if (!gl) return;

  const vertex = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fragment = `
precision mediump float;
uniform vec2 r;   // canvas size in device pixels
uniform float t;  // seconds
uniform float d;  // device pixel ratio
const float TAU = 6.2831853;

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}

// Barrel distortion: maps flat screen UV [0,1] to curved CRT glass coordinates [-1,1].
vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  c *= 1.0 + vec2(0.042, 0.048) * (c.yx * c.yx - 0.18);
  return c;
}

void main(){
  vec2 uv = gl_FragCoord.xy / r;
  vec2 c = barrel(uv);
  vec2 wuv = c * 0.5 + 0.5;
  vec2 px = (wuv * r) / d; // curved CSS-pixel coordinates so scanlines bend with the tube

  // Curved scanlines: soft dark gap every 3 CSS px along the warped vertical axis.
  float s = 0.5 + 0.5 * cos(px.y * TAU / 3.0);
  float scan = 1.0 - 0.065 * s * s;

  // Curved aperture-grille phosphor mask (R/G/B columns).
  float ph = px.x * TAU / 3.0;
  vec3 mask = 0.5 + 0.5 * vec3(cos(ph), cos(ph - TAU / 3.0), cos(ph + TAU / 3.0));
  mask = 1.0 - 0.035 * (1.0 - mask);

  // Rounded CRT tube mask & corner bezel falloff driven by barrel coordinates.
  vec2 ac = abs(c);
  float corner = length(max(ac - vec2(0.90), 0.0)) / 0.115;
  float edgeX = smoothstep(0.93, 1.005, ac.x);
  float edgeY = smoothstep(0.93, 1.005, ac.y);
  float rim = clamp(max(max(edgeX, edgeY), smoothstep(0.55, 1.02, corner)), 0.0, 1.0);
  float tube = mix(1.0, 0.22, rim) * (1.0 - 0.03 * dot(c, c));

  // Slow refresh band rolling down the curved glass.
  float y = 1.0 - fract(t * 0.05);
  float roll = 1.0 - 0.018 * exp(-pow((wuv.y - y) * 12.0, 2.0));

  // Fine animated grain and a subtle flicker.
  float grain = 1.0 - 0.018 * hash(floor(px * 0.8) + floor(t * 24.0) * vec2(17.0, 31.0));
  float flicker = 1.0 - 0.008 * hash(vec2(floor(t * 18.0), 7.0));

  vec3 warm = vec3(1.0);
  gl_FragColor = vec4(mask * warm * scan * tube * roll * grain * flicker, 1.0);
}`;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  const program = gl.createProgram();
  try {
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (error) {
    console.warn('CRT shader disabled:', error);
    return;
  }
  gl.useProgram(program);

  // One oversized triangle covers the viewport.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(program, 'r');
  const uTime = gl.getUniformLocation(program, 't');
  const uDpr = gl.getUniformLocation(program, 'd');

  screen.append(canvas);
  screen.classList.add('shader-on');

  const still = matchMedia('(prefers-reduced-motion: reduce)');
  let dpr = 1, raf = 0, last = 0, lost = false;

  function draw(now) {
    if (lost) return;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, still.matches ? 0 : (now / 1000) % 1000);
    gl.uniform1f(uDpr, dpr);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(screen.clientWidth * dpr));
    const h = Math.max(1, Math.round(screen.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    draw(performance.now());
  }
  // ~30fps is plenty for grain and the rolling band; skip work while the layer is hidden.
  function frame(now) {
    raf = 0;
    if (canvas.offsetWidth && now - last > 33) { last = now; draw(now); }
    if (!still.matches && !lost) raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf && !still.matches) raf = requestAnimationFrame(frame); }

  new ResizeObserver(resize).observe(screen);
  window.addEventListener('resize', resize);
  still.addEventListener('change', () => { draw(performance.now()); start(); });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    lost = true; cancelAnimationFrame(raf); raf = 0;
    screen.classList.remove('shader-on');
    canvas.remove();
  });
  resize();
  start();
})();
