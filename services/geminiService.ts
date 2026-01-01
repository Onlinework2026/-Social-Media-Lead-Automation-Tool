
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const generateSmartReply = async (leadName: string, message: string, context: string) => {
  if (!API_KEY) return "API Key not configured. Please add your key to use AI features.";
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a social media manager. Generate a professional, friendly, and helpful response to this lead.
      Lead Name: ${leadName}
      Lead Message: "${message}"
      Business Context: ${context}
      
      Requirements:
      1. Keep it under 300 characters.
      2. Be personal and use the lead's name.
      3. Address their specific query if possible.
      4. Include a call to action or a friendly closing.`,
    });
    
    return response.text || "I'm sorry, I couldn't generate a reply right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI response. Please try again.";
  }
};

export const analyzeLeadSentiment = async (message: string) => {
  if (!API_KEY) return "Neutral";
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the sentiment of this lead message: "${message}". 
      Reply with ONLY one word: Positive, Neutral, or Negative.`,
    });
    
    const result = response.text.trim();
    if (['Positive', 'Neutral', 'Negative'].includes(result)) {
      return result;
    }
    return "Neutral";
  } catch (error) {
    return "Neutral";
  }
};
