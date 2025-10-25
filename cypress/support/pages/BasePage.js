class BasePage {
  constructor() {
    this.defaultTimeout = 10000
  }

  // Méthodes de base
  click(selector, options = {}) {
    const { timeout = this.defaultTimeout, force = false } = options
    return cy.get(selector, { timeout }).click({ force })
  }

  hover(selector) {
    return cy.get(selector).realHover()
  }

  isVisible(selector, options = {}) {
    const { timeout = this.defaultTimeout } = options
    return cy.get(selector, { timeout }).should('be.visible')
  }

  // Navigation
  navigateTo(path) {
    cy.visit(path)
    cy.wait(1000) // Court délai pour la navigation
  }

  // Attendre le chargement de la page
  waitForPageLoad() {
    cy.get('body', { timeout: 15000 }).should('be.visible')
    cy.window({ timeout: 15000 }).should('have.property', 'document')
    cy.wait(3000)
  }

  // Obtenir le titre de la page
  getTitle() {
    return cy.title()
  }

  // Obtenir l'URL actuelle
  getCurrentUrl() {
    return cy.url()
  }

  // Attendre qu'un élément soit visible
  waitForElement(selector, timeout = 10000) {
    return cy.get(selector, { timeout }).should('be.visible')
  }

  // Cliquer sur un élément avec réessai
  clickWithRetry(selector, { retries = 3, multiple = false, timeout = 10000 } = {}) {
    for (let i = 0; i < retries; i++) {
      try {
        if (multiple) {
          cy.get(selector, { timeout }).click({ multiple: true });
        } else {
          cy.get(selector, { timeout })
            .filter(':visible')
            .first()
            .scrollIntoView()
            .click({ force: true });
        }
        return;
      } catch (error) {
        if (i === retries - 1) {
          cy.screenshot('echec-clic');
          throw error;
        }
        cy.wait(1000);
      }
    }
  }

  // Méthodes de base pour les interactions
  click(selector, options = {}) {
    const { timeout = this.defaultTimeout, force = false, multiple = false } = options
    
    // Attendre que l'élément soit visible
    return cy.waitForElement(selector, timeout)
      .then(($el) => {
        if (multiple) {
          return cy.get(selector).click({ multiple: true, force })
        }
        return $el.click({ force })
      })
  }

  type(selector, text, options = {}) {
    const { timeout = this.defaultTimeout } = options
    return cy.get(selector, { timeout }).clear().type(text)
  }

  isVisible(selector, options = {}) {
    const { timeout = this.defaultTimeout } = options
    return cy.get(selector, { timeout }).should('be.visible')
  }

  isNotVisible(selector, options = {}) {
    const { timeout = this.defaultTimeout } = options
    return cy.get(selector, { timeout }).should('not.be.visible')
  }

  containsText(selector, text, options = {}) {
    const { timeout = this.defaultTimeout } = options
    return cy.get(selector, { timeout }).should('contain', text)
  }

  // Navigation simplifiée
  navigateTo(path = '') {
    cy.visit(path)
    cy.wait(1000) // Court délai pour la navigation
  }

  // Utilitaires
  scrollToElement(selector) {
    return cy.get(selector).scrollIntoView()
  }

  hover(menuSelector) {
    // Cliquer d'abord sur le menu pour l'activer (si nécessaire)
    return cy.get(menuSelector)
      .first()
      .click({force: true})
      .wait(500) // Court délai pour l'animation
  }

  // Effectuer une action de survol
  hoverElement(selector, options = {}) {
    const { timeout = 10000, force = false } = options;
    
    cy.get(selector, { timeout })
      .should('be.visible')
      .then(($el) => {
        $el[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    
    cy.wait(200);
    
    cy.get(selector)
      .should('be.visible')
      .then(($el) => {
        $el.trigger('mouseover');
        $el.trigger('mousemove', { force });
        $el.trigger('focus');
      });
      
    cy.wait(300);
    return this;
  }
}

export default BasePage
