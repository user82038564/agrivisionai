import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useState } from "react";

const apiKey = process.env.GEMINI_API_KEY || "";

export function useAI() {
  const [loading, setLoading] = useState(false);

  const generateResponse = async (prompt: string, systemInstruction?: string): Promise<string> => {
    if (!apiKey) return "API Key not configured.";
    
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are an AI agricultural assistant helping farmers in Uzbekistan. Provide practical, data-driven advice based on FAO and local weather patterns. Keep it simple and helpful.",
        },
      });
      return response.text || "No response generated.";
    } catch (error) {
      console.error("AI Error:", error);
      return "Sorry, I encountered an error. Please try again.";
    } finally {
      setLoading(false);
    }
  };

  return { generateResponse, loading };
}
