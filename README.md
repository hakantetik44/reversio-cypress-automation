# Revers.io Cypress Automation - QA Lead Interview Project

Ce projet démontre une solution complète d'automatisation de tests pour la plateforme Revers.io, utilisant Cypress, Cucumber.js, et des pratiques de test modernes.

## 🎯 Objectif du Projet

Ce projet a été créé pour démontrer les compétences en automatisation de tests lors d'un entretien pour le poste de QA Lead chez Revers.io. Il showcase:

- **Expertise technique** en automatisation de tests
- **Page Object Model** pour une architecture maintenable
- **BDD avec Cucumber.js** pour des tests lisibles
- **Rapports Allure** pour une visualisation professionnelle
- **Pipeline Jenkins** pour l'intégration continue
- **Tests cross-browser** et responsive
- **Tests de performance** et d'accessibilité

## 🚀 Fonctionnalités

- **Tests Cypress**: Tests end-to-end avec Cypress
- **Cucumber.js**: Tests BDD avec syntaxe Gherkin en français
- **Page Object Model**: Structure de tests maintenable
- **Rapports Allure**: Rapports de tests professionnels
- **Intégration Jenkins**: Pipeline CI/CD complet
- **Tests cross-browser**: Chrome, Firefox, Safari, Edge
- **Tests responsive**: Mobile, tablette, desktop
- **Tests de performance**: Temps de chargement et Core Web Vitals
- **Tests d'accessibilité**: Conformité WCAG
- **Tests API**: Validation des API REST

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- npm (v8 ou supérieur)
- Navigateur Chrome (pour les tests)
- Allure CLI (pour les rapports)

## 🛠️ Installation

1. Cloner le repository:
```bash
git clone <repository-url>
cd reversio-cypress-automation
```

2. Installer les dépendances:
```bash
npm install
```

## 🎮 Utilisation

### Exécution des Tests

#### Exécuter tous les tests en mode headless:
```bash
npm run cypress:run
```

#### Exécuter les tests en mode interactif:
```bash
npm run cypress:open
```

#### Exécuter les tests sur un navigateur spécifique:
```bash
npm run cypress:run:chrome
npm run cypress:run:firefox
npm run cypress:run:edge
```

### Rapports Allure

#### Générer le rapport Allure:
```bash
npm run allure:generate
```

#### Ouvrir le rapport Allure:
```bash
npm run allure:open
```

#### Servir le rapport Allure:
```bash
npm run allure:serve
```

### Script de Démonstration

Exécuter la démonstration complète:
```bash
./demo.sh
```

## 📁 Structure du Projet

```
cypress/
├── e2e/
│   ├── frontend.cy.js            # Tests frontend
│   └── api.cy.js                 # Tests API
├── fixtures/
│   └── testData.json            # Données de test
├── support/
│   ├── commands.js             # Commandes personnalisées
│   ├── e2e.js                  # Configuration e2e
│   └── pages/                  # Page Object Model
│       ├── BasePage.js        # Page de base
│       ├── HomePage.js        # Page d'accueil
│       ├── LoginPage.js       # Page de connexion
│       └── ReversioPlatformPage.js # Page de la plateforme
├── screenshots/                # Captures d'écran
└── videos/                    # Vidéos des tests
```

## 🧪 Scénarios de Test

### Tests Frontend
- Vérification du chargement de la page
- Éléments de navigation
- Contenu de la section héro
- Design responsive (mobile, tablette, desktop)
- Métriques de performance
- Tests d'accessibilité
- Formulaire de contact avec validation

### Tests API
- Endpoints principaux
- Tests de sécurité
- Tests de performance
- Validation des données
- Tests d'intégration
- Gestion des erreurs

## 🔧 Pipeline Jenkins

Le projet inclut un pipeline Jenkins qui:
- Installe les dépendances
- Exécute les tests sur plusieurs navigateurs
- Génère les rapports Allure
- Archive les artefacts
- Envoie des notifications par email

## ⚙️ Configuration

### Configuration Cypress
- URL de base: https://revers.io
- Viewport: 1280x720
- Enregistrement vidéo: Activé
- Captures d'écran en cas d'échec: Activé
- Timeout par défaut: 10 secondes

### Configuration Allure
- Répertoire des résultats: allure-results
- Répertoire des rapports: allure-report
- Catégories: Échoués, Cassés, Ignorés, Réussis

## 🎯 Points Clés pour l'Entretien

### Architecture et Design Patterns
- **Page Object Model**: Séparation claire entre les tests et les éléments de page
- **BasePage**: Classe de base avec des méthodes communes
- **Sélecteurs centralisés**: Gestion des sélecteurs dans les classes de page
- **Méthodes de retry**: Gestion des éléments instables

### Qualité des Tests
- **Tests en français**: Scénarios BDD lisibles par les parties prenantes
- **Couverture complète**: Tests fonctionnels, de sécurité, de performance
- **Tests de données**: Utilisation de tables de données pour les tests
- **Tests négatifs**: Validation des cas d'erreur

### Intégration et DevOps
- **Pipeline Jenkins**: Automatisation complète du processus
- **Rapports Allure**: Visualisation professionnelle des résultats
- **Tests cross-browser**: Validation sur plusieurs navigateurs
- **Notifications**: Alertes automatiques par email

### Bonnes Pratiques
- **Code maintenable**: Structure claire et documentation
- **Gestion des erreurs**: Gestion robuste des échecs
- **Performance**: Tests de temps de chargement
- **Accessibilité**: Tests de conformité WCAG

## 📊 Métriques de Qualité

- **Couverture de test**: Tests fonctionnels complets
- **Stabilité**: Gestion des éléments instables
- **Performance**: Tests de temps de réponse
- **Sécurité**: Tests de vulnérabilités
- **Accessibilité**: Tests de conformité

## 🚀 Démonstration

Pour une démonstration complète:

1. Exécuter le script de démonstration:
```bash
./demo.sh
```

2. Montrer les rapports Allure
3. Expliquer l'architecture Page Object Model
4. Démontrer le pipeline Jenkins
5. Discuter des scénarios de test et de la couverture

## 📝 Notes pour l'Entretien

- **Expertise technique**: Démonstration de compétences avancées en automatisation
- **Pensée critique**: Analyse des besoins et conception de solutions
- **Communication**: Explication claire des concepts techniques
- **Innovation**: Utilisation d'outils modernes et de bonnes pratiques

## 🏷️ Système de Tags

- `@smoke`: Tests critiques
- `@critique`: Tests les plus importants
- `@négatif`: Tests négatifs
- `@sécurité`: Tests de sécurité
- `@performance`: Tests de performance
- `@accessibilité`: Tests d'accessibilité
- `@responsive`: Tests responsive
- `@navigation`: Tests de navigation
- `@contenu`: Tests de contenu
- `@contact`: Tests de formulaire de contact

## 📈 Bonnes Pratiques

### Page Object Model
- Classe séparée pour chaque page
- Sélecteurs d'éléments centralisés
- Méthodes réutilisables
- Utilisation de l'héritage

### Cucumber BDD
- Syntaxe Gherkin
- Tests lisibles par les métiers
- Définitions d'étapes
- Tables de données

### Gestion des Données de Test
- Utilisation des fixtures
- Données spécifiques à l'environnement
- Tests pilotés par les données

### Gestion des Erreurs
- Mécanisme de retry
- Assertions personnalisées
- Capture d'écran en cas d'échec
- Enregistrement vidéo

## 🔍 Débogage

### Débogage Cypress
```bash
npx cypress open
```

### Logs de Console
```javascript
cy.log('Message de débogage')
```

### Captures d'Écran
```javascript
cy.screenshot('capture-debug')
```

## 📞 Contact

Ce framework a été développé pour le poste de QA Lead chez Revers.io.

## 📄 Licence

Ce projet est sous licence ISC.