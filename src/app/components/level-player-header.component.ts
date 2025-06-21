import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-level-player-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="sticky top-0 z-10 p-3 border-b-2 border-amber-300 shadow-lg sm:p-4 dark:border-amber-500 bg-white/90 backdrop-blur-sm dark:bg-slate-800/90"
    >
      <div class="flex flex-wrap gap-2 justify-between items-center mx-auto max-w-7xl">
        <div class="flex flex-1 items-center space-x-3 min-w-0 sm:space-x-4">
          <button
            (click)="backClick.emit()"
            class="flex-shrink-0 p-2 text-xl rounded-lg transition-colors sm:text-2xl text-slate-600 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Go back to course dashboard"
          >
            ← Back
          </button>
          <div class="flex-1 min-w-0">
            <h1 class="text-lg font-bold sm:text-xl text-slate-800 truncate dark:text-slate-100">
              {{ title() }}
            </h1>
            <p class="text-xs sm:text-sm text-slate-600 line-clamp-2 dark:text-slate-400">
              {{ description() }}
            </p>
          </div>
        </div>
        <div
          class="flex flex-shrink-0 items-center space-x-1 sm:space-x-2"
          role="img"
          [attr.aria-label]="'Stars earned: ' + (stars() || 0)"
        >
          @for (star of getStarsArray(stars() || 0); track $index) {
            <span class="text-lg text-amber-400 animate-pulse sm:text-xl">⭐</span>
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
