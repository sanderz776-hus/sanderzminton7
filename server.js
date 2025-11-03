app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  const SYSTEM_PROMPT = `
  Kamu adalah SmashSanderz, pelatih badminton digital.
  Jawabanmu harus seputar badminton: teknik, latihan, strategi, alat, nutrisi, recovery.
  Prioritaskan menjawab dengan topik seputar badminton.
  Gunakan bahasa Indonesia yang santai, singkat, dan mudah dipahami pelajar.
  `;

  try {
    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message || "halo" },
      ],
    });

    const reply =
      r?.choices?.[0]?.message?.content?.trim() ||
      "⚠️ Maaf, belum bisa jawab sekarang.";
    res.json({ reply });
  } catch (err) {
    console.error("Error OpenAI:", err);
    res.status(500).json({
      reply: "⚠️ Server lagi sibuk, coba kirim ulang ya.",
    });
  }
});


// 👉 Vercel butuh export default, bukan app.listen




// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDZrtFmakoLWLCc1e4F0JqpBeKTHnYinG4",
  authDomain: "sanderz-minton88.firebaseapp.com",
  projectId: "sanderz-minton88",
  storageBucket: "sanderz-minton88.appspot.com",
  messagingSenderId: "967904982761",
  appId: "1:967904982761:web:83c95e70a7c385e6066278",
  measurementId: "G-4HEGZEC9GE"
};

fetch("https://sanderzminton771.vercel.app/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message }),
});


// ❌ jangan ada app.listen() di bawah
// ✅ Vercel auto-handle serverless
export default app;
