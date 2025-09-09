/**
 * TestMate Prompt Wizard - Main Application Controller
 * Coordinates all modules and handles user interactions
 */

class TestMateApp {
    constructor() {
        this.form = null;
        this.isInitialized = false;
        this.formStartTime = null;
        this.debouncedUpdateScore = null;
        this.validationRules = this.initializeValidationRules();
        this.autoSaveEnabled = true;
        this.autoSaveKey = 'testmate_form_data';
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            utils.log('Initializing TestMate Prompt Wizard', 'APP');

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                this.initializeApp();
            }

        } catch (error) {
            utils.log('App initialization failed', 'ERROR', error);
            analytics.trackError(`App Initialization: ${error.message}`, 'Application Error', true);
        }
    }

    /**
     * Initialize the application after DOM is ready
     */
    async initializeApp() {
        try {
            // Get form element
            this.form = document.getElementById('testmateForm');
            if (!this.form) {
                throw new Error('Form element not found');
            }

            // Setup debounced score updates
            this.debouncedUpdateScore = utils.debounce((formData, triggerField) => {
                scoringSystem.updateScore(formData, triggerField);
            }, 300);

            // Initialize components
            this.setupEventListeners();
            this.setupFormValidation();
            this.setupAutoSave();
            this.restoreFormData();

            // Track session start
            analytics.trackSessionInfo();

            // Mark as initialized
            this.isInitialized = true;
            this.formStartTime = Date.now();

            utils.log('TestMate Prompt Wizard initialized successfully', 'APP');

            // Track initialization
            analytics.trackUserAction('app_initialized', 'Application', 'Successful');

        } catch (error) {
            utils.log('App component initialization failed', 'ERROR', error);
            analytics.trackError(`App Component Init: ${error.message}`, 'Application Error', true);
            this.showErrorMessage('Failed to initialize application. Please refresh the page.');
        }
    }

    /**
     * Initialize validation rules for form fields
     */
    initializeValidationRules() {
        return {
            product: { required: true },
            productDescription: { required: true, minLength: 20 },
            productPrdLink: { url: true },
            testEnvironment: { required: true },
            roadmapTask: { required: true, minLength: 5 },
            roadmapDescription: { required: true, minLength: 20 },
            prdLink: { url: true },
            testStrategyLink: { url: true },
            testCaseTypes: { required: true },
            workflowTypes: { required: true },
            existingTestCases: { url: true },
            apeApiKey: { required: true, apiKey: true, minLength: 16 },
            useMetaCapabilities: {}
        };
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        utils.log('Setting up event listeners', 'APP');

        // Form input events
        this.form.addEventListener('input', this.handleFormInput.bind(this));
        this.form.addEventListener('change', this.handleFormChange.bind(this));

        // Button events
        const generateButton = document.getElementById('generatePrompt');
        if (generateButton) {
            generateButton.addEventListener('click', this.handleGeneratePrompt.bind(this));
        }

        const resetButton = document.getElementById('resetForm');
        if (resetButton) {
            resetButton.addEventListener('click', this.handleResetForm.bind(this));
        }

        const copyButton = document.getElementById('copyPrompt');
        if (copyButton) {
            copyButton.addEventListener('click', this.handleCopyPrompt.bind(this));
        }

        const downloadButton = document.getElementById('downloadPrompt');
        if (downloadButton) {
            downloadButton.addEventListener('click', this.handleDownloadPrompt.bind(this));
        }

        // Test environment change handler for device list
        const testEnvironmentRadios = document.querySelectorAll('input[name="testEnvironment"]');
        testEnvironmentRadios.forEach(radio => {
            radio.addEventListener('change', this.handleTestEnvironmentChange.bind(this));
        });

        // Window events
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

        // Error handling for uncaught errors
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    /**
     * Handle form input events
     */
    handleFormInput(event) {
        const field = event.target;
        const fieldName = field.name || field.id;

        if (!fieldName) return;

        utils.log(`Form input: ${fieldName}`, 'FORM');

        // Track form interaction
        analytics.trackFormInteraction('field_input', fieldName, field.value?.length || 0);

        // Update score (debounced)
        const formData = utils.getFormData(this.form);
        this.debouncedUpdateScore(formData, fieldName);

        // Auto-save (debounced)
        if (this.autoSaveEnabled) {
            this.debouncedAutoSave(formData);
        }
    }

    /**
     * Handle form change events
     */
    handleFormChange(event) {
        const field = event.target;
        const fieldName = field.name || field.id;

        if (!fieldName) return;

        utils.log(`Form change: ${fieldName}`, 'FORM');

        // Validate field immediately on change
        this.validateField(field);

        // Track form interaction
        analytics.trackFormInteraction('field_change', fieldName, field.value?.length || 0);

        // Update score immediately for changes
        const formData = utils.getFormData(this.form);
        scoringSystem.updateScore(formData, fieldName);

        // Auto-save
        if (this.autoSaveEnabled) {
            this.saveFormData(formData);
        }
    }

    /**
     * Handle test environment change to show/hide device list
     */
    handleTestEnvironmentChange(event) {
        const deviceListInput = document.getElementById('deviceList');
        if (!deviceListInput) return;

        const value = event.target.value;

        if (value === 'multi-device' || value === 'constellation') {
            deviceListInput.classList.add('show');
            deviceListInput.required = true;
        } else {
            deviceListInput.classList.remove('show');
            deviceListInput.required = false;
            deviceListInput.value = ''; // Clear the field
        }

        utils.log(`Test environment changed: ${value}`, 'FORM');
    }

    /**
     * Handle generate prompt button click
     */
    async handleGeneratePrompt() {
        try {
            utils.log('Generate prompt button clicked', 'USER');
            analytics.trackUserAction('generate_prompt_clicked', 'Form Action');

            // Validate form first
            if (!this.validateForm()) {
                utils.log('Form validation failed', 'FORM');
                this.showErrorMessage('Please fix the form errors before generating the prompt.');
                return;
            }

            // Get form data
            const formData = utils.getFormData(this.form);
            const currentScore = scoringSystem.currentScore;

            // Check score requirement
            if (currentScore < 4) {
                this.showErrorMessage('Your score is too low. Please fill more fields to reach at least level 4.');
                return;
            }

            // Show loading state
            this.showLoadingState(true);

            // Calculate completion time
            const completionTime = Date.now() - this.formStartTime;

            // Track form submission
            analytics.trackFormSubmission(currentScore, completionTime, formData);

            // Generate prompt
            const result = await apiService.generatePrompt(formData);

            if (result.success) {
                this.displayGeneratedPrompt(result.prompt, result.metadata);
                utils.showSuccessMessage('TestMate prompt generated successfully!');
                analytics.trackUserAction('prompt_generated_success', 'Generation');
            } else {
                this.showErrorMessage(`Failed to generate prompt: ${result.error}`);
                analytics.trackUserAction('prompt_generated_failure', 'Generation', result.error);
            }

        } catch (error) {
            utils.log('Generate prompt failed', 'ERROR', error);
            analytics.trackError(`Generate Prompt: ${error.message}`, 'User Action');
            this.showErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            this.showLoadingState(false);
        }
    }

    /**
     * Handle reset form button click
     */
    handleResetForm() {
        try {
            utils.log('Reset form button clicked', 'USER');
            analytics.trackUserAction('form_reset_clicked', 'Form Action');

            if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
                this.form.reset();

                // Reset score
                scoringSystem.resetScore();

                // Clear auto-saved data
                utils.storage.remove(this.autoSaveKey);

                // Hide results
                const resultsSection = document.getElementById('resultsSection');
                if (resultsSection) {
                    resultsSection.style.display = 'none';
                }

                // Hide device list
                const deviceListInput = document.getElementById('deviceList');
                if (deviceListInput) {
                    deviceListInput.classList.remove('show');
                }

                // Clear validation states
                this.clearValidationStates();

                utils.showSuccessMessage('Form has been reset successfully.');
                analytics.trackUserAction('form_reset_completed', 'Form Action');

                // Restart timing
                this.formStartTime = Date.now();
            }
        } catch (error) {
            utils.log('Reset form failed', 'ERROR', error);
            analytics.trackError(`Reset Form: ${error.message}`, 'User Action');
        }
    }

    /**
     * Handle copy prompt button click
     */
    async handleCopyPrompt() {
        try {
            const promptOutput = document.getElementById('promptOutput');
            if (!promptOutput) return;

            const promptText = promptOutput.textContent;
            if (!promptText) {
                this.showErrorMessage('No prompt to copy.');
                return;
            }

            const success = await utils.copyToClipboard(promptText);

            if (success) {
                utils.showSuccessMessage('Prompt copied to clipboard!');
                analytics.trackContentAction('copy', 'prompt', promptText.length);

                // Visual feedback
                const copyButton = document.getElementById('copyPrompt');
                if (copyButton) {
                    copyButton.classList.add('copy-success');
                    setTimeout(() => copyButton.classList.remove('copy-success'), 2000);
                }
            } else {
                this.showErrorMessage('Failed to copy prompt to clipboard.');
            }

        } catch (error) {
            utils.log('Copy prompt failed', 'ERROR', error);
            this.showErrorMessage('Failed to copy prompt.');
        }
    }

    /**
     * Handle download prompt button click
     */
    handleDownloadPrompt() {
        try {
            const promptOutput = document.getElementById('promptOutput');
            if (!promptOutput) return;

            const promptText = promptOutput.textContent;
            if (!promptText) {
                this.showErrorMessage('No prompt to download.');
                return;
            }

            const timestamp = utils.formatDate().replace(/[:/\s]/g, '-');
            const filename = `testmate-prompt-${timestamp}.txt`;

            // Create enhanced content with metadata
            const downloadContent = this.createDownloadContent(promptText);

            utils.downloadAsFile(downloadContent, filename);

            analytics.trackContentAction('download', 'prompt', promptText.length);
            utils.showSuccessMessage('Prompt downloaded successfully!');

        } catch (error) {
            utils.log('Download prompt failed', 'ERROR', error);
            this.showErrorMessage('Failed to download prompt.');
        }
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        utils.log('Setting up form validation', 'APP');

        // Add blur event listeners for real-time validation
        const formFields = this.form.querySelectorAll('input, textarea, select');
        formFields.forEach(field => {
            if (field.name || field.id) {
                field.addEventListener('blur', () => this.validateField(field));
            }
        });
    }

    /**
     * Validate a single field
     */
    validateField(field) {
        const fieldName = field.name || field.id;
        const rules = this.validationRules[fieldName];

        if (!rules) return true;

        return utils.validateField(field, rules);
    }

    /**
     * Validate the entire form
     */
    validateForm() {
        let isValid = true;
        const formData = utils.getFormData(this.form);

        utils.log('Validating entire form', 'FORM');

        // Validate each field with rules
        for (const [fieldName] of Object.entries(this.validationRules)) {
            const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);

            if (field) {
                const fieldValid = this.validateField(field);
                if (!fieldValid.isValid) {
                    isValid = false;
                }
            }
        }

        // Special validation for conditional fields
        if (formData.testEnvironment === 'multi-device' || formData.testEnvironment === 'constellation') {
            const deviceList = document.getElementById('deviceList');
            if (deviceList && !deviceList.value.trim()) {
                utils.updateFieldValidation(deviceList, false, 'Device list is required for multi-device/constellation testing');
                isValid = false;
            }
        }

        // Validate test case types (at least one must be selected)
        const testCaseCheckboxes = document.querySelectorAll('input[name="testCaseTypes"]:checked');
        if (testCaseCheckboxes.length === 0) {
            isValid = false;
        }

        return isValid;
    }

    /**
     * Clear all validation states
     */
    clearValidationStates() {
        const formFields = this.form.querySelectorAll('.form-input');
        formFields.forEach(field => {
            field.classList.remove('valid', 'invalid');
        });

        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());
    }

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        this.debouncedAutoSave = utils.debounce((formData) => {
            this.saveFormData(formData);
        }, 2000); // Auto-save after 2 seconds of inactivity

        utils.log('Auto-save setup completed', 'APP');
    }

    /**
     * Save form data to local storage
     */
    saveFormData(formData) {
        if (!this.autoSaveEnabled) return;

        try {
            const saveData = {
                timestamp: Date.now(),
                data: formData
            };

            utils.storage.set(this.autoSaveKey, saveData);
            utils.log('Form data auto-saved', 'APP');

        } catch (error) {
            utils.log('Auto-save failed', 'ERROR', error);
        }
    }

    /**
     * Restore form data from local storage
     */
    restoreFormData() {
        try {
            const savedData = utils.storage.get(this.autoSaveKey);

            if (!savedData || !savedData.data) {
                utils.log('No saved form data found', 'APP');
                return;
            }

            // Check if saved data is recent (less than 24 hours old)
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            if (Date.now() - savedData.timestamp > maxAge) {
                utils.log('Saved form data is too old, ignoring', 'APP');
                utils.storage.remove(this.autoSaveKey);
                return;
            }

            // Restore form fields
            this.populateForm(savedData.data);

            utils.log('Form data restored from auto-save', 'APP');
            utils.showSuccessMessage('Previous form data has been restored.');

        } catch (error) {
            utils.log('Failed to restore form data', 'ERROR', error);
        }
    }

    /**
     * Populate form with data
     */
    populateForm(data) {
        for (const [key, value] of Object.entries(data)) {
            if (!value) continue;

            const field = document.getElementById(key) || document.querySelector(`[name="${key}"]`);

            if (!field) continue;

            if (field.type === 'checkbox' || field.type === 'radio') {
                if (Array.isArray(value)) {
                    value.forEach(v => {
                        const specificField = document.querySelector(`[name="${key}"][value="${v}"]`);
                        if (specificField) specificField.checked = true;
                    });
                } else {
                    const specificField = document.querySelector(`[name="${key}"][value="${value}"]`);
                    if (specificField) specificField.checked = true;
                }
            } else {
                field.value = value;
            }
        }

        // Trigger events to update UI states
        const changeEvent = new Event('change', { bubbles: true });
        this.form.dispatchEvent(changeEvent);
    }

    /**
     * Display generated prompt in results section
     */
    displayGeneratedPrompt(prompt, metadata = {}) {
        const resultsSection = document.getElementById('resultsSection');
        const promptOutput = document.getElementById('promptOutput');

        if (!resultsSection || !promptOutput) {
            utils.log('Results elements not found', 'ERROR');
            return;
        }

        // Format and display prompt
        promptOutput.textContent = prompt;

        // Add metadata info
        if (metadata.generationTime || metadata.tokensUsed) {
            const metadataText = [
                `Generated in ${Math.round(metadata.generationTime || 0)}ms`,
                metadata.tokensUsed ? `Tokens used: ${metadata.tokensUsed}` : null,
                metadata.score ? `Input score: ${metadata.score}/10` : null
            ].filter(Boolean).join(' | ');

            promptOutput.textContent += `\n\n--- Metadata ---\n${metadataText}`;
        }

        // Show results section
        resultsSection.style.display = 'block';

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        utils.log('Generated prompt displayed', 'APP', {
            promptLength: prompt.length,
            metadata
        });
    }

    /**
     * Create enhanced download content
     */
    createDownloadContent(prompt) {
        const timestamp = utils.formatDate();
        const formData = utils.getFormData(this.form);
        const score = scoringSystem.currentScore;

        let content = `TestMate Prompt - Generated ${timestamp}\n`;
        content += `Score: ${score}/10\n`;
        content += `Product: ${formData.product || 'Not specified'}\n`;
        content += `Test Environment: ${formData.testEnvironment || 'Not specified'}\n`;
        content += `\n${'='.repeat(50)}\n\n`;
        content += prompt;
        content += `\n\n${'='.repeat(50)}\n`;
        content += `Generated by TestMate Prompt Wizard\n`;
        content += `https://testmate-prompt-wizard/\n`;

        return content;
    }

    /**
     * Show/hide loading state
     */
    showLoadingState(loading) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const generateButton = document.getElementById('generatePrompt');

        if (loadingOverlay) {
            loadingOverlay.style.display = loading ? 'flex' : 'none';
        }

        if (generateButton) {
            if (loading) {
                generateButton.classList.add('loading');
                generateButton.disabled = true;
            } else {
                generateButton.classList.remove('loading');
                generateButton.disabled = scoringSystem.currentScore < 4;
            }
        }

        // Disable form during loading
        if (this.form) {
            this.form.classList.toggle('loading', loading);
        }
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        utils.log(`Error message: ${message}`, 'ERROR');

        // You could implement a toast notification system here
        alert(message); // Simple fallback for now

        analytics.trackError(message, 'User Interface Error');
    }

    /**
     * Handle global errors
     */
    handleGlobalError(event) {
        utils.log('Global error caught', 'ERROR', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });

        analytics.trackError(`Global Error: ${event.message}`, 'JavaScript Error', true);
    }

    /**
     * Handle unhandled promise rejections
     */
    handleUnhandledRejection(event) {
        utils.log('Unhandled promise rejection', 'ERROR', event.reason);
        analytics.trackError(`Unhandled Rejection: ${event.reason}`, 'Promise Error', true);
    }

    /**
     * Handle page unload
     */
    handleBeforeUnload(_event) {
        // Save current form data
        if (this.form && this.autoSaveEnabled) {
            const formData = utils.getFormData(this.form);
            this.saveFormData(formData);
        }
    }

    /**
     * Get application status
     */
    getAppStatus() {
        return {
            initialized: this.isInitialized,
            formStartTime: this.formStartTime,
            autoSaveEnabled: this.autoSaveEnabled,
            currentScore: scoringSystem.currentScore,
            formValid: this.validateForm()
        };
    }

    /**
     * Enable/disable auto-save
     */
    setAutoSave(enabled) {
        this.autoSaveEnabled = enabled;
        utils.log(`Auto-save ${enabled ? 'enabled' : 'disabled'}`, 'APP');
    }
}

// Initialize app when script loads
document.addEventListener('DOMContentLoaded', () => {
    window.testMateApp = new TestMateApp();
});

// Also initialize immediately if DOM is already ready
if (document.readyState !== 'loading') {
    window.testMateApp = new TestMateApp();
}
