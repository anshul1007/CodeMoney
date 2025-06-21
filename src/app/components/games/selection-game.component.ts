import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseGameComponent } from '../../models/base-game.models';
import { GameData, SelectionGameData } from '../../models';

@Component({
  selector: 'app-selection-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionGameComponent
  implements BaseGameComponent<SelectionGameData>
{
  readonly gameData = input<GameData<SelectionGameData>>();
  readonly isSubmitted = input<boolean>(false);
  readonly itemClick = output<any>();
  // BaseGameComponent interface implementation
  readonly onInteraction = this.itemClick;
  readonly onValidationChange = output<any>();

  // Modern computed property for better performance
  readonly selectedItemsCount = computed(
    () =>
      this.gameData()?.data?.items?.filter((item) => item.isSelected).length ||
      0,
  );

  readonly gameItems = computed(() => this.gameData()?.data?.items || []);

  readonly canSubmit = computed(() => (this.selectedItemsCount() || 0) >= 2);

  onItemClick(item: any): void {
    if (!this.isSubmitted()) {
      this.itemClick.emit(item);
    }
  }

  resetGame(): void {
    throw new Error('Method not implemented.');
  }

  trackByItemId = (index: number, item: any): string =>
    item.id || index.toString();
}
