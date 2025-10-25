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
                    echo "   RÉCUPÉRATION DU CODE SOURCE"
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                }
                checkout scm
            }
        }

        stage('📦 Installation des dépendances') {
            steps {
                script {
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                    echo "   INSTALLATION DES DÉPENDANCES NPM"
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

        stage('🚀 Exécution des tests Cypress') {
            steps {
                script {
                    echo ""
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                    echo "   🚀 EXÉCUTION DES TESTS CYPRESS"
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

                        # Exécution des tests
                        npx cypress run \
                            --browser "$BROWSER" \
                            --headless \
                            --env allure=true
                    '''
                }

                script {
                    echo ""
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                    echo "   📊 TRAITEMENT DES RAPPORTS"
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

                    // Compter les fichiers JSON
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
                                --inline 2>/dev/null || true
                        '''
                    } else if (mochawesomeFiles == 1) {
                        echo "📊 Génération du rapport Mochawesome..."
                        sh '''
                            REPORT_FILE=$(ls mochawesome-report/*.json | head -1)
                            npx marge "$REPORT_FILE" -o mochawesome-report \
                                --reportTitle "Tests Revers.io" \
                                --reportPageTitle "Rapport de Tests Cypress" \
                                --inline 2>/dev/null || true
                        '''
                    }

                    // Analyser les résultats avec shell script
                    def reportExists = sh(
                        script: 'test -f mochawesome-report/merged.json && echo "true" || test -f mochawesome-report/mochawesome.json && echo "true" || echo "false"',
                        returnStdout: true
                    ).trim()

                    if (reportExists == "true") {
                        // Extraire les stats via jq ou grep/sed
                        def statsOutput = sh(
                            script: '''
                                REPORT_FILE=$(ls mochawesome-report/*.json 2>/dev/null | head -1)
                                if [ -f "$REPORT_FILE" ]; then
                                    if command -v jq >/dev/null 2>&1; then
                                        # Utiliser jq si disponible
                                        PASSES=$(jq -r '.stats.passes // 0' "$REPORT_FILE")
                                        FAILURES=$(jq -r '.stats.failures // 0' "$REPORT_FILE")
                                        SKIPPED=$(jq -r '.stats.skipped // 0' "$REPORT_FILE")
                                        TESTS=$(jq -r '.stats.tests // 0' "$REPORT_FILE")
                                        DURATION=$(jq -r '.stats.duration // 0' "$REPORT_FILE")
                                    else
                                        # Fallback: extraction basique avec grep/sed
                                        PASSES=$(grep -o '"passes":[0-9]*' "$REPORT_FILE" | head -1 | cut -d: -f2)
                                        FAILURES=$(grep -o '"failures":[0-9]*' "$REPORT_FILE" | head -1 | cut -d: -f2)
                                        SKIPPED=$(grep -o '"skipped":[0-9]*' "$REPORT_FILE" | head -1 | cut -d: -f2)
                                        TESTS=$(grep -o '"tests":[0-9]*' "$REPORT_FILE" | head -1 | cut -d: -f2)
                                        DURATION=$(grep -o '"duration":[0-9]*' "$REPORT_FILE" | head -1 | cut -d: -f2)
                                        PASSES=${PASSES:-0}
                                        FAILURES=${FAILURES:-0}
                                        SKIPPED=${SKIPPED:-0}
                                        TESTS=${TESTS:-0}
                                        DURATION=${DURATION:-0}
                                    fi
                                    echo "$PASSES|$FAILURES|$SKIPPED|$TESTS|$DURATION"
                                fi
                            ''',
                            returnStdout: true
                        ).trim()

                        if (statsOutput) {
                            def stats = statsOutput.split('\\|')
                            def passes = stats[0] ?: '0'
                            def failures = stats[1] ?: '0'
                            def skipped = stats[2] ?: '0'
                            def tests = stats[3] ?: '0'
                            def duration = stats[4] ?: '0'
                            def durationSec = Math.round(duration.toInteger() / 1000)

                            echo ""
                            echo "╔════════════════════════════════════════════╗"
                            echo "║                                            ║"
                            echo "║        📊 RÉSULTATS DES TESTS             ║"
                            echo "║                                            ║"
                            echo "╚════════════════════════════════════════════╝"
                            echo ""
                            echo "  ✅ Tests réussis     : ${passes}"
                            echo "  ❌ Tests échoués     : ${failures}"
                            echo "  ⏭️  Tests ignorés     : ${skipped}"
                            echo "  📊 Total             : ${tests}"
                            echo "  ⏱️  Durée totale     : ${durationSec}s"
                            echo ""

                            // Afficher le taux de réussite
                            def successRate = tests.toInteger() > 0 ?
                                Math.round((passes.toInteger() * 100) / tests.toInteger()) : 0
                            def rateIcon = successRate == 100 ? "🎉" :
                                          successRate >= 80 ? "✅" :
                                          successRate >= 60 ? "⚠️" : "❌"
                            echo "  ${rateIcon} Taux de réussite : ${successRate}%"
                            echo ""
                            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

                            // Lister les specs avec leur statut
                            echo ""
                            echo "📋 DÉTAIL PAR FICHIER DE TESTS:"
                            echo ""

                            sh '''
                                REPORT_FILE=$(ls mochawesome-report/*.json 2>/dev/null | head -1)
                                if [ -f "$REPORT_FILE" ]; then
                                    if command -v jq >/dev/null 2>&1; then
                                        jq -r '.results[] | "  " + (if (.suites[0].tests | map(select(.fail == true)) | length) > 0 then "❌" else "✅" end) + " " + (.file | split("/")[-1]) + " → ✅ " + (.suites[0].tests | map(select(.pass == true)) | length | tostring) + " réussis, ❌ " + (.suites[0].tests | map(select(.fail == true)) | length | tostring) + " échoués"' "$REPORT_FILE" 2>/dev/null || echo "  ⚠️  Impossible d'extraire les détails par spec"
                                    else
                                        echo "  ℹ️  Installez 'jq' pour voir les détails par spec"
                                    fi
                                fi
                            '''

                            echo ""

                            // Lister les tests échoués
                            if (failures.toInteger() > 0) {
                                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                                echo ""
                                echo "❌ LISTE DES TESTS ÉCHOUÉS:"
                                echo ""

                                sh '''
                                    REPORT_FILE=$(ls mochawesome-report/*.json 2>/dev/null | head -1)
                                    if [ -f "$REPORT_FILE" ]; then
                                        if command -v jq >/dev/null 2>&1; then
                                            jq -r '.results[].suites[].tests[] | select(.fail == true) | "  ❌ " + .title + "\\n     └─ " + (.err.message // "Erreur inconnue" | split("\\n")[0])' "$REPORT_FILE" 2>/dev/null || echo "  ⚠️  Impossible d'extraire les erreurs"
                                        else
                                            echo "  ℹ️  Installez 'jq' pour voir les détails des erreurs"
                                        fi
                                    fi
                                '''

                                echo ""
                                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                            }

                            // Définir le statut du build
                            if (failures.toInteger() > 0) {
                                currentBuild.result = 'UNSTABLE'
                                echo ""
                                echo "⚠️  Build marqué comme INSTABLE (${failures} test(s) échoué(s))"
                            } else {
                                echo ""
                                echo "✅ Tous les tests sont passés avec succès !"
                            }

                            // Afficher les rapports disponibles
                            echo ""
                            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                            echo "📊 RAPPORTS DISPONIBLES:"
                            echo ""
                            echo "  📄 Rapport Mochawesome → Build Artifacts → mochawesome-report/mochawesome.html"
                            echo "  📄 Rapport Allure      → Lien 'Allure Report' dans la barre latérale"
                            echo "  🎥 Vidéos             → Build Artifacts → cypress/videos/"
                            echo "  📸 Captures           → Build Artifacts → cypress/screenshots/"
                            echo ""
                            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        } else {
                            echo "⚠️  Impossible de lire les statistiques du rapport"
                        }
                    } else {
                        echo "⚠️  Aucun rapport Mochawesome trouvé"
                    }

                    echo ""
                }
            }
            post {
                always {
                    script {
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        echo "   📦 ARCHIVAGE DES ARTEFACTS"
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                    }

                    archiveArtifacts artifacts: 'cypress/screenshots/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'mochawesome-report/**/*', allowEmptyArchive: true

                    script {
                        // Publier le rapport HTML si le plugin est disponible
                        try {
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
                                echo "✅ Rapport HTML publié avec succès"
                            }
                        } catch (Exception e) {
                            echo "ℹ️  Plugin HTML Publisher non disponible - Le rapport est archivé dans les artefacts"
                            echo "   Accédez au rapport via : Build Artifacts → mochawesome-report → mochawesome.html"
                        }
                    }
                }
            }
        }

        stage('📊 Génération du rapport Allure') {
            steps {
                script {
                    // Vérifier si des résultats Allure existent
                    def allureExists = sh(
                        script: 'test -d allure-results && ls -A allure-results 2>/dev/null | wc -l',
                        returnStdout: true
                    ).trim().toInteger()

                    if (allureExists > 0) {
                        echo ""
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                        echo "   📊 GÉNÉRATION DU RAPPORT ALLURE"
                        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

                        sh 'npx allure generate allure-results --clean -o allure-report'

                        try {
                            allure([
                                includeProperties: false,
                                jdk: '',
                                properties: [],
                                reportBuildPolicy: 'ALWAYS',
                                results: [[path: 'allure-results']]
                            ])
                            echo "✅ Rapport Allure généré et publié avec succès"
                        } catch (Exception e) {
                            echo "ℹ️  Plugin Allure non disponible - Le rapport HTML est archivé dans les artefacts"
                            archiveArtifacts artifacts: 'allure-report/**/*', allowEmptyArchive: true
                        }
                    } else {
                        echo ""
                        echo "ℹ️  Aucun résultat Allure trouvé - étape ignorée"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo ""
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                echo "   🧹 NETTOYAGE FINAL"
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            }
            sh 'rm -rf cypress_cache .npm || true'
        }
        success {
            script {
                echo ""
                echo "╔════════════════════════════════════════════╗"
                echo "║                                            ║"
                echo "║          ✅ BUILD RÉUSSI !                ║"
                echo "║                                            ║"
                echo "║   Tous les tests sont passés avec succès  ║"
                echo "║                                            ║"
                echo "╚════════════════════════════════════════════╝"
                echo ""
            }
        }
        unstable {
            script {
                echo ""
                echo "╔════════════════════════════════════════════╗"
                echo "║                                            ║"
                echo "║       ⚠️  BUILD INSTABLE                  ║"
                echo "║                                            ║"
                echo "║   Certains tests ont échoué               ║"
                echo "║   Consultez le rapport pour plus de       ║"
                echo "║   détails                                 ║"
                echo "║                                            ║"
                echo "╚════════════════════════════════════════════╝"
                echo ""
            }
        }
        failure {
            script {
                echo ""
                echo "╔════════════════════════════════════════════╗"
                echo "║                                            ║"
                echo "║          ❌ BUILD ÉCHOUÉ                  ║"
                echo "║                                            ║"
                echo "║   Une erreur critique s'est produite      ║"
                echo "║                                            ║"
                echo "╚════════════════════════════════════════════╝"
                echo ""
            }
        }
    }
}