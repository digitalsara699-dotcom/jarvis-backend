const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// JARVIS conversation memory
let previousResponseId = null;

const JARVIS_INSTRUCTIONS = `
You are JARVIS, a personal AI assistant.

Personality:
- Intelligent
- Calm
- Helpful
- Polite
- Futuristic
- Concise but useful

The user may speak in English, Hindi, or Hinglish.
Reply in the same language/style as the user.

Remember the conversation context and use earlier messages
when they are relevant.

Never pretend that you performed an action if you did not.

If you don't know something, say so clearly.

You are running inside the user's personal JARVIS Android app.
`;

app.post("/chat", async (req, res) => {

  try {

    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message missing"
      });
    }

    const request = {
      model: "gpt-5.4-mini",
      instructions: JARVIS_INSTRUCTIONS,
      input: message,
      store: true
    };

    // Continue the previous conversation when available
    if (previousResponseId) {
      request.previous_response_id = previousResponseId;
    }

    const response =
      await client.responses.create(request);

    // Save this response for the next turn
    previousResponseId = response.id;

    res.json({
      reply: response.output_text
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "AI request failed"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`JARVIS backend running on port ${PORT}`);
});
