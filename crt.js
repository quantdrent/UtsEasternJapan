// crt scanlines and tube shape over the screen (static, redrawn on resize)
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
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r;   // canvas size
uniform float d;  // device pixel ratio
const float TAU = 6.2831853;

// curve the screen like a crt
vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  c *= 1.0 + vec2(0.042, 0.048) * (c.yx * c.yx - 0.18);
  return c;
}

void main(){
  vec2 uv = gl_FragCoord.xy / r;
  vec2 c = barrel(uv);
  vec2 wuv = c * 0.5 + 0.5;
  vec2 px = (wuv * r) / d;

  // scanlines
  float s = 0.5 + 0.5 * cos(px.y * TAU / 3.0);
  float scan = 1.0 - 0.042 * s * s;

  // rgb phosphor stripes
  float ph = px.x * TAU / 3.0;
  vec3 mask = 0.5 + 0.5 * vec3(cos(ph), cos(ph - TAU / 3.0), cos(ph + TAU / 3.0));
  mask = 1.0 - 0.020 * (1.0 - mask);

  // dark rounded edges
  vec2 ac = abs(c);
  float corner = length(max(ac - vec2(0.90), 0.0)) / 0.115;
  float edgeX = smoothstep(0.93, 1.005, ac.x);
  float edgeY = smoothstep(0.93, 1.005, ac.y);
  float rim = clamp(max(max(edgeX, edgeY), smoothstep(0.55, 1.02, corner)), 0.0, 1.0);
  float tube = mix(1.0, 0.22, rim) * (1.0 - 0.03 * dot(c, c));

  gl_FragColor = vec4(mask * scan * tube, 1.0);
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

  // fullscreen triangle
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(program, 'r');
  const uDpr = gl.getUniformLocation(program, 'd');

  screen.append(canvas);
  screen.classList.add('shader-on');

  const stage = document.getElementById('zoom-stage');
  let dpr = 1, lost = false, pending = 0, dirty = true;

  function draw() {
    if (lost) return;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uDpr, dpr);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    dirty = false;
  }
  // only redraw when the size changes
  function resize() {
    pending = 0;
    if (lost || (stage && !stage.hidden)) return;
    const cw = screen.clientWidth, ch = screen.clientHeight;
    if (!cw || !ch) return;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(700000 / (cw * ch)));
    const w = Math.max(1, Math.round(cw * dpr));
    const h = Math.max(1, Math.round(ch * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      dirty = true;
    }
    if (dirty) draw();
  }
  // batch resize events into one frame
  function schedule() { if (!pending) pending = requestAnimationFrame(resize); }

  new ResizeObserver(schedule).observe(screen);
  window.addEventListener('resize', schedule);
  if (stage) new MutationObserver(schedule).observe(stage, {attributes:true, attributeFilter:['hidden']});
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    lost = true; cancelAnimationFrame(pending); pending = 0;
    screen.classList.remove('shader-on');
    canvas.remove();
  });
  resize();
})();
