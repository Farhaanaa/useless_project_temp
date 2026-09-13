const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");

const unlockCard = document.getElementById("unlockCard");
const scoreCard = document.getElementById("scoreCard");

const placeButton = document.getElementById("placeButton");
const laterButton = document.getElementById("laterButton");

let placingFlower = false;

// SEND MESSAGE

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();

  if (!message) return;

  addMessage(message, "user");

  messageInput.value = "";

  // Show thinking animation
  showThinking();

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

    // Remove thinking animation
    hideThinking();

    // Add real AI response
    const aiMessage = addMessage(data.response, "ai");

    // Move score card directly below this answer
    if (scoreCard) {
      scoreCard.style.display = "flex";
      aiMessage.insertAdjacentElement("afterend", scoreCard);
    }

    updateScore(data.uselessness_score, data.chaos_score);

    updateUnlock(data.uselessness_score);
  } catch (error) {
    console.error(error);

    hideThinking();

    addMessage(
      "VerutheAI appears to be taking a very serious break. Please try again.",
      "ai",
    );
  }
});

// ADD MESSAGE

function addMessage(text, type) {
  const message = document.createElement("div");

  message.className =
    type === "user" ? "message user-message" : "message ai-message";

  if (type === "user") {
    message.innerHTML = `
      <div>
        <div class="message-bubble">
          ${escapeHTML(text)}
        </div>

        <div class="message-time">
          Just now
        </div>
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

  return message;
}

// SCORE

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

// FLOWER UNLOCK

function updateUnlock(uselessness) {
  if (!unlockCard) return;

  if (uselessness >= 70) {
    unlockCard.style.display = "flex";
  } else {
    unlockCard.style.display = "none";
  }
}

// THINKING POPUP

function showThinking() {
  if (document.getElementById("thinkingPopup")) return;

  const popup = document.createElement("div");

  popup.id = "thinkingPopup";

  popup.innerHTML = `
    <div class="thinking-icon">🧠</div>

    <div>
      <strong>Overthinking...</strong>
      <span>Taking this far too seriously.</span>
    </div>
  `;

  popup.style.position = "absolute";
  popup.style.left = "50%";
  popup.style.top = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.display = "flex";
  popup.style.alignItems = "center";
  popup.style.gap = "12px";
  popup.style.padding = "13px 18px";
  popup.style.background = "#f5eadc";
  popup.style.border = "1px solid #ded2bf";
  popup.style.borderRadius = "14px";
  popup.style.boxShadow = "0 10px 30px rgba(50, 55, 45, 0.08)";
  popup.style.zIndex = "10";
  popup.style.animation = "thinkingFloat 1.8s ease-in-out infinite";

  popup.querySelector("strong").style.display = "block";
  popup.querySelector("strong").style.fontFamily =
    '"Cormorant Garamond", serif';
  popup.querySelector("strong").style.fontSize = "17px";

  popup.querySelector("span").style.display = "block";
  popup.querySelector("span").style.marginTop = "2px";
  popup.querySelector("span").style.fontFamily = '"Kalam", cursive';
  popup.querySelector("span").style.fontSize = "11px";
  popup.querySelector("span").style.color = "#88877e";

  popup.querySelector(".thinking-icon").style.fontSize = "25px";

  document.querySelector(".chat-page").appendChild(popup);
}

function hideThinking() {
  const popup = document.getElementById("thinkingPopup");

  if (popup) {
    popup.remove();
  }
}

// PLACE FLOWER

if (placeButton) {
  placeButton.addEventListener("click", () => {
    placingFlower = true;

    unlockCard.style.display = "none";

    document.querySelector(".chat-page").style.cursor = "crosshair";

    const message = document.createElement("div");

    message.id = "placementHint";

    message.textContent = "Click anywhere in the chat to place your flower 🌼";

    message.style.position = "absolute";
    message.style.left = "50%";
    message.style.top = "18%";
    message.style.transform = "translateX(-50%)";
    message.style.padding = "9px 15px";
    message.style.background = "#f5eadc";
    message.style.border = "1px dashed #d2c4ae";
    message.style.borderRadius = "10px";
    message.style.fontFamily = '"Kalam", cursive';
    message.style.fontSize = "12px";
    message.style.color = "#77766f";
    message.style.zIndex = "10";

    document.querySelector(".chat-page").appendChild(message);
  });
}

// CLICK TO PLACE FLOWER

document.querySelector(".chat-page").addEventListener("click", (event) => {
  if (!placingFlower) return;

  // Don't place when clicking buttons, input or links
  if (
    event.target.closest("button") ||
    event.target.closest("input") ||
    event.target.closest("a")
  ) {
    return;
  }

  const chatPage = document.querySelector(".chat-page");
  const rect = chatPage.getBoundingClientRect();

  const flower = document.createElement("div");

  flower.className = "placed-flower";
  flower.textContent = "🌼";

  flower.style.position = "absolute";
  flower.style.left = `${event.clientX - rect.left}px`;
  flower.style.top = `${event.clientY - rect.top}px`;
  flower.style.transform = "translate(-50%, -50%) rotate(-8deg)";
  flower.style.fontSize = "38px";
  flower.style.zIndex = "3";
  flower.style.pointerEvents = "none";
  flower.style.animation = "flowerAppear 0.5s ease";

  chatPage.appendChild(flower);

  placingFlower = false;

  chatPage.style.cursor = "default";

  const hint = document.getElementById("placementHint");

  if (hint) {
    hint.remove();
  }
});

// LATER

if (laterButton) {
  laterButton.addEventListener("click", () => {
    unlockCard.style.display = "none";
  });
}

// ESCAPE HTML

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

// ANIMATION STYLES

const animationStyles = document.createElement("style");

animationStyles.textContent = `
  @keyframes thinkingFloat {
    0%, 100% {
      transform: translate(-50%, -50%) translateY(0);
    }

    50% {
      transform: translate(-50%, -50%) translateY(-6px);
    }
  }

  @keyframes flowerAppear {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) rotate(-8deg) scale(0.5);
    }

    100% {
      opacity: 0.8;
      transform: translate(-50%, -50%) rotate(-8deg) scale(1);
    }
  }
`;

document.head.appendChild(animationStyles);
