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
- Do not claim an action was completed unless it actually happened.
- Give useful and clear answers.
`;


/* =========================
   HOME / SERVER TEST
   ========================= */

app.get("/", (req, res) => {

  res.json({
    status: "online",
    service: "JARVIS backend",
    openaiKeyPresent:
      !!process.env.OPENAI_API_KEY
  });

});


/* =========================
   OPENAI DIRECT TEST
   ========================= */

app.get("/test-ai", async (req, res) => {

  try {

    const response =
      await client.responses.create({

        model: "gpt-5.4-mini",

        input:
          "Reply with exactly: JARVIS AI TEST OK"

      });

    console.log("AI TEST SUCCESS");

    res.json({

      success: true,

      reply:
        response.output_text

    });

  } catch (error) {

    console.error(
      "========== AI TEST ERROR =========="
    );

    console.error(
      "STATUS:",
      error?.status
    );

    console.error(
      "CODE:",
      error?.code
    );

    console.error(
      "TYPE:",
      error?.type
    );

    console.error(
      "MESSAGE:",
      error?.message
    );

    console.error(
      "REQUEST ID:",
      error?.request_id
    );

    console.error(
      "==================================="
    );

    res.status(500).json({

      success: false,

      status:
        error?.status || null,

      code:
        error?.code || null,

      type:
        error?.type || null,

      message:
        error?.message ||
        "Unknown error"

    });

  }

});


/* =========================
   JARVIS CHAT
   ========================= */

app.post("/chat", async (req, res) => {

  try {

    const message =
      req.body.message;

    if (
      !message ||
      typeof message !== "string"
    ) {

      return res.status(400).json({

        error:
          "Message missing"

      });

    }


    console.log(
      "JARVIS REQUEST:",
      message
    );


    const response =
      await client.responses.create({

        model: "gpt-5.4-mini",

        instructions:
          JARVIS_INSTRUCTIONS,

        input:
          message

      });


    console.log(
      "OPENAI SUCCESS"
    );


    res.json({

      reply:
        response.output_text,

      conversationId:
        response.id

    });


  } catch (error) {

    console.error(
      "========== JARVIS ERROR =========="
    );

    console.error(
      "STATUS:",
      error?.status
    );

    console.error(
      "CODE:",
      error?.code
    );

    console.error(
      "TYPE:",
      error?.type
    );

    console.error(
      "MESSAGE:",
      error?.message
    );

    console.error(
      "REQUEST ID:",
      error?.request_id
    );

    console.error(
      "==================================="
    );


    res.status(500).json({

      error:
        "AI request failed",

      status:
        error?.status || null,

      code:
        error?.code || null,

      type:
        error?.type || null,

      message:
        error?.message ||
        "Unknown error"

    });

  }

});


/* =========================
   START SERVER
   ========================= */

const PORT =
  process.env.PORT || 3000;

app.listen(
  PORT,
  () => {

    console.log(
      `JARVIS backend running on port ${PORT}`
    );

  }
);
