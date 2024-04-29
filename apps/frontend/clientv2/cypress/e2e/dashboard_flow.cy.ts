describe('Dashboard Charts and Cards', () => {
  const charts = [
    'Message Performance',
    'Campaign Performance',
    'Notification Metrics',
    'Subscriber Opt In/Out',
    'Message Status',
    'Notification Categories',
    'Success/Failed',
    'Failed Reasons',
  ];

  const cards = ['Campaigns', 'Templates', 'Subscribers'];

  // Function to verify the presence and visibility of charts
  const verifyCharts = () => {
    // Check the total number of rendered charts
    cy.get('.apexcharts-canvas').should('have.length', 8);
    // Verify each chart by its title
    charts.forEach((title) => {
      cy.contains(title).should('be.visible');
    });
  };

  before(() => {
    cy.login('bryn@channelmobile.co.za', 'Something24!');
  });

  it('verifies the rendering of dashboard components including charts and cards', () => {
    // Verify each card by its title or unique identifier
    cards.forEach((title) => {
      cy.contains(title).should('be.visible');
    });

    // Verify the presence and visibility of charts without date selection
    verifyCharts();
  });
});
