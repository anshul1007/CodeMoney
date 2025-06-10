import type { Level } from './game.models';

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  units: Unit[];
  isUnlocked: boolean;

  // Legacy property for backward compatibility
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  levels: Level[];
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
