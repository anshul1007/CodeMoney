import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import {
  GAME_CONFIG,
  GameData,
  MultiChoiceGameData,
  SelectionItem,
  SelectionSubmissionData,
} from '../../models';
import {
  BaseGameComponent,
  BaseGameMixin,
  GameComponentWithHints,
  GameComponentWithReset,
  GameComponentWithSave,
} from '../../models/base-game.models';

@Component({
  selector: 'app-selection-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionGameComponent
  extends BaseGameMixin<MultiChoiceGameData, SelectionSubmissionData>
  implements
    BaseGameComponent<MultiChoiceGameData>,
    GameComponentWithHints,
    GameComponentWithSave,
    GameComponentWithReset
{
  readonly gameData = input<GameData<MultiChoiceGameData>>();
  readonly isSubmitted = input<boolean>(false);
  readonly selectionChange = output<SelectionItem>();

  readonly courseId = input<string>();
  readonly unitId = input<string>();
  readonly lessonId = input<string>();
  readonly levelId = input<string>();

  private selectedItems = signal<Set<string>>(new Set());

  constructor() {
    super();
    this.initializeSubmissionLoading(this.isSubmitted, (data: SelectionSubmissionData) => {
      if (data && Array.isArray(data)) {
        this.selectedItems.set(new Set(data));
      }
    });
  }

  saveUserSubmission(): void {
    this.saveSubmission(() => Array.from(this.selectedItems()) as SelectionSubmissionData);
  }

  readonly onInteraction = this.selectionChange;
  readonly validationChange = output<boolean>();

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

  readonly hasHints = this.createHasHintsComputed(this.gameData);

  onItemClick(item: SelectionItem): void {
    if (!this.isSubmitted()) {
      const currentSelections = new Set(this.selectedItems());

      if (currentSelections.has(item.id)) {
        currentSelections.delete(item.id);
      } else {
        currentSelections.add(item.id);
      }

      this.selectedItems.set(currentSelections);

      const updatedItem = { ...item, isSelected: currentSelections.has(item.id) };
      this.selectionChange.emit(updatedItem);
    }
  }

  resetGame(): void {
    this.selectedItems.set(new Set());
  }

  trackByItemId = (index: number, item: SelectionItem): string => item.id || index.toString();
}
