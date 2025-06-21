import { InputSignal } from '@angular/core';

import { GameData } from './game.models';

export interface BaseGameData {
  // Common properties that all games might have
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in seconds
  maxAttempts?: number;
}

export interface BaseGameComponent<T extends BaseGameData = BaseGameData> {
  gameData: InputSignal<GameData<T> | undefined>;
  // State management
  isSubmitted: () => boolean;
  canSubmit: () => boolean;
  resetGame(): void;
  hasHints?: () => boolean;
}
