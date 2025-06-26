import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  BaseGameComponent,
  BaseGameMixin,
  GameComponentWithHints,
  GameComponentWithReset,
  GameComponentWithSave,
} from '../../models/base-game.models';
import {
  FundingSource,
  FundingSubmissionData,
  GameData,
  ResourceAllocationGameData,
} from '../../models/game.models';

@Component({
  selector: 'app-funding-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funding-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundingGameComponent
  extends BaseGameMixin<ResourceAllocationGameData, FundingSubmissionData>
  implements
    BaseGameComponent<ResourceAllocationGameData>,
    GameComponentWithHints,
    GameComponentWithSave,
    GameComponentWithReset
{
  gameData = input<GameData<ResourceAllocationGameData>>();
  isSubmitted = input<boolean>(false);

  readonly courseId = input<string>();
  readonly unitId = input<string>();
  readonly lessonId = input<string>();
  readonly levelId = input<string>();

  private readonly userSelections = signal<Record<string, boolean>>({});
  private readonly userAmounts = signal<Record<string, number>>({});
  private readonly submittedState = signal<boolean>(false);

  constructor() {
    super();
    this.initializeSubmissionLoading(this.isSubmitted, (data: FundingSubmissionData) => {
      if (data) {
        this.userSelections.set(data.selections || {});
        this.userAmounts.set(data.amounts || {});
      }
    });
  }

  saveUserSubmission(): void {
    this.saveSubmission(() => ({
      selections: this.userSelections(),
      amounts: this.userAmounts(),
    }));
  }

  readonly gameIsSubmitted = this.createGameIsSubmittedComputed(
    this.isSubmitted,
    this.submittedState,
  );

  readonly fundingSources = computed(() => {
    const data = this.gameData()?.data;
    if (!data) return [];

    const selections = this.userSelections();
    const amounts = this.userAmounts();

    return data.fundingSources.map((source) => ({
      ...source,
      isSelected: selections[source.id] || false,
      amount: amounts[source.id] || 0,
    }));
  });

  readonly totalEstimatedCost = computed(() => {
    return this.gameData()?.data?.totalBudget || 0;
  });

  readonly selectedSources = computed(() =>
    this.fundingSources().filter((source) => source.isSelected && (source.amount || 0) > 0),
  );

  readonly totalFunding = computed(() =>
    this.selectedSources().reduce((total, source) => total + (source.amount || 0), 0),
  );

  readonly fundingGap = computed(() =>
    Math.max(0, this.totalEstimatedCost() - this.totalFunding()),
  );

  readonly isFundingSufficient = computed(
    () => this.totalFunding() >= this.totalEstimatedCost() && this.totalEstimatedCost() > 0,
  );

  readonly hasSelectedSources = computed(() => this.selectedSources().length > 0);

  readonly hasMinimumSources = computed(() => {
    const minSources = this.gameData()?.data?.constraints?.minSources || 1;
    return this.selectedSources().length >= minSources;
  });

  readonly canSubmit = computed(() => {
    return (
      this.hasSelectedSources() &&
      this.hasMinimumSources() &&
      (this.totalEstimatedCost() === 0 || this.isFundingSufficient())
    );
  });

  resetGame(): void {
    this.submittedState.set(false);
    this.userSelections.set({});
    this.userAmounts.set({});
  }

  hasHints = this.createHasHintsComputed(this.gameData);

  onSourceClick(source: FundingSource): void {
    if (this.gameIsSubmitted()) return;

    const currentSelections = this.userSelections();
    const newSelection = !currentSelections[source.id];

    this.userSelections.set({
      ...currentSelections,
      [source.id]: newSelection,
    });

    if (!newSelection) {
      const currentAmounts = this.userAmounts();
      this.userAmounts.set({
        ...currentAmounts,
        [source.id]: 0,
      });
    }
  }

  onAmountChange(sourceId: string, value: number): void {
    const currentAmounts = this.userAmounts();
    this.userAmounts.set({
      ...currentAmounts,
      [sourceId]: value || 0,
    });
  }

  getSelectedSources(): FundingSource[] {
    return this.selectedSources();
  }

  trackBySourceId(index: number, source: FundingSource): string {
    return source.id || index.toString();
  }
}
