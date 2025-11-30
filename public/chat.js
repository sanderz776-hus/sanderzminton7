// ============================================
// Chat Functionality
// ============================================

const log = document.getElementById('log');
const msg = document.getElementById('msg');
const sendBtn = document.getElementById('send');
const clearBtn = document.getElementById('clear');
const typing = document.getElementById('typing');
const chips = document.querySelectorAll('.chip');
const history = [];

function push(role, text) {
  const wrap = document.createElement('div');
  wrap.className = 'msg ' + (role === 'user' ? 'me' : 'ai');
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerText = text;
  wrap.appendChild(bubble);
  log.appendChild(wrap);
  log.scrollTop = log.scrollHeight;
}

function setTyping(on) {
  typing.style.display = on ? 'block' : 'none';
}

async function send() {
  const text = msg.value.trim();
  if (!text) return;
  
  push('user', text);
  history.push({ role: 'user', content: text });
  msg.value = '';
  msg.focus();
  sendBtn.disabled = true;
  setTyping(true);
  
  try {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history })
    });
    const data = await r.json();
    const reply = data.reply || 'Maaf, lagi blank.';
    push('assistant', reply);
    history.push({ role: 'assistant', content: reply });
  } catch (e) {
    push('assistant', '⚠️ Koneksi error. Coba lagi.');
  } finally {
    setTyping(false);
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener('click', send);
clearBtn.addEventListener('click', () => {
  history.length = 0;
  log.innerHTML = '';
});
msg.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});
chips.forEach(c => c.addEventListener('click', () => {
  msg.value = c.dataset.q;
  msg.focus();
}));

setTimeout(() => {
  push('assistant', 'Halo! Tanyain teknik atau latihan yang kamu mau. Contoh: "Bang, program 3x/minggu buat ningkatin smash & footwork dong."');
}, 200);

