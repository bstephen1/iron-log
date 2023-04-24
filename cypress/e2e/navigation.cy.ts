import dayjs = require('dayjs')

it(`navigates to today's session from home page`, () => {
  cy.visit('/')
  cy.contains(`Today's Log`).click()
  cy.window().then((win) => {
    const date = dayjs(win.Date())
    cy.contains(date.format('YYYY-MM-DD'))
  })
})

it(`navigates home when clicking navbar logo`, () => {
  cy.visit('/manage')
  cy.get('header').contains('Iron Log').click()

  cy.contains('Welcome').should('be.visible')
})
