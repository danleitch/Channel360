describe('Campaign Feature Tests', () => {
  before(() => {
    // Pre-conditions: Login and verify that the Dashboard is visible
    cy.login('bryn@channelmobile.co.za', 'Something24!');
    cy.contains('Campaigns').should('be.visible');
  });

  it('Displays the General Settings Tabs in the Layout Content Panel', () => {
    // Navigate to the Campaign page before each test
    cy.get('[data-cy="header-nav-menu-icon"]').click();
    cy.get('[data-cy="nav-item-campaigns-button"]').click();
    cy.get('[data-cy="nav-item-list-button"]').click();
    cy.get('[data-cy="title__campaigns"]').contains('Campaigns');
  });

  it('Displays the General Table Layout', () => {
    // Verify that all table headings are visible
    cy.get('[data-cy="table-header__reference"]').should('be.visible');
    cy.get('[data-cy="table-header__template-name"]').should('be.visible');
    cy.get('[data-cy="table-header__group-name"]').should('be.visible');
    cy.get('[data-cy="table-header__scheduled"]').should('be.visible');
  });

  it('Allows Adding a New Campaign Entry', () => {
    // Add a new Campaign and verify the Campaign is added
    cy.get('[data-cy="campaigns__button_add"]').click();
    cy.get('[data-cy="popup__header-title"]').contains('Create Campaign');
    cy.get('[data-cy="popup__header-text"]').contains(
      'Fill in the details to create a new campaign'
    );

    cy.get('[data-cy="campaign-create__text_reference"]').click().type('Cypress test: Delete me');

    cy.get('[data-cy="campaign-create__selector_template"]').click();
    cy.get('[data-cy="selector_cypress_image_tags_call_to_action"]').click();

    cy.get('[data-cy="campaign-create__selector_groups"]').click();
    cy.get('[data-cy="selector_Test Group"]').click();

    cy.wait(1000);
    cy.get('[data-cy="campaign-create__button_submit"]').click();
    cy.get('[data-cy="title__campaigns"]').contains('Campaigns');
  });

  it('Navigating to Campaign details', () => {
    cy.contains('Cypress test: Delete me').first().click();
    cy.get('[data-cy="campaign-tab-details"]').should('be.visible');
    cy.get('[data-cy="campaign-tab-responses"]').click();
  });

  it('Allows Deleting a Newly Added Campaign Entry', () => {
    // Delete the first instance of a newly added Campaign and verify the Campaign is deleted
    cy.go('back');
    cy.get('[data-cy="delete_groups--Cypress test: Delete me"]').first().click();
    cy.get('[data-cy="popup__header-title"]').contains('Delete Group');
    cy.get('[data-cy="popup__header-text"]').contains('Are you sure you want to delete ?');

    cy.get('[data-cy="button__delete"]').click();
    cy.get('[data-cy="popup__header-title"]').should('not.exist');
  });
});
