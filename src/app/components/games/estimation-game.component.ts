// import {
//   Component,
//   input,
//   output,
//   ChangeDetectionStrategy,
//   computed,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { EstimationField } from '../../models/game.models';
// import { BaseGameComponent } from '../../models/game-interface.models';

// @Component({
//   selector: 'app-estimation-game',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './estimation-game.component.html',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class EstimationGameComponent implements BaseGameComponent {
//   readonly estimationFields = input<EstimationField[]>([]);
//   readonly isSubmitted = input<boolean>(false);
//   readonly valueChange = output<void>();

//   // BaseGameComponent interface implementation
//   readonly onInteraction = this.valueChange;
//   readonly onValidationChange = output<any>();

//   // Computed properties for validation and total cost
//   readonly totalCost = computed(() =>
//     this.estimationFields().reduce(
//       (total, field) => total + (field.userEstimate || 0),
//       0,
//     ),
//   );

//   readonly allFieldsComplete = computed(() =>
//     this.estimationFields().every(
//       (field) => field.userEstimate !== undefined && field.userEstimate > 0,
//     ),
//   );
//   readonly allFieldsValid = computed(() =>
//     this.estimationFields().every(
//       (field) => field.userEstimate !== undefined && field.userEstimate > 0,
//     ),
//   );

//   // BaseGameComponent interface methods
//   readonly canSubmit = computed(() => this.allFieldsComplete());

//   setGameData(data: any): void {
//     // For input signals, this would typically be handled by the parent component
//   }

//   getGameData(): any {
//     return this.estimationFields();
//   }

//   resetGame(): void {
//     // Reset game state - would be handled by parent component reloading data
//   }

//   onValueChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     const value = parseFloat(input.value);

//     if (value < 0) {
//       input.value = '0';
//     }

//     this.valueChange.emit();
//   }

//   getTotalCost(): number {
//     return this.totalCost();
//   }

//   trackByFieldId(index: number, field: EstimationField): string {
//     return field.id || index.toString();
//   }
// }
