const { defineConfig } = require('cypress');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
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
    // experimentalSessionAndOrigin removed since Cypress v12
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // Allure reporter
      allureWriter(on, config);
      // Log début de spec (affiché dans la console Jenkins)
      on('before:spec', (spec) => {
        try { console.log(`🔵 Démarrage du spec: ${spec?.name || spec}`); } catch {}
      });
      
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

      // After each spec, attach video to ONLY the last test of that spec.
      on('after:spec', (spec, results) => {
        try {
          // If video exists, copy into allure-results and attach to the last test only
          if (results && results.video) {
            const allureResultsDir = config.env?.allureResultsPath || 'allure-results';
            const videoFileName = path.basename(results.video);
            const targetVideoPath = path.join(allureResultsDir, videoFileName);
            try {
              fs.mkdirSync(allureResultsDir, { recursive: true });
              fs.copyFileSync(results.video, targetVideoPath);
              const files = fs.readdirSync(allureResultsDir).filter(f => f.endsWith('-result.json'));

              // Try to find the last test by title in allure results
              let candidateFile = null;
              const lastTestTitle = Array.isArray(results.tests) && results.tests.length
                ? (Array.isArray(results.tests[results.tests.length - 1].title)
                    ? results.tests[results.tests.length - 1].title.join(' ')
                    : results.tests[results.tests.length - 1].title)
                : null;

              if (lastTestTitle) {
                for (const file of files) {
                  try {
                    const full = path.join(allureResultsDir, file);
                    const json = JSON.parse(fs.readFileSync(full, 'utf-8'));
                    if (json && (json.name === lastTestTitle || (json.fullName && json.fullName.includes(lastTestTitle)))) {
                      candidateFile = full;
                      break;
                    }
                  } catch {}
                }
              }

              // Fallback: pick the newest result file
              if (!candidateFile && files.length) {
                const sorted = files
                  .map(f => ({ f, t: fs.statSync(path.join(allureResultsDir, f)).mtimeMs }))
                  .sort((a, b) => b.t - a.t);
                candidateFile = path.join(allureResultsDir, sorted[0].f);
              }

              if (candidateFile) {
                try {
                  const json = JSON.parse(fs.readFileSync(candidateFile, 'utf-8'));
                  json.attachments = json.attachments || [];
                  const already = json.attachments.some(a => a.name === 'Video');
                  if (!already) {
                    json.attachments.push({ name: 'Video', source: videoFileName, type: 'video/mp4' });
                    fs.writeFileSync(candidateFile, JSON.stringify(json, null, 2));
                  }
                } catch (e) {
                  console.warn('Failed to attach video to last test result:', e?.message);
                }
              }
            } catch (e) {
              console.warn('Copy video failed:', e?.message);
            }
          }

          // In CI (Jenkins) we do NOT generate/open here; Jenkins handles publishing.
          const isCI = process.env.CI === 'true' || !!process.env.JENKINS_URL;
          if (!isCI) {
            // Generate and open locally for developer convenience
            execSync('allure generate allure-results --clean -o allure-report', { stdio: 'ignore' });
            execSync('allure open allure-report', { stdio: 'ignore' });
          }
        } catch (e) {
          console.warn('Allure report generation/open failed:', e?.message);
        }
      });
      
      on('after:run', (results) => {
        try {
          const t = results?.totalTests || 0;
          const p = results?.totalPassed || 0;
          const f = results?.totalFailed || 0;
          const s = results?.totalSkipped || 0;
          console.log(`✅ Résumé exécution: tests=${t}, réussis=${p}, échoués=${f}, ignorés=${s}`);
        } catch {}
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
