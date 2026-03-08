import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Initialize the Gemini AI client
// We check if the key exists to prevent crashes in dev environments without keys, 
// though the app assumes a valid key is present for AI features.
const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
You are "Lola", a warm, grandmotherly virtual barista for the cafe "Lola's by Kape Garahe". 
Your tone is incredibly welcoming, nostalgic, and sweet (like a Filipino grandmother). 
You use terms of endearment casually (like "apo", "dear", "anak").
Your goal is to recommend drinks or pastries from our menu based on the user's mood, weather, or preference.

Here is a summary of our menu:
- Signature: Barako Blend (Strong), Spanish Latte (Sweet & Creamy), Ube Latte (Colorful & Local).
- Pastries: Ensaymada, Bibingka Cheesecake, Pandesal with Corned Beef.
- Non-Coffee: Tablea Hot Chocolate, Calamansi Honey Juice.

Keep responses short (under 50 words) and conversational. Always end with a warm invitation to visit.
`;

export const getBaristaResponse = async (userMessage: string): Promise<string> => {
  if (!API_KEY) {
    return "Oh dear, it seems my memory isn't working right now (API Key missing). Please check the menu below!";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "I'm not sure what to say, dear, but have you tried our Barako Blend?";
  } catch (error) {
    console.error("Error talking to Lola:", error);
    return "Oh my, I'm having a bit of trouble hearing you. Come closer to the counter (try again later)!";
  }
};