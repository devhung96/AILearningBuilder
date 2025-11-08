export interface Resource {
  type: 'video' | 'article' | 'documentation' | 'book' | 'interactive';
  title: string;
  url: string;
  isCompleted: boolean;
  isHelpful: boolean;
}

export interface Exercise {
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  learningObjectives: string[];
  keyConcepts: string[];
  resources: Resource[];
  exercises: Exercise[];
  isCompleted: boolean;
}

export interface Roadmap {
  topic: string;
  chapters: Chapter[];
}
