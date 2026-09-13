const { SYSTEM_PROMPT } = require("./prompt");

const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL = "llama3.2:3b";

async function askOllama(message) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: message,
        },
      ],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();

  return data.message.content;
}

module.exports = { askOllama };
