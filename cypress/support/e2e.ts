// This file is processed and loaded automatically before test files.
import './commands'

beforeEach(() => {
  cy.session('loginDevUser', () => cy.loginDevUser(), {
    cacheAcrossSpecs: true,
  })
})
