const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message missing"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.4-mini",

      instructions: `
You are JARVIS, a personal AI assistant.

Your personality:
- Intelligent
- Calm
- Helpful
- Polite
- Slightly futuristic
- Concise but useful

The user may speak in English, Hindi, or Hinglish.
Reply in the same language/style as the user.

Do not pretend to have performed an action when you have not.
If you don't know something, say so clearly.

For normal questions, give a direct and useful answer.
For complicated tasks, explain them step by step.

You are running inside the user's personal JARVIS Android application.
`,

      input: message
    });

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
