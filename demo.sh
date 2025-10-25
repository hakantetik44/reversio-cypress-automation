#!/bin/bash

# Revers.io Cypress Automation Demo Script
# This script demonstrates the complete test automation setup for Revers.io

echo "🚀 Revers.io Cypress Automation Demo"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️ $1${NC}"
}

# Check if Node.js is installed
check_node() {
    print_step "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_step "Checking npm installation..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_step "Installing project dependencies..."
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Clean previous results
clean_results() {
    print_step "Cleaning previous test results..."
    rm -rf allure-results allure-report
    rm -rf cypress/screenshots cypress/videos
    rm -rf cypress/cucumber-json
    print_success "Previous results cleaned"
}

# Run tests in headless mode
run_tests_headless() {
    print_step "Running Cypress tests in headless mode..."
    echo -e "${PURPLE}🧪 Executing test scenarios:${NC}"
    echo "   • Frontend functionality tests (Revers.io homepage)"
    echo "   • API endpoint tests (8 different endpoints)"
    echo "   • Responsive design tests (mobile, tablet, desktop)"
    echo "   • Performance tests (page load times)"
    echo "   • Accessibility tests (alt text, headings)"
    echo "   • Navigation tests (links, menus)"
    echo "   • Content tests (company information)"
    echo ""
    
    if npm run test; then
        print_success "All tests completed successfully"
    else
        print_warning "Some tests failed - check the results"
    fi
}

# Run tests in headed mode (for demo)
run_tests_headed() {
    print_step "Running Cypress tests in headed mode (demo)..."
    print_info "This will open the Cypress Test Runner for interactive testing"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop the test runner when done${NC}"
    echo ""
    
    # Ask user if they want to run in headed mode
    read -p "Do you want to run tests in headed mode? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run cypress:open
    else
        print_info "Skipping headed mode tests"
    fi
}

# Generate Allure report
generate_allure_report() {
    print_step "Generating Allure test report..."
    if npm run allure:generate; then
        print_success "Allure report generated successfully"
        print_info "Report location: allure-report/index.html"
    else
        print_error "Failed to generate Allure report"
    fi
}

# Open Allure report
open_allure_report() {
    print_step "Opening Allure report..."
    if command -v allure &> /dev/null; then
        print_info "Opening Allure report in browser..."
        npm run allure:open
    else
        print_warning "Allure command not found. Please install Allure CLI."
        print_info "You can manually open: allure-report/index.html"
    fi
}

# Show test results summary
show_results_summary() {
    print_step "Test Results Summary"
    echo "====================="
    echo ""
    
    # Count test files
    TEST_FILES=$(find cypress/e2e/features -name "*.feature" | wc -l)
    echo -e "${CYAN}📁 Test Files:${NC} $TEST_FILES"
    
    # Count screenshots
    SCREENSHOTS=$(find cypress/screenshots -name "*.png" 2>/dev/null | wc -l)
    echo -e "${CYAN}📸 Screenshots:${NC} $SCREENSHOTS"
    
    # Count videos
    VIDEOS=$(find cypress/videos -name "*.mp4" 2>/dev/null | wc -l)
    echo -e "${CYAN}🎥 Videos:${NC} $VIDEOS"
    
    # Check if Allure report exists
    if [ -d "allure-report" ]; then
        echo -e "${CYAN}📊 Allure Report:${NC} Generated"
    else
        echo -e "${CYAN}📊 Allure Report:${NC} Not generated"
    fi
    
    echo ""
}

# Main demo function
main() {
    echo -e "${GREEN}🎯 Revers.io QA Lead Interview Demo${NC}"
    echo -e "${GREEN}=====================================${NC}"
    echo ""
    echo "This demo showcases:"
    echo "• Cypress + Cucumber.js test automation"
    echo "• Page Object Model implementation"
    echo "• Allure reporting integration"
    echo "• Jenkins CI/CD pipeline"
    echo "• Cross-browser testing"
    echo "• Performance and accessibility testing"
    echo ""
    
    # Check prerequisites
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Clean previous results
    clean_results
    
    # Run tests
    run_tests_headless
    
    # Generate reports
    generate_allure_report
    
    # Show results
    show_results_summary
    
    # Ask about headed mode
    run_tests_headed
    
    # Open reports
    open_allure_report
    
    echo ""
    echo -e "${GREEN}🎉 Demo completed successfully!${NC}"
    echo ""
    echo "Next steps for the interview:"
    echo "1. Show the Allure report with detailed test results"
    echo "2. Demonstrate the Page Object Model structure"
    echo "3. Explain the Jenkins pipeline configuration"
    echo "4. Discuss the test scenarios and coverage"
    echo ""
    echo -e "${BLUE}Good luck with your interview! 🍀${NC}"
}

# Run the demo
main
