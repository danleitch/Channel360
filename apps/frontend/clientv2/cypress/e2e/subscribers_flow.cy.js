describe('Subscriber Feature Tests', () => {
  before(() => {
    // Pre-conditions: Login and verify that the Dashboard is visible
    cy.login('bryn@channelmobile.co.za', 'Something24!');
    cy.contains('Campaigns').should('be.visible');
  });

  it('Displays the General Settings Tabs in the Layout Content Panel', () => {
    // Navigate to the subscriber page before each test
    cy.get('[data-cy="header-nav-menu-icon"]').click();
    cy.get('[data-cy="nav-item-subscribers-button"]').click();
    cy.get('[data-cy="title__subscribers"]').contains('Subscribers');
  });

  it('Allows Adding a New Subscriber Entry', () => {
    // Add a new subscriber and verify the subscriber is added
    cy.get('[data-cy="subscribers__button--edit"]').click();
    cy.get('[data-cy="popup__header-title"]').contains('Create Subscriber');
    cy.get('[data-cy="popup__header-text"]').contains(
      'Fill in the details to create a new subscriber'
    );

    cy.get('[data-cy="popup--textfield__mobileNumber"]').click().type('+27214619988');
    cy.get('[data-cy="popup--textfield__first"]').click().type('CypressTest');
    cy.get('[data-cy="popup--textfield__last"]').click().type('deleteMe');

    cy.get('[data-cy="button__submit"]').click();
    cy.get('[data-cy="title__subscribers"]').contains('Subscribers');
    cy.contains('CypressTest').first().should('be.visible');
  });

  it('Allows Editing a Newly Added Subscriber Entry', () => {
    // Edit the first instance of a newly added Subscriber and verify the Subscriber is edited
    cy.get('[data-cy="subscriber__update+27214619988"]').first().click();
    cy.get('[data-cy="popup__header-title"]').contains('Edit Subscriber');
    cy.get('[data-cy="popup__header-text"]').contains('Change details about this subscriber');
    cy.get('[data-cy="popup--textfield__first"]').click().type(' :EDITED');
    cy.get('[data-cy="button__submit"]').click();
    cy.contains('CypressTest :EDITED').first().should('be.visible');
  });

  // TODO: Subscriber details pattern
  // it('Verifies the Presence of a New Subscriber Details on Entry', () => {
  //   // Check that the Subscriber Details is working
  //   cy.contains('CypressTest :EDITED').first().click();
  //   cy.get('[data-cy="subscriber-details__bulk-remove-button"]', {
  //     timeout: 30000,
  //   }).should('be.visible');
  //   cy.get('[data-cy="title__subscribers"]').should('be.visible');
  //   // Cypress will log out on Href click, so we need to navigate back to the Subscriber page
  //   cy.go('back');
  // });

  it('Allows Deleting a Newly Added Subscriber Entry', () => {
    // Delete the first instance of a newly added Subscriber and verify the Subscriber is deleted
    cy.get('[data-cy="subscriber__delete+27214619988"]').first().click();
    cy.get('[data-cy="popup__header-title"]').contains('Delete Subscriber');
    cy.get('[data-cy="popup__header-text"]').contains(
      'Are you sure you want to delete CypressTest :EDITED deleteMe, +27214619988 ?'
    );

    cy.get('[data-cy="button__delete"]').click();
    cy.get('[data-cy="popup__header-title"]').should('not.exist');
  });

  it('Export button works as expected', () => {
    // Export should download a csv file
    cy.get('[data-cy="subscribers__button--export"]').click();
    cy.get('[data-cy="popup__header-title"]').contains('Export Data');
    cy.get('[data-cy="popup__header-text"]').contains('Choose a date range.');
    cy.readFile('cypress/downloads/exported_file.csv').should('not.exist');
    // Download CSV
    cy.get('[data-cy="button__submit"]').click();
    // Confirm download
    cy.readFile('cypress/downloads/exported_file.csv').should('exist');
    // Confirm popup is closed
    cy.get('[data-cy="popup__header-title"]').should('not.exist');
    // Delete download folder
    cy.task('deleteFolder', Cypress.config('downloadsFolder'));
  });
});
