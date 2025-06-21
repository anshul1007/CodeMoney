export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  units: Unit[];
  isUnlocked: boolean;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  isUnlocked: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  levels: Level[];
  isUnlocked: boolean;
}

export interface Level {
  id: string;
  title: string;
  description: string;
  objective: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number; // 0-3 stars based on performance
}
