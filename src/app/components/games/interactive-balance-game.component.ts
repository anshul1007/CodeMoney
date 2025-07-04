import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import {
  BaseGameComponent,
  BaseGameMixin,
  GameComponentWithHints,
  GameComponentWithReset,
  GameComponentWithSave,
} from '../../models/base-game.models';
import {
  GameData,
  InteractiveBalanceGameData,
  InteractiveBalanceSubmissionData,
  PurchaseableItem,
} from '../../models/game.models';

@Component({
  selector: 'app-interactive-balance-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interactive-balance-game.component.html',
  styleUrl: './interactive-balance-game.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractiveBalanceGameComponent
  extends BaseGameMixin<InteractiveBalanceGameData, InteractiveBalanceSubmissionData>
  implements
    BaseGameComponent<InteractiveBalanceGameData>,
    GameComponentWithHints,
    GameComponentWithSave,
    GameComponentWithReset
{
  gameData = input<GameData<InteractiveBalanceGameData>>();
  isSubmitted = input<boolean>(false);

  readonly courseId = input<string>();
  readonly unitId = input<string>();
  readonly lessonId = input<string>();
  readonly levelId = input<string>();

  // Game state
  readonly purchasedItems = signal<PurchaseableItem[]>([]);
  readonly availableCash = signal<number>(0);
  readonly submittedState = signal<boolean>(false);

  constructor() {
    super();
    this.initializeSubmissionLoading(this.isSubmitted, (data: InteractiveBalanceSubmissionData) => {
      if (data?.purchasedItems) {
        this.purchasedItems.set(data.purchasedItems);
      }
      if (data?.availableCash !== undefined) {
        this.availableCash.set(data.availableCash);
      }
    });

    // Initialize available cash when component loads
    setTimeout(() => {
      if (this.availableCash() === 0) {
        this.availableCash.set(this.getStartingCash());
      }
    }, 0);
  }

  saveUserSubmission(): void {
    this.saveSubmission(() => ({
      purchasedItems: this.purchasedItems(),
      availableCash: this.availableCash(),
    }));
  }

  readonly gameIsSubmitted = this.createGameIsSubmittedComputed(
    this.isSubmitted,
    this.submittedState,
  );

  readonly hasValidGameData = computed(() => {
    return !!this.gameData()?.data?.availableItems?.length;
  });

  readonly startingEquity = computed(() => {
    return this.gameData()?.data?.startingEquity || 0;
  });

  readonly startingLoan = computed(() => {
    return this.gameData()?.data?.startingLoan || 0;
  });

  readonly availableItems = computed(() => {
    const items = this.gameData()?.data?.availableItems || [];
    const purchasedItemIds = this.purchasedItems().map((item) => item.id);
    return items.filter((item) => !purchasedItemIds.includes(item.id));
  });

  readonly totalAssets = computed(() => {
    const cash = this.availableCash();
    const itemsValue = this.purchasedItems().reduce((total, item) => total + item.amount, 0);
    return cash + itemsValue;
  });

  readonly totalLiabilities = computed(() => {
    return this.startingLoan();
  });

  readonly totalEquity = computed(() => {
    return this.startingEquity();
  });

  readonly isBalanced = computed(() => {
    return Math.abs(this.totalAssets() - (this.totalLiabilities() + this.totalEquity())) < 0.01;
  });

  readonly canPurchaseItem = computed(() => {
    return (item: PurchaseableItem) => {
      return this.availableCash() >= item.amount && !this.gameIsSubmitted();
    };
  });

  readonly canSubmit = computed(() => {
    // Can submit when they've made at least one purchase and balance sheet is balanced
    return this.purchasedItems().length > 0 && this.isBalanced() && !this.gameIsSubmitted();
  });

  readonly hasHints = this.createHasHintsComputed(this.gameData);

  private getStartingCash(): number {
    const equity = this.gameData()?.data?.startingEquity || 0;
    const loan = this.gameData()?.data?.startingLoan || 0;
    return equity + loan;
  }

  resetGame(): void {
    this.submittedState.set(false);
    this.purchasedItems.set([]);
    this.availableCash.set(this.getStartingCash());
  }

  purchaseItem(item: PurchaseableItem): void {
    if (!this.canPurchaseItem()(item)) return;

    // Add item to purchased items
    this.purchasedItems.update((items) => [...items, item]);

    // Deduct from available cash
    this.availableCash.update((cash) => cash - item.amount);

    // Save the state
    this.saveUserSubmission();
  }

  sellItem(item: PurchaseableItem): void {
    if (this.gameIsSubmitted()) return;

    // Remove item from purchased items
    this.purchasedItems.update((items) => items.filter((i) => i.id !== item.id));

    // Add back to available cash
    this.availableCash.update((cash) => cash + item.amount);

    // Save the state
    this.saveUserSubmission();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  trackByItemId(index: number, item: PurchaseableItem): string {
    return item.id || index.toString();
  }
}
