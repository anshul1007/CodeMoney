import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import {
  BalanceSheetGameData,
  BalanceSheetItem,
  BalanceSheetSubmissionData,
  formatCurrency,
  GameData,
} from '../../models';
import {
  BaseGameComponent,
  BaseGameMixin,
  GameComponentWithHints,
  GameComponentWithReset,
  GameComponentWithSave,
} from '../../models/base-game.models';

@Component({
  selector: 'app-balance-sheet-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-sheet-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceSheetGameComponent
  extends BaseGameMixin<BalanceSheetGameData, BalanceSheetSubmissionData>
  implements
    BaseGameComponent<BalanceSheetGameData>,
    GameComponentWithHints,
    GameComponentWithSave,
    GameComponentWithReset
{
  gameData = input<GameData<BalanceSheetGameData>>();
  isSubmitted = input<boolean>(false);

  readonly courseId = input<string>();
  readonly unitId = input<string>();
  readonly lessonId = input<string>();
  readonly levelId = input<string>();

  private readonly itemPlacements = signal<Record<string, 'assets' | 'liabilities' | 'equity'>>({});
  private readonly submittedState = signal<boolean>(false);
  private readonly draggedItem = signal<BalanceSheetItem | null>(null);

  constructor() {
    super();
    this.initializeSubmissionLoading(this.isSubmitted, (data: BalanceSheetSubmissionData) => {
      if (data?.itemPlacements) {
        this.itemPlacements.set(data.itemPlacements);
      }
    });
  }

  saveUserSubmission(): void {
    this.saveSubmission(() => ({
      itemPlacements: this.itemPlacements(),
    }));
  }

  readonly gameIsSubmitted = this.createGameIsSubmittedComputed(
    this.isSubmitted,
    this.submittedState,
  );

  readonly availableItems = computed(() => {
    const items = this.gameData()?.data?.items || [];
    const placements = this.itemPlacements();

    return items.filter((item) => !placements[item.id]);
  });

  readonly hasValidGameData = computed(() => {
    return !!this.gameData()?.data?.items?.length;
  });

  readonly assetsItems = computed(() => {
    const items = this.gameData()?.data?.items || [];
    const placements = this.itemPlacements();

    return items.filter((item) => placements[item.id] === 'assets');
  });

  readonly liabilitiesItems = computed(() => {
    const items = this.gameData()?.data?.items || [];
    const placements = this.itemPlacements();

    return items.filter((item) => placements[item.id] === 'liabilities');
  });

  readonly equityItems = computed(() => {
    const items = this.gameData()?.data?.items || [];
    const placements = this.itemPlacements();

    return items.filter((item) => placements[item.id] === 'equity');
  });

  readonly totalAssets = computed(() => {
    return this.assetsItems().reduce((total, item) => total + item.amount, 0);
  });

  readonly totalLiabilities = computed(() => {
    return this.liabilitiesItems().reduce((total, item) => total + item.amount, 0);
  });

  readonly totalEquity = computed(() => {
    return this.equityItems().reduce((total, item) => total + item.amount, 0);
  });

  readonly isBalanced = computed(() => {
    return Math.abs(this.totalAssets() - (this.totalLiabilities() + this.totalEquity())) < 0.01;
  });

  readonly allItemsPlaced = computed(() => {
    const totalItems = this.gameData()?.data?.items?.length || 0;
    const placedItems = Object.keys(this.itemPlacements()).length;
    return totalItems > 0 && placedItems === totalItems;
  });

  readonly canSubmit = computed(() => {
    // Only enable submit if all items are placed AND all are in their correct category
    if (!this.allItemsPlaced() || this.gameIsSubmitted()) return false;
    const items = this.gameData()?.data?.items || [];
    const placements = this.itemPlacements();
    // Every item must be placed in its correct category
    return items.every((item) => placements[item.id] === item.correctCategory);
  });

  readonly hasHints = this.createHasHintsComputed(this.gameData);

  resetGame(): void {
    this.submittedState.set(false);
    this.itemPlacements.set({});
    this.draggedItem.set(null);
  }

  // Drag and Drop event handlers
  onDragStart(event: DragEvent, item: BalanceSheetItem): void {
    if (this.gameIsSubmitted()) return;

    this.draggedItem.set(item);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', item.id);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, category: 'assets' | 'liabilities' | 'equity'): void {
    event.preventDefault();

    if (this.gameIsSubmitted()) return;

    const draggedItem = this.draggedItem();
    if (!draggedItem) return;

    const currentPlacements = this.itemPlacements();
    this.itemPlacements.set({
      ...currentPlacements,
      [draggedItem.id]: category,
    });

    this.draggedItem.set(null);
  }

  onDragEnd(): void {
    this.draggedItem.set(null);
  }

  // Remove item from category (return to available items)
  removeItem(itemId: string): void {
    if (this.gameIsSubmitted()) return;

    const currentPlacements = this.itemPlacements();
    const newPlacements = { ...currentPlacements };
    delete newPlacements[itemId];
    this.itemPlacements.set(newPlacements);
  }

  trackByItemId(index: number, item: BalanceSheetItem): string {
    return item.id || index.toString();
  }

  // Make formatCurrency available in template
  formatCurrency = formatCurrency;

  getBalanceDifference(): number {
    return Math.abs(this.totalAssets() - (this.totalLiabilities() + this.totalEquity()));
  }
}
