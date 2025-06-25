import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BaseGameComponent } from '../../models/base-game.models';
import { EstimationItem, GameData, ValueInputGameData } from '../../models/game.models';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-estimation-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estimation-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstimationGameComponent implements BaseGameComponent<ValueInputGameData> {
  // Input signals required by BaseGameComponent interface
  gameData = input<GameData<ValueInputGameData>>();
  isSubmitted = input<boolean>(false);

  // Injections
  private readonly progressService = inject(ProgressService);

  // Input signals for level identification
  readonly courseId = input<string>();
  readonly unitId = input<string>();
  readonly lessonId = input<string>();
  readonly levelId = input<string>();

  // Internal state - use a signal to track user estimates
  private readonly userEstimates = signal<Record<string, number>>({});
  private readonly submittedState = signal<boolean>(false);

  // Load saved submission on component initialization
  private loadSavedSubmission = effect(() => {
    const courseId = this.courseId();
    const unitId = this.unitId();
    const lessonId = this.lessonId();
    const levelId = this.levelId();

    if (courseId && unitId && lessonId && levelId && this.isSubmitted()) {
      const savedData = this.progressService.loadUserSubmission(
        courseId,
        unitId,
        lessonId,
        levelId,
      );
      if (savedData && typeof savedData === 'object') {
        this.userEstimates.set(savedData as Record<string, number>);
      }
    }
  });

  // Method to save user estimates on submit
  saveUserSubmission(): void {
    const courseId = this.courseId();
    const unitId = this.unitId();
    const lessonId = this.lessonId();
    const levelId = this.levelId();

    if (courseId && unitId && lessonId && levelId) {
      const estimates = this.userEstimates();
      this.progressService.saveUserSubmission(courseId, unitId, lessonId, levelId, estimates);
    }
  }

  // Computed properties
  readonly gameIsSubmitted = computed(() => this.isSubmitted() || this.submittedState());

  readonly estimationFields = computed(() => {
    const data = this.gameData()?.data;
    if (!data) return [];

    const estimates = this.userEstimates();

    return data.items.map((item) => ({
      ...item,
      itemName: item.name, // Map 'name' to 'itemName' for template compatibility
      currency: data.currency,
      userEstimate: estimates[item.id] || 0,
    }));
  });

  readonly totalCost = computed(() => {
    const estimates = this.userEstimates();
    return Object.values(estimates).reduce((total, value) => total + (value || 0), 0);
  });

  readonly allFieldsComplete = computed(() => {
    const estimates = this.userEstimates();
    const data = this.gameData()?.data;
    if (!data) return false;

    const minRequired = data.minEstimations || data.items.length;
    const completedFields = Object.values(estimates).filter((value) => value && value > 0);

    return completedFields.length >= minRequired;
  });

  readonly canSubmit = computed(() => {
    return this.allFieldsComplete() && !this.gameIsSubmitted();
  });

  // BaseGameComponent interface methods
  resetGame(): void {
    this.submittedState.set(false);
    this.userEstimates.set({});
  }

  hasHints = computed(() => {
    return (this.gameData()?.hints?.length || 0) > 0;
  });

  // Component-specific methods
  updateEstimate(itemId: string, value: number): void {
    const currentEstimates = this.userEstimates();
    this.userEstimates.set({
      ...currentEstimates,
      [itemId]: value || 0,
    });
  }

  onValueChange(event: Event, itemId: string): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value) || 0;

    if (value < 0) {
      input.value = '0';
      this.updateEstimate(itemId, 0);
    } else {
      this.updateEstimate(itemId, value);
    }
  }

  trackByFieldId(index: number, field: EstimationItem): string {
    return field.id || index.toString();
  }
}
