const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");

const unlockCard = document.getElementById("unlockCard");
const scoreCard = document.getElementById("scoreCard");

const placeButton = document.getElementById("placeButton");
const laterButton = document.getElementById("laterButton");

let placingFlower = false;

// =========================
// SEND MESSAGE
// =========================

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();

  if (!message) return;

  addMessage(message, "user");

  messageInput.value = "";

  // Show random thinking animation
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

    // Add AI response
    const aiMessage = addMessage(data.response, "ai");

    // Move score card below this answer
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

// =========================
// ADD MESSAGE
// =========================

function addMessage(text, type) {
  const message = document.createElement("div");

  message.className =
    type === "user" ? "message user-message" : "message ai-message";

  // USER MESSAGE

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
  }

  // AI MESSAGE
  else {
    message.innerHTML = `

      <div class="avatar">

        <img
          src="assets/mascot/mascot.png"
          class="ai-mascot"
          alt="VerutheAI mascot"
        />

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

// =========================
// SCORE
// =========================

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

// =========================
// FLOWER UNLOCK
// =========================

function updateUnlock(uselessness) {
  if (!unlockCard) return;

  if (uselessness >= 70) {
    unlockCard.style.display = "flex";
  } else {
    unlockCard.style.display = "none";
  }
}

// =========================
// THINKING POPUP
// =========================

function showThinking() {
  if (document.getElementById("thinkingPopup")) {
    return;
  }

  const thinkingMessages = [
    {
      icon: "🧠",
      title: "ഒന്ന് ആലോചിക്കട്ടെ...",
      subtitle: "ഇത് വെറുതെ വിട്ടാൽ മതിയായിരുന്നു.",
    },

    {
      icon: "🤨",
      title: "ഇത് എന്താ ചോദിച്ചത്...",
      subtitle: "ഞാനും ഇപ്പോ confused ആണ്.",
    },

    {
      icon: "☕",
      title: "ആദ്യം ഒരു ചായ എടുക്കട്ടെ...",
      subtitle: "പിന്നെ ഈ പ്രശ്നം നോക്കാം.",
    },

    {
      icon: "🧐",
      title: "ഗൗരവമായി പരിശോധിക്കുന്നു...",
      subtitle: "ആവശ്യമില്ലാത്തത്ര ഗൗരവമായി.",
    },

    {
      icon: "😭",
      title: "ഒരു നിമിഷം...",
      subtitle: "തലച്ചോർ തുറക്കുകയാണ്.",
    },

    {
      icon: "📚",
      title: "ഇതിനായി പഠിക്കേണ്ടി വരുമോ...",
      subtitle: "ചോദ്യം കണ്ടിട്ട് പേടിയായി.",
    },

    {
      icon: "🤔",
      title: "ഇതിൽ എന്തോ വലിയ കാര്യമുണ്ട്...",
      subtitle: "അല്ലെങ്കിൽ ഇല്ല.",
    },

    {
      icon: "📝",
      title: "ഞാൻ കുറച്ച് overthink ചെയ്യട്ടെ...",
      subtitle: "അതാണ് എന്റെ ജോലി.",
    },

    {
      icon: "🌿",
      title: "ശരി... വെറുതെ ആലോചിക്കാം.",
      subtitle: "കാരണം എന്തിനാണെന്ന് അറിയില്ല.",
    },

    {
      icon: "😐",
      title: "ഇതിന് ഉത്തരം ഉണ്ടോ?",
      subtitle: "ഉണ്ടാക്കിയെടുക്കാം.",
    },
  ];

  const randomMessage =
    thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];

  const popup = document.createElement("div");

  popup.id = "thinkingPopup";

  popup.innerHTML = `

    <div class="thinking-icon">
      ${randomMessage.icon}
    </div>

    <div>

      <strong>
        ${randomMessage.title}
      </strong>

      <span>
        ${randomMessage.subtitle}
      </span>

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
    '"Noto Sans Malayalam", sans-serif';

  popup.querySelector("strong").style.fontSize = "17px";

  popup.querySelector("strong").style.fontWeight = "600";

  popup.querySelector("span").style.display = "block";

  popup.querySelector("span").style.marginTop = "3px";

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

// =========================
// PLACE FLOWER
// =========================

if (placeButton) {
  placeButton.addEventListener("click", () => {
    placingFlower = true;

    unlockCard.style.display = "none";

    const chatPage = document.querySelector(".chat-page");

    chatPage.style.cursor = "crosshair";

    const message = document.createElement("div");

    message.id = "placementHint";

    message.textContent = "Click anywhere in the chat to place your flower";

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

    chatPage.appendChild(message);
  });
}

// =========================
// CLICK TO PLACE FLOWER
// =========================

document.querySelector(".chat-page").addEventListener("click", (event) => {
  if (!placingFlower) {
    return;
  }

  // Don't place on controls

  if (
    event.target.closest("button") ||
    event.target.closest("input") ||
    event.target.closest("a")
  ) {
    return;
  }

  const chatPage = document.querySelector(".chat-page");

  const rect = chatPage.getBoundingClientRect();

  // REAL FLOWER IMAGE

  const flower = document.createElement("img");

  flower.className = "placed-flower";

  flower.src = "assets/decorations/flower.png";

  flower.alt = "";

  flower.style.position = "absolute";

  flower.style.left = `${event.clientX - rect.left}px`;

  flower.style.top = `${event.clientY - rect.top}px`;

  flower.style.transform = "translate(-50%, -50%) rotate(-8deg)";

  flower.style.width = "55px";

  flower.style.height = "55px";

  flower.style.objectFit = "contain";

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

// =========================
// LATER
// =========================

if (laterButton) {
  laterButton.addEventListener("click", () => {
    unlockCard.style.display = "none";
  });
}

// =========================
// ESCAPE HTML
// =========================

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

// =========================
// ANIMATION STYLES
// =========================

const animationStyles = document.createElement("style");

animationStyles.textContent = `

  @keyframes thinkingFloat {

    0%, 100% {
      transform:
        translate(-50%, -50%)
        translateY(0);
    }

    50% {
      transform:
        translate(-50%, -50%)
        translateY(-6px);
    }

  }


  @keyframes flowerAppear {

    0% {
      opacity: 0;

      transform:
        translate(-50%, -50%)
        rotate(-8deg)
        scale(0.5);
    }

    100% {
      opacity: 0.9;

      transform:
        translate(-50%, -50%)
        rotate(-8deg)
        scale(1);
    }

  }

`;

document.head.appendChild(animationStyles);
