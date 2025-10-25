// ***********************************************************
// Configuration globale Cypress
// ***********************************************************

// Allure plugin (required for writing allure-results)
import '@shelex/cypress-allure-plugin'

// Importer les commandes personnalisées
import './commands'

// Configuration des erreurs non gérées
Cypress.on('uncaught:exception', (err) => {
  // Liste des erreurs à ignorer
  const ignoredErrors = [
    'cross-origin',
    'toJSON',
    'youtube',
    'SecurityError',
    'Axeptio SDK',
    'hotjar',
    'gtm',
    'google_tag_manager',
    'fbq',
    'facebook',
    'twitter',
    'linkedin',
    'analytics',
    'tracking',
    'marketing',
    'adblock',
    'advertising'
  ]
  
  // Vérifier si l'erreur doit être ignorée
  const shouldIgnoreError = ignoredErrors.some(error => 
    err.message && err.message.includes(error)
  )
  
  // Si l'erreur doit être ignorée, retourner false pour ne pas échouer le test
  if (shouldIgnoreError) {
    console.log('Erreur ignorée :', err.message)
    return false
  }
  
  // Pour toutes les autres erreurs, retourner true pour échouer le test
  return true
})

// Désactiver les logs de requêtes réseau dans la console
const origLog = Cypress.log
Cypress.log = function(opts, ...other) {
  if (opts.displayName === 'xhr' || opts.name === 'xhr') {
    return
  }
  return origLog(opts, ...other)
}

// Ignorer les erreurs de chargement de ressources
Cypress.on('window:before:load', (win) => {
  // Ignorer les erreurs de chargement de scripts externes
  const originalOnError = win.onerror
  win.onerror = function(msg, url, line, col, error) {
    const ignoredScripts = [
      'axeptio',
      'hotjar',
      'google-analytics',
      'googletagmanager',
      'facebook',
      'twitter',
      'linkedin',
      'analytics',
      'tracking',
      'marketing',
      'adblock',
      'advertising',
      'gtm',
      'tagmanager'
    ]
    
    if (ignoredScripts.some(script => msg && msg.includes(script))) {
      console.log('Script ignoré :', msg)
      return true
    }
    
    if (originalOnError) {
      return originalOnError.apply(this, arguments)
    }
    
    return false
  }
})

Cypress.Commands.add('takeScreenshot', (name) => {
  cy.screenshot(name, { capture: 'fullPage' })
})

// Custom assertions
Cypress.Commands.add('shouldBeVisible', (selector) => {
  cy.get(selector).should('be.visible')
})

Cypress.Commands.add('shouldContainText', (selector, text) => {
  cy.get(selector).should('contain.text', text)
})

// API helpers
Cypress.Commands.add('apiRequest', (method, url, body = null) => {
  return cy.request({
    method: method,
    url: url,
    body: body,
    failOnStatusCode: false
  })
})