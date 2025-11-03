import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
        { role: "user", content: message },
      ],
    });

    res.status(200).json({ reply: r.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memanggil API OpenAI" });
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

// ❌ jangan ada app.listen() di bawah
// ✅ Vercel auto-handle serverless
export default app;
