/**
 * TestMate Prompt Wizard - Analytics Module
 * Google Analytics integration and event tracking
 */

class Analytics {
    constructor() {
        this.trackingId = 'G-Q98010P7LZ';
        this.isInitialized = false;
        this.init();
    }

    /**
     * Initialize analytics
     */
    init() {
        try {
            // Check if gtag is available
            if (typeof gtag !== 'undefined') {
                this.isInitialized = true;
                utils.log('Google Analytics initialized', 'Analytics');

                // Track page view
                this.trackPageView();

                // Track user agent and browser info
                this.trackUserInfo();

            } else {
                utils.log('Google Analytics not available', 'WARN');
            }
        } catch (error) {
            utils.log('Analytics initialization failed', 'ERROR', error);
        }
    }

    /**
     * Track page view
     */
    trackPageView(page_title = 'TestMate Prompt Wizard', page_location = window.location.href) {
        if (!this.isInitialized) return;

        try {
            gtag('event', 'page_view', {
                page_title: page_title,
                page_location: page_location,
                custom_map: {
                    'dimension1': 'testmate_wizard'
                }
            });
            utils.log('Page view tracked', 'Analytics', { page_title, page_location });
        } catch (error) {
            utils.log('Page view tracking failed', 'ERROR', error);
        }
    }

    /**
     * Track user info for analytics
     */
    trackUserInfo() {
        if (!this.isInitialized) return;

        try {
            const userAgent = navigator.userAgent;
            const screenResolution = `${screen.width}x${screen.height}`;
            const viewportSize = `${window.innerWidth}x${window.innerHeight}`;

            gtag('event', 'user_info', {
                event_category: 'User Environment',
                event_label: 'Browser Info',
                custom_parameters: {
                    user_agent: userAgent,
                    screen_resolution: screenResolution,
                    viewport_size: viewportSize,
                    language: navigator.language,
                    platform: navigator.platform
                }
            });

            utils.log('User info tracked', 'Analytics', {
                userAgent,
                screenResolution,
                viewportSize
            });
        } catch (error) {
            utils.log('User info tracking failed', 'ERROR', error);
        }
    }

    /**
     * Track form interactions
     */
    trackFormInteraction(action, field_name, value_length = 0) {
        if (!this.isInitialized) return;

        try {
            gtag('event', action, {
                event_category: 'Form Interaction',
                event_label: field_name,
                value: value_length,
                custom_parameters: {
                    field_name: field_name,
                    value_length: value_length,
                    timestamp: Date.now()
                }
            });

            utils.log(`Form interaction tracked: ${action}`, 'Analytics', {
                field_name,
                value_length
            });
        } catch (error) {
            utils.log('Form interaction tracking failed', 'ERROR', error);
        }
    }

    /**
     * Track form submission
     */
    trackFormSubmission(score, completion_time, form_data) {
        if (!this.isInitialized) return;

        try {
            const filled_fields = Object.values(form_data).filter(value =>
                value !== null && value !== undefined && value !== ''
            ).length;

            gtag('event', 'form_submission', {
                event_category: 'Form Completion',
                event_label: `Score Level ${score}`,
                value: score,
                custom_parameters: {
                    completion_score: score,
                    completion_time_ms: completion_time,
                    filled_fields_count: filled_fields,
                    total_fields: 13,
                    completion_percentage: Math.round((filled_fields / 13) * 100),
                    product_type: form_data.product || 'unknown',
                    test_environment: form_data.testEnvironment || 'unknown',
                    has_prd_link: !!form_data.prdLink,
                    has_test_strategy: !!form_data.testStrategyLink,
                    api_key_provided: !!form_data.apeApiKey
                }
            });

            utils.log('Form submission tracked', 'Analytics', {
                score,
                completion_time,
                filled_fields
            });
        } catch (error) {
            utils.log('Form submission tracking failed', 'ERROR', error);
        }
    }

    /**
     * Track API calls
     */
    trackApiCall(endpoint, status, response_time, error = null) {
        if (!this.isInitialized) return;

        try {
            gtag('event', 'api_call', {
                event_category: 'API Usage',
                event_label: endpoint,
                value: response_time,
                custom_parameters: {
                    endpoint: endpoint,
                    status_code: status,
                    response_time_ms: response_time,
                    success: status >= 200 && status < 300,
                    error_message: error ? error.message : null,
                    timestamp: Date.now()
                }
            });

            utils.log(`API call tracked: ${endpoint}`, 'Analytics', {
                status,
                response_time,
                error
            });
        } catch (error) {
            utils.log('API call tracking failed', 'ERROR', error);
        }
    }

    /**
     * Track prompt generation
     */
    trackPromptGeneration(success, prompt_length, generation_time, input_score) {
        if (!this.isInitialized) return;

        try {
            gtag('event', 'prompt_generation', {
                event_category: 'Prompt Generation',
                event_label: success ? 'Success' : 'Failed',
                value: prompt_length,
                custom_parameters: {
                    generation_success: success,
                    prompt_length: prompt_length,
                    generation_time_ms: generation_time,
                    input_score: input_score,
                    quality_tier: input_score >= 7 ? 'high' : input_score >= 4 ? 'medium' : 'low',
                    timestamp: Date.now()
                }
            });

            utils.log('Prompt generation tracked', 'Analytics', {
                success,
                prompt_length,
                generation_time,
                input_score
            });
        } catch (error) {
            utils.log('Prompt generation tracking failed', 'ERROR', error);
        }
    }

    /**
     * Track user actions
     */
    trackUserAction(action, category = 'User Action', label = '', value = 0) {
        if (!this.isInitialized) return;

        try {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value,
                custom_parameters: {
                    action_timestamp: Date.now(),
                    page_url: window.location.href
                }
            });

            utils.log(`User action tracked: ${action}`, 'Analytics', {
                category,
                label,
                value
            });
        } catch (error) {
            utils.log('User action tracking failed', 'ERROR', error);
        }
    }

    /**
     * Track errors
     */
    trackError(error_message, error_category = 'JavaScript Error', fatal = false) {
        if (!this.isInitialized) return;

        try {
            gtag('event', 'exception', {
                description: error_message,
                fatal: fatal,
                custom_parameters: {
                    error_category: error_category,
                    page_url: window.location.href,
                    user_agent: navigator.userAgent,
                    timestamp: Date.now()
                }
            });

            utils.log('Error tracked', 'Analytics', {
                error_message,
                error_category,
                fatal
            });
        } catch (error) {
            utils.log('Error tracking failed', 'ERROR', error);
        }
    }

    /**
     * Track timing events
     */
    trackTiming(name, value, category = 'Performance', label = '') {
        if (!this.isInitialized) return;

        try {
            gtag('event', 'timing_complete', {
                name: name,
                value: Math.round(value),
                event_category: category,
                event_label: label,
                custom_parameters: {
                    timing_name: name,
                    timing_value_ms: Math.round(value),
                    timing_category: category,
                    timestamp: Date.now()
                }
            });

            utils.log(`Timing tracked: ${name}`, 'Analytics', {
                value,
                category,
                label
            });
        } catch (error) {
            utils.log('Timing tracking failed', 'ERROR', error);
        }
    }

    /**
     * Track score updates
     */
    trackScoreUpdate(old_score, new_score, trigger_field) {
        if (!this.isInitialized) return;

        try {
            gtag('event', 'score_update', {
                event_category: 'Scoring System',
                event_label: trigger_field,
                value: new_score,
                custom_parameters: {
                    old_score: old_score,
                    new_score: new_score,
                    score_change: new_score - old_score,
                    trigger_field: trigger_field,
                    reached_target: new_score >= 7,
                    timestamp: Date.now()
                }
            });

            utils.log('Score update tracked', 'Analytics', {
                old_score,
                new_score,
                trigger_field
            });
        } catch (error) {
            utils.log('Score update tracking failed', 'ERROR', error);
        }
    }

    /**
     * Track copy and download actions
     */
    trackContentAction(action, content_type, content_length = 0) {
        if (!this.isInitialized) return;

        try {
            gtag('event', action, {
                event_category: 'Content Action',
                event_label: content_type,
                value: content_length,
                custom_parameters: {
                    content_type: content_type,
                    content_length: content_length,
                    action_type: action,
                    timestamp: Date.now()
                }
            });

            utils.log(`Content action tracked: ${action}`, 'Analytics', {
                content_type,
                content_length
            });
        } catch (error) {
            utils.log('Content action tracking failed', 'ERROR', error);
        }
    }

    /**
     * Track session information
     */
    trackSessionInfo() {
        if (!this.isInitialized) return;

        try {
            const sessionStart = Date.now();

            gtag('event', 'session_start', {
                event_category: 'Session',
                custom_parameters: {
                    session_id: utils.generateId(),
                    start_time: sessionStart,
                    referrer: document.referrer,
                    entry_page: window.location.href,
                    browser: this.getBrowserInfo(),
                    device_type: this.getDeviceType()
                }
            });

            utils.log('Session start tracked', 'Analytics', { sessionStart });

            // Track session end on page unload
            window.addEventListener('beforeunload', () => {
                const sessionEnd = Date.now();
                const sessionDuration = sessionEnd - sessionStart;

                gtag('event', 'session_end', {
                    event_category: 'Session',
                    value: Math.round(sessionDuration / 1000), // in seconds
                    custom_parameters: {
                        session_duration_ms: sessionDuration,
                        end_time: sessionEnd
                    }
                });
            });

        } catch (error) {
            utils.log('Session info tracking failed', 'ERROR', error);
        }
    }

    /**
     * Get browser information
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';

        if (ua.includes('Chrome') && !ua.includes('Edg')) {
            browser = 'Chrome';
        } else if (ua.includes('Firefox')) {
            browser = 'Firefox';
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            browser = 'Safari';
        } else if (ua.includes('Edg')) {
            browser = 'Edge';
        }

        return browser;
    }

    /**
     * Get device type
     */
    getDeviceType() {
        const ua = navigator.userAgent;

        if (/tablet|ipad|playbook|silk/i.test(ua)) {
            return 'tablet';
        } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    }

    /**
     * Set custom dimensions (if needed)
     */
    setCustomDimension(index, value) {
        if (!this.isInitialized) return;

        try {
            gtag('config', this.trackingId, {
                [`custom_map.dimension${index}`]: value
            });

            utils.log(`Custom dimension set: dimension${index} = ${value}`, 'Analytics');
        } catch (error) {
            utils.log('Custom dimension setting failed', 'ERROR', error);
        }
    }
}

// Create global instance
window.analytics = new Analytics();
