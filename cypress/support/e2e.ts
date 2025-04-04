// This file is processed and loaded automatically before test files.
import './commands'

beforeEach(() => {
  cy.session('loginDevUser', () => cy.loginDevUser(), {
    cacheAcrossSpecs: true,
  })
  // seed db and assert script ran successfully
  cy.exec('npm run db:test').its('code').should('eq', 0)
})
