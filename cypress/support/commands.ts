Cypress.Commands.add('loginDevUser', () => {
  cy.session(
    'login',
    () => {
      cy.visit('/api/auth/signin')
      cy.contains(/dev/i).click()
    },
    {
      validate: () => {
        cy.getCookie('next-auth.session-token').should('exist')
      },
    }
  )
})

declare global {
  namespace Cypress {
    interface Chainable {
      loginDevUser(): Chainable<void>
    }
  }
}

// removes ts errors. See: https://stackoverflow.com/a/70000873
export {}
