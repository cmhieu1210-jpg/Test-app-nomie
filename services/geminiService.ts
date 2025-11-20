import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the GenAI client
// The API key is injected automatically via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image using Gemini 2.5 Flash Image based on a text prompt.
 * @param base64Image The source image in base64 format (without the data:image/xxx;base64 prefix preferably, or stripped inside).
 * @param mimeType The mime type of the image (e.g., 'image/png', 'image/jpeg').
 * @param prompt The text instruction for editing (e.g., "Add a retro filter").
 * @returns The base64 string of the generated image.
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    // Ensure base64 string is clean
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract the image from the response
    // The structure usually has candidates -> content -> parts -> inlineData
    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return part.inlineData.data;
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
