
import { GoogleGenAI, Type } from "@google/genai";
import { Roadmap } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const roadmapSchema = {
  type: Type.OBJECT,
  properties: {
    topic: {
      type: Type.STRING,
      description: 'The main topic of the learning roadmap.',
    },
    chapters: {
      type: Type.ARRAY,
      description: 'An array of chapters for the learning roadmap, ordered logically from basic to advanced.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: 'A unique identifier for the chapter, e.g., "chapter-1".',
          },
          title: {
            type: Type.STRING,
            description: 'The title of the chapter.',
          },
          description: {
            type: Type.STRING,
            description: 'A brief summary of what the chapter covers.',
          },
          learningObjectives: {
            type: Type.ARRAY,
            description: 'A list of skills or knowledge the learner will gain.',
            items: { type: Type.STRING },
          },
          keyConcepts: {
            type: Type.ARRAY,
            description: 'A list of key concepts, terms, or technologies covered in the chapter.',
            items: { type: Type.STRING },
          },
          resources: {
            type: Type.ARRAY,
            description: 'A list of learning resources like videos, articles, and documentation.',
            items: {
              type: Type.OBJECT,
              properties: {
                type: {
                  type: Type.STRING,
                  description: 'The type of the resource (e.g., "video", "article", "documentation", "book", "interactive").',
                },
                title: {
                  type: Type.STRING,
                  description: 'The title of the resource.',
                },
                url: {
                  type: Type.STRING,
                  description: 'The URL of the resource.',
                },
              },
              required: ['type', 'title', 'url'],
            },
          },
          exercises: {
            type: Type.ARRAY,
            description: 'A list of practical exercises to reinforce learning.',
            items: {
              type: Type.OBJECT,
              properties: {
                description: {
                  type: Type.STRING,
                  description: 'A description of the exercise.',
                },
                difficulty: {
                  type: Type.STRING,
                  description: 'The difficulty of the exercise (e.g., "easy", "medium", "hard").',
                },
              },
              required: ['description', 'difficulty'],
            },
          },
        },
        required: ['id', 'title', 'description', 'learningObjectives', 'keyConcepts', 'resources', 'exercises'],
      },
    },
  },
  required: ['topic', 'chapters'],
};

export const generateRoadmap = async (topic: string): Promise<Roadmap> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Generate a comprehensive, structured learning roadmap for the topic: "${topic}". The roadmap should be broken down into logical chapters, progressing from basic concepts to advanced topics. For each chapter, include learning objectives, key concepts, a mix of resources (videos, articles, documentation), and practical exercises. Ensure the response adheres strictly to the provided JSON schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const roadmapData = JSON.parse(jsonText);
    
    // Add the isCompleted property to each chapter
    const chaptersWithCompletion = roadmapData.chapters.map((chapter: any) => ({
      ...chapter,
      isCompleted: false,
    }));

    return { ...roadmapData, chapters: chaptersWithCompletion };
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw new Error("Failed to generate roadmap from Gemini API.");
  }
};