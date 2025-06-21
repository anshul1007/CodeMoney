import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardWrapperComponent } from './wrapper/card-wrapper.component';

@Component({
  selector: 'app-scene-description',
  standalone: true,
  imports: [CommonModule, CardWrapperComponent],
  template: `
    @if (scene()) {
      <app-card-wrapper customClasses="text-center">
        <div class="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce-subtle">
          {{ emoji() }}
        </div>
        <p class="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          {{ scene() }}
        </p>
      </app-card-wrapper>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneDescriptionComponent {
  scene = input<string>();
  emoji = input<string>('🏪');
}
