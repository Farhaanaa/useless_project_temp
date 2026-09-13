const express = require("express");
const cors = require("cors");
const { askOllama } = require("./ollama");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("VerutheAI backend is alive 🌿");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const rawResponse = await askOllama(message);

    let result;

    try {
      result = JSON.parse(rawResponse);
    } catch (error) {
      console.error("Invalid JSON from Ollama:", rawResponse);

      result = {
        response: rawResponse,
        uselessness_score: 50,
        chaos_score: 50,
        verdict: "The AI refused to behave.",
      };
    }

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong while talking to Ollama.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`VerutheAI server running at http://localhost:${PORT}`);
});
