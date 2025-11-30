// ============================================
// Firebase Authentication & Rekap Olahraga
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, sendPasswordResetEmail, updatePassword
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZrtFmakoLWLCc1e4F0JqpBeKTHnYinG4",
  authDomain: "sanderz-minton88.firebaseapp.com",
  projectId: "sanderz-minton88",
  storageBucket: "sanderz-minton88.appspot.com",
  messagingSenderId: "967904982761",
  appId: "1:967904982761:web:83c95e70a7c385e6066278",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ============================================
// Toast Notification (ganti alert())
// ============================================
function toast(msg, emoji = "⚡") {
  const old = document.querySelector('.toast-alert');
  if (old) old.remove();
  
  const host = document.createElement('div');
  host.className = 'toast-alert';
  host.style.cssText = `
    position: fixed;
    left: 50%;
    bottom: 28px;
    transform: translateX(-50%);
    z-index: 99999;
    animation: fadeIn 0.25s ease;
  `;
  
  host.innerHTML = `
    <div style="
      padding: 12px 16px;
      border-radius: 14px;
      background: linear-gradient(135deg, #0a1530, #101b3a);
      border: 1px solid rgba(34, 211, 238, 0.25);
      color: #e5e7eb;
      display: flex;
      gap: 10px;
      align-items: center;
      box-shadow: 0 0 16px rgba(34, 211, 238, 0.25);
      backdrop-filter: blur(8px);
      font: 500 14px system-ui, Segoe UI, Roboto;
      max-width: 92vw;
      white-space: pre-wrap;
    ">
      <span style="font-size: 18px">${emoji}</span>
      <span>${msg}</span>
    </div>
  `;
  
  document.body.appendChild(host);
  setTimeout(() => {
    host.style.transition = 'opacity 0.35s ease';
    host.style.opacity = '0';
    setTimeout(() => host.remove(), 350);
  }, 3200);
}

window.alert = (m) => toast(m);

// ============================================
// Login / Register UI
// ============================================
const modal = document.getElementById('authModal');
const openBtn = document.getElementById('openAuth');
const closeBtn = document.getElementById('closeAuth');
const toggleBtn = document.getElementById('toggleMode');
const modeText = document.getElementById('authMode');
const actionBtn = document.getElementById('authAction');
const emailInput = document.getElementById('authEmail');
const passInput = document.getElementById('authPass');

let isLogin = true;

openBtn.onclick = () => modal.style.display = 'flex';
closeBtn.onclick = () => modal.style.display = 'none';

toggleBtn.onclick = () => {
  isLogin = !isLogin;
  modeText.textContent = isLogin ? "Login ke akunmu" : "Buat akun baru";
  actionBtn.textContent = isLogin ? "Login" : "Daftar";
  toggleBtn.textContent = isLogin ? "Belum punya akun?" : "Sudah punya akun?";
};

actionBtn.onclick = async () => {
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();
  if (!email || !pass) return toast("Isi email dan password dulu ya.", "⚠️");

  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, pass);
      toast("Login sukses!", "✅");
    } else {
      await createUserWithEmailAndPassword(auth, email, pass);
      toast("Akun berhasil dibuat!", "🎉");
    }
    modal.style.display = 'none';
  } catch (err) {
    toast(err.message || "Gagal. Cek data kamu.", "⚠️");
  }
};

// ============================================
// User Menu
// ============================================
function renderUserMenu(user) {
  openBtn.textContent = '☰';
  openBtn.style.fontSize = '20px';
  openBtn.style.color = '#22d3ee';

  const menu = document.createElement('div');
  menu.id = 'userMenu';
  menu.style.cssText = `
    position: fixed;
    top: 55px;
    right: 16px;
    z-index: 1000;
    background: rgba(10, 15, 35, 0.97);
    border: 1px solid rgba(34, 211, 238, 0.3);
    border-radius: 14px;
    padding: 14px 16px;
    width: 230px;
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.25);
    color: #e5e7eb;
    font-family: system-ui;
    display: none;
    animation: fadeIn 0.3s ease;
  `;

  const displayName = user.displayName || user.email.split('@')[0];
  const email = user.email;

  menu.innerHTML = `
    <p style="margin: 0; font-weight: 600; color: #22d3ee; font-size: 15px;">${displayName}</p>
    <p style="margin: 4px 0 10px; color: #9ca3af; font-size: 13px;">${email}</p>
    <hr style="border-color: rgba(34, 211, 238, 0.2); margin: 6px 0;">
    <button id="changePassBtn" style="
      width: 100%;
      margin-top: 6px;
      background: #0a1530;
      border: 1px solid #1f2937;
      color: #a5b4fc;
      border-radius: 8px;
      padding: 6px;
      cursor: pointer;
    ">Ganti Password</button>
    <button id="forgotPassBtn" style="
      width: 100%;
      margin-top: 6px;
      background: #0a1530;
      border: 1px solid #1f2937;
      color: #a5b4fc;
      border-radius: 8px;
      padding: 6px;
      cursor: pointer;
    ">Lupa Password</button>
    <button id="logoutBtn" style="
      width: 100%;
      margin-top: 10px;
      background: linear-gradient(90deg, #3b0a0a, #7f1d1d);
      border: 1px solid #7f1d1d;
      border-radius: 8px;
      color: #fca5a5;
      cursor: pointer;
      padding: 6px;
    ">Logout</button>
  `;
  
  document.body.appendChild(menu);

  openBtn.onclick = () => {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  };

  menu.querySelector('#logoutBtn').onclick = async () => {
    await signOut(auth);
    toast("👋 Logout berhasil!");
    menu.remove();
  };

  menu.querySelector('#changePassBtn').onclick = async () => {
    const newPass = prompt("Masukkan password baru:");
    if (!newPass) return toast("Password baru tidak boleh kosong.", "⚠️");
    try {
      await updatePassword(user, newPass);
      toast("Password berhasil diganti!", "✅");
    } catch (err) {
      toast("Gagal ganti password: " + (err.message || err), "⚠️");
    }
  };

  menu.querySelector('#forgotPassBtn').onclick = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast("Link reset password dikirim ke email kamu.", "📩");
    } catch (err) {
      toast("Gagal kirim email: " + (err.message || err), "⚠️");
    }
  };
}

onAuthStateChanged(auth, user => {
  const existingMenu = document.getElementById('userMenu');
  if (existingMenu) existingMenu.remove();

  if (user) {
    renderUserMenu(user);
  } else {
    openBtn.textContent = '👤 Akun';
    openBtn.style.fontSize = '14px';
    openBtn.style.color = '#22d3ee';
    openBtn.onclick = () => modal.style.display = 'flex';
  }
});

// Tombol lupa password di modal
const forgotBtn = document.createElement('p');
forgotBtn.textContent = "Lupa password?";
forgotBtn.style.cssText = "color: #22d3ee; font-size: 13px; margin-top: 6px; cursor: pointer;";
document.querySelector("#authModal div").appendChild(forgotBtn);

forgotBtn.onclick = async () => {
  const email = emailInput.value.trim();
  if (!email) return toast("Masukkan email dulu untuk reset password.", "⚠️");
  try {
    await sendPasswordResetEmail(auth, email);
    toast("Link reset password sudah dikirim ke email kamu.", "📩");
  } catch (err) {
    toast("Gagal kirim email: " + err.message, "⚠️");
  }
};

// ============================================
// Rekap Olahraga
// ============================================
if (!document.getElementById('rekapBtnSM')) {
  const btn = document.createElement('button');
  btn.id = 'rekapBtnSM';
  btn.textContent = '📈 Rekap Olahraga';
  btn.style.cssText = `
    position: fixed;
    bottom: 22px;
    right: 22px;
    z-index: 9999;
    background: linear-gradient(135deg, #22d3ee, #6366f1);
    color: #0f172a;
    font-weight: 700;
    border: none;
    border-radius: 14px;
    padding: 12px 16px;
    cursor: pointer;
    letter-spacing: 0.3px;
    box-shadow: 0 0 25px rgba(34, 211, 238, 0.4);
    transition: 0.3s;
  `;
  
  btn.onmouseenter = () => btn.style.transform = 'scale(1.07)';
  btn.onmouseleave = () => btn.style.transform = 'scale(1)';
  document.body.appendChild(btn);

  // Panel
  const panel = document.createElement('div');
  panel.id = 'rekapPanelSM';
  panel.style.cssText = `
    position: fixed;
    inset: 0;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(10px);
    z-index: 10000;
  `;
  
  panel.innerHTML = `
    <div style="
      background: linear-gradient(145deg, #0b1225 20%, #111c33 80%);
      border: 1px solid rgba(34, 211, 238, 0.25);
      border-radius: 24px;
      padding: 30px 26px;
      width: 380px;
      max-height: 85vh;
      overflow: auto;
      box-shadow: 0 0 30px rgba(34, 211, 238, 0.25);
      color: #e5e7eb;
      font-family: system-ui;
      animation: fadeIn 0.4s ease-out;
    ">
      <h2 style="margin-top: 0; color: #22d3ee; text-align: center; font-size: 21px;">🏸 Dashboard Latihan</h2>

      <div id="progressWrap" style="margin: 14px 0 18px;">
        <p style="font-size: 13px; color: #a5b4fc; margin-bottom: 6px; text-align: center;">Progress Mingguan</p>
        <div style="width: 100%; height: 10px; background: #0a1530; border-radius: 999px; overflow: hidden;">
          <div id="progressBar" style="height: 100%; width: 0%;
            background: linear-gradient(90deg, #22d3ee, #818cf8);
            box-shadow: 0 0 14px rgba(34, 211, 238, 0.6);
            transition: width 0.6s ease;">
          </div>
        </div>
        <p id="progressText" style="font-size: 12px; text-align: center; margin-top: 6px; color: #9ca3af"></p>
      </div>

      <canvas id="rekapChart" width="320" height="320" style="margin: auto; display: block;"></canvas>
      <div id="rekapList" style="font-size: 14px; margin-top: 14px;"></div>

      <div style="margin-top: 18px; text-align: center;">
        <select id="kegiatan" style="width: 90%; margin-bottom: 6px; padding: 8px; border-radius: 10px; border: none; background: #0a1530; color: #e5e7eb;">
          <option value="">Pilih olahraga...</option>
          <option>Badminton</option>
          <option>Gym</option>
          <option>Lari</option>
          <option>Bersepeda</option>
          <option>Renang</option>
          <option>Futsal</option>
          <option>Calisthenics</option>
          <option>Workout Rumah</option>
        </select>
        <input id="durasi" type="number" placeholder="Durasi (menit)" style="width: 90%; margin-bottom: 10px; padding: 8px; border-radius: 10px; border: none; background: #0a1530; color: #e5e7eb">
        <button id="tambahRekap" style="background: linear-gradient(90deg, #22d3ee, #818cf8); color: #0f172a; border: none; padding: 8px 14px; border-radius: 10px; font-weight: 600; cursor: pointer;">Tambah</button>
      </div>

      <p id="totalDurasi" style="margin-top: 16px; color: #a5b4fc; font-size: 13px; text-align: center;"></p>
      <div style="text-align: center; margin-top: 8px;">
        <button id="closeRekap" style="background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 13px;">Tutup</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(panel);

  // Elemen panel
  const rekapList = panel.querySelector('#rekapList');
  const totalDurasi = panel.querySelector('#totalDurasi');
  const selectKegiatan = panel.querySelector('#kegiatan');
  const inputDurasi = panel.querySelector('#durasi');
  const tambahBtn = panel.querySelector('#tambahRekap');
  const closeBtn = panel.querySelector('#closeRekap');
  const progressBar = panel.querySelector('#progressBar');
  const progressText = panel.querySelector('#progressText');

  // Firestore helpers
  const userDoc = (uid) => doc(db, "users", uid, "rekapOlahraga", "data");

  async function ensureDoc(uid) {
    const snap = await getDoc(userDoc(uid));
    if (!snap.exists()) {
      await setDoc(userDoc(uid), { items: [], updated: serverTimestamp() });
    }
  }

  function subscribeItems(uid, onData) {
    return onSnapshot(userDoc(uid), (snap) => {
      const items = snap.exists() ? (snap.data().items || []) : [];
      onData(items);
    });
  }

  async function addItem(uid, nama, menit) {
    const ref = userDoc(uid);
    const snap = await getDoc(ref);
    const items = snap.exists() ? (snap.data().items || []) : [];
    items.push({ nama, menit, ts: Date.now() });
    await setDoc(ref, { items, updated: serverTimestamp() });
  }

  async function removeItem(uid, index) {
    const ref = userDoc(uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const items = snap.data().items || [];
    items.splice(index, 1);
    await setDoc(ref, { items, updated: serverTimestamp() });
  }

  // Chart + progress
  const TARGET = 300; // menit / minggu
  let chart;

  function renderProgress(total) {
    const pct = Math.min((total / TARGET) * 100, 100);
    progressBar.style.width = pct + '%';
    progressText.textContent = `${total}/${TARGET} menit (${Math.floor(pct)}%)`;
    if (pct >= 100) {
      progressText.innerHTML = `🔥 Target tercapai! (${total} menit)`;
      progressBar.style.background = 'linear-gradient(90deg, #34d399, #22d3ee)';
      progressBar.style.boxShadow = '0 0 16px rgba(34, 211, 238, 0.8)';
    } else {
      progressBar.style.background = 'linear-gradient(90deg, #22d3ee, #818cf8)';
      progressBar.style.boxShadow = '0 0 14px rgba(34, 211, 238, 0.6)';
    }
  }

  function renderChart(data) {
    const ctx = document.getElementById('rekapChart');
    if (chart) chart.destroy();
    if (data.length === 0) {
      const g = ctx.getContext('2d');
      g.clearRect(0, 0, ctx.width, ctx.height);
      g.fillStyle = "#9ca3af";
      g.font = "14px system-ui";
      g.fillText("Belum ada data...", 100, 150);
      return;
    }
    const labels = data.map(d => d.nama);
    const values = data.map(d => d.menit);
    const colors = ['#22d3ee', '#818cf8', '#34d399', '#facc15', '#fb7185', '#a78bfa', '#0ea5e9', '#4ade80'];
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: '#0b1225',
          borderWidth: 2,
          hoverOffset: 10
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: '#e5e7eb',
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#0b1225',
            titleColor: '#22d3ee',
            bodyColor: '#e5e7eb'
          }
        },
        cutout: '55%',
        animation: {
          animateRotate: true,
          duration: 900,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  function renderList(data) {
    rekapList.innerHTML = data.length
      ? data.map((r, i) => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>${i + 1}. ${r.nama} <span style="color: #22d3ee">(${r.menit} mnt)</span></span>
            <button data-i="${i}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 13px;">✕</button>
          </div>
        `).join('')
      : '<p style="color: #9ca3af; text-align: center;">Belum ada data latihan.</p>';
    const total = data.reduce((a, b) => a + (b.menit || 0), 0);
    totalDurasi.textContent = total ? `Total latihan minggu ini: ${total} menit 💪` : '';
    renderProgress(total);
    renderChart(data);
  }

  // Events
  let unsub = null;

  btn.onclick = async () => {
    const u = auth.currentUser;
    if (!u) {
      toast('🔒 Silakan login dulu untuk mengakses riwayat olahraga kamu.');
      return;
    }
    await ensureDoc(u.uid);
    if (unsub) unsub();
    unsub = subscribeItems(u.uid, renderList);
    panel.style.display = 'flex';
  };

  tambahBtn.onclick = async () => {
    const u = auth.currentUser;
    if (!u) return toast('Login dulu ya.', '🔒');
    const nama = (selectKegiatan.value || '').trim();
    const menit = parseInt((inputDurasi.value || '').trim());
    if (!nama || !menit) return toast('Pilih olahraga & isi durasi!', '⚠️');
    await addItem(u.uid, nama, menit);
    selectKegiatan.value = '';
    inputDurasi.value = '';
    toast('Data latihan ditambahkan!', '✅');
  };

  rekapList.addEventListener('click', async (e) => {
    const idx = e.target.dataset.i;
    if (idx === undefined) return;
    const u = auth.currentUser;
    if (!u) return;
    await removeItem(u.uid, Number(idx));
    toast('Data dihapus.', '🗑️');
  });

  closeBtn.onclick = () => {
    panel.style.display = 'none';
    if (unsub) {
      unsub();
      unsub = null;
    }
  };
}

