module.exports = {
  resultsDir: 'allure-results',
  reportDir: 'allure-report',
  categories: [
    {
      name: 'Failed tests',
      matchedStatuses: ['failed']
    },
    {
      name: 'Broken tests',
      matchedStatuses: ['broken']
    },
    {
      name: 'Skipped tests',
      matchedStatuses: ['skipped']
    },
    {
      name: 'Passed tests',
      matchedStatuses: ['passed']
    }
  ],
  environment: {
    browser: 'Chrome',
    version: 'Latest',
    platform: 'macOS',
    environment: 'Test'
  }
}
