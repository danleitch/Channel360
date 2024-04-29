describe('Login Test', () => {
  it('should log in successfully', () => {
    cy.fixture('user').then(({ email, password }) => {
      cy.login(email, password);
      cy.contains('Campaigns', { timeout: 30000 }).should('be.visible');
    });
  });
});
