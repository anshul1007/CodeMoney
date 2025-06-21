import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { GAME_CONFIG, GameData, SelectionGameData, SelectionItem } from '../../models';
import { BaseGameComponent } from '../../models/base-game.models';

@Component({
  selector: 'app-selection-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionGameComponent implements BaseGameComponent<SelectionGameData> {
  readonly gameData = input<GameData<SelectionGameData>>();
  readonly isSubmitted = input<boolean>(false);
  readonly selectionChange = output<SelectionItem>();

  private selectedItems = signal<Set<string>>(new Set());

  // BaseGameComponent interface implementation
  readonly onInteraction = this.selectionChange;
  readonly validationChange = output<boolean>();

  // Modern computed property for better performance
  readonly selectedItemsCount = computed(() => this.selectedItems().size);
  readonly minSelectionsRequired = computed(
    () => GAME_CONFIG.SELECTION_GAME.MIN_REQUIRED_SELECTIONS,
  );

  readonly gameItems = computed(() => {
    const items = this.gameData()?.data?.items || [];
    const selectedIds = this.selectedItems();

    return items.map((item) => ({
      ...item,
      isSelected: selectedIds.has(item.id),
    }));
  });

  readonly canSubmit = computed(
    () => (this.selectedItemsCount() || 0) >= GAME_CONFIG.SELECTION_GAME.MIN_REQUIRED_SELECTIONS,
  );

  readonly hasHints = computed(() => {
    const hints = this.gameData()?.hints;
    return Boolean(hints && hints.length > 0);
  });

  onItemClick(item: SelectionItem): void {
    if (!this.isSubmitted()) {
      // Update internal selection state
      const currentSelections = new Set(this.selectedItems());

      if (currentSelections.has(item.id)) {
        currentSelections.delete(item.id);
      } else {
        currentSelections.add(item.id);
      }

      this.selectedItems.set(currentSelections);

      // Emit the updated item for parent component if needed
      const updatedItem = { ...item, isSelected: currentSelections.has(item.id) };
      this.selectionChange.emit(updatedItem);
    }
  }

  resetGame(): void {
    this.selectedItems.set(new Set());
  }

  // // Additional utility methods for external access
  // getSelectedItems(): SelectionItem[] {
  //   return this.gameItems().filter((item) => item.isSelected);
  // }

  // getSelectedItemIds(): string[] {
  //   return Array.from(this.selectedItems());
  // }

  trackByItemId = (index: number, item: SelectionItem): string => item.id || index.toString();
}
