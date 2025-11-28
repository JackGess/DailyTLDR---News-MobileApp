const { GoogleGenAi, SchemaType } = require("@google/genai");
const logger = require("firebase-functions/logger");

const genAI = GoogleGenAi({apiKey: process.env.GEMINI_API_KEY});

const digestSchema = {
  type: SchemaType.OBJECT,
  properties: {
    headline: {
      type: SchemaType.STRING,
      description: "A short, catchy headline for the article.",
    },
    key_takeaway: {
      type: SchemaType.STRING,
      description: "The single most important fact or insight (1 sentence).",
    },
    synopsis: {
      type: SchemaType.STRING,
      description: "A concise 2-3 sentence summary of the article content.",
    },
    sentiment: {
      type: SchemaType.STRING,
      description: "The overall tone of the news.",
      enum: ["Positive", "Neutral", "Negative", "Controversial"],
    },
  },
  required: ["headline", "key_takeaway", "synopsis", "sentiment"],
};

