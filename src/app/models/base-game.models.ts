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
  hasHints?: () => boolean;
  saveUserSubmission?: () => void;
}

export abstract class BaseGameMixin<S> {
  protected readonly progressService = inject(ProgressService);

  protected initializeSubmissionLoading<T = S>(
    courseId: () => string | undefined,
    unitId: () => string | undefined,
    lessonId: () => string | undefined,
    levelId: () => string | undefined,
    isSubmitted: () => boolean,
    onLoadSavedSubmission: (data: T) => void,
  ): void {
    this.progressService.createLoadSavedSubmissionEffect<T>(
      courseId,
      unitId,
      lessonId,
      levelId,
      isSubmitted,
      onLoadSavedSubmission,
    );
  }

  protected saveSubmissionData<T>(
    courseId: () => string | undefined,
    unitId: () => string | undefined,
    lessonId: () => string | undefined,
    levelId: () => string | undefined,
    submissionData: T,
  ): void {
    const cId = courseId();
    const uId = unitId();
    const lId = lessonId();
    const lvlId = levelId();

    if (cId && uId && lId && lvlId) {
      this.progressService.saveUserSubmission(cId, uId, lId, lvlId, submissionData);
    }
  }

  protected saveUserSubmissionWithData<T>(
    courseId: () => string | undefined,
    unitId: () => string | undefined,
    lessonId: () => string | undefined,
    levelId: () => string | undefined,
    createSubmissionData: () => T,
  ): void {
    const submissionData = createSubmissionData();
    this.saveSubmissionData(courseId, unitId, lessonId, levelId, submissionData);
  }

  protected createHasHintsComputed(gameData: () => GameData<BaseGameData> | undefined) {
    return computed(() => {
      return (gameData()?.hints?.length || 0) > 0;
    });
  }

  protected createGameIsSubmittedComputed(
    isSubmitted: () => boolean,
    submittedState: () => boolean,
  ) {
    return computed(() => isSubmitted() || submittedState());
  }
}
