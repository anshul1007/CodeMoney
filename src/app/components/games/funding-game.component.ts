import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FundingSource } from '../../models/financial.models';

@Component({
  selector: 'app-funding-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funding-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundingGameComponent {
  readonly fundingSources = input<FundingSource[]>([]);
  readonly totalEstimatedCost = input<number>(0);
  readonly isSubmitted = input<boolean>(false);
  readonly sourceClick = output<FundingSource>();
  readonly amountChange = output<void>();

  // Optimized computed properties for better performance
  get selectedSources(): FundingSource[] {
    return this.fundingSources().filter(
      (source) => source.isSelected && (source.amount || 0) > 0,
    );
  }
  get totalFunding(): number {
    return this.selectedSources.reduce(
      (total, source) => total + (source.amount || 0),
      0,
    );
  }

  get fundingGap(): number {
    return Math.max(0, this.totalEstimatedCost() - this.totalFunding);
  }

  get isFundingSufficient(): boolean {
    return (
      this.totalFunding >= this.totalEstimatedCost() &&
      this.totalEstimatedCost() > 0
    );
  }

  get hasSelectedSources(): boolean {
    return this.selectedSources.length > 0;
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
    return this.selectedSources;
  }

  getTotalFunding(): number {
    return this.totalFunding;
  }

  trackBySourceId(index: number, source: FundingSource): string {
    return source.id || index.toString();
  }
}
