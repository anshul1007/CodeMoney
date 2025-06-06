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
  templateUrl: './level-player.component.html',
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
    // Validate minimum items for selection game
    if (
      this.currentLevel?.type === 'selection' &&
      this.getSelectedItemsCount() < 2
    ) {
      // Show validation message (already shown in template)
      return;
    }

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

  getSelectedItemsCount(): number {
    return this.gameItems.filter((item) => item.isSelected).length;
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

  // Additional methods that might be referenced in the template
  trackByItemId(index: number, item: GameItem): string {
    return item.id || index.toString();
  }

  trackByFieldId(index: number, field: EstimationField): string {
    return field.id || index.toString();
  }

  trackBySourceId(index: number, source: FundingSource): string {
    return source.id || index.toString();
  }
  getTotalSelectedCost(): number {
    return this.gameItems
      .filter((item) => item.isSelected)
      .reduce((total, item) => total + 0, 0); // GameItem doesn't have cost property
  }

  toggleItemSelection2(itemId: string): void {
    const item = this.gameItems.find((i) => i.id === itemId);
    if (item && !this.gameSubmitted) {
      item.isSelected = !item.isSelected;
    }
  }

  isEstimationAccurate(field: EstimationField): boolean {
    return this.getEstimationAccuracy(field) >= 80;
  }

  getTotalAllocated(): number {
    return this.fundingSources
      .filter((source) => source.isSelected)
      .reduce((total, source) => total + (source.amount || 0), 0);
  }

  toggleFundingSource2(sourceId: string): void {
    const source = this.fundingSources.find((s) => s.id === sourceId);
    if (source && !this.gameSubmitted) {
      source.isSelected = !source.isSelected;
      if (!source.isSelected) {
        source.amount = 0;
      }
    }
  }

  canSubmitGame(): boolean {
    if (this.currentLevel?.type === 'selection') {
      return this.getSelectedItemsCount() >= 2;
    }
    return true;
  }

  getSubmitButtonText(): string {
    if (this.currentLevel?.type === 'selection') {
      const selected = this.getSelectedItemsCount();
      const required = 2;
      if (selected < required) {
        return `Select ${required - selected} more item${required - selected > 1 ? 's' : ''}`;
      }
    }
    return 'Submit Game';
  }

  submitGame(): void {
    this.submitAnswer();
  }
  resetGame(): void {
    this.gameSubmitted = false;
    this.showHints = false;
    this.lastScore = 0;

    // Reset all selections
    this.gameItems.forEach((item) => {
      item.isSelected = false;
    });

    this.estimationFields.forEach((field) => {
      field.userEstimate = undefined;
    });

    this.fundingSources.forEach((source) => {
      source.isSelected = false;
      source.amount = 0;
    });
  }

  completeCourse(): void {
    this.router.navigate(['/courses']);
  }

  getScoreMessage(): string {
    if (this.lastScore >= 90) return 'Excellent work!';
    if (this.lastScore >= 70) return 'Good job!';
    if (this.lastScore >= 50) return 'Keep trying!';
    return 'Try again!';
  }

  toggleHints(): void {
    this.showHints = !this.showHints;
  }
}
