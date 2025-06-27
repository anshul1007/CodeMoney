// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add(
  'navigateToLevel',
  (courseId: string, unitId: string, lessonId: string, levelId: string) => {
    cy.visit(`/course/${courseId}/unit/${unitId}/lesson/${lessonId}/level/${levelId}`);
    cy.waitForAngular();
  },
);

Cypress.Commands.add('waitForAngular', () => {
  // Wait for Angular to be ready
  cy.window().then((win) => {
    if (win.ng) {
      cy.wrap(win.ng.getComponent).should('exist');
    }
  });

  // Wait for loading indicators to disappear
  cy.get('[data-cy="loading"]', { timeout: 10000 }).should('not.exist');

  // Alternative: wait for specific elements that indicate the page is ready
  cy.get('app-root', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('completeLevel', () => {
  // This will be customized based on the game type
  cy.get('[data-cy="complete-button"]', { timeout: 10000 }).should('be.visible').click();
  cy.get('[data-cy="level-completed"]', { timeout: 10000 }).should('be.visible');
});
