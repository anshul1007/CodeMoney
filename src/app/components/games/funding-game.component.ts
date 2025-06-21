import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FundingSource } from '../../models/financial.models';
import { BaseGameComponent } from '../../models/base-game.models';
import { GameData } from '../../models';

@Component({
  selector: 'app-funding-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funding-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundingGameComponent implements BaseGameComponent {
  // Input property for game data
  readonly gameData = input<GameData>();
  readonly fundingSources = input<FundingSource[]>([]);
  readonly totalEstimatedCost = input<number>(0);
  readonly isSubmitted = input<boolean>(false);
  readonly sourceClick = output<FundingSource>();
  readonly amountChange = output<void>();

  // BaseGameComponent interface implementation
  readonly onInteraction = this.sourceClick;
  readonly onValidationChange = output<any>();

  // Computed properties for better performance
  readonly selectedSources = computed(() =>
    this.fundingSources().filter(
      (source) => source.isSelected && (source.amount || 0) > 0,
    ),
  );

  readonly totalFunding = computed(() =>
    this.selectedSources().reduce(
      (total, source) => total + (source.amount || 0),
      0,
    ),
  );

  readonly fundingGap = computed(() =>
    Math.max(0, this.totalEstimatedCost() - this.totalFunding()),
  );

  readonly isFundingSufficient = computed(
    () =>
      this.totalFunding() >= this.totalEstimatedCost() &&
      this.totalEstimatedCost() > 0,
  );
  readonly hasSelectedSources = computed(
    () => this.selectedSources().length > 0,
  );

  // BaseGameComponent interface methods
  readonly canSubmit = computed(
    () =>
      this.hasSelectedSources() &&
      (this.totalEstimatedCost() === 0 || this.isFundingSufficient()),
  );

  setGameData(data: any): void {
    // For input signals, this would typically be handled by the parent component
  }

  getGameData(): any {
    return {
      fundingSources: this.fundingSources(),
      totalEstimatedCost: this.totalEstimatedCost(),
    };
  }

  resetGame(): void {
    // Reset game state - would be handled by parent component reloading data
  }

  onSourceClick(source: FundingSource): void {
    if (!this.isSubmitted()) {
      this.sourceClick.emit(source);
    }
  }

  onAmountChange(): void {
    this.amountChange.emit();
  }

  getSelectedSources(): FundingSource[] {
    return this.selectedSources();
  }

  getTotalFunding(): number {
    return this.totalFunding();
  }

  trackBySourceId(index: number, source: FundingSource): string {
    return source.id || index.toString();
  }
}
