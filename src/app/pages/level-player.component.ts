import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  DestroyRef,
  inject,
  inputBinding,
  OnInit,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import {
  CardWrapperComponent,
  GamePromptComponent,
  LevelPlayerHeaderComponent,
  SceneDescriptionComponent,
} from '../components';
import { CurrentLevel, GameData } from '../models';
import { BaseGameComponent } from '../models/base-game.models';
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
      <!-- Game Content -->
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

      <!-- Validation Message -->
      <!-- @if (
            !gameSubmitted() &&
            validationResult() &&
            !validationResult()?.isValid
          ) {
            <div
              class="p-4 mx-auto mb-4 max-w-md text-center bg-yellow-50 rounded-xl border border-yellow-200 sm:p-6 sm:mb-6 xl:p-8 xl:mb-8"
            >
              <div class="flex justify-center items-center mb-2 xl:mb-3">
                <span class="mr-2 text-yellow-600 xl:mr-3">⚠️</span>
                <span class="text-sm font-medium text-yellow-800 sm:text-base xl:text-lg">
                  {{ validationResult()?.message }}
                </span>
              </div>
              @if (validationResult()?.requiredActions?.length) {
                <div class="mt-2 text-xs text-yellow-700 xl:mt-3 xl:text-sm">
                  @for (
                    action of validationResult()?.requiredActions;
                    track $index
                  ) {
                    <div>• {{ action }}</div>
                  }
                </div>
              }
            </div>
          } -->
      <div
        class="px-4 pt-2 pb-1 mx-auto space-y-3 max-w-7xl sm:px-4 sm:pt-2 sm:pb-1 sm:space-y-3 xl:px-6 xl:pt-3 xl:pb-2"
      >
        <!-- Celebration Message -->
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
      <!-- Action Buttons -->
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

        @if (shouldShowHintsButton()) {
          <button
            (click)="showHints.set(true)"
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
export class LevelPlayerComponent implements OnInit {
  @ViewChild('gameContainer', { read: ViewContainerRef, static: false })
  gameContainer!: ViewContainerRef;

  // Injected services
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);
  private readonly progressService = inject(ProgressService);
  private readonly courseService = inject(CourseService);
  private readonly destroyRef = inject(DestroyRef);

  // Signal-based reactive state
  readonly gameData = signal<GameData | undefined>(undefined);
  readonly currentLevel = computed<CurrentLevel | undefined>(() => {
    return this.gameData()?.currentLevel;
  });

  readonly gameSubmitted = signal<boolean>(false);
  readonly showHints = signal<boolean>(false);
  readonly lastScore = signal<number>(0);

  // Route parameters
  readonly courseId = signal<string>('');
  readonly unitId = signal<string>('');
  readonly lessonId = signal<string>('');
  readonly levelId = signal<string>('');

  // Game state - purely interface-based
  //   readonly gameConfig = signal<DynamicGameConfig | null>(null);
  //   readonly validationResult = signal<GameValidationResult | null>(null);

  private currentGameComponent = signal<ComponentRef<BaseGameComponent> | null>(null);

  // Computed properties
  readonly shouldShowHintsButton = computed(() => {
    const component = this.currentGameComponent();
    if (!component?.instance?.hasHints) return false;

    return !this.gameSubmitted() && !this.showHints() && component.instance.hasHints();
  });

  readonly canSubmitGame = computed(() => {
    const component = this.currentGameComponent();
    if (!component?.instance) return false;

    return component.instance.canSubmit();
  });

  readonly levelAccessible = computed(() => {
    return this.hasAccessToLevel();
  });

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.courseId.set(params['courseId']);
      this.unitId.set(params['unitId']);
      this.lessonId.set(params['lessonId']);
      this.levelId.set(params['levelId']);

      this.checkLevelAccess();
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

    // Check if level is already completed from local storage
    const isCompleted = this.progressService.isLevelCompleted(
      this.courseId(),
      this.unitId(),
      this.lessonId(),
      this.levelId(),
    );

    // Update game data with completion status
    const gameDataWithCompletion = {
      ...result.gameData,
      isCompleted: isCompleted,
    };

    this.gameData.set(gameDataWithCompletion);

    // Update current position in progress
    this.progressService.updateCurrentPosition(
      this.courseId(),
      this.unitId(),
      this.lessonId(),
      this.levelId(),
    );

    // Set initial state based on completion status
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
        // this.error = `Component type '${config.componentType}' not found`;
      }
    } catch (err) {
      this.currentGameComponent.set(null);
      // this.error = 'Failed to load component';
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  handleSubmit(): void {
    const component = this.currentGameComponent();
    if (!component?.instance || !this.canSubmitGame() || this.gameSubmitted()) return;

    // Save user submission data before marking as submitted
    if (component.instance.saveUserSubmission) {
      component.instance.saveUserSubmission();
    }

    // Set the game as submitted
    this.gameSubmitted.set(true);

    // Calculate a simple score (could be enhanced later)
    const score = 3; // Default score for completion
    this.lastScore.set(score);

    // Mark level as complete and update local storage
    this.progressService.completeLevel(
      this.courseId(),
      this.unitId(),
      this.lessonId(),
      this.levelId(),
      score,
    );

    // Automatically unlock the next level
    this.unlockNextLevel();

    // Update the game data to reflect completion
    const currentGameData = this.gameData();
    if (currentGameData) {
      this.gameData.set({
        ...currentGameData,
        isCompleted: true,
      });
    }
  }

  private unlockNextLevel(): void {
    const courseId = this.courseId();
    const unitId = this.unitId();
    const lessonId = this.lessonId();
    const currentLevelId = this.levelId();

    if (!courseId || !unitId || !lessonId || !currentLevelId) return;

    // Get the current course structure
    const courses = this.courseService.courses();
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const unit = course.units.find((u) => u.id === unitId);
    if (!unit) return;

    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    // Find current level index
    const currentLevelIndex = lesson.levels.findIndex((level) => level.id === currentLevelId);
    if (currentLevelIndex === -1) return;

    // Check if there's a next level to unlock
    const nextLevelIndex = currentLevelIndex + 1;
    if (nextLevelIndex < lesson.levels.length) {
      const nextLevel = lesson.levels[nextLevelIndex];
      this.progressService.unlockLevel(courseId, unitId, lessonId, nextLevel.id);
    }
  }

  //   nextLevel(): void {}
  nextLevel(): void {
    const courseId = this.courseId();
    const unitId = this.unitId();
    const lessonId = this.lessonId();
    const currentLevelId = this.levelId();

    if (!courseId || !unitId || !lessonId || !currentLevelId) {
      this.router.navigate(['/courses']);
      return;
    }

    // Get the current course structure
    const courses = this.courseService.courses();
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      this.router.navigate(['/courses']);
      return;
    }

    const unit = course.units.find((u) => u.id === unitId);
    if (!unit) {
      this.router.navigate(['/courses']);
      return;
    }

    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (!lesson) {
      this.router.navigate(['/courses']);
      return;
    }

    // Find current level index
    const currentLevelIndex = lesson.levels.findIndex((level) => level.id === currentLevelId);
    if (currentLevelIndex === -1) {
      this.router.navigate(['/courses']);
      return;
    }

    // Check if there's a next level
    const nextLevelIndex = currentLevelIndex + 1;
    if (nextLevelIndex < lesson.levels.length) {
      const nextLevel = lesson.levels[nextLevelIndex];

      const isCurrentLevelCompleted = this.progressService.isLevelCompleted(
        courseId,
        unitId,
        lessonId,
        currentLevelId,
      );

      if (isCurrentLevelCompleted) {
        // Unlock the next level if it's not already unlocked
        if (!this.progressService.isLevelUnlocked(courseId, unitId, lessonId, nextLevel.id)) {
          this.progressService.unlockLevel(courseId, unitId, lessonId, nextLevel.id);
        }

        // Navigate to the next level
        this.router.navigate(['/level', courseId, unitId, lessonId, nextLevel.id]);
      } else {
        // Current level not completed, go back to courses dashboard
        this.router.navigate(['/courses']);
      }
    } else {
      // No more levels in this lesson, go back to courses dashboard
      this.router.navigate(['/courses']);
    }
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }

  private hasAccessToLevel(): boolean {
    const courseId = this.courseId();
    const unitId = this.unitId();
    const lessonId = this.lessonId();
    const currentLevelId = this.levelId();

    if (!courseId || !unitId || !lessonId || !currentLevelId) return false;

    // Get the current course structure
    const courses = this.courseService.courses();
    const course = courses.find((c) => c.id === courseId);
    if (!course) return false;

    const unit = course.units.find((u) => u.id === unitId);
    if (!unit) return false;

    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (!lesson) return false;

    // Find current level index
    const currentLevelIndex = lesson.levels.findIndex((level) => level.id === currentLevelId);
    if (currentLevelIndex === -1) return false;

    // Check if this is the first level (always accessible)
    if (currentLevelIndex === 0) return true;

    // Check if all previous levels are completed
    for (let i = 0; i < currentLevelIndex; i++) {
      const previousLevel = lesson.levels[i];
      if (!this.progressService.isLevelCompleted(courseId, unitId, lessonId, previousLevel.id)) {
        return false; // Previous level not completed, no access
      }
    }

    return true; // All previous levels completed, access granted
  }
}
