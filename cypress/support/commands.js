// ***********************************************
// Commandes personnalisées Cypress
// ***********************************************

/**
 * Attend qu'un élément soit visible avec un timeout dynamique
 * @param {string} selector - Sélecteur CSS de l'élément à attendre
 * @param {number} timeout - Timeout maximum en ms (défaut: 20000)
 */
Cypress.Commands.add('waitForElement', (selector, timeout = 20000) => {
  const startTime = Date.now()
  const checkElement = () => {
    const elapsed = Date.now() - startTime
    
    return cy.get('body').then(($body) => {
      const elements = $body.find(selector)
      
      if (elements.length > 0 && elements.first().is(':visible')) {
        return cy.wrap(elements.first())
      }
      
      if (elapsed >= timeout) {
        throw new Error(`L'élément ${selector} n'est pas visible après ${timeout}ms`)
      }
      
      // Attendre un peu avant de réessayer
      return cy.wait(500, { log: false }).then(checkElement)
    })
  }
  
  return checkElement()
})

// Custom command for API testing
Cypress.Commands.add('apiGet', (url) => {
  return cy.request({
    method: 'GET',
    url: url,
    failOnStatusCode: false
  })
})

Cypress.Commands.add('apiPost', (url, body) => {
  return cy.request({
    method: 'POST',
    url: url,
    body: body,
    failOnStatusCode: false
  })
})

// Custom command for database operations (if needed)
Cypress.Commands.add('seedDatabase', () => {
  // Implementation for seeding test data
  cy.log('Seeding database with test data')
})

Cypress.Commands.add('cleanDatabase', () => {
  // Implementation for cleaning test data
  cy.log('Cleaning database after test')
})
