import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstimationField } from '../../models/course.models';

@Component({
  selector: 'app-estimation-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estimation-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstimationGameComponent {
  @Input() estimationFields: EstimationField[] = [];
  @Input() isSubmitted: boolean = false;
  @Output() valueChange = new EventEmitter<void>();

  // Computed property for total cost
  get totalCost(): number {
    return this.estimationFields.reduce(
      (total, field) => total + (field.userEstimate || 0),
      0,
    );
  }

  // Computed property for validation
  get allFieldsValid(): boolean {
    return this.estimationFields.every(
      (field) => field.userEstimate !== undefined && field.userEstimate > 0,
    );
  }

  onValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);

    if (value < 0) {
      input.value = '0';
    }

    this.valueChange.emit();
  }

  getTotalCost(): number {
    return this.totalCost;
  }

  // Track by function for better performance in *ngFor
  trackByFieldId(index: number, field: EstimationField): string {
    return field.id || index.toString();
  }
}
