hi if you found this repo by accident just ignore it













ini source code dari uts eastern art review dimana kita harus membuat website dan menampilkan minimal 8 era dari suatu negara dan menampilkan 1 artefak dari setiap era serta artikelnya



ada shaders yg dari https://www.shadertoy.com/

rata2 hampir semua shaders di ambil dari fnf mods dan beberapa script juga di port ke js tapi semua design itu originalw



shadertoy.com CRT barrel, phosphor mask, noise/hash functions, SDF glow



thebookofshaders.com value noise, curl noise, ink wash flow fields



iquilezles.org SDF box() distance function



css-tricks.com CSS scanlines, ticker marquee, blend modes



developer.mozilla.org SVG filters, Web Audio, mask-image, mix-blend-mode



codepen.io CRT CSS fallback demos, retro UI patterns



\- `index.html` main html file. holds the room, the old crt monitor, the landing page portal, the credits window, and the article view container.

\- `style.css` all the styling and animations for the monitor, landing cards, flat credits window, and the ink reveal transition on the article page.

\- `app.js` main logic and all the text/data for the 8 japanese eras (jomon to edo). handles clicking eras, the loading bar, zooming the camera into the monitor, middle-click zoom, mouse parallax, background music, and sfx.

\- `article-wash.js` webgl shader that draws the moving ink wash over the article page (anchored to the document when you scroll) and animates the ink soaking in when you open an era.

\- `crt.js` webgl shader for the crt scanlines, rgb phosphor stripes, and dark curved corners on the monitor screen.

\- `fx.js` webgl shader for the tv power button turn on/off effect, static glitch when switching tabs/eras, screen light glow on the room walls, and the custom retro cursor inside the monitor.

\- `warp.js` generates an svg displacement filter that bends the actual html inside the monitor so it matches the curved crt glass.

\- `CNAME` custom domain config for github pages (`japanuts.my.id`).



