import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameItem } from '../../models/course.models';

@Component({
  selector: 'app-selection-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionGameComponent {
  @Input() gameItems: GameItem[] = [];
  @Input() isSubmitted: boolean = false;
  @Output() itemClick = new EventEmitter<GameItem>();

  // Computed property for selected items count
  get selectedItemsCount(): number {
    return this.gameItems.filter((item) => item.isSelected).length;
  }

  onItemClick(item: GameItem): void {
    if (!this.isSubmitted) {
      this.itemClick.emit(item);
    }
  }

  // Track by function for better performance in *ngFor
  trackByItemId(index: number, item: GameItem): string {
    return item.id || index.toString();
  }
}
