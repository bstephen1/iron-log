import { defineConfig } from 'cypress'

// Opening this file makes vscode detect a bunch of conflicts with jest types.
// Could not find a way to stop this with tsconfig, but changing it from .ts to .js
// seems to work.

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // adds a button to cypress ui to let you run mulitple specs instead of just one.
    // Cypress marked this experimental because they had concerns it may have been making tests flaky.
    // See: https://github.com/cypress-io/cypress/discussions/21628
    experimentalRunAllSpecs: true,
    baseUrl: 'http://localhost:7357',
    // todo: look into this -- allows generating tests from recording interactions in the browser
    // see: https://docs.cypress.io/app/guides/cypress-studio
    // experimentalStudio: true,
  },
})
