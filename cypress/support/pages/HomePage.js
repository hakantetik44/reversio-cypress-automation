import BasePage from './BasePage.js'
import HomePageLocators from '../locators/HomePageLocators.js'

class HomePage extends BasePage {
  constructor() {
    super()
    this.locators = new HomePageLocators()
  }

  /**
   * Navigate to homepage
   */
  visitHomePage() {
    this.navigateTo('/')
  }

  /**
   * Click on login button
   */
  clickLoginButton() {
    this.clickWithRetry(this.locators.loginButton)
  }

  /**
   * Click on signup button
   */
  clickSignupButton() {
    this.clickWithRetry(this.locators.signupButton)
  }

  /**
   * Click on CTA button
   */
  clickCtaButton() {
    this.clickWithRetry(this.locators.ctaButton)
  }

  /**
   * Verify homepage elements are visible
   */
  verifyHomepageElements() {
    this.isElementVisible(this.locators.logo)
    this.isElementVisible(this.locators.heroTitle)
    this.isElementVisible(this.locators.heroSubtitle)
    this.isElementVisible(this.locators.loginButton)
    this.isElementVisible(this.locators.signupButton)
  }

  /**
   * Verify hero section content
   */
  verifyHeroSection() {
    this.isElementVisible(this.locators.heroTitle)
    this.isElementVisible(this.locators.heroSubtitle)
    this.isElementVisible(this.locators.ctaButton)
  }

  /**
   * Verify features section
   */
  verifyFeaturesSection() {
    this.isElementVisible(this.locators.featuresSection)
    cy.get(this.locators.featureCards).should('have.length.at.least', 1)
  }

  /**
   * Verify about section
   */
  verifyAboutSection() {
    this.isElementVisible(this.locators.aboutSection)
    this.isElementVisible(this.locators.aboutTitle)
    this.isElementVisible(this.locators.aboutDescription)
  }

  /**
   * Fill contact form
   * @param {Object} formData - Form data object
   */
  fillContactForm(formData) {
    if (formData.name) {
      this.typeText(this.locators.contactName, formData.name)
    }
    if (formData.email) {
      this.typeText(this.locators.contactEmail, formData.email)
    }
    if (formData.message) {
      this.typeText(this.locators.contactMessage, formData.message)
    }
  }

  /**
   * Submit contact form
   */
  submitContactForm() {
    this.clickWithRetry(this.locators.submitButton)
  }

  /**
   * Verify footer elements
   */
  verifyFooter() {
    this.isElementVisible(this.locators.footer)
    cy.get(this.locators.footerLinks).should('have.length.at.least', 1)
  }

  /**
   * Scroll to specific section
   * @param {string} section - Section name
   */
  scrollToSection(section) {
    switch (section) {
      case 'features':
        this.scrollToElement(this.locators.featuresSection)
        break
      case 'about':
        this.scrollToElement(this.locators.aboutSection)
        break
      case 'contact':
        this.scrollToElement(this.locators.contactSection)
        break
      default:
        cy.log(`Section ${section} not found`)
    }
  }

  /**
   * Get page title text
   */
  getPageTitle() {
    return this.getElementText(this.locators.heroTitle)
  }

  /**
   * Verify page URL
   */
  // URL verification removed as requested

  /**
   * Take homepage screenshot
   */
  takeHomepageScreenshot() {
    this.takeScreenshot('homepage')
  }

  // Specific Revers.io methods
  verifyMainTitle() {
    this.verifyPageContent([
      'LOGICIEL DE GESTION DES OPÉRATIONS APRÈS-VENTE',
      'Optimisez la gestion des retours et des réparations'
    ])
  }

  verifyClientReferences() {
    this.verifyPageContent([
      'ILS RÉUSSISSENT AVEC REVERS.IO',
      'Carrefour',
      'Auchan Retail',
      'E.Leclerc',
      'Fnac Darty',
      'La Redoute',
      'Maisons Du Monde'
    ])
  }

  verifyStatistics() {
    this.verifyPageContent([
      '-70%',
      'réduction des coûts',
      '-50%',
      'délais de traitement',
      '+450',
      'partenaires connectés'
    ])
  }

  verifyMainSections() {
    this.verifyPageContent([
      'EXPÉRIENCE CLIENT',
      'TRAçabilité',
      'automatisation',
      'Votre plateforme de pilotage omnicanale'
    ])
  }

  verifyPlatformFeatures() {
    this.verifyPageContent([
      'Portail en self-service',
      'Gestion des règles métier',
      'Partenaires connectés',
      'Réparations et pièces détachées',
      'Finance',
      'Dashboarding'
    ])
  }

  verifyTargetProfessions() {
    this.verifyPageContent([
      'Service client',
      'Magasin',
      'Back office',
      'Logisticien',
      'Technicien',
      'Data analyst'
    ])
  }

  verifyTestimonials() {
    this.verifyPageContent([
      'nos clients sont nos ambassadeurs',
      'Ils dépassent leurs objectifs',
      'Romain Lahoche',
      'Chef de projet Supply Chain',
      'Michael Anzalone',
      'After-sales Manager'
    ])
  }

  verifyContactInfo() {
    this.verifyPageContent([
      '111 Rue du Château des Rentiers',
      '75013 Paris',
      'France'
    ])
  }

  verifyFooterLinks() {
    this.verifyPageContent([
      'Solutions',
      'PARTENAIRES',
      'Métiers',
      'industries',
      'Ressources',
      'À PROPOS DE REVERS.IO'
    ])
  }

  verifyLegalMentions() {
    this.verifyPageContent([
      'Copyright © Revers.io',
      'Mentions légales',
      'Politique de confidentialité',
      'Politique de gestion des cookies'
    ])
  }

  clickDemoButton() {
    cy.get('a[href*="demo"], button:contains("démo")').click()
  }

  verifyDemoButton() {
    cy.get('a[href*="demo"], button:contains("démo")').should('exist')
    cy.get('body').should('contain.text', 'Demander une démo')
  }

  // Resources section methods
  verifyResourcesSection() {
    this.verifyPageContent([
      'Ressources',
      'Blog',
      'Quel ROI pour votre SAV?',
      'Optimiser son SAV avec l\'IA'
    ])
  }

  clickResourcesSection() {
    cy.contains('Ressources', { timeout: 10000 }).should('be.visible')
    cy.contains('Ressources').click()
  }

  clickBlogLink() {
    cy.contains('Blog', { timeout: 10000 }).should('be.visible')
    cy.contains('Blog').click()
  }

  clickLivreBlancLink() {
    cy.contains('Quel ROI pour votre SAV?', { timeout: 10000 }).should('be.visible')
    cy.contains('Quel ROI pour votre SAV?').click()
  }

  clickWebinarLink() {
    cy.contains('Optimiser son SAV avec l\'IA', { timeout: 10000 }).should('be.visible')
    cy.contains('Optimiser son SAV avec l\'IA').click()
  }

  verifyBlogPage() {
    // URL verification removed as requested
    cy.get('body').should('contain.text', 'blog')
  }

  verifyLivreBlancPage() {
    cy.get('body').should('contain.text', 'ROI')
    cy.get('body').should('contain.text', 'SAV')
  }

  verifyWebinarPage() {
    cy.get('body').should('contain.text', 'IA')
    cy.get('body').should('contain.text', 'webinar')
    cy.get('body').should('contain.text', 'optimiser')
  }

  // Testimonials section methods
  verifyTestimonialsSection() {
    this.verifyPageContent([
      'TÉMOIGNAGES CLIENTS',
      'Maisons Du Monde',
      'FNAC-Darty',
      'La Redoute',
      'Joone',
      'Carrefour'
    ])
  }

  clickTestimonialsSection() {
    cy.contains('TÉMOIGNAGES CLIENTS', { timeout: 10000 }).should('be.visible')
    cy.contains('TÉMOIGNAGES CLIENTS').click()
  }

  clickMaisonsDuMondeTestimonial() {
    cy.contains('Maisons Du Monde', { timeout: 10000 }).should('be.visible')
    cy.contains('Maisons Du Monde').click()
  }

  clickFNACDartyTestimonial() {
    cy.contains('FNAC-Darty', { timeout: 10000 }).should('be.visible')
    cy.contains('FNAC-Darty').click()
  }

  clickLaRedouteTestimonial() {
    cy.contains('La Redoute', { timeout: 10000 }).should('be.visible')
    cy.contains('La Redoute').click()
  }

  clickJooneTestimonial() {
    cy.contains('Joone', { timeout: 10000 }).should('be.visible')
    cy.contains('Joone').click()
  }

  clickCarrefourTestimonial() {
    cy.contains('Carrefour', { timeout: 10000 }).should('be.visible')
    cy.contains('Carrefour').click()
  }

  verifyMaisonsDuMondeTestimonial() {
    cy.get('body').should('contain.text', 'Maisons Du Monde')
    cy.get('body').should('contain.text', 'interface')
    cy.get('body').should('contain.text', 'selfcare')
  }

  verifyFNACDartyTestimonial() {
    cy.get('body').should('contain.text', 'FNAC-Darty')
    cy.get('body').should('contain.text', 'digitalisation')
    cy.get('body').should('contain.text', 'traçabilité')
  }

  verifyLaRedouteTestimonial() {
    cy.get('body').should('contain.text', 'La Redoute')
    cy.get('body').should('contain.text', 'optimisation')
    cy.get('body').should('contain.text', 'expérience client')
  }

  verifyJooneTestimonial() {
    cy.get('body').should('contain.text', 'Joone')
    cy.get('body').should('contain.text', 'témoignage')
  }

  verifyCarrefourTestimonial() {
    cy.get('body').should('contain.text', 'Carrefour')
    cy.get('body').should('contain.text', 'webinar')
    cy.get('body').should('contain.text', 'témoignage')
  }

  // Complete Resources navigation test
  testCompleteResourcesNavigation() {
    // Navigate to Resources section
    this.clickResourcesSection()
    
    // Test Blog
    this.clickBlogLink()
    this.verifyBlogPage()
    cy.go('back')
    
    // Test Livre blanc
    this.clickLivreBlancLink()
    this.verifyLivreBlancPage()
    cy.go('back')
    
    // Test Webinar
    this.clickWebinarLink()
    this.verifyWebinarPage()
    cy.go('back')
    
    // Test Testimonials
    this.clickTestimonialsSection()
    
    // Test all testimonials
    this.clickMaisonsDuMondeTestimonial()
    this.verifyMaisonsDuMondeTestimonial()
    cy.go('back')
    
    this.clickFNACDartyTestimonial()
    this.verifyFNACDartyTestimonial()
    cy.go('back')
    
    this.clickLaRedouteTestimonial()
    this.verifyLaRedouteTestimonial()
    cy.go('back')
    
    this.clickJooneTestimonial()
    this.verifyJooneTestimonial()
    cy.go('back')
    
    this.clickCarrefourTestimonial()
    this.verifyCarrefourTestimonial()
    cy.go('back')
    
    // Return to homepage
    cy.url().should('include', 'revers.io')
  }

  // Navigation menu methods - simplified
  hoverPlateformeMenu() {
    return this.hover('div:contains("Plateforme")')
  }

  hoverPartenairesMenu() {
    return this.hover('div:contains("Partenaires")')
  }

  hoverAProposMenu() {
    return this.hover('div:contains("À propos")')
  }

  hoverRessourcesMenu() {
    return this.hover('div:contains("Ressources")')
  }

  clickGestionsDesRetours() {
    return this.click('div:contains("Gestions des retours")')
  }

  clickTechnologiques() {
    return this.click('div:contains("Technologiques")', { force: true })
  }

  clickQuiSommesNous() {
    return this.click('div:contains("Qui sommes-nous")')
  }

  clickBlog() {
    return this.click('div:contains("Blog")')
  }

  // Complete navigation methods - simplified
  navigateToPlateformeGestionsDesRetours() {
    // Hover sur le menu Plateforme
    this.hover(this.locators.plateformeMenu)
    
    // Cliquer sur 'Gestions des retours'
    this.click(this.locators.gestionsDesRetours)
    
    // Vérifier que la page de gestion des retours est chargée
    this.isVisible(this.locators.pageGestionDesRetours)
    
    // Faire défiler jusqu'au bas de la page
    cy.scrollTo('bottom', { duration: 1000 })
    
    // Attendre un peu
    cy.wait(1000)
    
    // Revenir en haut de la page
    cy.scrollTo('top', { duration: 1000 })
  }

  navigateToPartenairesTechnologiques() {
    this.hoverPartenairesMenu()
    this.clickTechnologiques()
  }

  navigateToAProposQuiSommesNous() {
    this.hoverAProposMenu()
    this.clickQuiSommesNous()
  }

  navigateToRessourcesBlog() {
    this.hoverRessourcesMenu()
    this.clickBlog()
  }
}

export default HomePage
