import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BaseGameComponent, BaseGameMixin } from '../../models/base-game.models';
import {
  EstimationItem,
  EstimationSubmissionData,
  GameData,
  ValueInputGameData,
} from '../../models/game.models';

@Component({
  selector: 'app-estimation-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estimation-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstimationGameComponent
  extends BaseGameMixin<EstimationSubmissionData>
  implements BaseGameComponent<ValueInputGameData>
{
  gameData = input<GameData<ValueInputGameData>>();
  isSubmitted = input<boolean>(false);

  readonly courseId = input<string>();
  readonly unitId = input<string>();
  readonly lessonId = input<string>();
  readonly levelId = input<string>();

  private readonly userEstimates = signal<Record<string, number>>({});
  private readonly submittedState = signal<boolean>(false);

  constructor() {
    super();
    this.initializeSubmissionLoading<EstimationSubmissionData>(
      this.courseId,
      this.unitId,
      this.lessonId,
      this.levelId,
      this.isSubmitted,
      (data: EstimationSubmissionData) => {
        if (data && data.userEstimates) {
          this.userEstimates.set(data.userEstimates);
        }
      },
    );
  }

  saveUserSubmission(): void {
    this.saveUserSubmissionWithData(
      this.courseId,
      this.unitId,
      this.lessonId,
      this.levelId,
      (): EstimationSubmissionData => ({
        userEstimates: this.userEstimates(),
      }),
    );
  }

  readonly gameIsSubmitted = this.createGameIsSubmittedComputed(
    this.isSubmitted,
    this.submittedState,
  );

  readonly estimationFields = computed(() => {
    const data = this.gameData()?.data;
    if (!data) return [];

    const estimates = this.userEstimates();

    return data.items.map((item) => ({
      ...item,
      itemName: item.name,
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

  resetGame(): void {
    this.submittedState.set(false);
    this.userEstimates.set({});
  }

  hasHints = this.createHasHintsComputed(this.gameData);

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
