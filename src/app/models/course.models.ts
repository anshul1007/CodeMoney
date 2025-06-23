export interface BaseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}

export interface Course extends BaseItem {
  units: Unit[];
}

export interface Unit extends BaseItem {
  lessons: Lesson[];
}

export interface Lesson extends BaseItem {
  levels: Level[];
}

export interface Level extends BaseItem {
  objective: string;
  isCompleted: boolean;
  stars: number; // 0-3 stars based on performance
}
