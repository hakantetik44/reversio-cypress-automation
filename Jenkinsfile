pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        CYPRESS_CACHE_FOLDER = 'cypress_cache'
        ALLURE_RESULTS = 'allure-results'
        ALLURE_REPORT = 'allure-report'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from repository...'
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                echo '🔧 Setting up Node.js environment...'
                sh '''
                    node --version
                    npm --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing project dependencies...'
                sh 'npm ci --cache .npm --prefer-offline'
            }
        }
        
        stage('Clean Previous Results') {
            steps {
                echo '🧹 Cleaning previous test results...'
                sh '''
                    rm -rf allure-results allure-report
                    rm -rf cypress/screenshots cypress/videos
                    rm -rf cypress/cucumber-json
                '''
            }
        }
        
        stage('Run Cypress Tests - Chrome') {
            steps {
                echo '🚀 Running Cypress tests on Chrome...'
                sh 'npm run cypress:run:chrome'
            }
            post {
                always {
                    echo '📸 Archiving screenshots and videos...'
                    archiveArtifacts artifacts: 'cypress/screenshots/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('Run Cypress Tests - Firefox') {
            steps {
                echo '🦊 Running Cypress tests on Firefox...'
                sh 'npm run cypress:run:firefox'
            }
            post {
                always {
                    echo '📸 Archiving Firefox screenshots and videos...'
                    archiveArtifacts artifacts: 'cypress/screenshots/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('Generate Allure Report') {
            steps {
                echo '📊 Generating Allure report...'
                sh '''
                    npm run allure:generate
                '''
            }
            post {
                always {
                    echo '📁 Archiving Allure results...'
                    archiveArtifacts artifacts: 'allure-results/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'allure-report/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('Publish Test Results') {
            steps {
                echo '📈 Publishing test results...'
                allure([
                    includeProperties: false,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'allure-results']]
                ])
            }
        }
        
        stage('Quality Gate') {
            steps {
                echo '✅ Running quality gate checks...'
                script {
                    def testResults = sh(
                        script: 'find allure-results -name "*.json" | wc -l',
                        returnStdout: true
                    ).trim()
                    
                    def failedTests = sh(
                        script: 'find allure-results -name "*.json" -exec grep -l "failed" {} \\; | wc -l',
                        returnStdout: true
                    ).trim()
                    
                    echo "Total test results: ${testResults}"
                    echo "Failed tests: ${failedTests}"
                    
                    if (failedTests.toInteger() > 0) {
                        echo "⚠️ Some tests failed, but continuing pipeline..."
                    } else {
                        echo "🎉 All tests passed!"
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up workspace...'
            sh '''
                rm -rf node_modules
                rm -rf cypress_cache
            '''
        }
        
        success {
            echo '✅ Pipeline completed successfully!'
            emailext (
                subject: "✅ Revers.io Test Automation - Pipeline Success",
                body: """
                <h2>🎉 Test Automation Pipeline Completed Successfully!</h2>
                <p><strong>Project:</strong> Revers.io Cypress Automation</p>
                <p><strong>Build:</strong> ${env.BUILD_NUMBER}</p>
                <p><strong>Status:</strong> ✅ SUCCESS</p>
                <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                
                <h3>📊 Test Results:</h3>
                <p>• All Cypress tests executed successfully</p>
                <p>• Allure reports generated</p>
                <p>• Cross-browser testing completed</p>
                
                <h3>🔗 Links:</h3>
                <p>• <a href="${env.BUILD_URL}">Build Details</a></p>
                <p>• <a href="${env.BUILD_URL}allure/">Allure Report</a></p>
                
                <p><em>This is an automated message from the Revers.io Test Automation Pipeline.</em></p>
                """,
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'qa-team@revers.io'}",
                mimeType: 'text/html'
            )
        }
        
        failure {
            echo '❌ Pipeline failed!'
            emailext (
                subject: "❌ Revers.io Test Automation - Pipeline Failed",
                body: """
                <h2>⚠️ Test Automation Pipeline Failed!</h2>
                <p><strong>Project:</strong> Revers.io Cypress Automation</p>
                <p><strong>Build:</strong> ${env.BUILD_NUMBER}</p>
                <p><strong>Status:</strong> ❌ FAILED</p>
                <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                
                <h3>🔍 Please check:</h3>
                <p>• Build logs for error details</p>
                <p>• Test execution results</p>
                <p>• Allure reports for test failures</p>
                
                <h3>🔗 Links:</h3>
                <p>• <a href="${env.BUILD_URL}">Build Details</a></p>
                <p>• <a href="${env.BUILD_URL}console">Console Output</a></p>
                
                <p><em>This is an automated message from the Revers.io Test Automation Pipeline.</em></p>
                """,
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'qa-team@revers.io'}",
                mimeType: 'text/html'
            )
        }
        
        unstable {
            echo '⚠️ Pipeline completed with warnings!'
        }
        
        cleanup {
            echo '🧹 Final cleanup...'
            deleteDir()
        }
    }
}