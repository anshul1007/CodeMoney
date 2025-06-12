import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-theme-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './theme-showcase.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeShowcaseComponent {
  colorPalettes = [
    {
      name: 'Primary',
      colors: [
        { name: '50', value: '#f0f9ff' },
        { name: '100', value: '#e0f2fe' },
        { name: '200', value: '#bae6fd' },
        { name: '300', value: '#7dd3fc' },
        { name: '400', value: '#38bdf8' },
        { name: '500', value: '#0ea5e9' },
        { name: '600', value: '#0284c7' },
        { name: '700', value: '#0369a1' },
        { name: '800', value: '#075985' },
        { name: '900', value: '#0c4a6e' },
      ],
    },
    {
      name: 'Secondary',
      colors: [
        { name: '50', value: '#fdf4ff' },
        { name: '100', value: '#fae8ff' },
        { name: '200', value: '#f5d0fe' },
        { name: '300', value: '#f0abfc' },
        { name: '400', value: '#e879f9' },
        { name: '500', value: '#d946ef' },
        { name: '600', value: '#c026d3' },
        { name: '700', value: '#a21caf' },
        { name: '800', value: '#86198f' },
        { name: '900', value: '#701a75' },
      ],
    },
    {
      name: 'Success',
      colors: [
        { name: '50', value: '#f0fdf4' },
        { name: '100', value: '#dcfce7' },
        { name: '200', value: '#bbf7d0' },
        { name: '300', value: '#86efac' },
        { name: '400', value: '#4ade80' },
        { name: '500', value: '#22c55e' },
        { name: '600', value: '#16a34a' },
        { name: '700', value: '#15803d' },
        { name: '800', value: '#166534' },
        { name: '900', value: '#14532d' },
      ],
    },
    {
      name: 'Warning',
      colors: [
        { name: '50', value: '#fffbeb' },
        { name: '100', value: '#fef3c7' },
        { name: '200', value: '#fde68a' },
        { name: '300', value: '#fcd34d' },
        { name: '400', value: '#fbbf24' },
        { name: '500', value: '#f59e0b' },
        { name: '600', value: '#d97706' },
        { name: '700', value: '#b45309' },
        { name: '800', value: '#92400e' },
        { name: '900', value: '#78350f' },
      ],
    },
    {
      name: 'Error',
      colors: [
        { name: '50', value: '#fef2f2' },
        { name: '100', value: '#fee2e2' },
        { name: '200', value: '#fecaca' },
        { name: '300', value: '#fca5a5' },
        { name: '400', value: '#f87171' },
        { name: '500', value: '#ef4444' },
        { name: '600', value: '#dc2626' },
        { name: '700', value: '#b91c1c' },
        { name: '800', value: '#991b1b' },
        { name: '900', value: '#7f1d1d' },
      ],
    },
  ];
  educationColors = [
    { name: 'Knowledge', value: '#6366f1' },
    { name: 'Growth', value: '#059669' },
    { name: 'Achievement', value: '#dc2626' },
    { name: 'Curiosity', value: '#7c3aed' },
  ];

  financeColors = [
    { name: 'Profit', value: '#10b981' },
    { name: 'Loss', value: '#ef4444' },
    { name: 'Neutral', value: '#6b7280' },
    { name: 'Investment', value: '#3b82f6' },
    { name: 'Savings', value: '#f59e0b' },
  ];
}
