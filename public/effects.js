// ============================================
// Visual Effects
// ============================================

// Cursor neon interaktif
const cursor = document.createElement('div');
cursor.style.cssText = `
  position: fixed;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #22d3ee;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 0 10px #22d3ee, 0 0 25px #a78bfa;
  transition: transform 0.08s ease-out;
`;
document.body.appendChild(cursor);

window.addEventListener('mousemove', e => {
  cursor.style.transform = `translate(${e.clientX - 7}px, ${e.clientY - 7}px)`;
});

// Notifikasi motivasi
const quotes = [
  "🔥 Fokus bukan berarti keras kepala, tapi konsisten.",
  "💪 Power itu hasil dari teknik + sabar latihan.",
  "🏸 Jangan buru-buru menang, buru-buru belajar.",
  "🎯 Smash kencang nggak akan berguna tanpa kontrol.",
  "🧠 Ingat: otak tenang, tangan tepat."
];

const headerEl = document.querySelector('header');
const motivationBar = document.createElement('div');
motivationBar.id = 'motivationBar';
motivationBar.innerHTML = `<span>Motivasi</span>${quotes[0]}`;
headerEl.after(motivationBar);

let quoteIndex = 0;
setInterval(() => {
  quoteIndex = (quoteIndex + 1) % quotes.length;
  motivationBar.classList.add('fade');
  setTimeout(() => {
    motivationBar.innerHTML = `<span>Motivasi</span>${quotes[quoteIndex]}`;
    motivationBar.classList.remove('fade');
  }, 250);
}, 8000);

// Efek partikel saat klik
document.addEventListener('click', e => {
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${['#22d3ee', '#a78bfa', '#60a5fa'][Math.floor(Math.random() * 3)]};
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      pointer-events: none;
      opacity: 1;
      z-index: 999;
      transform: scale(1);
      transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    `;
    document.body.appendChild(p);
    setTimeout(() => {
      p.style.opacity = 0;
      p.style.transform = `translate(${(Math.random() - 0.5) * 120}px, ${(Math.random() - 0.5) * 120}px) scale(0)`;
    }, 10);
    setTimeout(() => p.remove(), 700);
  }
});

// Efek neon pada teks X PPLG 2
const neonText = document.querySelector('.badge-xpplg');
if (neonText) {
  neonText.style.position = 'relative';
  neonText.style.textShadow = `
    0 0 6px #22d3ee,
    0 0 12px #22d3ee,
    0 0 24px #22d3ee,
    0 0 48px #0ff
  `;
  neonText.style.transition = 'all 0.3s ease';
  
  // Animasi berdenyut pelan
  setInterval(() => {
    neonText.style.textShadow = `
      0 0 ${6 + Math.random() * 6}px #22d3ee,
      0 0 ${12 + Math.random() * 8}px #22d3ee,
      0 0 ${24 + Math.random() * 10}px #22d3ee,
      0 0 ${48 + Math.random() * 14}px #0ff
    `;
  }, 500);
  
  // Efek saat hover
  neonText.addEventListener('mouseenter', () => {
    neonText.style.textShadow = `
      0 0 10px #a78bfa,
      0 0 24px #a78bfa,
      0 0 48px #22d3ee
    `;
    neonText.style.transform = 'scale(1.1)';
  });
  
  neonText.addEventListener('mouseleave', () => {
    neonText.style.transform = 'scale(1)';
  });
}

