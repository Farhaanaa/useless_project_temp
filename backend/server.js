const express = require("express");
const { askOllama } = require("./ollama");

const app = express();
const PORT = 3000;

app.use(express.json());

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

    const response = await askOllama(message);

    res.json({
      response,
    });
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
