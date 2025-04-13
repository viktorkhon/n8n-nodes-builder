"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicOpenAIChatModel = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const openai_1 = require("@langchain/openai");
class DynamicOpenAIChatModel {
    constructor() {
        this.description = {
            displayName: 'Dynamic OpenAI Chat Model',
            name: 'dynamicOpenAIChatModel',
            icon: 'file:openai.svg',
            group: ['transform'],
            version: 1,
            description: 'Use OpenAI chat models with dynamic credentials',
            defaults: {
                name: 'Dynamic OpenAI Chat Model',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [],
            properties: [
                {
                    displayName: 'API Key',
                    name: 'apiKey',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The OpenAI API key',
                    typeOptions: {
                        password: true,
                    },
                },
                {
                    displayName: 'Organization ID',
                    name: 'organizationId',
                    type: 'string',
                    default: '',
                    description: 'The OpenAI organization ID (optional)',
                },
                {
                    displayName: 'Model',
                    name: 'model',
                    type: 'string',
                    default: 'gpt-3.5-turbo',
                    description: 'The model to use',
                },
                {
                    displayName: 'Base URL',
                    name: 'baseURL',
                    type: 'string',
                    default: 'https://api.openai.com/v1',
                    description: 'Override the default base URL for the API',
                },
                {
                    displayName: 'Sampling Temperature',
                    name: 'temperature',
                    type: 'number',
                    default: 0.7,
                    description: 'The sampling temperature to use',
                    typeOptions: {
                        minValue: 0,
                        maxValue: 2,
                    },
                },
                {
                    displayName: 'Maximum Number of Tokens',
                    name: 'maxTokens',
                    type: 'number',
                    default: 1024,
                    description: 'The maximum number of tokens to generate',
                    typeOptions: {
                        minValue: 1,
                    },
                },
                {
                    displayName: 'Top P',
                    name: 'topP',
                    type: 'number',
                    default: 1,
                    description: 'The top-p sampling parameter',
                    typeOptions: {
                        minValue: 0,
                        maxValue: 1,
                    },
                },
                {
                    displayName: 'Frequency Penalty',
                    name: 'frequencyPenalty',
                    type: 'number',
                    default: 0,
                    description: 'The frequency penalty parameter',
                    typeOptions: {
                        minValue: -2,
                        maxValue: 2,
                    },
                },
                {
                    displayName: 'Presence Penalty',
                    name: 'presencePenalty',
                    type: 'number',
                    default: 0,
                    description: 'The presence penalty parameter',
                    typeOptions: {
                        minValue: -2,
                        maxValue: 2,
                    },
                },
                {
                    displayName: 'Timeout',
                    name: 'timeout',
                    type: 'number',
                    default: 60000,
                    description: 'The timeout in milliseconds',
                    typeOptions: {
                        minValue: 1,
                    },
                },
                {
                    displayName: 'Max Retries',
                    name: 'maxRetries',
                    type: 'number',
                    default: 3,
                    description: 'The maximum number of retries',
                    typeOptions: {
                        minValue: 0,
                    },
                },
            ],
        };
    }
    async execute() {
        var _a;
        const items = this.getInputData();
        const returnData = [];
        // Get parameters
        const apiKey = this.getNodeParameter('apiKey', 0);
        const organizationId = this.getNodeParameter('organizationId', 0);
        const model = this.getNodeParameter('model', 0);
        const baseURL = this.getNodeParameter('baseURL', 0);
        const temperature = this.getNodeParameter('temperature', 0);
        const maxTokens = this.getNodeParameter('maxTokens', 0);
        const topP = this.getNodeParameter('topP', 0);
        const frequencyPenalty = this.getNodeParameter('frequencyPenalty', 0);
        const presencePenalty = this.getNodeParameter('presencePenalty', 0);
        const timeout = this.getNodeParameter('timeout', 0);
        const maxRetries = this.getNodeParameter('maxRetries', 0);
        if (!apiKey) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'API Key is required');
        }
        // Create model options
        const modelOptions = {
            openAIApiKey: apiKey,
            modelName: model,
            temperature,
            maxTokens,
            topP,
            frequencyPenalty,
            presencePenalty,
            timeout,
            maxRetries,
        };
        // Add optional parameters
        if (organizationId) {
            modelOptions.organization = organizationId;
        }
        if (baseURL && baseURL !== 'https://api.openai.com/v1') {
            modelOptions.configuration = {
                baseURL,
            };
        }
        try {
            // Create the model instance
            const llm = new openai_1.ChatOpenAI(modelOptions);
            // Return the model instance for use with AI Agent
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                returnData.push({
                    json: {
                        model: llm,
                        modelType: 'chatOpenAI',
                    },
                });
            }
            return this.prepareOutputData(returnData);
        }
        catch (error) {
            const apiError = error;
            if (((_a = apiError.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid API key');
            }
            if (error instanceof Error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error: ${error.message}`);
            }
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'An unknown error occurred');
        }
    }
}
exports.DynamicOpenAIChatModel = DynamicOpenAIChatModel;
