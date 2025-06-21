import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white border-b border-gray-100 shadow-sm">
      <div class="py-3 px-4 mx-auto max-w-7xl sm:py-4">
        <!-- Single row header -->
        <div class="flex justify-between items-center">
          <!-- Left - Back button with logo -->
          <button
            routerLink="/"
            class="flex items-center space-x-2 text-gray-700 transition-colors cursor-pointer hover:text-gray-900 hover:cursor-pointer"
          >
            <img
              src="/assets/logo-code-money.svg"
              alt="CodeMoney"
              class="flex-shrink-0 w-auto h-8 sm:h-10 lg:h-12 xl:h-14 2xl:h-16"
            />
            <span
              class="text-sm font-medium leading-8 sm:text-base sm:leading-10 lg:text-lg xl:text-xl 2xl:text-2xl lg:leading-12 xl:leading-14 2xl:leading-16"
              >{{ homeButtonText() }}</span
            >
          </button>
          <!-- Center - Title -->
          <div class="flex-1 mx-4 text-center">
            @if (title()) {
              <h1 class="text-lg font-bold text-gray-800 sm:text-xl lg:text-2xl">
                {{ title() }}
              </h1>
            }
          </div>
          <!-- Right - Empty space for balance -->
          <div class="w-16 sm:w-20 lg:w-24"></div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly title = input<string>();
  readonly homeButtonText = input<string>('Home');
}
