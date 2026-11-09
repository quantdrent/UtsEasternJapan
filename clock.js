// jam dinding analog (seiko) di samping kalender
(() => {
  const hourEl = document.getElementById('clock-hour');
  const minEl = document.getElementById('clock-min');
  const secEl = document.getElementById('clock-sec');
  const clockEl = document.getElementById('wall-clock');
  if (!hourEl || !minEl || !secEl) return;

  function update() {
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes();
    const h = now.getHours();

    // hitung sudut rotasi (searah jarum jam, jam 12 = 0 deg)
    const secAngle = s * 6;
    const minAngle = m * 6 + s * 0.1;
    const hourAngle = (h % 12) * 30 + m * 0.5;

    // penyesuaian sudut karena gambar awalnya ga ngadep jam 12:
    // jarum jam udah di jam 12 (0 deg)
    // jarum menit digambar di jam 3 (90 deg) -> kurangi 90
    // jarum detik digambar di tengah jam 7 & 8 (~220 deg) -> kurangi 220
    hourEl.style.transform = `rotate(${hourAngle}deg)`;
    minEl.style.transform = `rotate(${minAngle - 90}deg)`;
    secEl.style.transform = `rotate(${secAngle - 220}deg)`;

    if (clockEl) {
      const displayHours = h % 12 || 12;
      const displayMins = m.toString().padStart(2, '0');
      const displaySecs = s.toString().padStart(2, '0');
      clockEl.setAttribute('aria-label', `Wall clock showing ${displayHours}:${displayMins}:${displaySecs}`);
    }

    // jadwalkan update pas pergantian detik sistem biar pas
    const delay = 1000 - now.getMilliseconds();
    setTimeout(update, Math.max(20, delay));
  }

  update();
})();
