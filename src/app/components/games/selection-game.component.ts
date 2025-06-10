import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameItem } from '../../models/game.models';

@Component({
  selector: 'app-selection-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionGameComponent {
  readonly gameItems = input<GameItem[]>([]);
  readonly isSubmitted = input<boolean>(false);
  @Output() itemClick = new EventEmitter<GameItem>();

  // Modern computed property for better performance
  readonly selectedItemsCount = computed(
    () => this.gameItems().filter((item) => item.isSelected).length,
  );

  readonly canSubmit = computed(() => this.selectedItemsCount() >= 2);
  onItemClick(item: GameItem): void {
    if (!this.isSubmitted()) {
      this.itemClick.emit(item);
    }
  }

  // Track by function for optimal *ngFor performance
  trackByItemId = (index: number, item: GameItem): string =>
    item.id || index.toString();
}
