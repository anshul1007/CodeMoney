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
  BalanceSheetGameData,
  BalanceSheetItem,
  BalanceSheetSubmissionData,
  GameData,
} from '../../models/game.models';

@Component({
  selector: 'app-equity-liabilities-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equity-liabilities-game.component.html',
  styleUrl: './equity-liabilities-game.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquityLiabilitiesGameComponent
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

  readonly itemPlacements = signal<Record<string, 'assets' | 'liabilities' | 'equity'>>({});
  private readonly submittedState = signal<boolean>(false);
  readonly selectedAnswers = signal<Record<string, 'equity' | 'liabilities'>>({});

  constructor() {
    super();
    this.initializeSubmissionLoading(this.isSubmitted, (data: BalanceSheetSubmissionData) => {
      if (data?.itemPlacements) {
        this.itemPlacements.set(data.itemPlacements);
      }
      if (data?.selectedAnswers) {
        this.selectedAnswers.set(data.selectedAnswers);
      }
      // Set submitted state to true when loading submitted data
      this.submittedState.set(true);
    });
  }

  saveUserSubmission(): void {
    this.saveSubmission(() => ({
      itemPlacements: this.itemPlacements(),
      selectedAnswers: this.selectedAnswers(),
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

  readonly totalLiabilities = computed(() => {
    return this.liabilitiesItems().reduce((total, item) => total + item.amount, 0);
  });

  readonly totalEquity = computed(() => {
    return this.equityItems().reduce((total, item) => total + item.amount, 0);
  });

  readonly allItemsPlaced = computed(() => {
    const totalItems = this.gameData()?.data?.items?.length || 0;
    const placedItems = Object.keys(this.itemPlacements()).length;
    return totalItems > 0 && placedItems === totalItems;
  });

  readonly canSubmit = computed(() => {
    // All items must have been answered
    const items = this.gameData()?.data?.items || [];
    const answers = this.selectedAnswers();

    if (items.length === 0 || Object.keys(answers).length !== items.length) return false;
    if (this.gameIsSubmitted()) return false;

    // Check if all answers are correct
    return items.every((item) => answers[item.id] === item.correctCategory);
  });

  readonly allItemsAnswered = computed(() => {
    const items = this.gameData()?.data?.items || [];
    const answers = this.selectedAnswers();
    return items.length > 0 && Object.keys(answers).length === items.length;
  });

  readonly correctAnswersCount = computed(() => {
    const items = this.gameData()?.data?.items || [];
    const answers = this.selectedAnswers();
    return items.filter((item) => answers[item.id] === item.correctCategory).length;
  });

  readonly hasHints = this.createHasHintsComputed(this.gameData);

  resetGame(): void {
    this.submittedState.set(false);
    this.itemPlacements.set({});
    this.selectedAnswers.set({});
  }

  // Submit quiz answers
  submitQuiz(): void {
    if (!this.allItemsAnswered() || this.gameIsSubmitted()) return;

    // Mark as submitted
    this.submittedState.set(true);

    // Save the submission
    this.saveUserSubmission();
  }

  // Answer selection methods
  selectAnswer(itemId: string, answer: 'equity' | 'liabilities'): void {
    if (this.gameIsSubmitted()) return;

    // Update selected answer
    const currentAnswers = this.selectedAnswers();
    this.selectedAnswers.set({
      ...currentAnswers,
      [itemId]: answer,
    });
  }

  clearAnswer(itemId: string): void {
    if (this.gameIsSubmitted()) return;

    // Remove the answer
    const currentAnswers = this.selectedAnswers();
    const newAnswers = { ...currentAnswers };
    delete newAnswers[itemId];
    this.selectedAnswers.set(newAnswers);
  }

  getSelectedAnswer(itemId: string): 'equity' | 'liabilities' | null {
    return this.selectedAnswers()[itemId] || null;
  }

  isAnswerCorrect(itemId: string): boolean {
    const item = this.gameData()?.data?.items?.find((i) => i.id === itemId);
    const selectedAnswer = this.selectedAnswers()[itemId];
    return item && selectedAnswer ? selectedAnswer === item.correctCategory : false;
  }

  readonly getAnsweredCount = computed(() => {
    return Object.keys(this.selectedAnswers()).length;
  });

  readonly getTotalItemsCount = computed(() => {
    return this.gameData()?.data?.items?.length || 0;
  });

  trackByItemId(index: number, item: BalanceSheetItem): string {
    return item.id || index.toString();
  }
}
