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
  totalEstimatedCost = 0; // Added to store the estimated cost from level 2

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

      // Check if the user is trying to access a level directly
      this.checkLevelAccess();
    });
  }
  // Add method to check if user can access this level directly
  private checkLevelAccess(): void {
    console.log('checkLevelAccess called for level:', this.levelId);

    const progress = this.courseService.getProgress().subscribe((progress) => {
      console.log('Current progress:', progress);
      console.log('Unlocked levels:', progress.unlockedLevels);
      console.log(
        'Checking if level is unlocked:',
        this.levelId,
        'Result:',
        progress.unlockedLevels.includes(this.levelId),
      );

      // If the level is not in unlockedLevels, redirect to the courses page
      if (!progress.unlockedLevels.includes(this.levelId)) {
        console.log('Level not unlocked, redirecting to courses page');
        this.router.navigate(['/courses']);
      } else {
        console.log('Level is unlocked, loading it');
        // Level is unlocked, load it
        this.loadLevel();

        // Load saved estimated cost from previous level if available
        this.loadSavedCost();
      }
    });
  }

  // Load saved cost if exists in localStorage
  private loadSavedCost(): void {
    const savedCost = localStorage.getItem('estimatedCost');
    if (savedCost && this.levelId === 'funding-sources') {
      this.totalEstimatedCost = parseInt(savedCost, 10);
    }
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

    // Reset game state only if the level is not already completed
    // This prevents resetting gameSubmitted when the progress service updates
    if (!this.currentLevel.isCompleted) {
      this.gameSubmitted = false;
      this.showHints = false;
      this.lastScore = 0;
    }

    // Initialize game data based on level type
    if (
      this.currentLevel.type === 'selection' &&
      this.currentLevel.gameData.items
    ) {
      // If level is completed, preserve existing selections, otherwise reset
      if (this.currentLevel.isCompleted && this.gameItems.length > 0) {
        // Keep existing selections - don't reinitialize
      } else {
        this.gameItems = [...this.currentLevel.gameData.items].map((item) => ({
          ...item,
          isSelected: false,
        }));
      }
    } else if (
      this.currentLevel.type === 'estimation' &&
      this.currentLevel.gameData.estimationFields
    ) {
      // If level is completed, preserve existing data, otherwise reset
      if (this.currentLevel.isCompleted && this.estimationFields.length > 0) {
        // Keep existing data - don't reinitialize
      } else {
        this.estimationFields = [
          ...this.currentLevel.gameData.estimationFields,
        ].map((field) => ({
          ...field,
          userEstimate: undefined,
        }));
      }
    } else if (
      this.currentLevel.type === 'funding' &&
      this.currentLevel.gameData.fundingSources
    ) {
      // If level is completed, preserve existing data, otherwise reset
      if (this.currentLevel.isCompleted && this.fundingSources.length > 0) {
        // Keep existing data - don't reinitialize
      } else {
        this.fundingSources = [
          ...this.currentLevel.gameData.fundingSources,
        ].map((source) => ({
          ...source,
          isSelected: false,
          amount: 0,
        }));
      }
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
    console.log('submitAnswer called');

    // If already submitted and not called from handleSubmit, don't process again
    if (this.gameSubmitted) {
      console.log('Game already submitted, processing completion');
    } else {
      // Validate minimum items for selection game
      if (this.currentLevel?.type === 'selection') {
        const selectedItemsCount = this.gameItems.filter(
          (item) => item.isSelected,
        ).length;

        console.log(`Selection game: ${selectedItemsCount} items selected`);

        if (selectedItemsCount < 2) {
          console.log('Not enough items selected, showing validation message');
          // Show validation message (already shown in template)
          return;
        }
      }

      // Validate all fields have positive values for estimation game
      if (this.currentLevel?.type === 'estimation') {
        const allFieldsHaveValues = this.estimationFields.every(
          (field) => field.userEstimate !== undefined && field.userEstimate > 0,
        );

        if (!allFieldsHaveValues) {
          // Show validation message (already shown in template)
          return;
        }

        // Save the total estimated cost to be used in the funding level
        const totalCost = this.getTotalEstimatedCost();
        localStorage.setItem('estimatedCost', totalCost.toString());
        this.totalEstimatedCost = totalCost;
      }

      // Set submitted flag if not already set
      this.gameSubmitted = true;
      console.log('gameSubmitted set to: true in submitAnswer');
    }

    let score = 0;

    if (this.currentLevel?.type === 'selection') {
      score = this.calculateSelectionScore();
    } else if (this.currentLevel?.type === 'estimation') {
      score = this.calculateEstimationScore();
    } else if (this.currentLevel?.type === 'funding') {
      score = this.calculateFundingScore();
    }
    this.lastScore = score;
    console.log(
      `Game submitted with score: ${score}, gameSubmitted set to: ${this.gameSubmitted}`,
    );

    // Complete the level
    this.courseService.completeLevel(
      this.courseId,
      this.unitId,
      this.lessonId,
      this.levelId,
      score,
    );
    console.log('Level completed in course service');
  }

  getSelectedItemsCount(): number {
    return this.gameItems.filter((item) => item.isSelected).length;
  }
  calculateSelectionScore(): number {
    // Always return 3 stars regardless of score
    return 3;
  }
  calculateEstimationScore(): number {
    // Always return 3 stars regardless of score
    return 3;
  }

  calculateFundingScore(): number {
    // Always return 3 stars regardless of score
    return 3;
  }
  getEstimationAccuracy(field: EstimationField): number {
    if (!field.userEstimate || !field.actualCost) return 0;

    // Always return a high accuracy score regardless of actual difference
    // This makes any positive entry "correct" enough
    return 90; // Return a high score (90%) for any positive value
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
    console.log('nextLevel called, isLastLevel:', this.isLastLevel);
    console.log('Current level ID:', this.levelId);
    console.log('Course ID:', this.courseId);
    console.log('Unit ID:', this.unitId);
    console.log('Lesson ID:', this.lessonId);

    if (this.isLastLevel) {
      // Reset estimated cost when completing the lesson
      if (this.currentLevel?.type === 'funding') {
        localStorage.removeItem('estimatedCost');
      }

      // Go back to course overview
      console.log('Navigating to courses overview');
      this.router.navigate(['/courses']);
    } else {
      // Navigate to next level
      const lesson = this.courseService.getLesson(
        this.courseId,
        this.unitId,
        this.lessonId,
      );
      console.log('Found lesson:', lesson);

      if (lesson) {
        const currentLevelIndex = lesson.levels.findIndex(
          (level) => level.id === this.levelId,
        );
        console.log('Current level index:', currentLevelIndex);
        console.log('Total levels:', lesson.levels.length);
        if (currentLevelIndex < lesson.levels.length - 1) {
          const nextLevel = lesson.levels[currentLevelIndex + 1];
          console.log('Next level:', nextLevel);
          console.log('Is next level unlocked?', nextLevel.isUnlocked);

          const navigationPath = [
            '/level',
            this.courseId,
            this.unitId,
            this.lessonId,
            nextLevel.id,
          ];
          console.log('Navigation path:', navigationPath);

          // Add a small delay to ensure level unlocking has been processed
          setTimeout(() => {
            console.log('Attempting navigation after delay...');
            this.router.navigate(navigationPath).then(
              (success) => {
                console.log('Navigation success:', success);
                if (!success) {
                  console.log('Navigation failed, staying on current level');
                  // Maybe show an error message or try alternative navigation
                }
              },
              (error) => {
                console.error('Navigation error:', error);
                // Fallback - try navigating to courses page
                console.log('Fallback: navigating to courses page');
                this.router.navigate(['/courses']);
              },
            );
          }, 100);
        } else {
          console.log('No next level found - current index is last');
        }
      } else {
        console.log('Lesson not found');
      }
    }
  }
  goBack(): void {
    // If we're in a funding level, preserve the cost for when we return
    if (this.currentLevel?.type !== 'funding') {
      localStorage.removeItem('estimatedCost');
    }

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
      // Check for ANY 2 selected items, regardless of whether they're correct
      const selectedItemsCount = this.gameItems.filter(
        (item) => item.isSelected,
      ).length;
      return selectedItemsCount >= 2;
    } else if (this.currentLevel?.type === 'estimation') {
      // All fields must have positive values
      return this.estimationFields.every(
        (field) => field.userEstimate !== undefined && field.userEstimate > 0,
      );
    } else if (this.currentLevel?.type === 'funding') {
      // When total cost is available, check if funding is enough
      if (this.totalEstimatedCost > 0) {
        return this.getTotalFunding() >= this.totalEstimatedCost;
      }
      // If no estimated cost is available, allow any funding
      return this.getSelectedFundingSources().length > 0;
    }
    return true;
  }
  getSubmitButtonText(): string {
    if (this.currentLevel?.type === 'selection') {
      const selectedItemsCount = this.gameItems.filter(
        (item) => item.isSelected,
      ).length;
      const required = 2;
      if (selectedItemsCount < required) {
        return `Guess ${required - selectedItemsCount} more item${required - selectedItemsCount > 1 ? 's' : ''}`;
      }
    } else if (this.currentLevel?.type === 'estimation') {
      // Check for empty or non-positive fields
      const missingFields = this.estimationFields.filter(
        (field) => field.userEstimate === undefined || field.userEstimate <= 0,
      ).length;

      if (missingFields > 0) {
        return `Enter values for all ${missingFields} remaining item${missingFields > 1 ? 's' : ''}`;
      }
    } else if (this.currentLevel?.type === 'funding') {
      // For funding game, show how much more funding is needed
      if (
        this.totalEstimatedCost > 0 &&
        this.getTotalFunding() < this.totalEstimatedCost
      ) {
        const remaining = this.totalEstimatedCost - this.getTotalFunding();
        return `Need ₹${remaining} more`;
      } else if (this.getSelectedFundingSources().length === 0) {
        return 'Select a funding source';
      }
    }
    return 'Submit Game';
  }
  handleSubmit(): void {
    console.log('handleSubmit called');

    // First check if we can submit
    if (!this.canSubmitGame()) {
      console.log('Cannot submit game - validation failed');
      return;
    }

    // Prevent double submission
    if (this.gameSubmitted) {
      console.log('Game already submitted, stopping');
      return;
    }

    // Set the state flag before submission
    this.gameSubmitted = true;
    console.log('gameSubmitted set to: true');

    // Call submit logic
    this.submitAnswer();

    console.log(`After submitAnswer: gameSubmitted=${this.gameSubmitted}`);
  }

  submitGame(): void {
    console.log('submitGame called, forwarding to submitAnswer');
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
  validatePositiveValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);

    if (value < 0) {
      input.value = '0'; // Reset to zero if negative
    }

    // Ensure we only allow positive values (zero is technically valid but not for submission)
    if (value === 0) {
      // Zero is allowed in the input but not as a valid submission
      // We'll handle this in the canSubmitGame method
    }
  }
}
