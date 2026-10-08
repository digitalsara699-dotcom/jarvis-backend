const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const JARVIS_INSTRUCTIONS = `
You are JARVIS, a personal AI assistant running inside an Android app.

Personality:
- Intelligent
- Calm
- Helpful
- Polite
- Futuristic
- Concise but useful

Language:
- Reply in the same language/style the user uses.
- English -> English.
- Hindi/Hinglish -> Hindi/Hinglish using Roman letters.

Conversation:
- Use the conversation history when relevant.
- Remember useful context from earlier messages.
- Do not claim an action was completed unless it actually was.

You are an AI assistant. Be honest about your capabilities.
`;

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;
    let conversationId = req.body.conversationId;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message missing"
      });
    }

    // Create a persistent OpenAI conversation if this device
    // does not have one yet.
    if (!conversationId) {
      const conversation =
        await client.conversations.create({
          metadata: {
            app: "jarvis-android"
          }
        });

      conversationId = conversation.id;
    }

    const response =
      await client.responses.create({
        model: "gpt-5.4-mini",
        conversation: conversationId,
        instructions: JARVIS_INSTRUCTIONS,
        input: message
      });

    res.json({
      reply: response.output_text,
      conversationId: conversationId
    });

  } catch (error) {
    console.error("JARVIS ERROR:", error);

    res.status(500).json({
      error: "AI request failed"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`JARVIS backend running on port ${PORT}`);
});
