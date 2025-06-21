import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseGameComponent } from '../../models/base-game.models';
import { GameData, SelectionGameData } from '../../models';

@Component({
  selector: 'app-selection-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionGameComponent
  implements BaseGameComponent<SelectionGameData>
{
  readonly gameData = input<GameData<SelectionGameData>>();
  readonly isSubmitted = input<boolean>(false);
  readonly itemClick = output<any>();
  // BaseGameComponent interface implementation
  readonly onInteraction = this.itemClick;
  readonly onValidationChange = output<any>();

  // Modern computed property for better performance
  readonly selectedItemsCount = computed(
    () =>
      this.gameData()?.gameSpecificData.options.filter(
        (item) => false, //item.isSelected,
      ).length,
  );

  readonly gameItems = computed(
    () => this.gameData()?.gameSpecificData.options || [],
  );

  readonly canSubmit = computed(() => (this.selectedItemsCount() || 0) >= 2);

  // BaseGameComponent interface methods
  setGameData(data: any): void {
    // For input signals, this would typically be handled by the parent component
    // In a more complex implementation, we might have writable signals here
  }

  getGameData(): any {
    return this.gameItems();
  }

  resetGame(): void {
    // Reset game state - in this case, we'd need writable signals to implement this
    // For now, this would be handled by the parent component reloading data
  }

  onItemClick(item: any): void {
    if (!this.isSubmitted()) {
      this.itemClick.emit(item);
    }
  }

  trackByItemId = (index: number, item: any): string =>
    item.id || index.toString();
}
