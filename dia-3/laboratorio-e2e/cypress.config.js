import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 800,

    // Cuánto reintenta Cypress antes de rendirse. Súbelo si tu app
    // es lenta; NO lo uses como parche para tests mal escritos.
    defaultCommandTimeout: 4000,

    video: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
