pipeline {
    agent any

    environment {
        CI = 'true'
        LANG = 'fr_FR.UTF-8'
        ALLURE_RESULTS = 'allure-results'
        ALLURE_REPORT = 'allure-report'
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin" // Node/npm görünmesi için
    }
    
    tools {
        // Jenkins Tools > NodeJS installations > Node18 tanımlı olmalı
        nodejs 'Node18'
    }

    stages {
        stage('Préparation NodeJS (auto)') {
            steps {
                echo '🔧 Préparation de Node/npm via NVM si nécessaire...'
                sh '''bash -lc '
set -e
export NVM_DIR="$HOME/.nvm"
mkdir -p "$NVM_DIR"
[ -s "$NVM_DIR/nvm.sh" ] || curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 18 >/dev/null || true
nvm use 18
node --version
npm --version
'
'''
            }
        }

        stage('Récupération du code') {
            steps {
                echo '📥 Récupération du code...'
                checkout scm
            }
        }

        stage('Installation des dépendances') {
            steps {
                echo '📦 Installation des dépendances...'
                sh '''bash -lc '
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 18
npm ci --cache .npm --prefer-offline
'''
            }
        }

        stage('Nettoyage des anciens résultats') {
            steps {
                echo '🧹 Nettoyage des anciens résultats...'
                sh '''bash -lc '
rm -rf allure-results allure-report
rm -rf cypress/screenshots cypress/videos
'''
            }
        }

        stage('Exécution des tests (Chrome headless)') {
            steps {
                echo '🚀 Exécution des tests Cypress (Chrome headless)...'
                sh '''bash -lc '
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 18
if command -v google-chrome >/dev/null 2>&1 || [ -d "/Applications/Google Chrome.app" ]; then
  BROWSER=chrome
else
  echo "Chrome introuvable, bascule sur Electron"
  BROWSER=electron
fi
npx cypress run --browser "$BROWSER" --headless --env allure=true
'''
            }
            post {
                always {
                    echo '📸 Archivage des captures et vidéos...'
                    archiveArtifacts artifacts: 'cypress/screenshots/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**/*', allowEmptyArchive: true
                }
            }
        }

        stage('Génération du rapport Allure') {
            steps {
                echo '📊 Génération du rapport Allure...'
                sh '''bash -lc '
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 18
npx allure generate allure-results --clean -o allure-report
'''
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
