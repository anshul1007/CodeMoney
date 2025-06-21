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
        <div class="mb-3 text-4xl sm:mb-4 sm:text-5xl md:text-6xl animate-bounce-subtle">
          {{ emoji() }}
        </div>
        <p class="text-base leading-relaxed sm:text-lg text-slate-700 dark:text-slate-300">
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
