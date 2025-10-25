/**
 * Home Page Locators
 * Contains all CSS selectors for the Revers.io homepage
 */
class HomePageLocators {
  constructor() {
    // Navigation elements
    this.logo = '.logo, [data-testid="logo"]'
    this.navigationMenu = 'nav, .navigation, [data-testid="navigation-menu"]'
    this.loginButton = '[data-testid="login-button"]'
    this.signupButton = '[data-testid="signup-button"]'
    this.demoButton = 'a[href*="demo"], button:contains("démo")'
    
    // Menu Plateforme
    this.plateformeMenu = 'div:contains("Plateforme")'
    this.gestionsDesRetours = 'div:contains("Gestions des retours")'
    this.pageGestionDesRetours = 'div:contains("Gestion des retours")'
    
    // Hero section
    this.heroTitle = '[data-testid="hero-title"]'
    this.heroSubtitle = '[data-testid="hero-subtitle"]'
    this.ctaButton = '[data-testid="cta-button"]'
    this.heroSection = '.hero, .banner, [data-testid="hero"]'
    
    // Features section
    this.featuresSection = '[data-testid="features-section"]'
    this.featureCards = '[data-testid="feature-card"]'
    
    // About section
    this.aboutSection = '[data-testid="about-section"]'
    this.aboutTitle = '[data-testid="about-title"]'
    this.aboutDescription = '[data-testid="about-description"]'
    
    // Contact section
    this.contactSection = '[data-testid="contact-section"]'
    this.contactForm = '[data-testid="contact-form"]'
    this.contactEmail = '[data-testid="contact-email"]'
    this.contactName = '[data-testid="contact-name"]'
    this.contactMessage = '[data-testid="contact-message"]'
    this.submitButton = '[data-testid="submit-button"]'
    
    // Footer
    this.footer = '[data-testid="footer"]'
    this.footerLinks = '[data-testid="footer-link"]'
    this.socialLinks = '[data-testid="social-link"]'
    
    // Client logos and testimonials
    this.clientLogos = '.client-logos, .partners'
    this.statistics = '.statistics, .stats'
    this.testimonials = '.testimonials, .témoignages'
    
    // Success/Error messages
    this.successMessage = '.success, .alert-success, [data-testid="success"]'
    this.errorMessage = '.error, .alert-error, [data-testid="error"]'
    
    // Mobile navigation
    this.mobileMenuButton = 'button[aria-label*="menu"], .hamburger, .menu-toggle'
    
    // Images and accessibility
    this.images = 'img'
    this.headings = 'h1, h2, h3'
    
    // Navigation menu locators
    this.plateformeMenu = 'div:contains("Plateforme")'
    this.partenairesMenu = 'div:contains("Partenaires")'
    this.aProposMenu = 'div:contains("À propos")'
    this.ressourcesMenu = 'div:contains("Ressources")'
    
    // Sub-menu locators
    this.gestionsDesRetours = 'div:contains("Gestions des retours")'
    this.technologiques = 'div:contains("Technologiques")'
    this.quiSommesNous = 'div:contains("Qui sommes-nous")'
    this.blog = 'div:contains("Blog")'
    
    // Content verification locators
    this.gestionDesRetours = 'div:contains("Gestion des retours")'
  }
}

export default HomePageLocators
