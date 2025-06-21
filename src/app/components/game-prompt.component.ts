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
          class="mb-3 text-xl font-bold leading-tight text-center sm:mb-4 sm:text-2xl text-slate-800 dark:text-slate-100"
        >
          {{ prompt() }}
        </h2>

        <!-- Hints -->
        @if (showHints() && hints() && hints()!.length > 0) {
          <div
            class="p-3 mb-3 bg-blue-50 rounded-r-lg border-l-4 border-blue-400 sm:p-4 sm:mb-4 dark:border-blue-500 dark:bg-blue-900/30"
            role="region"
            aria-label="Game hints"
          >
            <div class="flex items-center mb-2">
              <span class="mr-2 text-lg text-blue-600 dark:text-blue-400">💡</span>
              <span class="text-sm font-medium text-blue-800 sm:text-base dark:text-blue-300"
                >Hints:</span
              >
            </div>
            <ul class="ml-4 space-y-1 text-xs text-blue-700 sm:text-sm dark:text-blue-300">
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
