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

      format: "json",
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();

  let content = data.message.content.trim();

  // Remove markdown code fences if the model adds them
  content = content.replace(/^```json\s*/i, "");
  content = content.replace(/^```\s*/i, "");
  content = content.replace(/\s*```$/i, "");

  // Extract the JSON object if the model adds extra text
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");

  if (start !== -1 && end !== -1) {
    content = content.slice(start, end + 1);
  }

  return content;
}

module.exports = { askOllama };
