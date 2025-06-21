import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardWrapperComponent } from './wrapper/card-wrapper.component';

@Component({
  selector: 'app-game-prompt',
  standalone: true,
  imports: [CommonModule, CardWrapperComponent],
  template: `
    @if (prompt()) {
      <app-card-wrapper>
        <h2
          class="text-xl sm:text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-3 sm:mb-4 leading-tight"
        >
          {{ prompt() }}
        </h2>

        <!-- Hints -->
        @if (showHints() && hints() && hints()!.length > 0) {
          <div
            class="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-500 p-3 sm:p-4 mb-3 sm:mb-4 rounded-r-lg"
            role="region"
            aria-label="Game hints"
          >
            <div class="flex items-center mb-2">
              <span class="text-blue-600 dark:text-blue-400 mr-2 text-lg">💡</span>
              <span class="font-medium text-blue-800 dark:text-blue-300 text-sm sm:text-base"
                >Hints:</span
              >
            </div>
            <ul class="text-blue-700 dark:text-blue-300 text-xs sm:text-sm space-y-1 ml-4">
              @for (hint of hints()!; track $index) {
                <li class="list-disc">
                  {{ hint }}
                </li>
              }
            </ul>
          </div>
        }
      </app-card-wrapper>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePromptComponent {
  prompt = input<string>();
  hints = input<string[]>();
  showHints = input<boolean>(false);
}
