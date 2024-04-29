describe('Groups Feature Tests', () => {
  before(() => {
    // Pre-conditions: Login and verify that the Dashboard is visible
    cy.login('bryn@channelmobile.co.za', 'Something24!');
    cy.contains('Campaigns').should('be.visible');
  });

  it('Displays the General Settings Tabs in the Layout Content Panel', () => {
    // Navigate to the Groups page before each test
    cy.get('[data-cy="header-nav-menu-icon"]').click();
    cy.get('[data-cy="nav-item-groups-button"]').click();
    cy.get('[data-cy="title__groups"]').contains('Groups');
  });

  it('Displays the General Settings Tabs in the Layout Content Panel', () => {
    // Verify that all table headings are visible
    cy.get('[data-cy="table-header__name"]').should('be.visible');
    cy.get('[data-cy="table-header__description"]').should('be.visible');
    cy.get('[data-cy="table-header__member-count"]').should('be.visible');
  });

  it('Allows Adding a New Group Entry', () => {
    // Add a new group and verify the group is added
    cy.get('[data-cy="groups__add-group-button"]').click();
    cy.get('[data-cy="popup__header-title"]').contains('Create Group');
    cy.get('[data-cy="popup__header-text"]').contains('Fill in the details to create a new group');

    cy.get('[data-cy="popup--textfield__name"]').click().type('Cypress test');
    cy.get('[data-cy="popup--textfield__last"]').click().type('delete me');

    cy.get('[data-cy="button__submit"]').click();
    cy.get('[data-cy="title__groups"]').contains('Groups');
    cy.contains('Cypress test').first().should('be.visible');
  });

  it('Allows Editing a Newly Added Group Entry', () => {
    // Edit the first instance of a newly added group and verify the group is edited
    cy.get('[data-cy="groups-table-button-edit-CypressTest"]').first().click();
    cy.get('[data-cy="popup__header-title"]').contains('Edit Group');
    cy.get('[data-cy="popup__header-text"]').contains('Change details about this group');
    cy.get('[data-cy="popup--textfield__name"]').click().type(' :EDITED');
    cy.get('[data-cy="button__submit"]').click();
    cy.contains('Cypress test :EDITED').first().should('be.visible');
  });

  it('Verifies the Presence of a New Group Details on Entry', () => {
    // Check that the Group Details is working
    cy.contains('Cypress test :EDITED').first().click();
    cy.get('[data-cy="groups-details__bulk-remove-button"]').should('be.visible');
    // Cypress will log out on Href click, so we need to navigate back to the Groups page
    cy.go('back');
  });

  it('Allows Deleting a Newly Added Group Entry', () => {
    // Delete the first instance of a newly added group and verify the group is deleted
    cy.get('[data-cy="groups-table-button-delete-CypressTestEDITED"]')
      .first()
      .click();
    cy.get('[data-cy="popup__header-title"]').contains('Delete Group');
    cy.get('[data-cy="popup__header-text"]').contains(
      'Are you sure you want to delete "Cypress test :EDITED" ?'
    );

    cy.get('[data-cy="button__delete"]').click();
    cy.get('[data-cy="popup__header-title"]').should('not.exist');
  });
});
