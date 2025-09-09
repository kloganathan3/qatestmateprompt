/**
 * TestMate Prompt Wizard - API Integration
 * Handles OpenAI API calls via wearables-ape endpoint
 */

class ApiService {
    constructor() {
        this.baseUrl = 'https://api.wearables-ape.io/models/v1';
        this.fallbackApiKey = '02c9c859-7ee8-4515-9c0f-f706094df1f8';
        this.maxTokens = 2000;
        this.model = 'gpt-4o';
        this.requestTimeout = 30000; // 30 seconds
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
        this.init();
    }

    /**
     * Initialize API service
     */
    init() {
        utils.log('API Service initialized', 'API', {
            baseUrl: this.baseUrl,
            model: this.model,
            maxTokens: this.maxTokens
        });
    }

    /**
     * Get API key from form or fallback
     */
    getApiKey() {
        const formApiKey = document.getElementById('apeApiKey')?.value?.trim();
        if (formApiKey && utils.isValidApiKey(formApiKey)) {
            return formApiKey;
        }

        utils.log('Using fallback API key', 'API');
        return this.fallbackApiKey;
    }

    /**
     * Create headers for API request
     */
    createHeaders(apiKey) {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'User-Agent': 'TestMate-Prompt-Wizard/1.0'
        };
    }

    /**
     * Make API request with retry logic
     */
    async makeRequest(endpoint, payload, apiKey, attempt = 1) {
        const startTime = performance.now();
        const url = `${this.baseUrl}${endpoint}`;

        utils.log(`API Request attempt ${attempt}`, 'API', {
            url,
            payload: { ...payload, messages: `${payload.messages?.length || 0} messages` }
        });

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

            const response = await fetch(url, {
                method: 'POST',
                headers: this.createHeaders(apiKey),
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const endTime = performance.now();
            const responseTime = endTime - startTime;

            // Track API call
            analytics.trackApiCall(endpoint, response.status, responseTime);

            if (!response.ok) {
                const errorText = await response.text();
                const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
                error.status = response.status;
                error.response = errorText;
                throw error;
            }

            const data = await response.json();

            utils.log('API Request successful', 'API', {
                status: response.status,
                responseTime: Math.round(responseTime),
                dataKeys: Object.keys(data)
            });

            return {
                success: true,
                data: data,
                responseTime: responseTime,
                status: response.status
            };

        } catch (error) {
            const endTime = performance.now();
            const responseTime = endTime - startTime;

            utils.log(`API Request failed (attempt ${attempt})`, 'ERROR', {
                error: error.message,
                responseTime: Math.round(responseTime),
                status: error.status || 0
            });

            // Track failed API call
            analytics.trackApiCall(endpoint, error.status || 0, responseTime, error);

            // Retry logic
            if (attempt < this.retryAttempts && this.shouldRetry(error)) {
                utils.log(`Retrying API request in ${this.retryDelay}ms`, 'API');
                await this.delay(this.retryDelay * attempt); // Exponential backoff
                return this.makeRequest(endpoint, payload, apiKey, attempt + 1);
            }

            throw error;
        }
    }

    /**
     * Determine if request should be retried
     */
    shouldRetry(error) {
        // Retry on network errors, timeouts, and specific HTTP status codes
        const retryableCodes = [500, 502, 503, 504, 429]; // Server errors and rate limiting
        return !error.status || retryableCodes.includes(error.status);
    }

    /**
     * Delay helper for retry logic
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generate TestMate prompt using OpenAI
     */
    async generatePrompt(formData, userApiKey = null) {
        const startTime = performance.now();

        try {
            utils.log('Starting prompt generation', 'API', { formDataKeys: Object.keys(formData) });

            // Get API key
            const apiKey = userApiKey || this.getApiKey();
            if (!apiKey) {
                throw new Error('No valid API key provided');
            }

            // Create the system prompt
            const systemPrompt = this.createSystemPrompt();

            // Create the user prompt from form data
            const userPrompt = this.createUserPrompt(formData);

            // Prepare API payload
            const payload = {
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userPrompt
                    }
                ],
                max_tokens: this.maxTokens,
                temperature: 0.7,
                top_p: 0.9,
                frequency_penalty: 0.1,
                presence_penalty: 0.1
            };

            // Make the request
            const result = await this.makeRequest('/chat/completions', payload, apiKey);

            if (result.success && result.data.choices && result.data.choices.length > 0) {
                const generatedPrompt = result.data.choices[0].message.content.trim();
                const endTime = performance.now();
                const generationTime = endTime - startTime;

                // Get current score for analytics
                const currentScore = scoringSystem.currentScore;

                // Track successful generation
                analytics.trackPromptGeneration(true, generatedPrompt.length, generationTime, currentScore);

                utils.log('Prompt generation completed successfully', 'API', {
                    promptLength: generatedPrompt.length,
                    generationTime: Math.round(generationTime),
                    tokensUsed: result.data.usage?.total_tokens || 0
                });

                return {
                    success: true,
                    prompt: generatedPrompt,
                    metadata: {
                        generationTime: generationTime,
                        tokensUsed: result.data.usage?.total_tokens || 0,
                        model: this.model,
                        score: currentScore
                    }
                };
            } else {
                throw new Error('Invalid response format from API');
            }

        } catch (error) {
            const endTime = performance.now();
            const generationTime = endTime - startTime;
            const currentScore = scoringSystem.currentScore;

            // Track failed generation
            analytics.trackPromptGeneration(false, 0, generationTime, currentScore);
            analytics.trackError(error.message, 'API Error');

            utils.log('Prompt generation failed', 'ERROR', {
                error: error.message,
                generationTime: Math.round(generationTime)
            });

            return {
                success: false,
                error: error.message,
                details: error.response || null,
                metadata: {
                    generationTime: generationTime,
                    model: this.model
                }
            };
        }
    }

    /**
     * Create system prompt for TestMate
     */
    createSystemPrompt() {
        return `You are TestMate Prompt Assistant, an expert in creating comprehensive test case generation prompts for wearables product testing at Meta. Your role is to analyze user inputs and generate detailed, actionable prompts that will help QA teams create effective test strategies and test cases.

Key Responsibilities:
1. Analyze product information, roadmap tasks, and testing requirements
2. Generate structured prompts that cover functional, performance, and stability testing
3. Consider device-specific, multi-device, and constellation testing scenarios
4. Incorporate PRD information and existing test strategies when provided
5. Create prompts that distinguish between positive and negative/destructive testing workflows

Output Requirements:
- Generate a clear, structured prompt for TestMate that includes:
  * Product context and feature description
  * Testing scope and objectives
  * Test environment specifications (device-only, multi-device, constellation)
  * Test case types requested (functional, performance, stability)
  * Workflow coverage (positive only vs comprehensive)
  * Integration with existing documentation (PRDs, test strategies)
  * Special considerations for wearables testing

Format Guidelines:
- Use clear sections and bullet points
- Include specific testing criteria and edge cases
- Provide context for TestMate to generate relevant test cases
- Ensure the prompt is actionable and comprehensive
- Focus on wearables-specific testing considerations (battery, connectivity, sensors, UI/UX)

The generated prompt should enable TestMate to create high-quality, targeted test cases that align with Meta's wearables product testing standards.`;
    }

    /**
     * Create user prompt from form data
     */
    createUserPrompt(formData) {
        let prompt = `Please generate a comprehensive TestMate prompt for test case generation based on the following information:\n\n`;

        // Product Information
        prompt += `PRODUCT INFORMATION:\n`;
        prompt += `- Product: ${formData.product || 'Not specified'}\n`;
        if (formData.productDescription) {
            prompt += `- Product Description: ${formData.productDescription}\n`;
        }
        if (formData.productPrdLink) {
            prompt += `- Product PRD: ${formData.productPrdLink}\n`;
        }
        prompt += `\n`;

        // Roadmap Task Information
        prompt += `ROADMAP TASK:\n`;
        if (formData.roadmapTask) {
            prompt += `- Task Number: ${formData.roadmapTask}\n`;
        }
        if (formData.roadmapDescription) {
            prompt += `- Task Description: ${formData.roadmapDescription}\n`;
        }
        if (formData.prdLink) {
            prompt += `- PRD Link: ${formData.prdLink}\n`;
        }
        prompt += `\n`;

        // Testing Environment
        prompt += `TESTING ENVIRONMENT:\n`;
        prompt += `- Environment Type: ${formData.testEnvironment || 'Not specified'}\n`;
        if (formData.deviceList && (formData.testEnvironment === 'multi-device' || formData.testEnvironment === 'constellation')) {
            prompt += `- Device List: ${formData.deviceList}\n`;
        }
        prompt += `\n`;

        // Test Requirements
        prompt += `TEST REQUIREMENTS:\n`;
        if (formData.testCaseTypes && Array.isArray(formData.testCaseTypes)) {
            prompt += `- Test Case Types: ${formData.testCaseTypes.join(', ')}\n`;
        } else if (formData.testCaseTypes) {
            prompt += `- Test Case Types: ${formData.testCaseTypes}\n`;
        }
        prompt += `- Workflow Types: ${formData.workflowTypes || 'Not specified'}\n`;
        prompt += `\n`;

        // Additional Resources
        prompt += `ADDITIONAL RESOURCES:\n`;
        if (formData.testStrategyLink) {
            prompt += `- Existing Test Strategy: ${formData.testStrategyLink}\n`;
        }
        if (formData.existingTestCases) {
            prompt += `- Existing Test Cases: ${formData.existingTestCases}\n`;
        }
        prompt += `- Meta-Approved OpenAI Capabilities: ${formData.useMetaCapabilities ? 'Yes' : 'No'}\n`;
        prompt += `\n`;

        // Special Instructions
        prompt += `SPECIAL INSTRUCTIONS:\n`;
        prompt += `- This is for wearables testing (consider battery life, connectivity, sensors, UI/UX)\n`;
        prompt += `- Generate test cases that exclude existing ones if provided\n`;
        prompt += `- Focus on the specific test case types requested\n`;
        if (formData.workflowTypes === 'all-workflows') {
            prompt += `- Include negative and destructive test scenarios\n`;
        } else {
            prompt += `- Focus on positive test workflows only\n`;
        }
        prompt += `- Consider device-specific limitations and capabilities\n`;
        prompt += `\n`;

        prompt += `Please generate a detailed TestMate prompt that will enable comprehensive test case generation for this feature/product.`;

        return prompt;
    }

    /**
     * Test API connectivity
     */
    async testConnection(apiKey = null) {
        try {
            utils.log('Testing API connectivity', 'API');

            const testApiKey = apiKey || this.getApiKey();
            const payload = {
                model: this.model,
                messages: [
                    {
                        role: 'user',
                        content: 'Hello, this is a connection test. Please respond with "Connection successful".'
                    }
                ],
                max_tokens: 50,
                temperature: 0.1
            };

            const result = await this.makeRequest('/chat/completions', payload, testApiKey);

            if (result.success) {
                utils.log('API connection test successful', 'API');
                return { success: true, message: 'API connection successful' };
            } else {
                throw new Error('Connection test failed');
            }

        } catch (error) {
            utils.log('API connection test failed', 'ERROR', error);
            analytics.trackError(`API Connection Test: ${error.message}`, 'API Error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Get model information
     */
    async getModelInfo() {
        try {
            // This would typically call a models endpoint, but we'll return static info for now
            const modelInfo = {
                model: this.model,
                maxTokens: this.maxTokens,
                supportedFeatures: ['chat', 'completion', 'high-detail-images'],
                endpoint: this.baseUrl
            };

            utils.log('Model info retrieved', 'API', modelInfo);
            return modelInfo;

        } catch (error) {
            utils.log('Failed to get model info', 'ERROR', error);
            return null;
        }
    }

    /**
     * Validate API key format and accessibility
     */
    async validateApiKey(apiKey) {
        try {
            utils.log('Validating API key', 'API');

            if (!apiKey || !utils.isValidApiKey(apiKey)) {
                return { valid: false, error: 'Invalid API key format' };
            }

            // Test with a minimal request
            const result = await this.testConnection(apiKey);

            if (result.success) {
                utils.log('API key validation successful', 'API');
                return { valid: true, message: 'API key is valid and functional' };
            } else {
                return { valid: false, error: result.error || 'API key validation failed' };
            }

        } catch (error) {
            utils.log('API key validation failed', 'ERROR', error);
            return { valid: false, error: error.message };
        }
    }

    /**
     * Generate enhanced prompt with context analysis
     */
    async generateEnhancedPrompt(formData, contextAnalysis = null) {
        try {
            // First generate base prompt
            const baseResult = await this.generatePrompt(formData);

            if (!baseResult.success) {
                return baseResult;
            }

            // If we have context analysis, enhance the prompt
            if (contextAnalysis) {
                const enhancementResult = await this.enhancePromptWithContext(
                    baseResult.prompt,
                    contextAnalysis,
                    formData
                );

                if (enhancementResult.success) {
                    return {
                        ...baseResult,
                        prompt: enhancementResult.prompt,
                        enhanced: true,
                        metadata: {
                            ...baseResult.metadata,
                            enhancementApplied: true
                        }
                    };
                }
            }

            return baseResult;

        } catch (error) {
            utils.log('Enhanced prompt generation failed', 'ERROR', error);
            analytics.trackError(`Enhanced Prompt Generation: ${error.message}`, 'API Error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Enhance prompt with additional context
     */
    async enhancePromptWithContext(basePrompt, contextAnalysis, _formData) {
        try {
            const apiKey = this.getApiKey();

            const enhancementPrompt = `
Please enhance the following TestMate prompt by incorporating additional context analysis and improving its specificity for wearables testing:

Original Prompt:
${basePrompt}

Context Analysis:
${JSON.stringify(contextAnalysis, null, 2)}

Enhancement Instructions:
1. Add more specific wearables testing considerations
2. Include edge cases based on the product type
3. Enhance test case coverage based on the testing environment
4. Add specific validation criteria for the test types requested
5. Include performance benchmarks if performance testing is requested
6. Ensure the prompt addresses both positive and negative scenarios as specified

Please return an enhanced version of the TestMate prompt that incorporates these improvements while maintaining the original structure and intent.
            `;

            const payload = {
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert TestMate prompt enhancer specializing in wearables testing. Enhance prompts to be more specific, comprehensive, and actionable.'
                    },
                    {
                        role: 'user',
                        content: enhancementPrompt
                    }
                ],
                max_tokens: this.maxTokens,
                temperature: 0.5
            };

            const result = await this.makeRequest('/chat/completions', payload, apiKey);

            if (result.success && result.data.choices && result.data.choices.length > 0) {
                const enhancedPrompt = result.data.choices[0].message.content.trim();

                utils.log('Prompt enhancement successful', 'API', {
                    originalLength: basePrompt.length,
                    enhancedLength: enhancedPrompt.length
                });

                return {
                    success: true,
                    prompt: enhancedPrompt
                };
            } else {
                throw new Error('Enhancement request failed');
            }

        } catch (error) {
            utils.log('Prompt enhancement failed', 'ERROR', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get API usage statistics (if supported)
     */
    getUsageStats() {
        // This would typically call an API usage endpoint
        // For now, return basic stats from our tracking
        const stats = {
            requestsToday: 0, // Would be tracked in a real implementation
            tokensUsed: 0,
            errorRate: 0,
            averageResponseTime: 0
        };

        return stats;
    }
}

// Create global instance
window.apiService = new ApiService();
