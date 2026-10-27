// Cache the ink fields once; animate texture samples anchored to the scrolling article.
(() => {
  const stage = document.getElementById('zoom-stage');
  const selection = document.getElementById('selection');
  const screen = document.getElementById('screen');
  if (!stage || !selection || !screen) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.className = 'article-wash';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', {
    alpha: true, premultipliedAlpha: false, antialias: false,
    depth: false, stencil: false, powerPreference: 'low-power'
  });
  if (!gl) return;

  const vertex = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fragment = `
    precision mediump float;
    uniform sampler2D uField;
    uniform vec2 uScroll;
    uniform vec2 uViewport;
    uniform vec2 uRes;
    uniform vec2 uAspect;
    uniform vec3 uTint;
    uniform float uTime;
    void main(){
      // Convert canvas buffer fragments (bottom-up) to top-down CSS pixels anchored to the document
      vec2 viewportPx = vec2(
        gl_FragCoord.x * (uViewport.x / uRes.x),
        (uRes.y - gl_FragCoord.y) * (uViewport.y / uRes.y)
      );
      vec2 docPx = viewportPx + uScroll;
      vec2 uv = docPx * uAspect;

      vec2 drift = vec2(uTime * .016, -uTime * .011);
      vec2 flow = texture2D(uField, uv * .44 + drift).rg - .5;
      vec2 curl = vec2(-flow.y, flow.x);
      vec2 tide = vec2(sin(uv.y * 5. + uTime * .12), cos(uv.x * 4. - uTime * .095)) * .05;
      float wash = texture2D(uField, uv * .64 + curl * .34 + tide - drift * .65).r;
      float bloom = texture2D(uField, uv * .93 - flow * .22 - tide + drift * .48).g;
      float feather = texture2D(uField, uv * 1.7 + curl * .28 - drift * .27).r;
      float pool = smoothstep(.30, .71, wash + feather * .065);
      float rim = smoothstep(.42, .49, wash) - smoothstep(.49, .58, wash);
      float pale = smoothstep(.43, .70, bloom) * (1. - pool * .75);
      vec3 ink = mix(vec3(.26, .22, .17), uTint, .32);
      vec3 pigment = mix(ink, vec3(.96, .89, .75), pale * .95);
      // Normal alpha blending also deposits warm pigment over dark lettering.
      float alpha = .025 + pool * .22 + rim * .085 + pale * .07;
      gl_FragColor = vec4(pigment, alpha);
    }`;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(error);
    }
    return shader;
  }
  let program;
  try {
    program = gl.createProgram();
    const vs = compile(gl.VERTEX_SHADER, vertex);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (error) {
    console.warn('Article ink wash unavailable:', error);
    return;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniform = Object.fromEntries(
    ['uField', 'uScroll', 'uViewport', 'uRes', 'uAspect', 'uTint', 'uTime'].map(name => [name, gl.getUniformLocation(program, name)])
  );

  // Periodic value noise keeps the cached field seamless as the ink drifts.
  function hash(x, y, seed) {
    let n = Math.imul(x + seed, 374761393) ^ Math.imul(y + seed, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }
  function noise(x, y, cells, seed) {
    const ix = Math.floor(x), iy = Math.floor(y);
    let fx = x - ix, fy = y - iy;
    fx *= fx * (3 - 2 * fx); fy *= fy * (3 - 2 * fy);
    const a = hash(ix % cells, iy % cells, seed);
    const b = hash((ix + 1) % cells, iy % cells, seed);
    const c = hash(ix % cells, (iy + 1) % cells, seed);
    const d = hash((ix + 1) % cells, (iy + 1) % cells, seed);
    return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
  }
  const size = 128, field = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const index = (y * size + x) * 4;
    for (let channel = 0; channel < 2; channel++) {
      let value = 0, amplitude = .53;
      for (let octave = 0; octave < 4; octave++) {
        const cells = 4 << octave;
        value += noise(x / size * cells, y / size * cells, cells, 17 + channel * 97) * amplitude;
        amplitude *= .5;
      }
      field[index + channel] = Math.round(value * 255);
    }
    field[index + 2] = 128; field[index + 3] = 255;
  }
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, field);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.uniform1i(uniform.uField, 0);
  stage.append(canvas);

  let frame = 0, timer = 0, lost = false, needsSize = true;
  let width = 1, phase = 0, previousTime = 0;
  let tint = [.16,.28,.52];
  function visible() { return !lost && !document.hidden && !stage.hidden && !selection.hidden; }
  function resize() {
    width = screen.clientWidth || innerWidth;
    const height = screen.clientHeight || innerHeight;
    const scale = Math.min(.6, 640 / width, Math.sqrt(180000 / (width * height)));
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    needsSize = false;
  }
  function draw(now) {
    frame = 0;
    if (timer) { clearTimeout(timer); timer = 0; }
    if (!visible()) return;
    if (needsSize) resize();
    if (!reduced.matches && previousTime) phase += Math.min(100, now - previousTime) / 1000;
    previousTime = now;

    const vpW = screen.clientWidth || innerWidth;
    const vpH = screen.clientHeight || innerHeight;
    const scrollX = screen.scrollLeft || 0;
    const scrollY = screen.scrollTop || 0;

    gl.uniform2f(uniform.uScroll, scrollX, scrollY);
    gl.uniform2f(uniform.uViewport, vpW, vpH);
    gl.uniform2f(uniform.uRes, canvas.width, canvas.height);
    gl.uniform2f(uniform.uAspect, 1 / vpW, 1 / vpW);
    gl.uniform1f(uniform.uTime, phase);
    gl.uniform3f(uniform.uTint, ...tint);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduced.matches) timer = setTimeout(() => { timer = 0; schedule(); }, 1000 / 30);
  }
  function schedule() { if (!frame && visible()) frame = requestAnimationFrame(draw); }
  function refresh() {
    cancelAnimationFrame(frame); clearTimeout(timer); frame = timer = 0;
    previousTime = 0;
    needsSize = true;
    schedule();
  }
  function updateTint() {
    const rgb = selection.style.getPropertyValue('--era').match(/[\d.]+/g);
    if (rgb?.length >= 3) tint = rgb.slice(0, 3).map(n => Number(n) / 255);
    schedule();
  }
  screen.addEventListener('scroll', schedule, { passive: true });
  new ResizeObserver(() => { needsSize = true; schedule(); }).observe(screen);
  new MutationObserver(updateTint).observe(selection, {attributes:true, attributeFilter:['style']});
  new MutationObserver(refresh).observe(stage, {attributes:true, attributeFilter:['hidden']});
  new MutationObserver(refresh).observe(selection, {attributes:true, attributeFilter:['hidden']});
  document.addEventListener('visibilitychange', refresh);
  reduced.addEventListener('change', refresh);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); lost = true; refresh(); canvas.hidden = true;
  });
  updateTint();
  refresh();
})();