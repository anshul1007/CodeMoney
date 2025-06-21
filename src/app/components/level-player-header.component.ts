import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-level-player-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      <div class="py-4 px-4 mx-auto max-w-7xl sm:py-5 sm:px-6 xl:py-6 xl:px-8 2xl:py-7 2xl:px-10">
        <div class="flex flex-wrap gap-2 justify-between items-center">
          <div class="flex flex-1 items-center space-x-4 min-w-0 xl:space-x-6">
            <button
              (click)="backClick.emit()"
              class="flex-shrink-0 p-2 text-base font-medium text-gray-700 rounded-lg transition-colors cursor-pointer sm:text-lg xl:text-xl hover:text-gray-900 hover:bg-gray-100 hover:cursor-pointer"
              aria-label="Go back to course dashboard"
            >
              ← Back
            </button>
            <div class="flex-1 min-w-0">
              <h1
                class="text-lg font-bold text-gray-800 sm:text-xl lg:text-2xl xl:text-3xl truncate"
              >
                {{ title() }}
              </h1>
              <p class="text-sm text-gray-600 sm:text-base xl:text-lg line-clamp-2">
                {{ description() }}
              </p>
            </div>
          </div>
          <div
            class="flex flex-shrink-0 items-center space-x-1 sm:space-x-2 xl:space-x-3"
            role="img"
            [attr.aria-label]="'Stars earned: ' + (stars() || 0)"
          >
            @for (star of getStarsArray(stars() || 0); track $index) {
              <span class="text-lg text-yellow-400 animate-pulse sm:text-xl xl:text-2xl">⭐</span>
            }
          </div>
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
