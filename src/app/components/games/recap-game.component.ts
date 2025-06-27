import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import {
  BaseGameComponent,
  BaseGameMixin,
  GameComponentWithHints,
  GameComponentWithReset,
  GameComponentWithSave,
} from '../../models/base-game.models';
import { GameData, RecapGameData, RecapNote, RecapSubmissionData } from '../../models/game.models';

@Component({
  selector: 'app-recap-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recap-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecapGameComponent
  extends BaseGameMixin<RecapGameData, RecapSubmissionData>
  implements
    BaseGameComponent<RecapGameData>,
    GameComponentWithHints,
    GameComponentWithSave,
    GameComponentWithReset
{
  gameData = input<GameData<RecapGameData>>();
  isSubmitted = input<boolean>(false);

  readonly courseId = input<string>();
  readonly unitId = input<string>();
  readonly lessonId = input<string>();
  readonly levelId = input<string>();

  private readonly readStartTime = signal<number>(Date.now());
  private readonly isCompleted = signal<boolean>(false);
  private readonly submittedState = signal<boolean>(false);

  constructor() {
    super();
    this.initializeSubmissionLoading(this.isSubmitted, (data: RecapSubmissionData) => {
      if (data?.completed) {
        this.isCompleted.set(true);
      }
    });
  }

  saveUserSubmission(): void {
    const readTime = Date.now() - this.readStartTime();
    this.saveSubmission(() => ({
      completed: true,
      readTime: Math.round(readTime / 1000), // Convert to seconds
    }));
  }

  readonly gameIsSubmitted = this.createGameIsSubmittedComputed(
    this.isSubmitted,
    this.submittedState,
  );

  readonly recapNotes = computed(() => {
    return this.gameData()?.data?.notes || [];
  });

  readonly keyConceptNotes = computed(() => {
    return this.recapNotes().filter((note) => note.type === 'key-concept');
  });

  readonly tipNotes = computed(() => {
    return this.recapNotes().filter((note) => note.type === 'tip');
  });

  readonly summaryNotes = computed(() => {
    return this.recapNotes().filter((note) => note.type === 'summary');
  });

  readonly reminderNotes = computed(() => {
    return this.recapNotes().filter((note) => note.type === 'reminder');
  });

  readonly nextSteps = computed(() => {
    return this.gameData()?.data?.nextSteps || [];
  });

  readonly canSubmit = computed(() => {
    // For recap, user can submit once they've had time to read (auto-submit after viewing)
    return !this.gameIsSubmitted();
  });

  readonly hasHints = this.createHasHintsComputed(this.gameData);

  resetGame(): void {
    this.submittedState.set(false);
    this.isCompleted.set(false);
    this.readStartTime.set(Date.now());
  }

  markAsComplete(): void {
    if (!this.gameIsSubmitted()) {
      this.isCompleted.set(true);
      this.submittedState.set(true);
      this.saveUserSubmission();
    }
  }

  getNoteIcon(note: RecapNote): string {
    if (note.icon) return note.icon;

    switch (note.type) {
      case 'key-concept':
        return '🎯';
      case 'tip':
        return '💡';
      case 'summary':
        return '📋';
      case 'reminder':
        return '🔔';
      default:
        return '📝';
    }
  }

  getNoteTypeLabel(type: RecapNote['type']): string {
    switch (type) {
      case 'key-concept':
        return 'Key Concept';
      case 'tip':
        return 'Pro Tip';
      case 'summary':
        return 'Summary';
      case 'reminder':
        return 'Remember';
      default:
        return 'Note';
    }
  }

  getNoteTypeColor(type: RecapNote['type']): string {
    switch (type) {
      case 'key-concept':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'tip':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'summary':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'reminder':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  }

  trackByNoteId(index: number, note: RecapNote): string {
    return note.id || index.toString();
  }
}
