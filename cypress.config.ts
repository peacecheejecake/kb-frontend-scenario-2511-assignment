import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://kb-frontend-scenario-2511-assignmen-three.vercel.app'
  }
})
