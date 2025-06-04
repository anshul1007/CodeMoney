# CodeMoney Tailwind CSS Theme

## Overview
A comprehensive, modern design system for financial education applications, featuring carefully crafted color palettes, typography, and components optimized for learning and engagement.

## Color Palette

### Primary Colors
- **Primary**: Blue tones for main brand elements and primary actions
  - `primary-50` to `primary-950` (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
  - Usage: Main navigation, primary buttons, key interactive elements

### Secondary Colors  
- **Secondary**: Purple/magenta tones for accents and secondary actions
  - `secondary-50` to `secondary-950`
  - Usage: Secondary buttons, highlights, complementary elements

### Semantic Colors
- **Success**: Green tones for positive outcomes, profits, achievements
  - `success-50` to `success-950`
  - Usage: Success messages, profit indicators, completed tasks

- **Warning**: Orange/amber tones for caution and attention
  - `warning-50` to `warning-950` 
  - Usage: Warning messages, savings indicators, important notices

- **Error**: Red tones for errors, losses, mistakes
  - `error-50` to `error-950`
  - Usage: Error messages, loss indicators, validation errors

### Educational Theme Colors
- `education-knowledge`: #6366f1 (Indigo for learning)
- `education-growth`: #059669 (Emerald for progress)
- `education-achievement`: #dc2626 (Red for milestones)
- `education-curiosity`: #7c3aed (Purple for exploration)

### Financial Theme Colors
- `finance-profit`: #10b981 (Green for gains)
- `finance-loss`: #ef4444 (Red for losses)
- `finance-neutral`: #6b7280 (Gray for neutral)
- `finance-investment`: #3b82f6 (Blue for investments)
- `finance-savings`: #f59e0b (Amber for savings)

## Typography

### Font Families
- **Display Font**: `font-display` - Poppins (headings, titles, brand elements)
- **Body Font**: `font-body` - Inter (body text, UI elements)
- **Monospace**: `font-mono` - System monospace (code, numbers, data)

### Font Sizes
Extended scale from `text-xs` (0.75rem) to `text-9xl` (8rem) with proper line heights

## Components

### Buttons
- `.btn-primary` - Primary action button with hover effects
- `.btn-secondary` - Secondary action button 
- Custom hover animations with `translateY` and shadow effects

### Cards
- `.card` - Standard card component with hover effects
- `.card-dark` - Dark theme variant
- Smooth hover animations with lift effect

### Gradients
- `.educational-gradient` - Primary to secondary gradient for educational content
- `.financial-gradient` - Investment to profit gradient for financial content

## Animations

### Available Animations
- `animate-fade-in` - Smooth fade-in effect (0.5s)
- `animate-slide-up` - Slide up from bottom (0.5s)
- `animate-slide-down` - Slide down from top (0.5s)
- `animate-scale-up` - Scale up with fade (0.3s)
- `animate-bounce-gentle` - Gentle bounce effect (2s infinite)
- `animate-pulse-slow` - Slow pulse effect (3s infinite)

### Custom Shadows
- `shadow-glow` - Blue glow effect for special elements
- `shadow-glow-lg` - Larger blue glow effect

## Usage Examples

### Buttons
```html
<button class="btn-primary">Primary Action</button>
<button class="btn-secondary">Secondary Action</button>
<button class="bg-success-600 hover:bg-success-700 text-white px-6 py-3 rounded-lg">Success Button</button>
```

### Cards
```html
<div class="card">
  <h3 class="text-xl font-semibold mb-3">Card Title</h3>
  <p class="text-neutral-600">Card content...</p>
</div>

<div class="card educational-gradient text-white">
  <h3 class="text-xl font-semibold mb-3">Educational Card</h3>
  <p class="text-white/90">Content...</p>
</div>
```

### Financial Data Display
```html
<div class="bg-white rounded-xl p-6 shadow-lg border-l-4 border-finance-profit">
  <p class="text-sm font-medium text-neutral-600">Total Profit</p>
  <p class="text-2xl font-bold text-finance-profit">$1,234.56</p>
</div>
```

### Typography
```html
<h1 class="text-5xl font-display font-bold text-primary-600">Main Heading</h1>
<h2 class="text-3xl font-display font-semibold text-neutral-800">Section Heading</h2>
<p class="text-lg font-body text-neutral-600">Body text content</p>
```

## Best Practices

1. **Color Usage**:
   - Use primary colors for main actions and navigation
   - Use semantic colors (success, warning, error) for appropriate contexts
   - Use financial colors for monetary displays and data

2. **Typography**:
   - Use display font (Poppins) for headings and brand elements
   - Use body font (Inter) for readable content
   - Use monospace font for numerical data and code

3. **Animations**:
   - Apply entrance animations to important elements
   - Use hover effects for interactive elements
   - Keep animations subtle and purposeful

4. **Spacing**:
   - Use consistent spacing scale
   - Maintain proper visual hierarchy
   - Ensure adequate whitespace

## Implementation Notes

- The theme is built for Tailwind CSS 4.x
- All colors follow WCAG accessibility guidelines
- Fonts are loaded from Google Fonts
- Animations use hardware acceleration for smooth performance
- Components are designed for responsive layouts

## File Structure
- `tailwind.config.js` - Main theme configuration
- `src/styles.css` - Global styles and imports
- `src/index.html` - Font imports and base HTML
- `src/app/components/theme-showcase.component.*` - Theme demonstration
