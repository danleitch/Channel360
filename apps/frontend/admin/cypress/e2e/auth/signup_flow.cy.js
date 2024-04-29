const host = 'http://localhost:3000';

describe('Signup Test', () => {
  it('should SignUp successfully', () => {
    cy.fixture('signup').then(({ firstName, lastName, mobileNumber, password, email }) => {
      cy.log('Intercepting the signup request');
      cy.intercept('POST', 'https://staging.channel360.co.za/webapi/user/signup', {
        statusCode: 200,
        body: {
          message: 'Signup successful',
        },
      }).as('signupRequest');

      cy.log('Intercepting the account verification request');
      cy.intercept('POST', 'https://staging.channel360.co.za/webapi/user/verify-account', {
        statusCode: 200,
        body: {
          message: 'Account verified successfully',
        },
      }).as('verifyAccountRequest');

      cy.log('Visiting the host page');
      cy.visit(host, { timeout: 30000 });

      cy.log('Navigating to the Signup Page');
      cy.get('[data-cy="landing-sign-up-button"]').should('be.visible').click();

      cy.log('Filling in the Signup Form');
      cy.get('[data-cy="signup__first-name-field"]').type(firstName);
      cy.get('[data-cy="signup__last-name-field"]').type(lastName);
      cy.get('[data-cy="signup__email-field"]').type(email);
      cy.get('[data-cy="signup__mobile-number-field"]').type(mobileNumber);
      cy.get('[data-cy="signup__password-field"]').type(password);

      cy.log('Submitting the Signup Form');
      cy.get('[data-cy="signup__submit-button"]').click();

      cy.log('Filling in the OTP for Account Verification');
      // Assuming OTP is 111111 for the purpose of the test
      cy.get('[data-cy="otp-input-0"]').type('1');
      cy.get('[data-cy="otp-input-1"]').type('1');
      cy.get('[data-cy="otp-input-2"]').type('1');
      cy.get('[data-cy="otp-input-3"]').type('1');
      cy.get('[data-cy="otp-input-4"]').type('1');
      cy.get('[data-cy="otp-input-5"]').type('1');

      cy.log('Submitting the OTP');
      cy.get('[data-cy="verify__submit-button"]').click();

      cy.log('Verifying the Signup Completion');
      cy.contains('Sign in to Channel360');
    });
  });
});
