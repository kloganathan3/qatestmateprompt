/**
 * TestMate Prompt Wizard - Utility Functions
 * Provides logging, validation, and helper functions
 */

class Utils {
    constructor() {
        this.debugMode = true;
        this.logPrefix = '[TestMate]';
        console.log(`${this.logPrefix} Utils initialized`);
    }

    /**
     * Enhanced logging with categories and timestamps
     */
    log(message, category = 'INFO', data = null) {
        if (!this.debugMode) return;

        const timestamp = new Date().toISOString();
        const logMessage = `${this.logPrefix}[${category}] ${timestamp} - ${message}`;

        switch (category) {
            case 'ERROR':
                console.error(logMessage, data || '');
                break;
            case 'WARN':
                console.warn(logMessage, data || '');
                break;
            case 'API':
            case 'SCORE':
            case 'FORM':
            case 'USER':
                console.log(`%c${logMessage}`, 'color: #0066cc; font-weight: bold;', data || '');
                break;
            default:
                console.log(logMessage, data || '');
        }
    }

    /**
     * Validate URL format
     */
    isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate API key format (basic check)
     */
    isValidApiKey(apiKey) {
        // Check if it's a UUID-like format or similar
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const generalApiKeyRegex = /^[a-zA-Z0-9_-]{16,}$/;

        return uuidRegex.test(apiKey) || generalApiKeyRegex.test(apiKey);
    }

    /**
     * Sanitize HTML to prevent XSS
     */
    sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Escape special regex characters
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Debounce function calls
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    /**
     * Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Deep clone object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    /**
     * Format text for better readability
     */
    formatText(text, maxLength = 100) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    /**
     * Convert form data to object
     */
    formDataToObject(formData) {
        const obj = {};
        for (let [key, value] of formData.entries()) {
            // Handle multiple values for same key (checkboxes)
            if (obj[key]) {
                if (Array.isArray(obj[key])) {
                    obj[key].push(value);
                } else {
                    obj[key] = [obj[key], value];
                }
            } else {
                obj[key] = value;
            }
        }
        return obj;
    }

    /**
     * Get form data with validation
     */
    getFormData(formElement) {
        const formData = new FormData(formElement);
        const data = this.formDataToObject(formData);

        // Handle special cases
        if (data.testCaseTypes && !Array.isArray(data.testCaseTypes)) {
            data.testCaseTypes = [data.testCaseTypes];
        }

        this.log('Form data collected', 'FORM', data);
        return data;
    }

    /**
     * Validate form field
     */
    validateField(element, rules = {}) {
        const value = element.value.trim();
        const fieldName = element.name || element.id;
        let isValid = true;
        let errorMessage = '';

        this.log(`Validating field: ${fieldName}`, 'FORM', { value, rules });

        // Required field validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${fieldName} is required`;
        }

        // URL validation
        if (value && rules.url && !this.isValidUrl(value)) {
            isValid = false;
            errorMessage = `${fieldName} must be a valid URL`;
        }

        // Email validation
        if (value && rules.email && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = `${fieldName} must be a valid email`;
        }

        // API key validation
        if (value && rules.apiKey && !this.isValidApiKey(value)) {
            isValid = false;
            errorMessage = `${fieldName} must be a valid API key`;
        }

        // Min length validation
        if (value && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `${fieldName} must be at least ${rules.minLength} characters`;
        }

        // Max length validation
        if (value && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = `${fieldName} must be less than ${rules.maxLength} characters`;
        }

        // Update UI
        this.updateFieldValidation(element, isValid, errorMessage);

        return { isValid, errorMessage };
    }

    /**
     * Update field validation UI
     */
    updateFieldValidation(element, isValid, errorMessage = '') {
        // Remove previous validation classes
        element.classList.remove('valid', 'invalid');

        // Add appropriate class
        element.classList.add(isValid ? 'valid' : 'invalid');

        // Handle error message
        const existingError = element.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (!isValid && errorMessage) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message show';
            errorDiv.textContent = errorMessage;
            element.parentNode.appendChild(errorDiv);
        }
    }

    /**
     * Show success message
     */
    showSuccessMessage(message, container = null) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;

        if (container) {
            container.appendChild(successDiv);
        } else {
            document.body.appendChild(successDiv);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);

        this.log(`Success message shown: ${message}`, 'USER');
    }

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.log('Text copied to clipboard', 'USER');
            return true;
        } catch (err) {
            this.log('Failed to copy text to clipboard', 'ERROR', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (successful) {
                    this.log('Text copied to clipboard (fallback)', 'USER');
                    return true;
                }
            } catch (fallbackErr) {
                document.body.removeChild(textArea);
                this.log('Fallback copy failed', 'ERROR', fallbackErr);
            }
            return false;
        }
    }

    /**
     * Download text as file
     */
    downloadAsFile(content, filename, contentType = 'text/plain') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.log(`File downloaded: ${filename}`, 'USER');
    }

    /**
     * Format date for display
     */
    formatDate(date = new Date()) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Local storage helpers
     */
    storage = {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                this.log(`Stored data for key: ${key}`, 'INFO');
            } catch (e) {
                this.log(`Failed to store data for key: ${key}`, 'ERROR', e);
            }
        },

        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                const value = item ? JSON.parse(item) : defaultValue;
                this.log(`Retrieved data for key: ${key}`, 'INFO');
                return value;
            } catch (e) {
                this.log(`Failed to retrieve data for key: ${key}`, 'ERROR', e);
                return defaultValue;
            }
        },

        remove: (key) => {
            try {
                localStorage.removeItem(key);
                this.log(`Removed data for key: ${key}`, 'INFO');
            } catch (e) {
                this.log(`Failed to remove data for key: ${key}`, 'ERROR', e);
            }
        },

        clear: () => {
            try {
                localStorage.clear();
                this.log('Cleared all stored data', 'INFO');
            } catch (e) {
                this.log('Failed to clear stored data', 'ERROR', e);
            }
        }
    };

    /**
     * Session storage helpers
     */
    session = {
        set: (key, value) => {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
                this.log(`Stored session data for key: ${key}`, 'INFO');
            } catch (e) {
                this.log(`Failed to store session data for key: ${key}`, 'ERROR', e);
            }
        },

        get: (key, defaultValue = null) => {
            try {
                const item = sessionStorage.getItem(key);
                const value = item ? JSON.parse(item) : defaultValue;
                this.log(`Retrieved session data for key: ${key}`, 'INFO');
                return value;
            } catch (e) {
                this.log(`Failed to retrieve session data for key: ${key}`, 'ERROR', e);
                return defaultValue;
            }
        },

        remove: (key) => {
            try {
                sessionStorage.removeItem(key);
                this.log(`Removed session data for key: ${key}`, 'INFO');
            } catch (e) {
                this.log(`Failed to remove session data for key: ${key}`, 'ERROR', e);
            }
        }
    };
}

// Create global instance
window.utils = new Utils();
