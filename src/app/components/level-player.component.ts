import {
  Component,
  OnInit,
  signal,
  computed,
  effect,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../services/course.service';
import {
  EstimationField,
  FundingSource,
  GameItem,
  Level,
} from '../models/course.models';
import { SelectionGameComponent } from './games/selection-game.component';
import { EstimationGameComponent } from './games/estimation-game.component';
import { FundingGameComponent } from './games/funding-game.component';

@Component({
  selector: 'app-level-player',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectionGameComponent,
    EstimationGameComponent,
    FundingGameComponent,
  ],
  templateUrl: './level-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelPlayerComponent implements OnInit {
  // Injected services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);

  // Signal-based reactive state
  currentLevel = signal<Level | null>(null);
  gameItems = signal<GameItem[]>([]);
  estimationFields = signal<EstimationField[]>([]);
  fundingSources = signal<FundingSource[]>([]);
  gameSubmitted = signal<boolean>(false);
  showHints = signal<boolean>(false);
  lastScore = signal<number>(0);
  totalEstimatedCost = signal<number>(0);

  // Route parameters as signals
  courseId = signal<string>('');
  unitId = signal<string>('');
  lessonId = signal<string>('');
  levelId = signal<string>('');

  // Computed signals for derived state
  isLastLevel = computed(() => {
    const level = this.currentLevel();
    const courseId = this.courseId();
    const unitId = this.unitId();
    const lessonId = this.lessonId();
    const levelId = this.levelId();

    if (!level || !courseId || !unitId || !lessonId || !levelId) return false;

    const lesson = this.courseService.getLesson(courseId, unitId, lessonId);
    if (!lesson) return false;

    const currentIndex = lesson.levels.findIndex((l) => l.id === levelId);
    return currentIndex === lesson.levels.length - 1;
  });

  selectedItemsCount = computed(
    () => this.gameItems().filter((item) => item.isSelected).length,
  );

  totalFunding = computed(() =>
    this.fundingSources()
      .filter((source) => source.isSelected && (source.amount || 0) > 0)
      .reduce((total, source) => total + (source.amount || 0), 0),
  );

  totalEstimatedCostComputed = computed(() =>
    this.estimationFields().reduce(
      (total, field) => total + (field.userEstimate || 0),
      0,
    ),
  );

  canSubmitGame = computed(() => {
    const level = this.currentLevel();
    if (!level) return false;

    if (level.type === 'selection') {
      return this.selectedItemsCount() >= 2;
    } else if (level.type === 'estimation') {
      return this.estimationFields().every(
        (field) => field.userEstimate !== undefined && field.userEstimate > 0,
      );
    } else if (level.type === 'funding') {
      const hasSelectedSources = this.fundingSources().some(
        (source) => source.isSelected && (source.amount || 0) > 0,
      );
      if (this.totalEstimatedCost() > 0) {
        return this.totalFunding() >= this.totalEstimatedCost();
      }
      return hasSelectedSources;
    }
    return true;
  });

  // Effect to automatically save estimated cost
  private autoSaveCostEffect = effect(() => {
    const level = this.currentLevel();
    const total = this.totalEstimatedCostComputed();

    if (level?.type === 'estimation' && total > 0) {
      localStorage.setItem('estimatedCost', total.toString());
      this.totalEstimatedCost.set(total);
    }
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.courseId.set(params['courseId']);
      this.unitId.set(params['unitId']);
      this.lessonId.set(params['lessonId']);
      this.levelId.set(params['levelId']);

      // Check if the user is trying to access a level directly
      this.checkLevelAccess();
    });
  }
  // Add method to check if user can access this level directly
  private checkLevelAccess(): void {
    const progress = this.courseService.getProgress().subscribe((progress) => {
      // If the level is not in unlockedLevels, redirect to the courses page
      if (!progress.unlockedLevels.includes(this.levelId())) {
        this.router.navigate(['/courses']);
      } else {
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
    if (savedCost && this.levelId() === 'funding-sources') {
      this.totalEstimatedCost.set(parseInt(savedCost, 10));
    }
  }

  loadLevel(): void {
    const currentLevel = this.courseService.getLevel(
      this.courseId(),
      this.unitId(),
      this.lessonId(),
      this.levelId(),
    );

    if (!currentLevel) {
      this.router.navigate(['/courses']);
      return;
    }

    this.currentLevel.set(currentLevel);

    // Reset game state only if the level is not already completed
    // This prevents resetting gameSubmitted when the progress service updates
    if (!currentLevel.isCompleted) {
      this.gameSubmitted.set(false);
      this.showHints.set(false);
      this.lastScore.set(0);
    }

    // Initialize game data based on level type
    if (currentLevel.type === 'selection' && currentLevel.gameData.items) {
      // If level is completed, preserve existing selections, otherwise reset
      if (currentLevel.isCompleted && this.gameItems().length > 0) {
        // Keep existing selections - don't reinitialize
      } else {
        const items = [...currentLevel.gameData.items].map((item) => ({
          ...item,
          isSelected: false,
        }));
        this.gameItems.set(items);
      }
    } else if (
      currentLevel.type === 'estimation' &&
      currentLevel.gameData.estimationFields
    ) {
      // If level is completed, preserve existing data, otherwise reset
      if (currentLevel.isCompleted && this.estimationFields().length > 0) {
        // Keep existing data - don't reinitialize
      } else {
        const fields = [...currentLevel.gameData.estimationFields].map(
          (field) => ({
            ...field,
            userEstimate: undefined,
          }),
        );
        this.estimationFields.set(fields);
      }
    } else if (
      currentLevel.type === 'funding' &&
      currentLevel.gameData.fundingSources
    ) {
      // If level is completed, preserve existing data, otherwise reset
      if (currentLevel.isCompleted && this.fundingSources().length > 0) {
        // Keep existing data - don't reinitialize
      } else {
        const sources = [...currentLevel.gameData.fundingSources].map(
          (source) => ({
            ...source,
            isSelected: false,
            amount: 0,
          }),
        );
        this.fundingSources.set(sources);
      }
    }
  }

  toggleItemSelection(item: GameItem): void {
    if (!this.gameSubmitted()) {
      const items = this.gameItems();
      const updatedItems = items.map((i) =>
        i.id === item.id ? { ...i, isSelected: !i.isSelected } : i,
      );
      this.gameItems.set(updatedItems);
    }
  }

  toggleFundingSource(source: FundingSource): void {
    if (!this.gameSubmitted()) {
      const sources = this.fundingSources();
      const updatedSources = sources.map((s) =>
        s.id === source.id
          ? {
              ...s,
              isSelected: !s.isSelected,
              amount: !s.isSelected ? s.amount : 0,
            }
          : s,
      );
      this.fundingSources.set(updatedSources);
    }
  }
  submitAnswer(): void {
    // If already submitted and not called from handleSubmit, don't process again
    if (this.gameSubmitted()) {
      // Process completion
    } else {
      const currentLevel = this.currentLevel();

      // Validate minimum items for selection game
      if (currentLevel?.type === 'selection') {
        const selectedItemsCount = this.selectedItemsCount();

        if (selectedItemsCount < 2) {
          // Show validation message (already shown in template)
          return;
        }
      }

      // Validate all fields have positive values for estimation game
      if (currentLevel?.type === 'estimation') {
        const allFieldsHaveValues = this.estimationFields().every(
          (field) => field.userEstimate !== undefined && field.userEstimate > 0,
        );

        if (!allFieldsHaveValues) {
          // Show validation message (already shown in template)
          return;
        }

        // Save the total estimated cost to be used in the funding level
        const totalCost = this.getTotalEstimatedCost();
        localStorage.setItem('estimatedCost', totalCost.toString());
        this.totalEstimatedCost.set(totalCost);
      } // Set submitted flag if not already set
      this.gameSubmitted.set(true);
    }

    let score = 0;
    const currentLevel = this.currentLevel();

    if (currentLevel?.type === 'selection') {
      score = this.calculateSelectionScore();
    } else if (currentLevel?.type === 'estimation') {
      score = this.calculateEstimationScore();
    } else if (currentLevel?.type === 'funding') {
      score = this.calculateFundingScore();
    }
    this.lastScore.set(score);

    // Complete the level
    this.courseService.completeLevel(
      this.courseId(),
      this.unitId(),
      this.lessonId(),
      this.levelId(),
      score,
    );
  }

  getSelectedItemsCount(): number {
    return this.selectedItemsCount();
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
    return this.totalEstimatedCostComputed();
  }

  getTotalActualCost(): number {
    return this.estimationFields().reduce(
      (total, field) => total + (field.actualCost || 0),
      0,
    );
  }

  getSelectedFundingSources(): FundingSource[] {
    return this.fundingSources().filter(
      (source) => source.isSelected && source.amount! > 0,
    );
  }

  getTotalFunding(): number {
    return this.totalFunding();
  }

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }
  nextLevel(): void {
    if (this.isLastLevel()) {
      // Reset estimated cost when completing the lesson
      const currentLevel = this.currentLevel();
      if (currentLevel?.type === 'funding') {
        localStorage.removeItem('estimatedCost');
      }

      // Go back to course overview
      this.router.navigate(['/courses']);
    } else {
      // Navigate to next level
      const lesson = this.courseService.getLesson(
        this.courseId(),
        this.unitId(),
        this.lessonId(),
      );

      if (lesson) {
        const currentLevelIndex = lesson.levels.findIndex(
          (level) => level.id === this.levelId(),
        );
        if (currentLevelIndex < lesson.levels.length - 1) {
          const nextLevel = lesson.levels[currentLevelIndex + 1];

          const navigationPath = [
            '/level',
            this.courseId(),
            this.unitId(),
            this.lessonId(),
            nextLevel.id,
          ];

          // Add a small delay to ensure level unlocking has been processed
          setTimeout(() => {
            this.router.navigate(navigationPath).then(
              (success) => {
                if (!success) {
                  // Maybe show an error message or try alternative navigation
                }
              },
              (error) => {
                // Fallback - try navigating to courses page
                this.router.navigate(['/courses']);
              },
            );
          }, 100);
        }
      }
    }
  }

  goBack(): void {
    // If we're in a funding level, preserve the cost for when we return
    const currentLevel = this.currentLevel();
    if (currentLevel?.type !== 'funding') {
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
    return this.gameItems()
      .filter((item) => item.isSelected)
      .reduce((total, item) => total + 0, 0); // GameItem doesn't have cost property
  }

  toggleItemSelection2(itemId: string): void {
    const item = this.gameItems().find((i) => i.id === itemId);
    if (item && !this.gameSubmitted()) {
      this.toggleItemSelection(item);
    }
  }

  isEstimationAccurate(field: EstimationField): boolean {
    return this.getEstimationAccuracy(field) >= 80;
  }

  getTotalAllocated(): number {
    return this.fundingSources()
      .filter((source) => source.isSelected)
      .reduce((total, source) => total + (source.amount || 0), 0);
  }

  toggleFundingSource2(sourceId: string): void {
    const source = this.fundingSources().find((s) => s.id === sourceId);
    if (source && !this.gameSubmitted()) {
      this.toggleFundingSource(source);
    }
  }

  getSubmitButtonText(): string {
    const currentLevel = this.currentLevel();
    if (currentLevel?.type === 'selection') {
      const selectedItemsCount = this.selectedItemsCount();
      const required = 2;
      if (selectedItemsCount < required) {
        return `Guess ${required - selectedItemsCount} more item${required - selectedItemsCount > 1 ? 's' : ''}`;
      }
    } else if (currentLevel?.type === 'estimation') {
      // Check for empty or non-positive fields
      const missingFields = this.estimationFields().filter(
        (field) => field.userEstimate === undefined || field.userEstimate <= 0,
      ).length;

      if (missingFields > 0) {
        return `Enter values for all ${missingFields} remaining item${missingFields > 1 ? 's' : ''}`;
      }
    } else if (currentLevel?.type === 'funding') {
      // For funding game, show how much more funding is needed
      if (
        this.totalEstimatedCost() > 0 &&
        this.getTotalFunding() < this.totalEstimatedCost()
      ) {
        const remaining = this.totalEstimatedCost() - this.getTotalFunding();
        return `Need ₹${remaining} more`;
      } else if (this.getSelectedFundingSources().length === 0) {
        return 'Select a funding source';
      }
    }
    return 'Submit Game';
  }
  handleSubmit(): void {
    // First check if we can submit
    if (!this.canSubmitGame()) {
      return;
    }

    // Prevent double submission
    if (this.gameSubmitted()) {
      return;
    }

    // Set the state flag before submission
    this.gameSubmitted.set(true);

    // Call submit logic
    this.submitAnswer();
  }

  submitGame(): void {
    this.submitAnswer();
  }

  resetGame(): void {
    this.gameSubmitted.set(false);
    this.showHints.set(false);
    this.lastScore.set(0);

    // Reset all selections
    const items = this.gameItems().map((item) => ({
      ...item,
      isSelected: false,
    }));
    this.gameItems.set(items);

    const fields = this.estimationFields().map((field) => ({
      ...field,
      userEstimate: undefined,
    }));
    this.estimationFields.set(fields);

    const sources = this.fundingSources().map((source) => ({
      ...source,
      isSelected: false,
      amount: 0,
    }));
    this.fundingSources.set(sources);
  }

  completeCourse(): void {
    this.router.navigate(['/courses']);
  }

  getScoreMessage(): string {
    const score = this.lastScore();
    if (score >= 90) return 'Excellent work!';
    if (score >= 70) return 'Good job!';
    if (score >= 50) return 'Keep trying!';
    return 'Try again!';
  }

  toggleHints(): void {
    this.showHints.set(!this.showHints());
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

  onEstimationChange(): void {
    // Handle estimation field changes if needed
  }

  onFundingChange(): void {
    // Handle funding amount changes if needed
  }
}
