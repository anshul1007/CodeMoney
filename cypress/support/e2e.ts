// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global types
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to navigate to a specific course level
       * @param courseId - The course ID
       * @param unitId - The unit ID
       * @param lessonId - The lesson ID
       * @param levelId - The level ID
       */
      navigateToLevel(
        courseId: string,
        unitId: string,
        lessonId: string,
        levelId: string,
      ): Chainable<Element>;

      /**
       * Custom command to wait for Angular to be ready
       */
      waitForAngular(): Chainable<Element>;

      /**
       * Custom command to complete a game level
       */
      completeLevel(): Chainable<Element>;
    }
  }
}
