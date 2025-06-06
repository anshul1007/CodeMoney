import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../services/course.service';
import {
  Level,
  GameItem,
  EstimationField,
  FundingSource,
} from '../models/game.models';

@Component({
  selector: 'app-level-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100"
      *ngIf="currentLevel"
    >
      <!-- Header -->
      <div class="bg-white shadow-sm border-b-4 border-yellow-400 p-3 sm:p-4">
        <div
          class="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-2"
        >
          <div class="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <button
              (click)="goBack()"
              class="text-gray-600 hover:text-gray-800 text-xl sm:text-2xl flex-shrink-0"
            >
              ← Back
            </button>
            <div class="min-w-0 flex-1">
              <h1 class="text-lg sm:text-xl font-bold text-gray-800 truncate">
                {{ currentLevel.title }}
              </h1>
              <p class="text-xs sm:text-sm text-gray-600 line-clamp-2">
                {{ currentLevel.description }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <span
              *ngFor="let star of getStarsArray(currentLevel.stars)"
              class="text-yellow-400 text-lg sm:text-xl"
              >⭐</span
            >
          </div>
        </div>
      </div>
      <!-- Game Content -->
      <div class="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <!-- Scene Description -->
        <div
          *ngIf="currentLevel.gameData.scene"
          class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 text-center"
        >
          <div class="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🏪</div>
          <p class="text-base sm:text-lg text-gray-700">
            {{ currentLevel.gameData.scene }}
          </p>
        </div>

        <!-- Game Prompt -->
        <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2
            class="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-3 sm:mb-4"
          >
            {{ currentLevel.gameData.prompt }}
          </h2>

          <!-- Hints -->
          <div
            *ngIf="showHints && currentLevel.gameData.hints"
            class="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 mb-3 sm:mb-4"
          >
            <div class="flex items-center mb-2">
              <span class="text-blue-600 mr-2">💡</span>
              <span class="font-medium text-blue-800 text-sm sm:text-base"
                >Hints:</span
              >
            </div>
            <ul class="text-blue-700 text-xs sm:text-sm space-y-1">
              <li *ngFor="let hint of currentLevel.gameData.hints">
                • {{ hint }}
              </li>
            </ul>
          </div>
        </div>
        <!-- Selection Game (Level 1) -->
        <div *ngIf="currentLevel.type === 'selection'" class="game-content">
          <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h3
              class="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 text-center"
            >
              Click on the items you need for your lemonade stand:
            </h3>

            <div
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4"
            >
              <div
                *ngFor="let item of gameItems"
                class="item-card cursor-pointer transition-all duration-200 hover:scale-105"
                [class.selected]="item.isSelected"
                [class.correct]="
                  item.isSelected && item.isCorrect && gameSubmitted
                "
                [class.incorrect]="
                  item.isSelected && !item.isCorrect && gameSubmitted
                "
                (click)="toggleItemSelection(item)"
              >
                <div
                  class="border-2 rounded-xl p-2 sm:p-3 md:p-4 text-center"
                  [ngClass]="{
                    'border-blue-500 bg-blue-50':
                      item.isSelected && !gameSubmitted,
                    'border-green-500 bg-green-50':
                      item.isSelected && item.isCorrect && gameSubmitted,
                    'border-red-500 bg-red-50':
                      item.isSelected && !item.isCorrect && gameSubmitted,
                    'border-gray-200 bg-white hover:border-gray-300':
                      !item.isSelected,
                  }"
                >
                  <div class="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">
                    {{ item.icon }}
                  </div>
                  <div class="font-medium text-xs sm:text-sm text-gray-800">
                    {{ item.name }}
                  </div>

                  <!-- Feedback -->
                  <div
                    *ngIf="gameSubmitted && item.isSelected"
                    class="mt-1 sm:mt-2 text-xs"
                  >
                    <span *ngIf="item.isCorrect" class="text-green-600"
                      >✅ Great choice!</span
                    >
                    <span *ngIf="!item.isCorrect" class="text-red-600"
                      >❌ Oops! You don't need that for lemonade!</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Estimation Game (Level 2) -->
        <div *ngIf="currentLevel.type === 'estimation'" class="game-content">
          <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h3
              class="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6 text-center"
            >
              Estimate how much each item costs:
            </h3>

            <div class="space-y-3 sm:space-y-4">
              <div
                *ngFor="let field of estimationFields"
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 rounded-lg gap-2 sm:gap-4"
              >
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <span class="text-2xl sm:text-3xl">{{ field.icon }}</span>
                  <span
                    class="font-medium text-gray-800 text-sm sm:text-base"
                    >{{ field.itemName }}</span
                  >
                </div>

                <div class="flex items-center space-x-2 w-full sm:w-auto">
                  <span class="text-base sm:text-lg">{{ field.currency }}</span>
                  <input
                    type="number"
                    [(ngModel)]="field.userEstimate"
                    placeholder="0"
                    class="w-20 sm:w-24 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    [disabled]="gameSubmitted"
                  />

                  <!-- Show actual cost after submission -->
                  <div
                    *ngIf="gameSubmitted"
                    class="ml-2 sm:ml-4 text-xs sm:text-sm"
                  >
                    <div class="text-gray-600">
                      Actual: {{ field.currency }}{{ field.actualCost }}
                    </div>
                    <div
                      [ngClass]="{
                        'text-green-600': getEstimationAccuracy(field) >= 80,
                        'text-yellow-600': getEstimationAccuracy(field) >= 50,
                        'text-red-600': getEstimationAccuracy(field) < 50,
                      }"
                    >
                      {{ getEstimationAccuracy(field) }}% accurate
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Cost -->
            <div class="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div
                class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
              >
                <span class="font-bold text-base sm:text-lg text-gray-800"
                  >Total Cost:</span
                >
                <span class="font-bold text-lg sm:text-xl text-blue-600">
                  {{
                    getTotalEstimatedCost() > 0
                      ? '₹' + getTotalEstimatedCost()
                      : '₹ ---'
                  }}
                </span>
              </div>
              <div
                *ngIf="gameSubmitted"
                class="text-right text-xs sm:text-sm text-gray-600 mt-1"
              >
                Actual Total: ₹{{ getTotalActualCost() }}
              </div>
            </div>
          </div>
        </div>
        <!-- Funding Game (Level 3) -->
        <div *ngIf="currentLevel.type === 'funding'" class="game-content">
          <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h3
              class="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6 text-center"
            >
              How will you get the money you need?
            </h3>

            <div
              class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6"
            >
              <div
                *ngFor="let source of fundingSources"
                class="funding-option cursor-pointer transition-all duration-200 hover:shadow-md"
                [class.selected]="source.isSelected"
                (click)="toggleFundingSource(source)"
              >
                <div
                  class="border-2 rounded-xl p-3 sm:p-4"
                  [ngClass]="{
                    'border-blue-500 bg-blue-50': source.isSelected,
                    'border-gray-200 bg-white hover:border-gray-300':
                      !source.isSelected,
                  }"
                >
                  <div
                    class="flex items-start space-x-2 sm:space-x-3 mb-2 sm:mb-3"
                  >
                    <span class="text-2xl sm:text-3xl">{{ source.icon }}</span>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-bold text-gray-800 text-sm sm:text-base">
                        {{ source.name }}
                      </h4>
                      <p class="text-xs sm:text-sm text-gray-600 break-words">
                        {{ source.description }}
                      </p>
                    </div>
                  </div>

                  <!-- Amount Input -->
                  <div
                    *ngIf="source.isSelected && source.maxAmount! > 0"
                    class="mt-2 sm:mt-3"
                  >
                    <label
                      class="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      Amount (Max: ₹{{ source.maxAmount }}):
                    </label>
                    <input
                      type="number"
                      [(ngModel)]="source.amount"
                      [max]="source.maxAmount || 0"
                      placeholder="0"
                      class="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Funding Summary -->
            <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
              <h4 class="font-bold text-gray-800 mb-2 text-sm sm:text-base">
                Funding Summary:
              </h4>
              <div class="space-y-1 text-xs sm:text-sm">
                <div
                  *ngFor="let source of getSelectedFundingSources()"
                  class="flex justify-between"
                >
                  <span class="truncate pr-2">{{ source.name }}</span>
                  <span class="font-medium">₹{{ source.amount || 0 }}</span>
                </div>
                <div class="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total Available:</span>
                  <span class="text-green-600">₹{{ getTotalFunding() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Action Buttons -->
        <div
          class="text-center space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center"
        >
          <button
            *ngIf="!gameSubmitted"
            (click)="submitAnswer()"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-colors duration-200 text-base sm:text-lg w-full sm:w-auto"
          >
            Submit Answer
          </button>

          <button
            *ngIf="!showHints && currentLevel.gameData.hints?.length"
            (click)="showHints = true"
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-colors duration-200 text-base sm:text-lg w-full sm:w-auto"
          >
            💡 Show Hints
          </button>

          <button
            *ngIf="gameSubmitted"
            (click)="nextLevel()"
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-colors duration-200 text-base sm:text-lg w-full sm:w-auto"
          >
            {{ isLastLevel ? 'Complete Lesson' : 'Next Level' }} →
          </button>
        </div>
        <!-- Celebration Message -->
        <div
          *ngIf="gameSubmitted && lastScore > 0"
          class="mt-4 sm:mt-6 bg-green-50 border border-green-200 rounded-2xl p-4 sm:p-6 text-center"
        >
          <div class="text-3xl sm:text-4xl mb-2">🎉</div>
          <h3 class="text-lg sm:text-xl font-bold text-green-800 mb-2">
            Great Job!
          </h3>
          <p class="text-sm sm:text-base text-green-700 mb-3">
            You earned {{ lastScore }} stars!
          </p>
          <div class="flex justify-center space-x-1">
            <span
              *ngFor="let star of getStarsArray(lastScore)"
              class="text-yellow-400 text-xl sm:text-2xl"
              >⭐</span
            >
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .item-card.selected {
        transform: scale(1.05);
      }

      .funding-option.selected {
        transform: translateY(-2px);
      }

      .game-content {
        animation: fadeIn 0.5s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class LevelPlayerComponent implements OnInit {
  currentLevel: Level | null = null;
  gameItems: GameItem[] = [];
  estimationFields: EstimationField[] = [];
  fundingSources: FundingSource[] = [];
  gameSubmitted = false;
  showHints = false;
  lastScore = 0;
  isLastLevel = false;

  private courseId = '';
  private unitId = '';
  private lessonId = '';
  private levelId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.courseId = params['courseId'];
      this.unitId = params['unitId'];
      this.lessonId = params['lessonId'];
      this.levelId = params['levelId'];

      this.loadLevel();
    });
  }
  loadLevel(): void {
    this.currentLevel =
      this.courseService.getLevel(
        this.courseId,
        this.unitId,
        this.lessonId,
        this.levelId,
      ) || null;

    if (!this.currentLevel) {
      this.router.navigate(['/courses']);
      return;
    }

    // Reset game state
    this.gameSubmitted = false;
    this.showHints = false;
    this.lastScore = 0;

    // Initialize game data based on level type
    if (
      this.currentLevel.type === 'selection' &&
      this.currentLevel.gameData.items
    ) {
      this.gameItems = [...this.currentLevel.gameData.items].map((item) => ({
        ...item,
        isSelected: false,
      }));
    } else if (
      this.currentLevel.type === 'estimation' &&
      this.currentLevel.gameData.estimationFields
    ) {
      this.estimationFields = [
        ...this.currentLevel.gameData.estimationFields,
      ].map((field) => ({
        ...field,
        userEstimate: undefined,
      }));
    } else if (
      this.currentLevel.type === 'funding' &&
      this.currentLevel.gameData.fundingSources
    ) {
      this.fundingSources = [...this.currentLevel.gameData.fundingSources].map(
        (source) => ({
          ...source,
          isSelected: false,
          amount: 0,
        }),
      );
    }

    // Check if this is the last level in the lesson
    const lesson = this.courseService.getLesson(
      this.courseId,
      this.unitId,
      this.lessonId,
    );
    if (lesson) {
      const currentLevelIndex = lesson.levels.findIndex(
        (level) => level.id === this.levelId,
      );
      this.isLastLevel = currentLevelIndex === lesson.levels.length - 1;
    }
  }

  toggleItemSelection(item: GameItem): void {
    if (!this.gameSubmitted) {
      item.isSelected = !item.isSelected;
    }
  }

  toggleFundingSource(source: FundingSource): void {
    if (!this.gameSubmitted) {
      source.isSelected = !source.isSelected;
      if (!source.isSelected) {
        source.amount = 0;
      }
    }
  }

  submitAnswer(): void {
    this.gameSubmitted = true;

    let score = 0;

    if (this.currentLevel?.type === 'selection') {
      score = this.calculateSelectionScore();
    } else if (this.currentLevel?.type === 'estimation') {
      score = this.calculateEstimationScore();
    } else if (this.currentLevel?.type === 'funding') {
      score = this.calculateFundingScore();
    }

    this.lastScore = score;

    // Complete the level
    this.courseService.completeLevel(
      this.courseId,
      this.unitId,
      this.lessonId,
      this.levelId,
      score,
    );
  }

  calculateSelectionScore(): number {
    const correctItems = this.gameItems.filter((item) => item.isCorrect);
    const selectedCorrectItems = this.gameItems.filter(
      (item) => item.isSelected && item.isCorrect,
    );
    const selectedIncorrectItems = this.gameItems.filter(
      (item) => item.isSelected && !item.isCorrect,
    );

    const correctPercent = selectedCorrectItems.length / correctItems.length;
    const penalty = selectedIncorrectItems.length * 0.1;

    const finalScore = Math.max(0, correctPercent - penalty);

    if (finalScore >= 0.9) return 3;
    if (finalScore >= 0.7) return 2;
    if (finalScore >= 0.5) return 1;
    return 0;
  }

  calculateEstimationScore(): number {
    const accuracies = this.estimationFields.map((field) =>
      this.getEstimationAccuracy(field),
    );
    const averageAccuracy =
      accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;

    if (averageAccuracy >= 80) return 3;
    if (averageAccuracy >= 60) return 2;
    if (averageAccuracy >= 40) return 1;
    return 0;
  }

  calculateFundingScore(): number {
    const selectedSources = this.getSelectedFundingSources();
    const totalFunding = this.getTotalFunding();

    // Simple scoring: 3 stars if they have at least one funding source with reasonable amount
    if (selectedSources.length > 0 && totalFunding > 200) return 3;
    if (selectedSources.length > 0 && totalFunding > 100) return 2;
    if (selectedSources.length > 0) return 1;
    return 0;
  }

  getEstimationAccuracy(field: EstimationField): number {
    if (!field.userEstimate || !field.actualCost) return 0;

    const difference = Math.abs(field.userEstimate - field.actualCost);
    const percentDifference = (difference / field.actualCost) * 100;
    return Math.max(0, 100 - percentDifference);
  }

  getTotalEstimatedCost(): number {
    return this.estimationFields.reduce(
      (total, field) => total + (field.userEstimate || 0),
      0,
    );
  }

  getTotalActualCost(): number {
    return this.estimationFields.reduce(
      (total, field) => total + (field.actualCost || 0),
      0,
    );
  }

  getSelectedFundingSources(): FundingSource[] {
    return this.fundingSources.filter(
      (source) => source.isSelected && source.amount! > 0,
    );
  }

  getTotalFunding(): number {
    return this.getSelectedFundingSources().reduce(
      (total, source) => total + (source.amount || 0),
      0,
    );
  }

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }

  nextLevel(): void {
    if (this.isLastLevel) {
      // Go back to course overview
      this.router.navigate(['/courses']);
    } else {
      // Navigate to next level
      const lesson = this.courseService.getLesson(
        this.courseId,
        this.unitId,
        this.lessonId,
      );
      if (lesson) {
        const currentLevelIndex = lesson.levels.findIndex(
          (level) => level.id === this.levelId,
        );
        if (currentLevelIndex < lesson.levels.length - 1) {
          const nextLevel = lesson.levels[currentLevelIndex + 1];
          this.router.navigate([
            '/level',
            this.courseId,
            this.unitId,
            this.lessonId,
            nextLevel.id,
          ]);
        }
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
