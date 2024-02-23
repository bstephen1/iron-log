// Tried setting this up by setting system date but wasn't having any luck.
// Cypress says to use cy.clock() but using that was preventing anything from rendering.
it(`navigates to today's session from home page`, () => {
  cy.visit('/')
  cy.contains(`Today's Log`).click()

  // cannot import dayjs since this uses an isolated tsconfig I guess
  cy.window().then((win) => {
    const date = new Date(win.Date())
    // Have to manually add leading zeroes. slice(-2) takes the last 2 chars of the string. Date months are zero indexed so have to add one.
    const [year, month, day] = [
      date.getFullYear(),
      ('0' + (date.getMonth() + 1)).slice(-2),
      ('0' + date.getDate()).slice(-2),
    ]

    cy.url().should('include', `${year}-${month}-${day}`)
    // check date picker input
    cy.get('input[placeholder="MM/DD/YYYY"]').should(
      'have.value',
      `${month}/${day}/${year}`,
    )
  })
})

it(`navigates home when clicking navbar logo`, () => {
  cy.visit('/manage')
  cy.get('header').contains('Iron Log').click()

  cy.contains('Welcome').should('be.visible')
})
