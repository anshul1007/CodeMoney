import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { GAME_CONFIG, GameData, MultiChoiceGameData, SelectionItem } from '../../models';
import { BaseGameComponent } from '../../models/base-game.models';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-selection-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionGameComponent implements BaseGameComponent<MultiChoiceGameData> {
  readonly gameData = input<GameData<MultiChoiceGameData>>();
  readonly isSubmitted = input<boolean>(false);
  readonly selectionChange = output<SelectionItem>();

  // Injections
  private readonly progressService = inject(ProgressService);

  // Input signals for level identification
  readonly courseId = input<string>();
  readonly unitId = input<string>();
  readonly lessonId = input<string>();
  readonly levelId = input<string>();

  private selectedItems = signal<Set<string>>(new Set());

  // Load saved submission on component initialization
  private loadSavedSubmission = effect(() => {
    const courseId = this.courseId();
    const unitId = this.unitId();
    const lessonId = this.lessonId();
    const levelId = this.levelId();

    if (courseId && unitId && lessonId && levelId && this.isSubmitted()) {
      const savedData = this.progressService.loadUserSubmission(
        courseId,
        unitId,
        lessonId,
        levelId,
      );
      if (savedData && Array.isArray(savedData)) {
        this.selectedItems.set(new Set(savedData));
      }
    }
  });

  // Method to save user selection on submit
  saveUserSubmission(): void {
    const courseId = this.courseId();
    const unitId = this.unitId();
    const lessonId = this.lessonId();
    const levelId = this.levelId();

    if (courseId && unitId && lessonId && levelId) {
      const selectedIds = Array.from(this.selectedItems());
      this.progressService.saveUserSubmission(courseId, unitId, lessonId, levelId, selectedIds);
    }
  }

  private resetSavedSubmission = effect(() => {
    if (!this.isSubmitted()) {
      this.selectedItems.set(new Set());
    }
  });

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

  trackByItemId = (index: number, item: SelectionItem): string => item.id || index.toString();
}
