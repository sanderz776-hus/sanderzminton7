const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  // tampilkan pesan user
  addChat("Kamu", message);
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    addChat("AI", data.reply || "Error: no reply");
  } catch (err) {
    addChat("AI", "⚠️ Server error / API mati.");
  }
}

function addChat(sender, text) {
  const div = document.createElement("div");
  div.innerHTML = `<b>${sender}:</b> ${text}`;
  chatBox.appendChild(div);
}

