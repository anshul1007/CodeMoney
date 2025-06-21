import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-level-player-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg border-b-2 border-amber-300 dark:border-amber-500 p-3 sm:p-4 sticky top-0 z-10"
    >
      <div
        class="container mx-auto max-w-4xl flex items-center justify-between flex-wrap gap-2"
      >
        <div
          class="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0"
        >
          <button
            (click)="backClick.emit()"
            class="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100 text-xl sm:text-2xl flex-shrink-0 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Go back to course dashboard"
          >
            ← Back
          </button>
          <div class="min-w-0 flex-1">
            <h1
              class="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 truncate"
            >
              {{ title() }}
            </h1>
            <p
              class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2"
            >
              {{ description() }}
            </p>
          </div>
        </div>
        <div
          class="flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
          role="img"
          [attr.aria-label]="'Stars earned: ' + (stars() || 0)"
        >
          @for (star of getStarsArray(stars() || 0); track $index) {
            <span class="text-amber-400 text-lg sm:text-xl animate-pulse"
              >⭐</span
            >
          }
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelPlayerHeaderComponent {
  title = input<string>('');
  description = input<string>('');
  stars = input<number>(0);
  
  backClick = output<void>();

  getStarsArray(stars: number): number[] {
    return Array(stars).fill(0);
  }
}
