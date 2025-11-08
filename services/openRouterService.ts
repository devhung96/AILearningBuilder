// Fix: Changed default import to named import for OpenRouter SDK to resolve "not constructable" error.
import { OpenRouter } from '@openrouter/sdk';
import { Roadmap } from '../types';
import { roadmapSchema } from './geminiService'; // Reuse the schema for consistency

const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  console.warn("OPENROUTER_API_KEY environment variable is not set. The application will not be able to connect to the OpenRouter service.");
}

const openrouter = new OpenRouter({
  apiKey: API_KEY,
  defaultHeaders: {
    'HTTP-Referer': `${window.location.origin}`,
    'X-Title': 'AI Learning Roadmap Builder',
  }
});

const schemaToString = (schema: object) => {
    return JSON.stringify(schema, null, 2);
}

export const generateRoadmap = async (topic: string): Promise<Roadmap> => {
  const prompt = `Generate a comprehensive, structured learning roadmap for the topic: "${topic}". The roadmap should be broken down into logical chapters, progressing from basic concepts to advanced topics. For each chapter, include learning objectives, key concepts, a mix of resources (videos, articles, documentation), and practical exercises. Your response MUST be a single, valid JSON object that strictly adheres to the following schema. Do not include any text, markdown, or explanations outside of the JSON object itself. Your entire output must be ONLY the JSON object, starting with { and ending with }.

JSON Schema:
${schemaToString(roadmapSchema)}`;

  try {
    const completion = await openrouter.chat.completions.create({
        model: 'google/gemma-2-27b-it', // A powerful, free model on OpenRouter
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
    });

    // Validate the response structure from OpenRouter
    if (!completion.choices || completion.choices.length === 0 || !completion.choices[0].message || !completion.choices[0].message.content) {
        console.error("Invalid response structure from OpenRouter:", completion);
        throw new Error("Received an invalid or empty response from the AI model.");
    }

    const jsonText = completion.choices[0].message.content.trim();

    if (!jsonText) {
        console.error("Empty content received from OpenRouter");
        throw new Error("Received an empty response from the AI model.");
    }

    let roadmapData;
    try {
        // The model sometimes wraps the JSON in markdown backticks. Let's remove them.
        const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
        roadmapData = JSON.parse(cleanedJsonText);
    } catch (parseError) {
        console.error("Failed to parse JSON response from OpenRouter:", parseError);
        console.error("Raw response content:", jsonText);
        throw new Error("The AI model returned a malformed response. Please try again.");
    }
    
    // Add the isCompleted property to each chapter
    if (!roadmapData.chapters || !Array.isArray(roadmapData.chapters)) {
      console.error("Roadmap data is missing 'chapters' array:", roadmapData);
      throw new Error("The AI model returned data in an unexpected format.");
    }

    const chaptersWithCompletion = roadmapData.chapters.map((chapter: any) => ({
      ...chapter,
      isCompleted: false,
      resources: (chapter.resources || []).map((resource: any) => ({
        ...resource,
        isCompleted: false,
        isHelpful: false,
      })),
    }));

    return { ...roadmapData, chapters: chaptersWithCompletion };
  } catch (error) {
    console.error("Error generating roadmap from OpenRouter:", error);
    // Re-throw the specific error message
    throw error instanceof Error ? error : new Error("Failed to generate roadmap from OpenRouter API.");
  }
};