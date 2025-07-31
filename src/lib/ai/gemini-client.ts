import { GoogleGenAI, type Part, type SchemaUnion } from "@google/genai";

const googleGenAi = new GoogleGenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * @note Only accepts PDF files (at least for now)
 */
export interface PartWithFileUrl extends Part {
  fileUrl?: string; // Optional URL for file content
  mimeType?: "application/pdf";
}

export async function promptWithFileUrl(
  prompt: PartWithFileUrl[],
  options?: { model?: "application/json" | "text/x.enum", responseMimeType?: string, responseSchema?: SchemaUnion }
) {
  const contents = await Promise.all(prompt.map(async (part) => {
    if (part.fileUrl) {
      const response = await fetch(part.fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file from ${part.fileUrl}`);
      }
      const data = await response.arrayBuffer();
      return {
        ...part,
        inlineData: {
          mimeType: part.mimeType,
          data: Buffer.from(data).toString("base64"),
        },
      };
    }
    return part;
  }));

  const response = await googleGenAi.models.generateContent({
    model: options?.model || "gemini-2.0-flash",
    contents: contents,
    config: {
      responseMimeType: options?.responseMimeType,
      responseSchema: options?.responseSchema,
    },
  });

  return response;
}
