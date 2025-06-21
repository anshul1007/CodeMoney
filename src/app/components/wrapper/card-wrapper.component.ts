import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-card-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardWrapperComponent {
  variant = input<'default' | 'success' | 'warning' | 'info'>('default');
  padding = input<'sm' | 'md' | 'lg'>('md');
  customClasses = input<string>('');

  cardClasses() {
    const baseClasses = 'backdrop-blur-sm rounded-2xl shadow-xl border';

    const variantClasses = {
      default: 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700',
      success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700',
      warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700',
      info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700',
    };

    const paddingClasses = {
      sm: 'p-3',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
    };

    return [
      baseClasses,
      variantClasses[this.variant()],
      paddingClasses[this.padding()],
      this.customClasses(),
    ]
      .filter(Boolean)
      .join(' ');
  }
}
