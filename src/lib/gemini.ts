import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateNewsArticle(newsContextJson: string, language: "Bangla" | "English" = "Bangla") {
  const context = JSON.parse(newsContextJson);
  const primaryNews = context.primary;
  const supporting = context.supporting;
  const originalQuery = context.query;

  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const systemInstruction = `You are NewsForge AI, a top-tier SEO news writer. 
Current Date: ${currentDate}.
Target Topic: ${originalQuery}.

STRICT CONTENT RULES:
1. SOURCE GROUNDING: You must generate the article based ONLY on the provided Context.
2. PRIORITY: The "Primary Source" details are the most important. Use "Supporting Context" only to add depth or verify facts.
3. LOCAL FOCUS: Do NOT mention unrelated international events or other countries unless they are explicitly in the source data.
4. NO HALLUCINATION: If a detail isn't in the context, don't invent it. Use the provided snippet and title to forge a cohesive narrative.
5. STYLE: Inverted Pyramid Style. Professional, human-like journalistic tone.
6. LANGUAGE: Generate in ${language}.
7. FORMAT: Return valid JSON matching the schema.

PRIMARY SOURCE:
Title: ${primaryNews.title}
Source: ${primaryNews.source}
Snippet: ${primaryNews.snippet}

SUPPORTING RESEARCH DATA:
${supporting}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Please generate a news article about "${primaryNews.title}" using the provided context.`,
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
