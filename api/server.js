import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

dotenv.config();

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
    Gunakan bahasa Indonesia santai, singkat, dan mudah dipahami pelajar.
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
      "⚠️ Maaf, server lagi blank. Coba kirim ulang ya.";

    res.json({ reply });
  } catch (err) {
    console.error("Error OpenAI:", err);
    res.status(500).json({
      reply: "⚠️ Server lagi sibuk / API key salah.",
      error: err.message,
    });
  }
});

// ✅ WAJIB UNTUK VERCEL — jangan pake app.listen()
export default app;

