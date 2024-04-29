/// <reference types="cypress" />

const host = 'http://localhost:3000';

Cypress.Commands.add('login', (email, password) => {
  cy.visit(host, { timeout: 30000 });
  cy.get('[data-cy="landing-sign-in-button"]').should('be.visible');

  // Form
  cy.contains('Sign In').click();
  cy.get('[data-cy="auth__email-field"]').type(email);
  cy.get('[data-cy="auth__email-password"]').type(password);
  // Submit
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="button_signout"]').click();
});
