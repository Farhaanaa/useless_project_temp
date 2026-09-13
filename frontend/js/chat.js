const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();

  if (!message) return;

  addMessage(message, "user");

  messageInput.value = "";

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();

    addMessage(data.response, "ai");

    updateScore(data.uselessness_score, data.chaos_score);
  } catch (error) {
    console.error(error);

    addMessage(
      "VerutheAI appears to be taking a very serious break. Please try again.",
      "ai",
    );
  }
});

function addMessage(text, type) {
  const message = document.createElement("div");

  message.className =
    type === "user" ? "message user-message" : "message ai-message";

  if (type === "user") {
    message.innerHTML = `
            <div class="message-bubble">
                ${escapeHTML(text)}
            </div>

            <div class="message-time">
                Just now
            </div>
        `;
  } else {
    message.innerHTML = `
            <div class="avatar">
                <div class="avatar-face">
                    <span>•</span>
                    <span>•</span>
                    <small>⌣</small>
                </div>
            </div>

            <div class="ai-content">

                <div class="message-bubble">
                    ${escapeHTML(text)}
                </div>

                <div class="message-time">
                    VerutheAI · just now
                </div>

            </div>
        `;
  }

  messages.appendChild(message);

  messages.scrollTop = messages.scrollHeight;
}

function updateScore(uselessness, chaos) {
  const scoreFill = document.getElementById("scoreFill");
  const scoreNumber = document.getElementById("scoreNumber");

  if (scoreFill) {
    scoreFill.style.width = `${uselessness}%`;
  }

  if (scoreNumber) {
    scoreNumber.textContent = `${uselessness}%`;
  }
}

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}
