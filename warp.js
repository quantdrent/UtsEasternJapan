// WebGL fragment-shader barrel warp for the in-monitor DOM.
// Uses a GLSL fragment shader to compute a smooth barrel-distortion vector field (R = dx, G = dy)
// on the GPU, then feeds that shader texture into an SVG feDisplacementMap filter so the live
// HTML UI bows outward like a curved CRT tube while keeping text crisp and 100% clickable.
(() => {
  const screen = document.getElementById('screen');
  if (!screen) return;

  const KX = 0.042, KY = 0.048; // subtle CRT barrel curvature matching crt.js

  const mapCanvas = document.createElement('canvas');
  const gl = mapCanvas.getContext('webgl', {
    alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: true
  });
  if (!gl) return;

  const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FRAG = `
precision highp float;
uniform vec2 uSize;
uniform float uScale;
void main(){
  // SVG feImage top-left is (0,0), while WebGL gl_FragCoord bottom-left is (0,0).
  vec2 uv = vec2(gl_FragCoord.x / uSize.x, 1.0 - gl_FragCoord.y / uSize.y);
  vec2 c = uv * 2.0 - 1.0;
  // Pure barrel curve pinned at center and mid-axes so the picture stays centered.
  vec2 wc = c * (1.0 + vec2(${KX}, ${KY}) * (c.yx * c.yx - 0.18));
  vec2 deltaPx = (wc - c) * 0.5 * uSize;
  vec2 enc = clamp(0.5 + deltaPx / uScale, 0.0, 1.0);
  gl_FragColor = vec4(enc.x, enc.y, 0.5, 1.0);
}`;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  try {
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (err) {
    console.warn('CRT warp shader disabled:', err);
    return;
  }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  const uSize = gl.getUniformLocation(prog, 'uSize');
  const uScale = gl.getUniformLocation(prog, 'uScale');

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  svg.innerHTML =
    '<filter id="crt-warp" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" ' +
    'color-interpolation-filters="sRGB" x="0" y="0" width="1" height="1">' +
    '<feImage result="map" x="0" y="0" width="1" height="1" preserveAspectRatio="none"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G" scale="0"/>' +
    '</filter>';
  document.body.append(svg);
  const filter = svg.querySelector('filter');
  const image = svg.querySelector('feImage');
  const displace = svg.querySelector('feDisplacementMap');

  let lastW = 0, lastH = 0, token = 0;

  async function build() {
    const w = screen.offsetWidth, h = screen.offsetHeight;
    if (!w || !h || (w === lastW && h === lastH)) return;
    lastW = w; lastH = h;
    const id = ++token;

    const mw = 512, mh = Math.max(2, Math.round(512 * h / w));
    mapCanvas.width = mw; mapCanvas.height = mh;
    gl.viewport(0, 0, mw, mh);

    // Keep uScale tight to the actual corner displacement so 8-bit steps stay sub-pixel (<0.1px).
    const maxShift = Math.max(w, h) * 0.045;
    gl.uniform2f(uSize, mw, mh);
    gl.uniform1f(uScale, maxShift * (mw / w));
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const url = mapCanvas.toDataURL('image/png');
    const probe = new Image();
    probe.src = url;
    try { await probe.decode(); } catch { return; }
    if (id !== token) return;

    for (const element of [filter, image]) {
      element.setAttribute('width', w);
      element.setAttribute('height', h);
    }
    image.setAttribute('href', url);
    displace.setAttribute('scale', maxShift.toFixed(2));
    screen.classList.add('warp-on');
  }

  new ResizeObserver(build).observe(screen);
  build();
})();
