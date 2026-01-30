import { GoogleGenAI, Type } from "@google/genai";
import { Blueprint, ForgeSettings } from '../types';

let genAI: GoogleGenAI | null = null;

const getAI = () => {
  if (!genAI && process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const generateBlueprint = async (
  prompt: string, 
  settings: ForgeSettings
): Promise<Blueprint> => {
  const ai = getAI();
  if (!ai) {
    throw new Error("API Key not found or invalid.");
  }

  const systemInstruction = `
    You are 'The Forge', a high-end software architect AI. 
    Your goal is to take a raw idea and forge it into a structured technical blueprint.
    
    Adhere to these parameters:
    - Complexity Level: ${settings.complexity}/100 (If high, suggest microservices, AI, advanced tech. If low, simple scripts or static sites).
    - Chaos/Abstraction: ${settings.chaos}/100 (If high, suggest wild, experimental, avant-garde features. If low, stick to industry standards).
    
    Output strictly in JSON format matching the schema.
  `;

  const userPrompt = `Forge a blueprint for this idea: "${prompt}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tagline: { type: Type.STRING },
            description: { type: Type.STRING },
            techStack: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            coreFeatures: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            architectureDiagram: { type: Type.STRING, description: "A creative text-based diagram or ASCII art representing the data flow." },
            estimatedComplexity: { type: Type.STRING },
          },
          required: ["title", "tagline", "description", "techStack", "coreFeatures", "architectureDiagram", "estimatedComplexity"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Blueprint;
    }
    throw new Error("No response text generated.");
  } catch (error) {
    console.error("Forge failed:", error);
    throw error;
  }
};

export const generateSparks = async (): Promise<{text: string, type: 'COMBO'|'PIVOT'|'WILD'}[]> => {
    const ai = getAI();
    // Default sparks if API key is missing
    if (!ai) return [
      { text: "API Key Missing - Local Sparks Only", type: "WILD" },
      { text: "Check Environment Variables", type: "PIVOT" }
    ];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Generate 3 short, punchy, abstract software ideas. Mix 'PIVOT' (changing direction), 'COMBO' (merging two genres), and 'WILD' (experimental art/tech). Max 10 words each.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ["COMBO", "PIVOT", "WILD"] }
                    },
                    required: ["text", "type"]
                  }
                }
            }
        });
        
        if (response.text) {
             const parsed = JSON.parse(response.text);
             if (Array.isArray(parsed)) return parsed;
             return [];
        }
        return [];
    } catch (e) {
        console.error(e);
        return [{ text: "Spark ignition failed.", type: "WILD" }];
    }
}