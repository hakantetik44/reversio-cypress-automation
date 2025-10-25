pipeline {
    agent any

    environment {
        CI = 'true'
        LANG = 'fr_FR.UTF-8'
        FORCE_COLOR = '0'
        NO_COLOR = '1'
    }

    tools {
        nodejs 'Node24'
    }

    stages {

        stage('📥 Récupération du code') {
            steps {
                script {
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                    echo "   RÉCUPÉRATION DU CODE"
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                }
                checkout scm
            }
        }

        stage('📦 Installation des dépendances') {
            steps {
                script {
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                    echo "   INSTALLATION DES DÉPENDANCES"
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                }
                sh 'npm ci --cache .npm --prefer-offline --silent'
            }
        }

        stage('🧹 Nettoyage') {
            steps {
                script {
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                    echo "   NETTOYAGE DES ANCIENS RÉSULTATS"
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                }
                sh '''
                    rm -rf allure-results allure-report mochawesome-report
                    rm -rf cypress/screenshots cypress/videos
                    mkdir -p mochawesome-report
                '''
            }
        }

        stage('🚀 Exécution des tests') {
            steps {
                script {
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                    echo "   EXÉCUTION DES TESTS CYPRESS"
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                    echo ""
                }

                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh '''
                        if command -v google-chrome >/dev/null 2>&1 || [ -d "/Applications/Google Chrome.app" ]; then
                            BROWSER=chrome
                        else
                            BROWSER=electron
                        fi

                        # Exécution des tests avec les reporters configurés
                        npx cypress run \
                            --browser "$BROWSER" \
                            --headless \
                            --env allure=true
                    '''
                }

                script {
                    echo ""
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                    echo "   TRAITEMENT DES RAPPORTS"
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

                    // Fusionner les rapports Mochawesome si plusieurs fichiers JSON existent
                    def mochawesomeFiles = sh(
                        script: 'ls -1 mochawesome-report/*.json 2>/dev/null | wc -l',
                        returnStdout: true
                    ).trim().toInteger()

                    if (mochawesomeFiles > 1) {
                        echo "📊 Fusion de ${mochawesomeFiles} rapports Mochawesome..."
                        sh '''
                            npx mochawesome-merge mochawesome-report/*.json > mochawesome-report/merged.json
                            npx marge mochawesome-report/merged.json -o mochawesome-report \
                                --reportTitle "Tests Revers.io" \
                                --reportPageTitle "Rapport de Tests Cypress" \
                                --inline
                        '''
                    } else if (mochawesomeFiles == 1) {
                        echo "📊 Génération du rapport Mochawesome..."
                        sh '''
                            REPORT_FILE=$(ls mochawesome-report/*.json | head -1)
                            npx marge "$REPORT_FILE" -o mochawesome-report \
                                --reportTitle "Tests Revers.io" \
                                --reportPageTitle "Rapport de Tests Cypress" \
                                --inline
                        '''
                    }

                    // Lecture et affichage du résumé des tests
                    def reportFile = mochawesomeFiles > 1 ? 'mochawesome-report/merged.json' : sh(
                        script: 'ls mochawesome-report/*.json 2>/dev/null | head -1',
                        returnStdout: true
                    ).trim()

                    if (reportFile && fileExists(reportFile)) {
                        def report = readJSON file: reportFile
                        def stats = report.stats

                        echo ""
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        echo "   RÉSULTATS DES TESTS"
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        echo ""
                        echo "  ✅ Tests réussis    : ${stats.passes}"
                        echo "  ❌ Tests échoués    : ${stats.failures}"
                        echo "  ⏭️  Tests ignorés    : ${stats.skipped}"
                        echo "  📊 Total            : ${stats.tests}"
                        echo "  ⏱️  Durée           : ${Math.round(stats.duration / 1000)}s"
                        echo ""
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

                        // Afficher les tests par spec avec icônes
                        if (report.results) {
                            echo ""
                            echo "📋 DÉTAIL PAR SPEC:"
                            echo ""
                            report.results.each { result ->
                                def fileName = result.file ? new File(result.file).name : 'Unknown'
                                def suiteStats = result.suites[0]?.tests ?: []
                                def passes = suiteStats.findAll { it.pass }.size()
                                def failures = suiteStats.findAll { it.fail }.size()
                                def icon = failures > 0 ? '❌' : '✅'

                                echo "  ${icon} ${fileName}"
                                echo "     ✅ Réussis: ${passes}  ❌ Échoués: ${failures}"
                            }
                            echo ""
                        }

                        // Afficher la liste des tests échoués
                        if (stats.failures > 0) {
                            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                            echo "❌ TESTS ÉCHOUÉS:"
                            echo ""
                            report.results.each { result ->
                                result.suites.each { suite ->
                                    suite.tests.each { test ->
                                        if (test.fail) {
                                            echo "  ❌ ${test.title}"
                                            if (test.err?.message) {
                                                def errorMsg = test.err.message.split('\n')[0]
                                                echo "     └─ ${errorMsg}"
                                            }
                                        }
                                    }
                                }
                            }
                            echo ""
                            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        }

                        // Afficher tous les tests avec icônes
                        echo ""
                        echo "📝 LISTE COMPLÈTE DES TESTS:"
                        echo ""
                        report.results.each { result ->
                            result.suites.each { suite ->
                                if (suite.title) {
                                    echo "  📦 ${suite.title}"
                                }
                                suite.tests.each { test ->
                                    def icon = test.pass ? '✅' : (test.fail ? '❌' : '⏭️')
                                    def duration = test.duration ? " (${Math.round(test.duration / 1000)}s)" : ""
                                    echo "     ${icon} ${test.title}${duration}"
                                }
                            }
                        }
                        echo ""

                        // Définir le statut du build
                        if (stats.failures > 0) {
                            currentBuild.result = 'UNSTABLE'
                        }
                    } else {
                        echo "⚠️  Aucun rapport Mochawesome trouvé"
                    }
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'cypress/screenshots/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'mochawesome-report/**/*', allowEmptyArchive: true

                    // Publier le rapport HTML si disponible
                    script {
                        if (fileExists('mochawesome-report/mochawesome.html')) {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'mochawesome-report',
                                reportFiles: 'mochawesome.html',
                                reportName: '📊 Rapport de Tests',
                                reportTitles: 'Rapport Cypress'
                            ])
                        }
                    }
                }
            }
        }

        stage('📊 Génération Allure') {
            when {
                expression { fileExists('allure-results') }
            }
            steps {
                script {
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                    echo "   GÉNÉRATION DU RAPPORT ALLURE"
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                }
                sh 'npx allure generate allure-results --clean -o allure-report'

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
            script {
                echo ""
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                echo "   NETTOYAGE FINAL"
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            }
            sh 'rm -rf cypress_cache .npm || true'
        }
        success {
            script {
                echo ""
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                echo "   ✅ BUILD RÉUSSI"
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            }
        }
        unstable {
            script {
                echo ""
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                echo "   ⚠️  BUILD INSTABLE - CERTAINS TESTS ONT ÉCHOUÉ"
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            }
        }
        failure {
            script {
                echo ""
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                echo "   ❌ BUILD ÉCHOUÉ"
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            }
        }
    }
}