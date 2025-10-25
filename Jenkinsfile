pipeline {
  agent any

  environment {
    CI = 'true'
    LANG = 'fr_FR.UTF-8'
    ALLURE_RESULTS = 'allure-results'
    ALLURE_REPORT = 'allure-report'
  }

  stages {
    stage('Récupération du code') {
      steps {
        echo '📥 Récupération du code...'
        checkout scm
      }
    }

    stage('Installation des dépendances') {
      steps {
        echo '📦 Installation des dépendances...'
        sh 'npm ci --cache .npm --prefer-offline'
      }
    }

    stage('Nettoyage des anciens résultats') {
      steps {
        echo '🧹 Nettoyage des anciens résultats...'
        sh '''
          rm -rf allure-results allure-report
          rm -rf cypress/screenshots cypress/videos
        '''
      }
    }

    stage('Exécution des tests (Chrome headless)') {
      steps {
        echo '🚀 Exécution des tests Cypress (Chrome headless)...'
        sh 'npx cypress run --browser chrome --headless --env allure=true'
      }
      post {
        always {
          echo '📸 Archivage des captures et vidéos...'
          archiveArtifacts artifacts: 'cypress/screenshots/**/*', allowEmptyArchive: true
          archiveArtifacts artifacts: 'cypress/videos/**/*', allowEmptyArchive: true
        }
      }
    }

    // Optionnel: exécuter par spec en parallèle
    // stage('Exécution parallèle par spec') {
    //   parallel {
    //     stage('Frontend') {
    //       steps { sh 'npx cypress run --spec cypress/e2e/frontend.cy.js --env allure=true' }
    //     }
    //     stage('API') {
    //       steps { sh 'npx cypress run --spec cypress/e2e/api.cy.js --env allure=true' }
    //     }
    //   }
    // }

    stage('Génération du rapport Allure') {
      steps {
        echo '📊 Génération du rapport Allure...'
        sh 'npx allure generate allure-results --clean -o allure-report'
      }
      post {
        always {
          echo '📁 Archivage des résultats Allure...'
          archiveArtifacts artifacts: 'allure-results/**/*', allowEmptyArchive: true
          archiveArtifacts artifacts: 'allure-report/**/*', allowEmptyArchive: true
        }
      }
    }

    stage('Publication Allure') {
      steps {
        echo '📈 Publication du rapport Allure...'
        allure([
          includeProperties: false,
          jdk: '',
          properties: [],
          reportBuildPolicy: 'ALWAYS',
          results: [[path: 'allure-results']]
        ])
      }
    }
  }

  post {
    always {
      echo '🧹 Nettoyage final du workspace...'
      sh 'rm -rf cypress_cache || true'
    }
  }
}