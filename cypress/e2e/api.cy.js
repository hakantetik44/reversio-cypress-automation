import BasePage from '../support/pages/BasePage.js'

describe('Tests API Revers.io', () => {
  const basePage = new BasePage()

  // API endpoints to test
  const apiEndpoints = [
    { name: 'retours', url: '/api/returns', method: 'GET' },
    { name: 'commandes', url: '/api/orders', method: 'GET' },
    { name: 'transport', url: '/api/shipping', method: 'GET' },
    { name: 'réparations', url: '/api/repairs', method: 'GET' },
    { name: 'suivi', url: '/api/tracking', method: 'GET' },
    { name: 'clients', url: '/api/customers', method: 'GET' },
    { name: 'rapports', url: '/api/reports', method: 'GET' },
    { name: 'partenaires', url: '/api/partners', method: 'GET' },
    { name: 'stocks', url: '/api/inventory', method: 'GET' },
    { name: 'synchronisation', url: '/api/sync', method: 'GET' },
    { name: 'remboursements', url: '/api/refunds', method: 'GET' }
  ]

  // Test each API endpoint
  apiEndpoints.forEach(endpoint => {
    it(`Teste l'API de ${endpoint.name}`, () => {
      basePage.makeApiRequest(endpoint.method, endpoint.url)
        .then((response) => {
          expect(response.status).to.be.oneOf([200, 201, 404])
          cy.log(`Statut API ${endpoint.name}: ${response.status}`)
        })
    })
  })

  it('Teste les performances des API endpoints', () => {
    const performanceEndpoints = ['/api/returns', '/api/orders', '/api/tracking']
    
    performanceEndpoints.forEach(endpoint => {
      basePage.makeApiRequest('GET', endpoint)
        .then((response) => {
          expect(response.duration).to.be.lessThan(2000)
          cy.log(`Performance ${endpoint}: ${response.duration}ms`)
        })
    })
  })

  it('Teste la validation des paramètres API', () => {
    const invalidEndpoints = [
      '/api/returns?param=invalid',
      '/api/orders?id=abc',
      '/api/tracking?tracking_id='
    ]
    
    invalidEndpoints.forEach(endpoint => {
      basePage.makeApiRequest('GET', endpoint)
        .then((response) => {
          expect(response.status).to.be.oneOf([400, 422, 404])
          cy.log(`Validation ${endpoint}: ${response.status}`)
        })
    })
  })
})
