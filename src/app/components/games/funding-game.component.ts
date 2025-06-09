import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FundingSource } from '../../models/course.models';

@Component({
  selector: 'app-funding-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funding-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundingGameComponent {
  @Input() fundingSources: FundingSource[] = [];
  @Input() totalEstimatedCost: number = 0;
  @Input() isSubmitted: boolean = false;
  @Output() sourceClick = new EventEmitter<FundingSource>();
  @Output() amountChange = new EventEmitter<void>();

  // Computed property for selected sources
  get selectedSources(): FundingSource[] {
    return this.fundingSources.filter(
      (source) => source.isSelected && (source.amount || 0) > 0,
    );
  }

  // Computed property for total funding
  get totalFunding(): number {
    return this.selectedSources.reduce(
      (total, source) => total + (source.amount || 0),
      0,
    );
  }

  // Computed property for funding gap
  get fundingGap(): number {
    return Math.max(0, this.totalEstimatedCost - this.totalFunding);
  }

  // Computed property for funding sufficiency
  get isFundingSufficient(): boolean {
    return this.totalFunding >= this.totalEstimatedCost;
  }

  onSourceClick(source: FundingSource): void {
    if (!this.isSubmitted) {
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

  // Track by function for better performance in *ngFor
  trackBySourceId(index: number, source: FundingSource): string {
    return source.id || index.toString();
  }
}
