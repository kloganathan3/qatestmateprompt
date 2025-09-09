# TestMate Prompt Wizard

A comprehensive web application for generating high-quality test case prompts for TestMate, specifically designed for Meta's wearables product testing teams. This tool helps QA teams create detailed, actionable prompts that enable TestMate to generate effective test strategies and test cases.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Scoring System](#scoring-system)
- [API Integration](#api-integration)
- [Analytics](#analytics)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Original Prompt](#original-prompt)

## Overview

TestMate Prompt Wizard is a single-page web application that guides users through a comprehensive form to gather all necessary information for generating effective TestMate prompts. The application features a sophisticated scoring system that encourages users to provide detailed, high-quality input to ensure valuable test case generation.

### Key Benefits

- **Quality Assurance**: Scoring system ensures Level 7+ input quality
- **Comprehensive Coverage**: Supports functional, performance, and stability testing
- **Multi-Device Support**: Handles device-only, multi-device, and constellation testing scenarios
- **Integration Ready**: Works with existing PRDs, test strategies, and documentation
- **Analytics Enabled**: Tracks usage patterns and identifies improvement opportunities

## Features

### Core Functionality

- **13-Question Progressive Form**: Comprehensive data collection for test case generation
- **Real-time Scoring System**: Level-based scoring (1-10 scale) with Level 7+ target
- **Dynamic Validation**: Real-time field validation with helpful error messages
- **Auto-save**: Automatic form data persistence with restoration capability
- **Prompt Generation**: OpenAI GPT-4o powered prompt generation via wearables-ape API
- **Export Options**: Copy to clipboard and download as text file

### User Experience

- **Modern UI**: Clean, professional interface with white background and black accents
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Clear visual feedback during API operations
- **Error Handling**: Comprehensive error management with user-friendly messages
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### Technical Features

- **Extensive Logging**: Comprehensive console logging for debugging and monitoring
- **Google Analytics**: Integrated analytics with custom event tracking
- **Performance Monitoring**: API response time tracking and optimization
- **Browser Compatibility**: Modern browser support with graceful fallbacks
- **Security**: Input sanitization and XSS protection

## Architecture

### Project Structure

```
TestMatePromptWizard/
├── index.html              # Main application file
├── css/
│   ├── styles.css          # Main stylesheet
│   └── components.css      # Component-specific styles
├── js/
│   ├── app.js              # Main application controller
│   ├── api.js              # API integration module
│   ├── scoring.js          # Scoring system
│   ├── analytics.js        # Google Analytics integration
│   └── utils.js            # Utility functions
├── assets/                 # Static assets (if needed)
└── README.md              # This documentation
```

### Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Analytics**: Google Analytics 4
- **API**: OpenAI GPT-4o via wearables-ape.io endpoint
- **Storage**: LocalStorage for auto-save functionality
- **Deployment**: Static hosting (local or GitHub Pages)

### Module Overview

#### 1. Utils Module (`js/utils.js`)
- Logging and debugging utilities
- Form validation functions
- Data sanitization and security
- Storage helpers (localStorage/sessionStorage)
- Common utility functions

#### 2. Analytics Module (`js/analytics.js`)
- Google Analytics integration
- Event tracking for user interactions
- Performance monitoring
- Error tracking and reporting
- Custom dimensions and metrics

#### 3. Scoring System (`js/scoring.js`)
- Real-time score calculation
- Field weight management
- Validation rules enforcement
- Score history tracking
- Recommendations engine

#### 4. API Service (`js/api.js`)
- OpenAI API integration
- Request/response handling
- Retry logic and error recovery
- Prompt generation and enhancement
- API key validation

#### 5. Main Application (`js/app.js`)
- Application lifecycle management
- Event handling and coordination
- Form management and validation
- UI state management
- User interaction handling

## Installation

### Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Internet connection for API calls and analytics
- APE API key for OpenAI integration

### Setup Instructions

1. **Download/Clone the Project**
   ```bash
   # Clone or download the project files
   git clone <repository-url>
   cd TestMatePromptWizard
   ```

2. **Local Development Server**
   ```bash
   # Option 1: Python HTTP Server
   python -m http.server 8000

   # Option 2: Node.js http-server
   npx http-server -p 8000

   # Option 3: PHP built-in server
   php -S localhost:8000
   ```

3. **Open in Browser**
   ```
   http://localhost:8000
   ```

### GitHub Pages Deployment

1. **Repository Setup**
   - Create a new GitHub repository
   - Upload all project files to the repository
   - Ensure `index.html` is in the root directory

2. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save settings

3. **Access Application**
   - Your app will be available at: `https://yourusername.github.io/repository-name`

## Usage

### Getting Started

1. **Open the Application**
   - Navigate to the hosted URL or local development server
   - The application loads with the disclaimer and empty form

2. **Fill the Form**
   - Start with basic product information (Question 1-3)
   - Progress through testing environment setup (Question 4)
   - Provide roadmap and feature details (Questions 5-7)
   - Specify test requirements (Questions 8-10)
   - Configure API settings (Questions 11-13)

3. **Monitor Your Score**
   - Watch the real-time score updates in the header
   - Aim for Level 7+ for optimal results
   - Follow validation messages and recommendations

4. **Generate Prompt**
   - Click "Generate TestMate Prompt" when ready
   - Wait for the AI-powered generation process
   - Review and use the generated prompt

### Form Questions Explained

#### Product Information
1. **Product Selection**: Choose from Malibu, Ceres, Hypernova, Supernova, Florian, Artemis, SSG
2. **Product Description**: Detailed explanation of the product (minimum 20 characters)
3. **Product PRD Link**: Optional link to product requirements document

#### Testing Environment
4. **Test Environment Type**:
   - Device Only: Single device testing
   - Multi-Device: Testing across multiple devices
   - Constellation: Complex multi-device ecosystem testing

#### Roadmap Information
5. **Roadmap Task**: Task number and high-level description
6. **PRD Link**: Link to feature-specific requirements document
7. **Test Strategy Link**: Link to existing test strategy (if available)

#### Test Specifications
8. **Test Case Types**: Select from functional, performance, stability testing
9. **Workflow Types**: Choose positive-only or comprehensive (includes negative/destructive)
10. **Existing Test Cases**: Link to current test cases (for exclusion)

#### API Configuration
11. **External Services**: Pre-populated API information (read-only)
12. **APE API Key**: Your personal API key for OpenAI access
13. **Meta Capabilities**: Enable Meta-approved OpenAI capabilities

### Scoring System Details

The scoring system evaluates form completion and quality across multiple dimensions:

#### Scoring Criteria

- **Required Fields**: Critical fields have higher weights
- **Content Quality**: Longer, detailed descriptions score higher
- **URL Validation**: Valid links receive bonus points
- **Completion Bonus**: High completion rates get additional points
- **Field Relationships**: Conditional field requirements (e.g., device list for multi-device testing)

#### Score Levels

- **Level 0-3**: Insufficient information - generation blocked
- **Level 4-6**: Minimum viable - generation allowed with warnings
- **Level 7-10**: Target quality - optimal prompt generation

#### Recommendations

The system provides real-time recommendations to improve scores:
- Missing required field alerts
- Content quality suggestions
- Optional high-value field recommendations
- Field-specific improvement guidance

### Best Practices

#### For High-Quality Prompts

1. **Be Specific**: Provide detailed product descriptions and use case information
2. **Include Documentation**: Add PRD links and test strategy references when available
3. **Consider Test Scope**: Think about the complete testing environment and scenarios
4. **Specify Requirements**: Clearly indicate what types of test cases you need
5. **Provide Context**: Include roadmap information and feature objectives

#### For Optimal Results

1. **Aim for Level 7+**: Higher scores produce better, more targeted prompts
2. **Use Valid URLs**: Properly formatted links improve context and scoring
3. **Fill Optional Fields**: High-value optional fields significantly improve results
4. **Review and Refine**: Use the auto-save feature to iterate and improve your input
5. **Test Different Approaches**: Experiment with various test case type combinations

## API Integration

### OpenAI GPT-4o Configuration

The application uses OpenAI's GPT-4o model via the wearables-ape.io endpoint:

```javascript
Base URL: https://api.wearables-ape.io/models/v1
Model: gpt-4o
Max Tokens: 2000
Temperature: 0.7 (balanced creativity and consistency)
```

### API Key Management

- **Primary**: User-provided APE API key (recommended)
- **Fallback**: Built-in API key for basic functionality
- **Validation**: Real-time API key format and connectivity testing
- **Security**: Keys are not stored permanently, only used for session

### Request/Response Handling

- **Retry Logic**: Automatic retry with exponential backoff
- **Error Handling**: Comprehensive error categorization and user feedback
- **Timeout Management**: 30-second request timeout with abort capability
- **Performance Tracking**: Response time monitoring and analytics

### Prompt Engineering

The system uses sophisticated prompt engineering techniques:

#### System Prompt
- Defines TestMate context and expertise
- Establishes wearables testing focus
- Provides structured output requirements
- Ensures consistency across generations

#### User Prompt Construction
- Dynamic content based on form inputs
- Structured information organization
- Context-aware field handling
- Special instruction integration

## Analytics

### Google Analytics Integration

The application includes comprehensive analytics tracking:

```javascript
Tracking ID: G-Q98010P7LZ
Event Categories: Form Interaction, API Usage, Performance, Errors
Custom Dimensions: Product type, test environment, completion score
```

### Tracked Events

#### User Interactions
- Form field interactions (input, change, focus)
- Button clicks and navigation
- Copy/download actions
- Form submissions and resets

#### Performance Metrics
- Page load times
- API response times
- Score calculation performance
- Error rates and recovery

#### Business Metrics
- Completion rates by product type
- Score distribution analysis
- Feature usage patterns
- API usage statistics

### Privacy and Compliance

- **Data Collection**: Only functional and performance data
- **User Privacy**: No personally identifiable information stored
- **Company Compliance**: Meta-approved analytics account
- **Data Retention**: Standard Google Analytics retention policies

## Development

### Code Organization

#### Modular Architecture
- Separate modules for distinct functionality
- Clear separation of concerns
- Global instances for cross-module communication
- Event-driven architecture for loose coupling

#### Coding Standards
- ES6+ JavaScript features
- Comprehensive error handling
- Extensive logging for debugging
- JSDoc comments for documentation

#### Performance Optimization
- Debounced event handlers
- Lazy loading where appropriate
- Efficient DOM manipulation
- Minimal external dependencies

### Debugging and Logging

#### Console Logging Categories
- `[TestMate][INFO]`: General information
- `[TestMate][FORM]`: Form-related events
- `[TestMate][SCORE]`: Scoring system updates
- `[TestMate][API]`: API interactions
- `[TestMate][ERROR]`: Error conditions

#### Debug Mode
```javascript
// Enable debug mode
utils.debugMode = true;

// View application status
console.log(testMateApp.getAppStatus());

// Check scoring statistics
console.log(scoringSystem.getScoreStatistics());
```

### Testing

#### Manual Testing Checklist
- [ ] Form validation for all field types
- [ ] Score calculation accuracy
- [ ] API integration and error handling
- [ ] Cross-browser compatibility
- [ ] Responsive design functionality
- [ ] Analytics event firing

#### Browser Testing Matrix
- Chrome 90+ (Primary)
- Firefox 88+
- Safari 14+
- Edge 90+

### Customization

#### Styling Modifications
- Edit `css/styles.css` for global styles
- Modify `css/components.css` for specific components
- Responsive breakpoints: 768px (tablet), 480px (mobile)

#### Functionality Extensions
- Add new validation rules in `initializeValidationRules()`
- Extend scoring system in `scoring.js`
- Add new analytics events in `analytics.js`
- Implement additional API endpoints in `api.js`

## Troubleshooting

### Common Issues

#### Score Not Updating
**Symptoms**: Score remains at 0 or doesn't change
**Solutions**:
1. Check browser console for JavaScript errors
2. Verify form fields have proper `name` or `id` attributes
3. Ensure scoring system is initialized: `scoringSystem.currentScore`

#### API Generation Fails
**Symptoms**: "Failed to generate prompt" error
**Solutions**:
1. Verify API key format and validity
2. Check network connectivity
3. Review browser console for detailed error messages
4. Try the fallback API key option

#### Form Data Not Saving
**Symptoms**: Form resets unexpectedly or data doesn't restore
**Solutions**:
1. Check localStorage availability: `localStorage.setItem('test', 'test')`
2. Verify browser storage settings and quota
3. Clear localStorage if corrupted: `localStorage.clear()`

#### Analytics Not Tracking
**Symptoms**: No events appearing in Google Analytics
**Solutions**:
1. Verify Google Analytics script loads: check for `gtag` function
2. Check browser ad blockers and privacy settings
3. Confirm tracking ID matches: `G-Q98010P7LZ`

### Error Codes

#### API Errors
- **401 Unauthorized**: Invalid API key
- **429 Rate Limited**: Too many requests
- **500 Server Error**: API service issues
- **Timeout**: Request exceeded 30 seconds

#### Application Errors
- **Form Validation**: Check field requirements and formats
- **Score Calculation**: Verify field weights and values
- **Storage**: Browser storage quota or permissions

### Browser Compatibility

#### Supported Features
- ES6+ JavaScript (async/await, classes, modules)
- Fetch API for network requests
- LocalStorage for data persistence
- CSS3 features (flexbox, grid, animations)

#### Fallbacks
- `execCommand('copy')` for older clipboard API
- Polyfills for missing features automatically loaded
- Graceful degradation for advanced CSS features

### Performance Optimization

#### Best Practices
- Enable browser caching for static assets
- Use CDN for external dependencies if needed
- Minimize DOM queries and manipulations
- Debounce expensive operations (scoring, validation)

#### Memory Management
- Clear event listeners on page unload
- Remove unused DOM references
- Limit stored data size (auto-save, analytics)

## Original Prompt

This section contains the complete original prompt that was used to create this TestMate Prompt Wizard application, preserved as a reference for understanding the project requirements and design decisions.

---

Here is a description for an application I need you to create. Please think of the right implementation, architecture, dependencies and resources needed and propose a plan. You must NOT not start coding and creating files until the user has approved your plan.

Application Title: TestMate Prompt WIzard

Purpose of the application: The purpose of this application will be similar to vibe coding prompt wizard (https://pages.ghe.oculus-rep.com/jeremieg/prompt-wizard) but for TestMate (https://www.internalfb.com/testmate/home) which is used by QA teams to either generate the test strategy or generatation of test cases for a specific feature or product within wearables product lines such as Malibu, Ceres, Hypernova, Supernova, Florian, Aretmis and SSG.
Based on the inputs the application should give a score similar to vibe coding prompt wizard

Look and feel of the application: Modern and sleek with white back ground, black text boxes for inputs and black text.

Known UI Elements Required:
1. The application will be a full screen desktop web application with questions where user can enter the roadmap task number, the link to the PRD, link to Figma files and free form description of features.
User is prompted to enter on what types of test cases they would like to generate such as functional test cases, performance test cases, stability test cases, all positive or negative test cases.
User is prompted with questions about their setup such as standalone device, standalone mobile app, multi-device or constellation settings

User Flows:
1. User is presented with the web application with title of the application on the top along with  the following disclaimer.
You need to reach at least Level 7 to get a valuable output from this tool
Garbage (prompt) in → garbage (app) out.
If you don't give right inputs about your product, your feature under consideration, links to PRD, FIgma and important details below the output prompt will not be super useful.
User is prompted to add in the relevant details for each of the following questions.

1-What is the product you are looking to generate test cases for?
2- Please describe the product in your own words
3- If you have the link to the product's PRD - provide the link here
4-DO you need to create device only test cases, multi-device or constellation use cases? Please include the list of devices for multi-device and constellation use cases.
5- Please input the roadmap task number and high level description of what this roadmap task is about.
6- If you have a PRD - provide the PRD link.
7- If you have an existing test strategy for this feature - provide the strategy link.
8- What type of test cases you need to generate (functional test cases, performance test cases, stability test cases)
9- Do you only need positive workflows or you also need negative and destructive workflows as well?
10- If you already have existing test cases, provide the link so they can be excluded from test case generation effort from TestMate
11-Known External Services or APIs Needed (This text box is already populated and can't take input - the text contains "You can use API calls to openAI GPT 4o for any logic required in this application using the following endpoint: "https://api.wearables-ape.io/models/v1/chat/completions" instead of "https://api.openai.com/v1/chat/completions". If using images in prompts always use high details. Set max tokens to 2000. If audio transcription is needed in the logic of this app, use the following API call instructions: curl -X 'POST' 'https://api.wearables-ape.io/models/v1/audio/transcriptions' -H 'accept: application/json' -H 'Content-Type: multipart/form-data' -H 'Authorization: Bearer TOKEN' -F 'model=whisper' -F 'language=en' -F 'file=<FILE>.mp3;type=audio/mpeg' Send the file as a multipart form data, not a base64 encoded blob. Use the following API key 02c9c859-7ee8-4515-9c0f-f706094df1f8"
12-APE API Key: *
Get a key at https://wearables-ape.io/settings/api-keys
13- Check mark for Use Meta-Approved OpenAI Capabilities which when checked allows users to user meta approved openAI capabilities

User inputs and actions to take on these inputs:
1. Based on all the inputs, this tool should generate the prompt similar to what is produced by Vibe Coding Prompt WIzard.
Please include following details in addition to the generated prompt.


Analytics. Add Google Analytics tracking using tag ID: G-Q98010P7LZ (Comment to human readers - this is a compliant Meta-account Google Analytics, for data points on resources needed to scale the program)

Debuggability: The application should be highly debuggable. Add console logs extensively for every step of the user flows and every step of the application loading or logic.

Documentation: Create a fully detailed README.md that covers the full solution, so that the project and code base is always easily understandable to both humans and AI Agents. You need to include a section called "Original Prompt" that includes this full prompt without any edits, as it will serve as a reference for the prompt that originally created the baseline of the code base.

Security and privacy: This application will be run either locally on a secure company laptop or in a GitHub Enterprise environment as a GitHub page, which will only be accessible to company employees from a secure network and secure machines.

As reminder, your task is to think of the right implementation, architecture, dependencies and resources needed and propose a plan.You must NOT not start coding and creating files until the user has approved your plan.

Mock Data: no mock data is required

Known External Services or APIs Needed: You can use API calls to openAI GPT 4o for any logic required in this application using the following endpoint: "https://api.wearables-ape.io/models/v1/chat/completions" instead of "https://api.openai.com/v1/chat/completions". If using images in prompts always use high details. Set max tokens to 2000. If audio transcription is needed in the logic of this app, use the following API call instructions: curl -X 'POST' 'https://api.wearables-ape.io/models/v1/audio/transcriptions' -H 'accept: application/json' -H 'Content-Type: multipart/form-data' -H 'Authorization: Bearer TOKEN' -F 'model=whisper' -F 'language=en' -F 'file=<FILE>.mp3;type=audio/mpeg' Send the file as a multipart form data, not a base64 encoded blob. Use the following API key 02c9c859-7ee8-4515-9c0f-f706094df1f8

Technical Constraints: A HTML web app with CSS and JavaScript that can be run locally. Any network accessible resource or API can be used.

Machine used to run this app: I'm using a Macbook and Google Chrome, both updated to the latest version

Media: Use the https://picsum.photos/ endoint to get images, as needed in this project. To get a square image: Append the desired size to the URL, example: https://picsum.photos/400 will return a 400x400 pixel image. To get a rectangular image: Append the desired width, followed by the height, example: https://picsum.photos/400/250 will return a 400x250 pixel image. To ensure a new image is fetched every time, you can add ?random=<some_number> to the end of the URL (e.g., https://picsum.photos/400?random=1).

Analytics. Add Google Analytics tracking using tag ID: G-Q98010P7LZ (Comment to human readers - this is a compliant Meta-account Google Analytics, for data points on resources needed to scale the program)

Debuggability: The application should be highly debuggable. Add console logs extensively for every step of the user flows and every step of the application loading or logic.

Documentation: Create a fully detailed README.md that covers the full solution, so that the project and code base is always easily understandable to both humans and AI Agents. You need to include a section called "Original Prompt" that includes this full prompt without any edits, as it will serve as a reference for the prompt that originally created the baseline of the code base.

Security and privacy: This application will be run either locally on a secure company laptop or in a GitHub Enterprise environment as a GitHub page, which will only be accessible to company employees from a secure network and secure machines.

As reminder, your task is to think of the right implementation, architecture, dependencies and resources needed and propose a plan.You must NOT not start coding and creating files until the user has approved your plan.

---

This original prompt serves as the foundational specification for the TestMate Prompt Wizard application. All implementation decisions and features trace back to these requirements, ensuring the delivered solution meets the intended use case and quality standards.

## License

This project is proprietary software developed for Meta's internal use. All rights reserved.

## Support

For technical support or questions:
1. Check this README for common solutions
2. Review browser console logs for detailed error information
3. Contact the development team with specific error messages and reproduction steps

---

**Generated by TestMate Prompt Wizard v1.0**
Built with ❤️ for Meta's Wearables QA Teams
