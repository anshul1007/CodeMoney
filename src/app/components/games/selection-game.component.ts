import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
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
  readonly itemClick = output<GameItem>();

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

  trackByItemId = (index: number, item: GameItem): string =>
    item.id || index.toString();
}
