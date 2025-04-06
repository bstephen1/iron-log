it(`adds an exercise`, () => {
  cy.visit('/manage?tab=exercises')

  // confirm loading is done
  const exerciseInput = cy.get('label').contains('Exercise')
  exerciseInput.click()
  cy.contains('No options').should('be.visible')

  // add an exercise
  exerciseInput.type('squats')
  cy.contains(`Add "squats"`).click()

  // edit fields

  cy.get('label').contains('Name').type('{home}SSB ')
  cy.get('button[data-testid="submit button"]').click()
  // name change should update name/exercise inputs and url
  cy.get('input[value="SSB squats"]').should('have.length', 2)
  cy.url().should('include', 'SSB+squats')

  cy.contains('Active').click()
  cy.contains('Archived').click()

  // label has pointer events "none", probably because it isn't in shrink mode
  // so we can't directly click it
  cy.get('label')
    .contains('Equipment weight')
    .closest('div')
    .click()
    .type('7.5')

  cy.contains('Bodyweight').click()

  cy.get('textarea[placeholder="Add note"]').type('my note')
  cy.get('button[aria-label="add note"]').click()

  // confirm edits persist on reload

  cy.reload()
  cy.get('input[value="SSB squats"]')
    .should('have.length', 2)
    .should('be.visible')
  cy.contains('Archived').should('be.visible')
  cy.get('input[value="7.5"]').should('be.visible')
  cy.contains('Bodyweight')
    .closest('label')
    .within(() => {
      cy.get('input[type="checkbox"]').should('be.checked')
    })
  cy.contains('my note').should('be.visible')
})
