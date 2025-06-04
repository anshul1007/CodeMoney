import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { GameService } from '../services/game.service';
import { Level, DragItem, DropZone } from '../models/game.models';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  currentLevel: Level | null = null;
  feedback: string = '';
  showFeedback: boolean = false;
  isCorrect: boolean = false;
  allLevels: Level[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.getCurrentLevel().subscribe(level => {
      this.currentLevel = level;
      this.resetLevel();
    });

    this.gameService.getAllLevels().subscribe(levels => {
      this.allLevels = levels;
    });
  }

  resetLevel() {
    if (this.currentLevel) {
      // Reset all items to not placed
      this.currentLevel.dragItems.forEach(item => item.isPlaced = false);
      // Clear all drop zones
      this.currentLevel.dropZones.forEach(zone => zone.placedItems = []);
    }
    this.feedback = '';
    this.showFeedback = false;
  }
  drop(event: CdkDragDrop<DragItem[]>, dropZone: DropZone) {
    if (event.previousContainer === event.container) {
      // Moving within the same container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const draggedItem = event.previousContainer.data[event.previousIndex];
      
      // Check if this item is accepted in this drop zone
      if (dropZone.acceptedItems.includes(draggedItem.id)) {
        // Check if drop zone has space
        if (!dropZone.maxItems || dropZone.placedItems.length < dropZone.maxItems) {
          // Transfer the item
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          
          // Update the original item status
          if (this.currentLevel) {
            const originalItem = this.currentLevel.dragItems.find(item => item.id === draggedItem.id);
            if (originalItem) {
              originalItem.isPlaced = true;
            }
          }
        }
      }
    }
  }
  returnToInventory(item: DragItem, dropZone: DropZone) {
    const itemIndex = dropZone.placedItems.indexOf(item);
    if (itemIndex > -1) {
      // Remove from drop zone
      dropZone.placedItems.splice(itemIndex, 1);
      
      // Update the original item status
      if (this.currentLevel) {
        const originalItem = this.currentLevel.dragItems.find(di => di.id === item.id);
        if (originalItem) {
          originalItem.isPlaced = false;
        }
      }
    }
  }

  checkAnswer() {
    if (this.currentLevel) {
      const result = this.gameService.checkAnswer(this.currentLevel);
      this.isCorrect = result.isCorrect;
      this.feedback = result.feedback;
      this.showFeedback = true;
    }
  }

  getUnplacedItems(): DragItem[] {
    return this.currentLevel?.dragItems.filter(item => !item.isPlaced) || [];
  }

  getTotalAssets(): number {
    if (!this.currentLevel) return 0;
    return this.currentLevel.dropZones
      .filter(zone => zone.type === 'asset')
      .reduce((sum, zone) => sum + zone.placedItems.reduce((itemSum, item) => itemSum + item.amount, 0), 0);
  }

  getTotalLiabilities(): number {
    if (!this.currentLevel) return 0;
    return this.currentLevel.dropZones
      .filter(zone => zone.type === 'liability')
      .reduce((sum, zone) => sum + zone.placedItems.reduce((itemSum, item) => itemSum + item.amount, 0), 0);
  }

  getTotalEquity(): number {
    if (!this.currentLevel) return 0;
    return this.currentLevel.dropZones
      .filter(zone => zone.type === 'equity')
      .reduce((sum, zone) => sum + zone.placedItems.reduce((itemSum, item) => itemSum + item.amount, 0), 0);
  }

  isBalanceSheetComplete(): boolean {
    return this.currentLevel?.dragItems.every(item => item.isPlaced) || false;
  }

  getAllDropZoneIds(): string[] {
    if (!this.currentLevel) return [];
    return this.currentLevel.dropZones.map(zone => zone.id);
  }

  getDropZonesByType(type: 'asset' | 'liability' | 'equity'): DropZone[] {
    return this.currentLevel?.dropZones.filter(zone => zone.type === type) || [];
  }

  goToNextLevel() {
    this.gameService.goToNextLevel();
  }

  goToLevel(levelId: string) {
    this.gameService.goToLevel(levelId);
  }

  hasNextLevel(): boolean {
    if (!this.currentLevel || !this.allLevels.length) return false;
    const currentIndex = this.allLevels.findIndex(l => l.id === this.currentLevel!.id);
    return currentIndex !== -1 && currentIndex < this.allLevels.length - 1;
  }

  getNextLevel(): Level | null {
    if (!this.currentLevel || !this.allLevels.length) return null;
    const currentIndex = this.allLevels.findIndex(l => l.id === this.currentLevel!.id);
    if (currentIndex !== -1 && currentIndex < this.allLevels.length - 1) {
      return this.allLevels[currentIndex + 1];
    }
    return null;
  }
}
