import { computed, inject, InputSignal } from '@angular/core';

import { ProgressService } from '../services/progress.service';

import { GameData } from './game.models';

export interface BaseGameData {
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  maxAttempts?: number;
}

export interface BaseGameComponent<T extends BaseGameData = BaseGameData> {
  gameData: InputSignal<GameData<T> | undefined>;
  isSubmitted: () => boolean;
  canSubmit: () => boolean;
  resetGame(): void;
}

export interface GameComponentWithHints {
  hasHints: () => boolean;
}

export interface GameComponentWithSave {
  saveUserSubmission: () => void;
}

export interface GameComponentWithReset {
  resetGame: () => void;
}

// Type guard functions for better type safety
export function isGameComponentWithHints(
  component: BaseGameComponent,
): component is BaseGameComponent & GameComponentWithHints {
  return 'hasHints' in component && typeof component.hasHints === 'function';
}

export function isGameComponentWithSave(
  component: BaseGameComponent,
): component is BaseGameComponent & GameComponentWithSave {
  return 'saveUserSubmission' in component && typeof component.saveUserSubmission === 'function';
}

export function isGameComponentWithReset(
  component: BaseGameComponent,
): component is BaseGameComponent & GameComponentWithReset {
  return 'resetGame' in component && typeof component.resetGame === 'function';
}

export abstract class BaseGameMixin<TGameData extends BaseGameData, TSubmissionData> {
  protected readonly progressService = inject(ProgressService);

  abstract readonly courseId: () => string | undefined;
  abstract readonly unitId: () => string | undefined;
  abstract readonly lessonId: () => string | undefined;
  abstract readonly levelId: () => string | undefined;

  protected initializeSubmissionLoading(
    isSubmitted: () => boolean,
    onLoadSavedSubmission: (data: TSubmissionData) => void,
  ): void {
    this.progressService.createLoadSavedSubmissionEffect<TSubmissionData>(
      this.courseId,
      this.unitId,
      this.lessonId,
      this.levelId,
      isSubmitted,
      onLoadSavedSubmission,
    );
  }

  protected saveSubmission(createSubmissionData: () => TSubmissionData): void {
    const submissionData = createSubmissionData();
    const cId = this.courseId();
    const uId = this.unitId();
    const lId = this.lessonId();
    const lvlId = this.levelId();

    if (cId && uId && lId && lvlId) {
      this.progressService.saveUserSubmission(cId, uId, lId, lvlId, submissionData);
    }
  }

  protected createHasHintsComputed(gameData: () => GameData<TGameData> | undefined) {
    return computed(() => (gameData()?.hints?.length || 0) > 0);
  }

  protected createGameIsSubmittedComputed(
    isSubmitted: () => boolean,
    submittedState: () => boolean,
  ) {
    return computed(() => isSubmitted() || submittedState());
  }
}
