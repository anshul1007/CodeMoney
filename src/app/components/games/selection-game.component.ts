import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { GameData, SelectionGameData } from '../../models';
import { BaseGameComponent } from '../../models/base-game.models';

interface SelectionItem {
  id: string;
  name: string;
  icon?: string;
  isCorrect?: boolean;
  isSelected?: boolean;
}

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

  // BaseGameComponent interface implementation
  readonly onInteraction = this.selectionChange;
  readonly validationChange = output<boolean>();

  // Modern computed property for better performance
  readonly selectedItemsCount = computed(
    () => this.gameItems().filter((item) => item.isSelected).length || 0,
  );

  readonly gameItems = computed(() => this.gameData()?.data?.items || []);

  readonly canSubmit = computed(() => (this.selectedItemsCount() || 0) >= 2);

  onItemClick(item: SelectionItem): void {
    if (!this.isSubmitted()) {
      this.selectionChange.emit(item);
    }
  }

  resetGame(): void {
    throw new Error('Method not implemented.');
  }

  trackByItemId = (index: number, item: SelectionItem): string => item.id || index.toString();
}
