// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in to the application.
     * @example cy.login('email@example.com', 'password')
     */
    login(email: string, password: string): Chainable<void>;

    /**
     * Custom command to log out from the application.
     * @example cy.logout()
     */
    logout(): Chainable<void>;
  }
}
