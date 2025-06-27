describe('Code Money - Welcome Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the welcome page correctly', () => {
    // Check if the main heading is visible
    cy.contains('CodeMoney').should('be.visible');
    cy.contains('Learn Financial Literacy Through Interactive Adventures').should('be.visible');

    // Check if the start button is present
    cy.contains('🚀 Start Learning').should('be.visible');

    // Check if the logo is displayed
    cy.get('img[alt="CodeMoney Monkey Mascot"]').should('be.visible');

    // Check if Lucy character section is displayed
    cy.contains('Meet Lucy').should('be.visible');
    cy.contains('Your financial mentor').should('be.visible');
  });

  it('should navigate to courses dashboard when start button is clicked', () => {
    cy.contains('🚀 Start Learning').click();
    cy.url().should('include', '/courses');
  });

  it('should have a reset progress button', () => {
    cy.contains('🔄 Reset Progress').should('be.visible');
  });

  it('should be responsive on mobile devices', () => {
    cy.viewport('iphone-6');
    cy.contains('CodeMoney').should('be.visible');
    cy.contains('🚀 Start Learning').should('be.visible');
    cy.get('img[alt="CodeMoney Monkey Mascot"]').should('be.visible');
  });
});
