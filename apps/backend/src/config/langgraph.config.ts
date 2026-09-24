import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

/**
 * Initializes and returns the primary ChatGroq model if API key is available.
 */
export const getGroqChatModel = (temperature = 0.3): ChatGroq | null => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new ChatGroq({
    apiKey,
    model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    temperature,
  });
};

/**
 * Initializes and returns the fallback ChatGoogleGenerativeAI model.
 */
export const getGeminiChatModel = (temperature = 0.3, modelName = "gemini-2.5-flash"): ChatGoogleGenerativeAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new ChatGoogleGenerativeAI({
    apiKey,
    model: modelName,
    temperature,
  });
};

/**
 * Returns a runnable chat model with Groq as primary and Gemini as fallback.
 */
export const getFallbackChatModel = (temperature = 0.3): BaseChatModel => {
  const groqModel = getGroqChatModel(temperature);
  const geminiModel = getGeminiChatModel(temperature, "gemini-2.5-flash");

  if (groqModel && geminiModel) {
    return groqModel.withFallbacks({
      fallbacks: [
        geminiModel,
        getGeminiChatModel(temperature, "gemini-3.6-flash") || geminiModel,
      ],
    }) as unknown as BaseChatModel;
  }

  if (groqModel) return groqModel as unknown as BaseChatModel;
  if (geminiModel) return geminiModel as unknown as BaseChatModel;

  throw new Error("No AI API keys configured (GROQ_API_KEY or GEMINI_API_KEY).");
};
