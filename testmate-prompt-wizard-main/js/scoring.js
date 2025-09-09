/**
 * TestMate Prompt Wizard - Scoring System
 * Calculates and tracks form completion score
 */

class ScoringSystem {
    constructor() {
        this.maxScore = 10;
        this.targetScore = 7;
        this.currentScore = 0;
        this.fieldWeights = this.initializeFieldWeights();
        this.scoreHistory = [];
        this.init();
    }

    /**
     * Initialize scoring system
     */
    init() {
        utils.log('Scoring system initialized', 'SCORE');
        this.updateScoreDisplay();

        // Track initial score
        analytics.trackScoreUpdate(0, 0, 'initialization');
    }

    /**
     * Define field weights and scoring criteria
     */
    initializeFieldWeights() {
        return {
            // Critical fields (higher weight)
            product: {
                weight: 1.0,
                required: true,
                type: 'select'
            },
            productDescription: {
                weight: 1.2,
                required: true,
                minLength: 20,
                type: 'textarea'
            },
            roadmapTask: {
                weight: 1.1,
                required: true,
                minLength: 5,
                type: 'text'
            },
            roadmapDescription: {
                weight: 1.2,
                required: true,
                minLength: 20,
                type: 'textarea'
            },
            testEnvironment: {
                weight: 1.0,
                required: true,
                type: 'radio'
            },
            testCaseTypes: {
                weight: 1.0,
                required: true,
                type: 'checkbox'
            },
            workflowTypes: {
                weight: 1.0,
                required: true,
                type: 'radio'
            },
            apeApiKey: {
                weight: 1.3,
                required: true,
                minLength: 16,
                type: 'password'
            },

            // Important fields (medium weight)
            productPrdLink: {
                weight: 0.8,
                required: false,
                type: 'url'
            },
            prdLink: {
                weight: 0.8,
                required: false,
                type: 'url'
            },
            testStrategyLink: {
                weight: 0.7,
                required: false,
                type: 'url'
            },
            deviceList: {
                weight: 0.6,
                required: false,
                conditional: true, // Only required if testEnvironment is multi-device or constellation
                type: 'textarea'
            },

            // Optional fields (lower weight)
            existingTestCases: {
                weight: 0.5,
                required: false,
                type: 'url'
            },
            useMetaCapabilities: {
                weight: 0.3,
                required: false,
                type: 'checkbox'
            }
        };
    }

    /**
     * Calculate score for a specific field
     */
    calculateFieldScore(fieldName, value, formData = {}) {
        const config = this.fieldWeights[fieldName];
        if (!config) {
            utils.log(`Unknown field: ${fieldName}`, 'WARN');
            return 0;
        }

        let score = 0;
        const weight = config.weight;

        utils.log(`Calculating score for ${fieldName}`, 'SCORE', { value, config });

        // Handle different field types
        switch (config.type) {
            case 'select':
                score = value && value !== '' ? weight : 0;
                break;

            case 'text':
            case 'password':
                if (value && value.trim() !== '') {
                    score = weight;
                    // Bonus for meeting minimum length
                    if (config.minLength && value.trim().length >= config.minLength) {
                        score += weight * 0.2; // 20% bonus
                    }
                    // Penalty for very short entries on important fields
                    if (config.minLength && value.trim().length < config.minLength) {
                        score *= 0.6; // 40% reduction
                    }
                }
                break;

            case 'textarea':
                if (value && value.trim() !== '') {
                    score = weight;
                    const words = value.trim().split(/\s+/).length;

                    // Bonus for detailed descriptions
                    if (words >= 10) {
                        score += weight * 0.3; // 30% bonus for detailed input
                    } else if (words >= 5) {
                        score += weight * 0.15; // 15% bonus for moderate input
                    }

                    // Penalty for very short descriptions
                    if (config.minLength && value.trim().length < config.minLength) {
                        score *= 0.5; // 50% reduction for insufficient detail
                    }
                }

                // Handle conditional fields (device list)
                if (fieldName === 'deviceList') {
                    const testEnv = formData.testEnvironment;
                    if (testEnv === 'multi-device' || testEnv === 'constellation') {
                        // Device list becomes more important
                        if (!value || value.trim() === '') {
                            score = -0.3; // Penalty for missing required conditional field
                        }
                    }
                }
                break;

            case 'url':
                if (value && value.trim() !== '') {
                    if (utils.isValidUrl(value)) {
                        score = weight;
                        // Bonus for providing optional URLs
                        if (!config.required) {
                            score += weight * 0.25; // 25% bonus for optional URLs
                        }
                    } else {
                        score = -0.2; // Penalty for invalid URL
                    }
                }
                break;

            case 'radio':
                score = value && value !== '' ? weight : 0;
                break;

            case 'checkbox':
                if (Array.isArray(value) && value.length > 0) {
                    score = weight;
                    // Bonus for selecting multiple test case types
                    if (fieldName === 'testCaseTypes' && value.length > 1) {
                        score += weight * 0.2 * (value.length - 1); // 20% bonus per additional type
                    }
                } else if (typeof value === 'boolean' && value) {
                    score = weight * 0.5; // Lower score for single boolean checkbox
                } else if (typeof value === 'string' && value !== '') {
                    score = weight;
                }
                break;

            default:
                score = value && value !== '' ? weight : 0;
        }

        // Apply required field penalty
        if (config.required && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
            score = -0.5; // Penalty for missing required fields
        }

        utils.log(`Field score calculated: ${fieldName} = ${score}`, 'SCORE');
        return Math.max(0, score); // Ensure non-negative scores
    }

    /**
     * Calculate total score from form data
     */
    calculateTotalScore(formData) {
        let totalScore = 0;
        let maxPossibleScore = 0;
        const fieldScores = {};

        utils.log('Calculating total score', 'SCORE', formData);

        // Calculate score for each field
        for (const [fieldName, config] of Object.entries(this.fieldWeights)) {
            const value = formData[fieldName];
            const fieldScore = this.calculateFieldScore(fieldName, value, formData);

            fieldScores[fieldName] = fieldScore;
            totalScore += fieldScore;
            maxPossibleScore += config.weight;
        }

        // Apply completion bonus
        const filledFields = Object.keys(formData).filter(key => {
            const value = formData[key];
            return value !== null && value !== undefined && value !== '' &&
                   !(Array.isArray(value) && value.length === 0);
        }).length;

        const completionRatio = filledFields / Object.keys(this.fieldWeights).length;
        if (completionRatio >= 0.8) {
            totalScore += 1.0; // Bonus for high completion
        } else if (completionRatio >= 0.6) {
            totalScore += 0.5; // Smaller bonus for moderate completion
        }

        // Normalize to 1-10 scale
        const normalizedScore = Math.min(this.maxScore, Math.max(0,
            (totalScore / maxPossibleScore) * this.maxScore
        ));

        // Round to nearest 0.1
        const finalScore = Math.round(normalizedScore * 10) / 10;

        utils.log('Total score calculated', 'SCORE', {
            totalScore,
            maxPossibleScore,
            normalizedScore,
            finalScore,
            fieldScores,
            completionRatio
        });

        return {
            score: finalScore,
            maxScore: this.maxScore,
            fieldScores: fieldScores,
            completionRatio: completionRatio,
            meetsTarget: finalScore >= this.targetScore
        };
    }

    /**
     * Update score based on form data
     */
    updateScore(formData, triggerField = null) {
        const startTime = performance.now();

        const scoreData = this.calculateTotalScore(formData);
        const oldScore = this.currentScore;
        const newScore = scoreData.score;

        this.currentScore = newScore;

        // Update score history
        this.scoreHistory.push({
            timestamp: Date.now(),
            score: newScore,
            triggerField: triggerField,
            formData: utils.deepClone(formData)
        });

        // Keep only last 50 score updates
        if (this.scoreHistory.length > 50) {
            this.scoreHistory = this.scoreHistory.slice(-50);
        }

        // Update UI
        this.updateScoreDisplay();

        // Track score change
        if (triggerField && oldScore !== newScore) {
            analytics.trackScoreUpdate(oldScore, newScore, triggerField);
        }

        // Track timing
        const endTime = performance.now();
        analytics.trackTiming('score_calculation', endTime - startTime, 'Performance', triggerField);

        utils.log(`Score updated: ${oldScore} -> ${newScore}`, 'SCORE', {
            triggerField,
            scoreData,
            timing: endTime - startTime
        });

        return scoreData;
    }

    /**
     * Update score display in UI
     */
    updateScoreDisplay() {
        const scoreElement = document.getElementById('currentScore');
        const progressElement = document.getElementById('scoreProgress');

        if (scoreElement) {
            scoreElement.textContent = this.currentScore.toFixed(1);

            // Add visual feedback for score level
            scoreElement.className = 'score-value';
            if (this.currentScore >= this.targetScore) {
                scoreElement.classList.add('high-score');
            } else if (this.currentScore >= 4) {
                scoreElement.classList.add('medium-score');
            } else {
                scoreElement.classList.add('low-score');
            }
        }

        if (progressElement) {
            const percentage = (this.currentScore / this.maxScore) * 100;
            progressElement.style.width = `${percentage}%`;

            // Update progress bar color based on score
            if (this.currentScore >= this.targetScore) {
                progressElement.style.background = '#28a745'; // Green
            } else if (this.currentScore >= 4) {
                progressElement.style.background = 'linear-gradient(90deg, #ffc107 0%, #28a745 100%)'; // Yellow to green
            } else {
                progressElement.style.background = '#dc3545'; // Red
            }
        }

        // Update form submission button state
        this.updateFormButtonState();
    }

    /**
     * Update form submission button based on score
     */
    updateFormButtonState() {
        const generateButton = document.getElementById('generatePrompt');
        if (generateButton) {
            if (this.currentScore >= this.targetScore) {
                generateButton.disabled = false;
                generateButton.textContent = 'Generate TestMate Prompt';
                generateButton.title = `Great! Your score of ${this.currentScore} meets the target.`;
            } else if (this.currentScore >= 4) {
                generateButton.disabled = false;
                generateButton.textContent = `Generate Prompt (Score: ${this.currentScore}/10)`;
                generateButton.title = `Score ${this.currentScore} is below target ${this.targetScore}, but you can still generate a prompt.`;
            } else {
                generateButton.disabled = true;
                generateButton.textContent = `Score Too Low (${this.currentScore}/10)`;
                generateButton.title = `Please fill more fields to reach at least level 4. Target is level ${this.targetScore}.`;
            }
        }
    }

    /**
     * Get score recommendations
     */
    getScoreRecommendations(formData) {
        const recommendations = [];
        const scoreData = this.calculateTotalScore(formData);

        if (scoreData.score >= this.targetScore) {
            recommendations.push({
                type: 'success',
                message: '🎉 Excellent! Your input quality meets the target level.',
                priority: 'high'
            });
            return recommendations;
        }

        // Analyze missing required fields
        for (const [fieldName, config] of Object.entries(this.fieldWeights)) {
            const value = formData[fieldName];

            if (config.required && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
                recommendations.push({
                    type: 'error',
                    message: `Required field missing: ${this.getFieldDisplayName(fieldName)}`,
                    field: fieldName,
                    priority: 'high'
                });
            }
        }

        // Suggest improvements for low-scoring fields
        const sortedFields = Object.entries(scoreData.fieldScores)
            .sort(([,a], [,b]) => a - b)
            .slice(0, 3); // Top 3 fields needing improvement

        for (const [fieldName, score] of sortedFields) {
            const config = this.fieldWeights[fieldName];
            if (score < config.weight * 0.8) { // Less than 80% of potential score
                recommendations.push({
                    type: 'warning',
                    message: this.getFieldRecommendation(fieldName, formData[fieldName]),
                    field: fieldName,
                    priority: 'medium'
                });
            }
        }

        // Suggest optional high-value fields
        if (scoreData.score < this.targetScore) {
            const highValueOptional = ['productPrdLink', 'prdLink', 'testStrategyLink'];
            for (const fieldName of highValueOptional) {
                const value = formData[fieldName];
                if (!value || value === '') {
                    recommendations.push({
                        type: 'info',
                        message: `Consider adding ${this.getFieldDisplayName(fieldName)} for better results`,
                        field: fieldName,
                        priority: 'low'
                    });
                }
            }
        }

        return recommendations;
    }

    /**
     * Get display name for field
     */
    getFieldDisplayName(fieldName) {
        const displayNames = {
            product: 'Product Selection',
            productDescription: 'Product Description',
            productPrdLink: 'Product PRD Link',
            testEnvironment: 'Test Environment Type',
            roadmapTask: 'Roadmap Task Number',
            roadmapDescription: 'Roadmap Description',
            prdLink: 'PRD Link',
            testStrategyLink: 'Test Strategy Link',
            testCaseTypes: 'Test Case Types',
            workflowTypes: 'Workflow Types',
            existingTestCases: 'Existing Test Cases Link',
            apeApiKey: 'APE API Key',
            deviceList: 'Device List',
            useMetaCapabilities: 'Meta-Approved Capabilities'
        };
        return displayNames[fieldName] || fieldName;
    }

    /**
     * Get specific recommendation for field improvement
     */
    getFieldRecommendation(fieldName, currentValue) {
        if (!currentValue || currentValue === '') {
            return `Please provide ${this.getFieldDisplayName(fieldName)}`;
        }

        switch (fieldName) {
            case 'productDescription':
            case 'roadmapDescription':
                if (currentValue.length < 50) {
                    return `${this.getFieldDisplayName(fieldName)} needs more detail (at least 50 characters)`;
                }
                if (currentValue.split(/\s+/).length < 10) {
                    return `${this.getFieldDisplayName(fieldName)} should be more comprehensive (at least 10 words)`;
                }
                break;

            case 'deviceList':
                return `${this.getFieldDisplayName(fieldName)} is required for multi-device/constellation testing`;

            case 'apeApiKey':
                if (!utils.isValidApiKey(currentValue)) {
                    return `${this.getFieldDisplayName(fieldName)} format appears invalid`;
                }
                break;

            case 'testCaseTypes':
                if (Array.isArray(currentValue) && currentValue.length === 1) {
                    return `Consider selecting multiple test case types for comprehensive coverage`;
                }
                break;

            default:
                return `${this.getFieldDisplayName(fieldName)} needs improvement`;
        }

        return `Consider improving ${this.getFieldDisplayName(fieldName)}`;
    }

    /**
     * Get score statistics
     */
    getScoreStatistics() {
        return {
            currentScore: this.currentScore,
            targetScore: this.targetScore,
            maxScore: this.maxScore,
            meetsTarget: this.currentScore >= this.targetScore,
            completionPercentage: (this.currentScore / this.maxScore) * 100,
            scoreHistory: this.scoreHistory.slice(-10), // Last 10 updates
            averageScore: this.scoreHistory.length > 0
                ? this.scoreHistory.reduce((sum, entry) => sum + entry.score, 0) / this.scoreHistory.length
                : 0
        };
    }

    /**
     * Reset score
     */
    resetScore() {
        const oldScore = this.currentScore;
        this.currentScore = 0;
        this.scoreHistory = [];
        this.updateScoreDisplay();

        analytics.trackScoreUpdate(oldScore, 0, 'reset');
        utils.log('Score reset', 'SCORE');
    }

    /**
     * Export score data
     */
    exportScoreData() {
        return {
            statistics: this.getScoreStatistics(),
            fieldWeights: this.fieldWeights,
            scoreHistory: this.scoreHistory
        };
    }
}

// Create global instance
window.scoringSystem = new ScoringSystem();
