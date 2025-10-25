import HomePage from '../support/pages/HomePage.js'

describe('Tests de navigation Revers.io', () => {
  const page = new HomePage()
  
  beforeEach(() => {
    page.visitHomePage()
  })

  it('Devrait naviguer vers la page Gestions des retours', () => {
    page.navigateToPlateformeGestionsDesRetours()
  })

  it('Devrait naviguer vers la page Partenaires', () => {
    page.navigateToPartenairesTechnologiques()
  })

  it('Devrait naviguer vers la page À propos', () => {
    page.navigateToAProposQuiSommesNous()
  })

  it('Devrait naviguer vers la page Blog', () => {
    page.navigateToRessourcesBlog()
  })
})