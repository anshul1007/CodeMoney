import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BaseGameComponent } from '../../models/base-game.models';
import { FundingGameData, FundingSource, GameData } from '../../models/game.models';

@Component({
  selector: 'app-funding-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funding-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundingGameComponent implements BaseGameComponent<FundingGameData> {
  // Input signals required by BaseGameComponent interface
  gameData = input<GameData<FundingGameData>>();
  isSubmitted = input<boolean>(false);

  // Internal state - use signals to track user selections and amounts
  private readonly userSelections = signal<Record<string, boolean>>({});
  private readonly userAmounts = signal<Record<string, number>>({});
  private readonly submittedState = signal<boolean>(false);

  // Computed properties
  readonly gameIsSubmitted = computed(() => this.isSubmitted() || this.submittedState());

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

  // BaseGameComponent interface methods
  resetGame(): void {
    this.submittedState.set(false);
    this.userSelections.set({});
    this.userAmounts.set({});
  }

  hasHints = computed(() => {
    return (this.gameData()?.hints?.length || 0) > 0;
  });

  // Component-specific methods
  onSourceClick(source: FundingSource): void {
    if (this.gameIsSubmitted()) return;

    const currentSelections = this.userSelections();
    const newSelection = !currentSelections[source.id];

    this.userSelections.set({
      ...currentSelections,
      [source.id]: newSelection,
    });

    // If deselecting, reset the amount
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
