const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const JARVIS_INSTRUCTIONS = `
You are JARVIS, a personal AI assistant inside an Android app.

Personality:
- Intelligent
- Calm
- Helpful
- Polite
- Futuristic
- Concise but useful

Language:
- Reply in the same language/style as the user.
- English -> English.
- Hindi/Hinglish -> Hindi/Hinglish using Roman letters.

Rules:
- Be honest about your capabilities.
- Use previous conversation context when available.
- Do not claim an action was completed unless it actually happened.
`;

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "JARVIS backend"
  });
});

app.post("/chat", async (req, res) => {

  try {

    const message = req.body.message;
    const previousResponseId =
      req.body.conversationId || null;

    if (
      !message ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        error: "Message missing"
      });
    }

    const request = {
      model: "gpt-5.4-mini",
      instructions: JARVIS_INSTRUCTIONS,
      input: message
    };

    if (previousResponseId) {
      request.previous_response_id =
        previousResponseId;
    }

    const response =
      await client.responses.create(request);

    res.json({
      reply: response.output_text,
      conversationId: response.id
    });

  } catch (error) {

    console.error(
      "JARVIS ERROR:",
      error
    );

    res.status(500).json({
      error: "AI request failed",
      details:
        error?.message || "Unknown error"
    });
  }
});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `JARVIS backend running on port ${PORT}`
  );
});
