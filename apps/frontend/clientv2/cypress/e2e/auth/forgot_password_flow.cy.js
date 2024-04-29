const host = 'http://localhost:3000';

describe('Password Reset Process', () => {
  const testEmail = 'test@test.co.za';
  const newPassword = 'Something24!';
  const resetCode = '123456';

  it('completes the entire password reset flow', () => {
    cy.intercept('POST', 'https://staging.channel360.co.za/webapi/user/reset-password', {
      statusCode: 200,
      body: {
        message: 'Password reset successful',
      },
    }).as('resetPasswordRequest');
    cy.intercept('POST', 'https://staging.channel360.co.za/webapi/user/forgot-password', {
      statusCode: 200,
      body: {
        message: 'Password reset email sent',
      },
    }).as('forgotPasswordRequest');
    
    cy.log('Visiting the host page');
    cy.visit(host, { timeout: 30000 });

    cy.log('Navigating to Forgot Password');
    cy.get('[data-cy="landing-sign-in-button"]').click();
    cy.get('[data-cy="auth__forgot-link"]').click();

    cy.log('Submitting email for password reset');
    cy.get('[data-cy="forgot-password__email-field"]').type(testEmail);
    cy.get('[data-cy="forgot-password__submit-button"]').click();

    cy.log('Entering Reset Code and New Password');
    cy.get('[data-cy="reset-password__code-field"]').type(resetCode);
    cy.get('[data-cy="reset-password__new-password-field"]').type(newPassword);
    cy.get('[data-cy="reset-password__confirm-password-field"]').type(newPassword);
    cy.get('[data-cy="reset-password__submit-button"]').click();

    cy.contains('Sign in to Channel360');
  });
});
