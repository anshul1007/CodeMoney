import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  DestroyRef,
  effect,
  inject,
  inputBinding,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import {
  CardWrapperComponent,
  GamePromptComponent,
  LevelPlayerHeaderComponent,
  SceneDescriptionComponent,
} from '../components';
import { CurrentLevel, GameData } from '../models';
import {
  BaseGameComponent,
  isGameComponentWithHints,
  isGameComponentWithReset,
  isGameComponentWithSave,
} from '../models/base-game.models';
import { AnalyticsService } from '../services/analytics.service';
import { CourseService } from '../services/course.service';
import { GameService } from '../services/game.service';
import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-level-player-dynamic',
  standalone: true,
  imports: [
    CommonModule,
    SceneDescriptionComponent,
    GamePromptComponent,
    CardWrapperComponent,
    LevelPlayerHeaderComponent,
  ],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      role="main"
    >
      @if (currentLevel()) {
        <app-level-player-header
          [title]="currentLevel()?.title || ''"
          [description]="currentLevel()?.description || ''"
          [stars]="currentLevel()?.stars || 0"
          (backClick)="goBack()"
        />
      }
      <div
        class="px-4 pt-2 pb-3 mx-auto space-y-3 max-w-7xl sm:px-4 sm:pt-2 sm:pb-3 sm:space-y-3 xl:px-6 xl:pt-3 xl:pb-4"
      >
        <app-scene-description [scene]="gameData()?.scene || ''" />
      </div>

      <div
        class="py-2 px-4 mx-auto space-y-3 max-w-7xl sm:py-2 sm:px-4 sm:space-y-3 xl:py-3 xl:px-6"
      >
        <app-game-prompt
          [prompt]="gameData()?.prompt"
          [hints]="gameData()?.hints"
          [showHints]="showHints()"
        />
      </div>

      <div
        class="py-2 px-4 mx-auto space-y-3 max-w-7xl sm:py-2 sm:px-4 sm:space-y-3 xl:py-3 xl:px-6"
      >
        <app-card-wrapper customClasses="game-content">
          <ng-template #gameContainer></ng-template>
        </app-card-wrapper>
      </div>

      <div
        class="px-4 pt-2 pb-1 mx-auto space-y-3 max-w-7xl sm:px-4 sm:pt-2 sm:pb-1 sm:space-y-3 xl:px-6 xl:pt-3 xl:pb-2"
      >
        @if (gameSubmitted()) {
          <app-card-wrapper variant="success" customClasses="mb-4 sm:mb-6 xl:mb-8 text-center">
            <div class="flex gap-2 justify-center items-center mb-2 xl:gap-3 xl:mb-3">
              <div class="text-2xl sm:text-3xl xl:text-4xl">🎉</div>
              <h3 class="text-lg font-bold text-green-800 sm:text-xl xl:text-2xl">Amazing Work!</h3>
            </div>
            <p class="text-sm text-green-700 sm:text-base xl:text-lg">You earned 3 stars!</p>
            <div class="flex justify-center my-2 space-x-1 xl:my-3 xl:space-x-2">
              @for (star of [1, 2, 3]; track $index) {
                <span class="text-lg text-yellow-400 sm:text-xl xl:text-2xl">⭐</span>
              }
            </div>
          </app-card-wrapper>
        }
      </div>
      <div
        class="flex flex-col justify-center pt-2 pb-6 space-y-4 text-center sm:flex-row sm:space-y-0 sm:space-x-6 xl:space-x-8"
      >
        @if (!gameSubmitted()) {
          <button
            (click)="handleSubmit()"
            [disabled]="!canSubmitGame()"
            class="py-4 px-8 w-full text-base font-bold rounded-xl transition-all duration-200 cursor-pointer sm:py-5 sm:px-10 sm:w-auto sm:text-lg xl:py-6 xl:px-12 xl:text-xl hover:cursor-pointer"
            [ngClass]="{
              'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg hover:-translate-y-1':
                canSubmitGame(),
              'bg-gray-300 text-gray-500 cursor-not-allowed hover:cursor-not-allowed':
                !canSubmitGame(),
            }"
          >
            Submit
          </button>
        }

        @if (canResetGame()) {
          <button
            (click)="handleReset()"
            class="py-4 px-8 w-full text-base font-bold text-white bg-red-500 rounded-xl transition-all duration-200 cursor-pointer sm:py-5 sm:px-10 sm:w-auto sm:text-lg xl:py-6 xl:px-12 xl:text-xl hover:bg-red-600 hover:shadow-lg hover:-translate-y-1 hover:cursor-pointer"
          >
            🔄 Reset
          </button>
        }

        @if (shouldShowHintsButton()) {
          <button
            (click)="showHintsWithTracking()"
            class="py-4 px-8 w-full text-base font-bold text-white bg-yellow-500 rounded-xl transition-all duration-200 cursor-pointer sm:py-5 sm:px-10 sm:w-auto sm:text-lg xl:py-6 xl:px-12 xl:text-xl hover:bg-yellow-600 hover:shadow-lg hover:-translate-y-1 hover:cursor-pointer"
          >
            💡 Show Hints
          </button>
        }

        @if (gameSubmitted()) {
          <button
            (click)="nextLevel()"
            class="py-4 px-8 w-full text-base font-bold text-white bg-green-500 rounded-xl transition-all duration-200 animate-bounce cursor-pointer sm:py-5 sm:px-10 sm:w-auto sm:text-lg xl:py-6 xl:px-12 xl:text-xl hover:bg-green-600 hover:shadow-lg hover:-translate-y-1 hover:cursor-pointer"
          >
            🎉 Continue Learning
          </button>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelPlayerComponent {
  @ViewChild('gameContainer', { read: ViewContainerRef, static: false })
  gameContainer!: ViewContainerRef;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);
  private readonly progressService = inject(ProgressService);
  private readonly courseService = inject(CourseService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly analyticsService = inject(AnalyticsService);

  readonly gameData = signal<GameData | undefined>(undefined);
  readonly currentLevel = computed<CurrentLevel | undefined>(() => {
    return this.gameData()?.currentLevel;
  });

  readonly gameSubmitted = signal<boolean>(false);
  readonly showHints = signal<boolean>(false);
  readonly lastScore = signal<number>(0);

  private readonly routeParams = toSignal(this.route.params, {
    initialValue: {} as Record<string, string>,
  });
  readonly courseId = computed(() => this.routeParams()['courseId'] || '');
  readonly unitId = computed(() => this.routeParams()['unitId'] || '');
  readonly lessonId = computed(() => this.routeParams()['lessonId'] || '');
  readonly levelId = computed(() => this.routeParams()['levelId'] || '');

  private currentGameComponent = signal<ComponentRef<BaseGameComponent> | null>(null);

  readonly shouldShowHintsButton = computed(() => {
    const component = this.currentGameComponent();
    if (!component?.instance) return false;

    if (!isGameComponentWithHints(component.instance)) return false;

    return !this.gameSubmitted() && !this.showHints() && component.instance.hasHints();
  });

  readonly canSubmitGame = computed(() => {
    const component = this.currentGameComponent();
    if (!component?.instance) return false;

    return component.instance.canSubmit();
  });

  readonly canResetGame = computed(() => {
    const component = this.currentGameComponent();
    if (!component?.instance) return false;

    return isGameComponentWithReset(component.instance) && !this.gameSubmitted();
  });

  readonly levelAccessible = computed(() => {
    return this.hasAccessToLevel();
  });

  constructor() {
    effect(() => {
      const courseId = this.courseId();
      const unitId = this.unitId();
      const lessonId = this.lessonId();
      const levelId = this.levelId();

      if (courseId && unitId && lessonId && levelId) {
        this.checkLevelAccess();
      }
    });

    // Track level abandonment when component is destroyed
    this.destroyRef.onDestroy(() => {
      if (!this.gameSubmitted()) {
        const courseId = this.courseId();
        const unitId = this.unitId();
        const lessonId = this.lessonId();
        const levelId = this.levelId();

        if (courseId && unitId && lessonId && levelId) {
          this.analyticsService.trackLevelAbandonment(
            courseId,
            unitId,
            lessonId,
            levelId,
            50, // Estimate 50% progress if abandoned
          );
        }
      }
    });
  }

  private async checkLevelAccess(): Promise<void> {
    const result = await firstValueFrom(
      this.gameService.getGameData(this.courseId(), this.unitId(), this.lessonId(), this.levelId()),
    );
    if (!result) {
      this.router.navigate(['/courses']);
      return;
    }

    if (!this.hasAccessToLevel()) {
      this.router.navigate(['/courses']);
      return;
    }

    const isCompleted = this.progressService.isLevelCompleted(
      this.courseId(),
      this.unitId(),
      this.lessonId(),
      this.levelId(),
    );

    const gameDataWithCompletion = {
      ...result.gameData,
      isCompleted: isCompleted,
    };

    this.gameData.set(gameDataWithCompletion);

    // Track level start in analytics
    this.analyticsService.trackLevelStart(
      this.courseId(),
      this.unitId(),
      this.lessonId(),
      this.levelId(),
      gameDataWithCompletion.currentLevel.title || 'Unknown Level',
    );

    this.progressService.updateCurrentPosition(
      this.courseId(),
      this.unitId(),
      this.lessonId(),
      this.levelId(),
    );

    if (isCompleted) {
      this.gameSubmitted.set(true);
      this.showHints.set(false);
      const stars = this.progressService.getLevelStars(
        this.courseId(),
        this.unitId(),
        this.lessonId(),
        this.levelId(),
      );
      this.lastScore.set(stars);
    } else {
      this.gameSubmitted.set(false);
      this.showHints.set(false);
      this.lastScore.set(0);
    }

    this.loadComponent(gameDataWithCompletion);
  }

  private async loadComponent(gameData: GameData) {
    try {
      const componentType = await this.gameService.getComponent(gameData.gameType);

      if (componentType) {
        this.gameContainer.clear();
        const componentRef = this.gameContainer.createComponent(componentType, {
          bindings: [
            inputBinding('gameData', () => gameData),
            inputBinding('isSubmitted', () => this.gameSubmitted()),
            inputBinding('courseId', () => this.courseId()),
            inputBinding('unitId', () => this.unitId()),
            inputBinding('lessonId', () => this.lessonId()),
            inputBinding('levelId', () => this.levelId()),
          ],
        });

        componentRef.onDestroy(() => {
          this.currentGameComponent.set(null);
        });

        this.currentGameComponent.set(componentRef as ComponentRef<BaseGameComponent>);
      } else {
        this.currentGameComponent.set(null);
      }
    } catch {
      this.currentGameComponent.set(null);
    }
  }

  handleSubmit(): void {
    const component = this.currentGameComponent();
    if (!component?.instance || !this.canSubmitGame() || this.gameSubmitted()) return;

    if (isGameComponentWithSave(component.instance)) {
      component.instance.saveUserSubmission();
    }

    this.gameSubmitted.set(true);

    const score = 3;
    this.lastScore.set(score);

    this.progressService.completeLevel(
      this.courseId(),
      this.unitId(),
      this.lessonId(),
      this.levelId(),
      score,
    );

    // Track level completion in analytics
    const gameData = this.gameData();
    if (gameData) {
      this.analyticsService.trackLevelComplete({
        courseId: this.courseId(),
        unitId: this.unitId(),
        lessonId: this.lessonId(),
        levelId: this.levelId(),
        levelName: gameData.currentLevel.title || 'Unknown Level',
        progress: 100,
        isCompleted: true,
        timeSpent: 0, // Will be calculated by analytics service
        hintsUsed: 0, // TODO: Track hints if needed
        errors: 0, // TODO: Track errors if needed
      });
    }

    this.unlockNextLevel();

    const currentGameData = this.gameData();
    if (currentGameData) {
      this.gameData.set({
        ...currentGameData,
        isCompleted: true,
      });
    }
  }

  handleReset(): void {
    const component = this.currentGameComponent();
    if (!component?.instance || this.gameSubmitted()) return;

    if (isGameComponentWithReset(component.instance)) {
      component.instance.resetGame();
      this.showHints.set(false);
    }
  }

  private unlockNextLevel(): void {
    const courseId = this.courseId();
    const unitId = this.unitId();
    const lessonId = this.lessonId();
    const currentLevelId = this.levelId();

    if (!courseId || !unitId || !lessonId || !currentLevelId) return;

    const currentLevel = this.courseService.getLevel()(courseId, unitId, lessonId, currentLevelId);
    if (!currentLevel?.nextLevelId) return;

    this.progressService.unlockLevel(courseId, unitId, lessonId, currentLevel.nextLevelId);
  }

  nextLevel(): void {
    const courseId = this.courseId();
    const unitId = this.unitId();
    const lessonId = this.lessonId();
    const currentLevelId = this.levelId();

    if (!courseId || !unitId || !lessonId || !currentLevelId) {
      this.router.navigate(['/courses']);
      return;
    }

    const currentLevel = this.courseService.getLevel()(courseId, unitId, lessonId, currentLevelId);
    if (!currentLevel) {
      this.router.navigate(['/courses']);
      return;
    }

    if (currentLevel.nextLevelId) {
      this.router.navigate(['/level', courseId, unitId, lessonId, currentLevel.nextLevelId]);
    } else {
      this.router.navigate(['/courses']);
    }
  }

  goBack(): void {
    // Track user going back without completing
    if (!this.gameSubmitted()) {
      this.analyticsService.trackUserEngagement('go_back', 'navigation', {
        from_level: this.levelId(),
        completed: false,
      });
    }

    this.router.navigate(['/courses']);
  }

  showHintsWithTracking(): void {
    // Track help usage
    this.analyticsService.trackHelpUsage(this.courseId(), this.levelId(), 'hints', 'level_hints');

    this.showHints.set(true);
  }

  private hasAccessToLevel(): boolean {
    const courseId = this.courseId();
    const unitId = this.unitId();
    const lessonId = this.lessonId();
    const currentLevelId = this.levelId();

    if (!courseId || !unitId || !lessonId || !currentLevelId) return false;

    const currentLevel = this.courseService.getLevel()(courseId, unitId, lessonId, currentLevelId);
    if (!currentLevel) return false;

    return (
      !currentLevel.prevLevelId ||
      this.progressService.isLevelCompleted(courseId, unitId, lessonId, currentLevel.prevLevelId)
    );
  }
}
