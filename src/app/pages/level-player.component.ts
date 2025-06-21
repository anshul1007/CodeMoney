import {
  Component,
  OnInit,
  signal,
  inject,
  ChangeDetectionStrategy,
  DestroyRef,
  ViewContainerRef,
  ViewChild,
  inputBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { GameService } from '../services/game.service';
import { SceneDescriptionComponent } from '../components/scene-description.component';
import { GamePromptComponent } from '../components/game-prompt.component';
import { CardWrapperComponent } from '../components/wrapper/card-wrapper.component';
import { LevelPlayerHeaderComponent } from '../components/level-player-header.component';

import { Level } from '../models/course.models';
import { GameData } from '../models';

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
    @if (currentLevel()) {
      <div
        class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
        role="main"
        [attr.aria-label]="'Playing level: ' + currentLevel()?.level?.title"
      >
        <app-level-player-header
          [title]="currentLevel()?.level?.title || ''"
          [description]="currentLevel()?.level?.description || ''"
          [stars]="currentLevel()?.level?.stars || 0"
          (backClick)="goBack()"
        />

        <!-- Game Content -->
        <div
          class="container mx-auto max-w-4xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6"
        >
          <app-scene-description [scene]="currentLevel()?.gameData?.scene" />

          <app-game-prompt
            [prompt]="currentLevel()?.gameData?.prompt"
            [hints]="currentLevel()?.gameData?.hints"
            [showHints]="showHints()"
          />

          <app-card-wrapper customClasses="game-content">
            <ng-template #gameContainer></ng-template>
          </app-card-wrapper>

          <!-- Validation Message -->
          <!-- @if (
            !gameSubmitted() &&
            validationResult() &&
            !validationResult()?.isValid
          ) {
            <div
              class="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center max-w-md mx-auto"
            >
              <div class="flex items-center justify-center mb-2">
                <span class="text-yellow-600 mr-2">⚠️</span>
                <span class="font-medium text-yellow-800 text-sm sm:text-base">
                  {{ validationResult()?.message }}
                </span>
              </div>
              @if (validationResult()?.requiredActions?.length) {
                <div class="text-xs text-yellow-700 mt-2">
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
          <!-- Celebration Message -->
          @if (gameSubmitted()) {
            <app-card-wrapper
              variant="success"
              customClasses="mb-4 sm:mb-6 text-center"
            >
              <div class="flex justify-center items-center gap-2 mb-1">
                <div class="text-2xl sm:text-3xl">🎉</div>
                <h3 class="text-lg font-bold text-green-800">Amazing Work!</h3>
              </div>
              <p class="text-sm text-green-700">You earned 3 stars!</p>
              <div class="flex justify-center space-x-1 my-1">
                @for (star of [1, 2, 3]; track $index) {
                  <span class="text-yellow-400 text-lg sm:text-xl">⭐</span>
                }
              </div>
            </app-card-wrapper>
          }

          <!-- Action Buttons -->
          <div
            class="text-center space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center"
          >
            <!-- @if (!gameSubmitted()) {
              <button
                (click)="handleSubmit()"
                [disabled]="!canSubmitGame()"
                class="font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-all duration-200 text-base sm:text-lg w-full sm:w-auto"
                [ngClass]="{
                  'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg':
                    canSubmitGame(),
                  'bg-gray-300 text-gray-500 cursor-not-allowed':
                    !canSubmitGame(),
                }"
              >
                {{ submitButtonText() }}
              </button>
            } -->

            @if (
              !gameSubmitted() &&
              !showHints() &&
              currentLevel()?.gameData?.hints?.length
            ) {
              <button
                (click)="showHints.set(true)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-all duration-200 hover:shadow-lg text-base sm:text-lg w-full sm:w-auto"
              >
                💡 Show Hints
              </button>
            }

            <!-- @if (gameSubmitted()) {
              <button
                (click)="nextLevel()"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-all duration-200 hover:shadow-lg text-base sm:text-lg w-full sm:w-auto animate-bounce"
              >
                {{ isLastLevel() ? 'Complete Lesson' : 'Next Level' }} →
              </button>
            } -->
          </div>
        </div>
      </div>
    }
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
  private readonly destroyRef = inject(DestroyRef);

  // Signal-based reactive state
  readonly currentLevel = signal<
    | {
        level: Pick<Level, 'id' | 'title' | 'description' | 'stars'>;
        gameData: GameData;
      }
    | undefined
  >(undefined);
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

  // Dynamic game component reference
  //   private currentGameComponent: ComponentRef<any> | null = null;

  // Computed properties
  //   readonly isLastLevel = computed(() => {
  //     const level = this.currentLevel();
  //     const courseId = this.courseId();
  //     const unitId = this.unitId();
  //     const lessonId = this.lessonId();
  //     const levelId = this.levelId();

  //     if (!level || !courseId || !unitId || !lessonId || !levelId) return false;

  //     const lesson = this.courseService.getLesson(courseId, unitId, lessonId);
  //     if (!lesson) return false;

  //     const currentIndex = lesson.levels.findIndex((l) => l.id === levelId);
  //     return currentIndex === lesson.levels.length - 1;
  //   });

  //   readonly canSubmitGame = computed(() => {
  //     const validation = this.validationResult();
  //     return validation?.isValid ?? false;
  //   });

  //   readonly submitButtonText = computed(() => {
  //     const config = this.gameConfig();
  //     if (!config) return 'Submit Game';

  //     // Generic submit button text based on game type
  //     const typeLabels: { [key: string]: string } = {
  //       selection: 'Submit Selection',
  //       estimation: 'Submit Estimates',
  //       funding: 'Submit Funding Plan',
  //     };

  //     return typeLabels[config.type] || 'Submit Game';
  //   });

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.courseId.set(params['courseId']);
        this.unitId.set(params['unitId']);
        this.lessonId.set(params['lessonId']);
        this.levelId.set(params['levelId']);

        this.checkLevelAccess();
      });
  }

  private async checkLevelAccess(): Promise<void> {
    const currentLevel = await firstValueFrom(
      this.gameService.getGameData(
        this.courseId(),
        this.unitId(),
        this.lessonId(),
        this.levelId(),
      ),
    );
    if (!currentLevel) {
      this.router.navigate(['/courses']);
    } else {
      console.log('Current Level:', currentLevel.level?.title);
      this.currentLevel.set(currentLevel);
      if (!currentLevel.gameData.isCompleted) {
        this.gameSubmitted.set(false);
        this.showHints.set(false);
        this.lastScore.set(0);
      }
      this.loadComponent(currentLevel.gameData);
    }
  }

  private async loadComponent(gameData: GameData) {
    try {
      const componentType = await this.gameService.getComponent(
        gameData.gameType,
      );

      if (componentType) {
        this.gameContainer.clear();
        this.gameContainer.createComponent(componentType, {
          bindings: [inputBinding('gameData', () => gameData)],
        });
      } else {
        // this.error = `Component type '${config.componentType}' not found`;
      }
    } catch (err) {
      // this.error = 'Failed to load component';
      console.error(err);
    }
  }

  //   handleSubmit(): void {
  //     const validation = this.validationResult();
  //     if (!validation?.isValid || this.gameSubmitted()) return;

  //     this.gameSubmitted.set(true);

  //     // Update component submitted state
  //     if (this.currentGameComponent?.instance?.isSubmitted) {
  //       this.currentGameComponent.instance.isSubmitted.set(true);
  //     }

  //     // Calculate score using validation
  //     const score = this.calculateGameScore(validation);
  //     this.lastScore.set(score);

  //     // // Save data for next level if needed
  //     // this.saveGameDataForNextLevel();

  //     // Complete the level
  //     this.courseService.completeLevel(
  //       this.courseId(),
  //       this.unitId(),
  //       this.lessonId(),
  //       this.levelId(),
  //       score,
  //     );
  //   }

  //   private calculateGameScore(validation: GameValidationResult): number {
  //     // Generic scoring - could be enhanced with more sophisticated logic
  //     return validation.isValid ? 3 : 0;
  //   }

  //   nextLevel(): void {}
  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
