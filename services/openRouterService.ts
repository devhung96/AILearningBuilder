
import { Roadmap } from '../types';
import { roadmapSchema } from './geminiService'; // Reuse the schema for consistency

const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  // This is a placeholder. In a real app, the key might be managed differently.
  console.warn("OPENROUTER_API_KEY environment variable is not set. Using a placeholder. This will likely fail.");
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Helper to convert the Gemini schema to a simplified JSON string for the prompt
const schemaToString = (schema: object) => {
    // A more robust implementation might recursively build a string representation.
    // For this prompt, a simple JSON stringify is sufficient.
    return JSON.stringify(schema, null, 2);
}

export const generateRoadmap = async (topic: string): Promise<Roadmap> => {
  const prompt = `Generate a comprehensive, structured learning roadmap for the topic: "${topic}". The roadmap should be broken down into logical chapters, progressing from basic concepts to advanced topics. For each chapter, include learning objectives, key concepts, a mix of resources (videos, articles, documentation), and practical exercises. Your response MUST be a single, valid JSON object that strictly adheres to the following schema. Do not include any text, markdown, or explanations outside of the JSON object itself.

JSON Schema:
${schemaToString(roadmapSchema)}`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': `${window.location.origin}`, // Recommended by OpenRouter
        'X-Title': 'AI Learning Roadmap Builder', // Recommended by OpenRouter
      },
      body: JSON.stringify({
        model: 'google/gemma-2-27b-it', // A powerful, free model on OpenRouter
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenRouter API Error:", errorBody);
        throw new Error(`OpenRouter API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const jsonText = data.choices[0].message.content.trim();
    const roadmapData = JSON.parse(jsonText);
    
    // Add the isCompleted property to each chapter
    const chaptersWithCompletion = roadmapData.chapters.map((chapter: any) => ({
      ...chapter,
      isCompleted: false,
    }));

    return { ...roadmapData, chapters: chaptersWithCompletion };
  } catch (error) {
    console.error("Error generating roadmap from OpenRouter:", error);
    throw new Error("Failed to generate roadmap from OpenRouter API.");
  }
};
