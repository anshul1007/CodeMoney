describe('Code Money - Recap Level Functionality', () => {
  beforeEach(() => {
    cy.visit('/courses');
  });

  it('should display the recap level in the lesson', () => {
    // Check if the recap level is visible in the lesson structure
    cy.contains('Level 4: What We Learned').should('be.visible');
    cy.contains('Review and recap everything you learned').should('be.visible');
  });

  it('should have the recap level as the 4th level', () => {
    // Count level cards and verify recap is the 4th
    cy.get('app-level-card').should('have.length.at.least', 4);
    cy.get('app-level-card').eq(3).should('contain', 'Level 4');
    cy.get('app-level-card').eq(3).should('contain', 'What We Learned');
  });

  it('should show recap level with appropriate emoji', () => {
    // Check if the recap level has the correct emoji/icon
    cy.get('app-level-card').eq(3).should('contain', '📝');
  });

  it('should be accessible when trying to navigate to recap level', () => {
    // Try to click on the recap level (might be locked, but should be clickable element)
    cy.get('app-level-card').eq(3).should('be.visible');

    // The element should exist and be styled as a level card
    cy.get('app-level-card').eq(3).should('have.length', 1);
  });

  it('should display appropriate description for recap level', () => {
    // Check if the recap level has educational description
    cy.contains(
      'Review and recap everything you learned about starting your lemonade stand',
    ).should('be.visible');
  });
});
