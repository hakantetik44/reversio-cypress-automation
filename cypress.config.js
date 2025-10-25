const { defineConfig } = require('cypress');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.revers.io/fr',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    chromeWebSecurity: false,
    experimentalSessionAndOrigin: false,
    specPattern: [
      'cypress/e2e/**/*.cy.js',
      'cypress/e2e/features/**/*.feature'
    ],
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // Cucumber preprocessor - must be first
      addCucumberPreprocessorPlugin(on, config);
      
      // ESBuild bundler for Cucumber
      on('file:preprocessor', createBundler({
        plugins: [createEsbuildPlugin(config)]
      }));
      
      // Allure reporter
      allureWriter(on, config);
      
      // Clean previous results before the run starts (no shell prompts, cross-shell safe)
      on('before:run', () => {
        const toRemove = [
          'allure-results',
          'allure-report',
          path.join('cypress', 'screenshots'),
          path.join('cypress', 'videos')
        ];
        toRemove.forEach((p) => {
          try {
            fs.rmSync(p, { recursive: true, force: true });
            // Ensure directories exist when Cypress/Allure expects them
            if (p === 'allure-results') {
              fs.mkdirSync('allure-results', { recursive: true });
            }
          } catch (e) {
            console.warn('Cleanup warning for', p, e?.message);
          }
        });
      });

      // After each spec, generate and open Allure report automatically
      on('after:spec', (spec, results) => {
        try {
          // If video exists, copy into allure-results and attach to each test result JSON
          if (results && results.video) {
            const allureResultsDir = config.env?.allureResultsPath || 'allure-results';
            const videoFileName = path.basename(results.video);
            const targetVideoPath = path.join(allureResultsDir, videoFileName);
            try {
              fs.mkdirSync(allureResultsDir, { recursive: true });
              fs.copyFileSync(results.video, targetVideoPath);
              const files = fs.readdirSync(allureResultsDir).filter(f => f.endsWith('-result.json'));
              files.forEach(file => {
                const full = path.join(allureResultsDir, file);
                try {
                  const json = JSON.parse(fs.readFileSync(full, 'utf-8'));
                  json.attachments = json.attachments || [];
                  const already = json.attachments.some(a => a.name === 'Video');
                  if (!already) {
                    json.attachments.push({ name: 'Video', source: videoFileName, type: 'video/mp4' });
                    fs.writeFileSync(full, JSON.stringify(json, null, 2));
                  }
                } catch (e) {
                  console.warn('Failed to attach video to', file, e?.message);
                }
              });
            } catch (e) {
              console.warn('Copy video failed:', e?.message);
            }
          }

          // Generate report fresh each time
          execSync('allure generate allure-results --clean -o allure-report', { stdio: 'ignore' });
          // Open report (detached) - avoid blocking the Cypress process
          execSync('allure open allure-report', { stdio: 'ignore' });
        } catch (e) {
          console.warn('Allure report generation/open failed:', e?.message);
        }
      });
      
      // Custom tasks
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        }
      });
      
      return config;
    },
    env: {
      allure: true,
      allureReuseAfterSpec: true,
      allureResultsPath: 'allure-results'
    }
  },
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
});
