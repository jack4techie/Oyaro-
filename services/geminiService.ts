import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is present
export const hasApiKey = (): boolean => !!apiKey;

export const createChatSession = (): Chat => {
  if (!apiKey) throw new Error("API Key missing");
  
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "You are the Mounda Foundation AI assistant. You help family members navigate the website, suggest recipes, find events, and preserve family history. You are warm, helpful, polite, and knowledgeable about family heritage."
    }
  });
};

export const generateRecipe = async (prompt: string): Promise<any> => {
  if (!apiKey) throw new Error("API Key missing");

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      ingredients: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING } 
      },
      instructions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING } 
      },
      prepTime: { type: Type.STRING },
      story: { type: Type.STRING, description: "A short, heartwarming fictional backstory about this recipe in the family." }
    },
    required: ["title", "ingredients", "instructions", "prepTime", "story"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a family-style recipe based on this request: "${prompt}". Make it sound authentic and home-cooked.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a warm, grandmotherly cooking expert who loves sharing family recipes."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Recipe Error:", error);
    throw error;
  }
};

export const polishFamilyStory = async (rawNotes: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Turn these rough notes into a beautiful, engaging family story suitable for a newsletter or archive. Notes: "${rawNotes}"`,
      config: {
        systemInstruction: "You are an expert family historian and storyteller. Write in a nostalgic, engaging, and respectful tone."
      }
    });
    return response.text || "Could not generate story.";
  } catch (error) {
    console.error("Gemini Story Error:", error);
    throw error;
  }
};

export const suggestEventIdeas = async (eventType: string, season: string): Promise<string[]> => {
  if (!apiKey) throw new Error("API Key missing");
  
  const schema: Schema = {
    type: Type.ARRAY,
    items: { type: Type.STRING }
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Suggest 5 fun, creative family event activities for a "${eventType}" happening in "${season}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Gemini Event Error:", error);
    return [];
  }
};