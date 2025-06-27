describe('Code Money - Courses Dashboard', () => {
  beforeEach(() => {
    cy.visit('/courses');
  });

  it('should display the courses dashboard', () => {
    // Check if the header is displayed
    cy.contains('Course Dashboard').should('be.visible');

    // Check if courses are displayed
    cy.get('app-course-card').should('have.length.at.least', 1);

    // Check if the Money Mission course is displayed
    cy.contains('Money Mission: Build Your Own Business!').should('be.visible');
  });

  it('should display course units and lessons', () => {
    // Check if units are displayed
    cy.get('app-unit-card').should('be.visible');

    // Check if the lemonade stand unit is displayed
    cy.contains('Unit 1: Start Your Lemonade Stand!').should('be.visible');

    // Check if lessons are displayed within the unit
    cy.get('app-lesson-card').should('be.visible');
    cy.contains('Lesson 1: What Do You Need to Start?').should('be.visible');
  });

  it('should display level cards within lessons', () => {
    // Check if level cards are displayed
    cy.get('app-level-card').should('have.length.at.least', 4);

    // Check specific levels
    cy.contains('Level 1: Choose What You Need').should('be.visible');
    cy.contains('Level 2: How Much Does It Cost?').should('be.visible');
    cy.contains('Level 3: Where Will the Money Come From?').should('be.visible');
    cy.contains('Level 4: What We Learned').should('be.visible');
  });

  it('should show course structure correctly', () => {
    // First level should be unlocked
    cy.get('app-level-card').first().should('be.visible');

    // Course card should be visible
    cy.get('app-course-card').should('be.visible');
  });

  it('should be responsive on different screen sizes', () => {
    // Test tablet view
    cy.viewport('ipad-2');
    cy.get('app-course-card').should('be.visible');

    // Test mobile view
    cy.viewport('iphone-6');
    cy.get('app-course-card').should('be.visible');
    cy.get('app-level-card').should('be.visible');
  });
});
