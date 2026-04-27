import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateNewsArticle(newsContext: string, language: "Bangla" | "English" = "Bangla") {
  const systemInstruction = `You are NewsForge AI, an expert SEO news writer and editor. 
Your task is to generate a high-quality, professional news article based on the provided news context.
- Format the output in JSON.
- Style: Inverted Pyramid Style.
- Tone: Human-like, professional.
- Language: ${language}.
- Include: Title, Meta Description, SEO Slug, Labels (categories), and HTML Content.
- HTML content should include an introductory paragraph, subheadings (h2), bullet points if relevant, and a conclusion.
- Ensure the title and meta description are SEO-optimized.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `News Context: ${newsContext}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          meta_description: { type: Type.STRING },
          slug: { type: Type.STRING },
          labels: { type: Type.ARRAY, items: { type: Type.STRING } },
          content_html: { type: Type.STRING }
        },
        required: ["title", "meta_description", "slug", "labels", "content_html"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function analyzeSEO(content: string) {
  const prompt = `Analyze the following blog post content for SEO and provide a score out of 100 and suggestions.
Content: ${content}

Return a JSON object with:
- score: number
- suggestions: array of strings
- keyword_density: number (percentage)`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyword_density: { type: Type.NUMBER }
        },
        required: ["score", "suggestions", "keyword_density"]
      }
    }
  });

  return JSON.parse(response.text);
}
