export const GAME_CONFIG = {
  SELECTION_GAME: {
    MIN_REQUIRED_SELECTIONS: 2,
  },
  CURRENCY: {
    SYMBOL: '₹',
    LOCALE: 'en-IN',
    CODE: 'INR',
  },
} as const;

// Helper function to format currency consistently across the app
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(GAME_CONFIG.CURRENCY.LOCALE, {
    style: 'currency',
    currency: GAME_CONFIG.CURRENCY.CODE,
  }).format(amount);
}
