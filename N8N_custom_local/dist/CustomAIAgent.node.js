"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAIAgent = void 0;
class CustomAIAgent {
    constructor() {
        this.description = {
            displayName: 'Custom AI Agent',
            name: 'customAIAgent',
            group: ['transform'], // Ensure this is a valid node group.
            version: 1,
            description: 'A custom AI agent node with manually entered parameters for LLM and credentials',
            defaults: {
                name: 'Custom AI Agent',
                color: '#772244',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'LLM Model',
                    name: 'model',
                    type: 'string',
                    default: 'gpt-4o-mini',
                    placeholder: 'Enter the model identifier',
                    description: 'Identifier for the LLM model to use.',
                },
                {
                    displayName: 'API Key',
                    name: 'apiKey',
                    type: 'string',
                    default: '',
                    typeOptions: {
                        password: true,
                    },
                    placeholder: 'Enter your API key',
                    description: 'API key for the LLM service.',
                },
                {
                    displayName: 'Endpoint URL',
                    name: 'endpoint',
                    type: 'string',
                    default: 'https://api.openai.com/v1/',
                    placeholder: 'https://api.openai.com/v1/',
                    description: 'Endpoint URL for the LLM API.',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                const model = this.getNodeParameter('model', itemIndex);
                const apiKey = this.getNodeParameter('apiKey', itemIndex);
                const endpoint = this.getNodeParameter('endpoint', itemIndex);
                // Insert your custom LLM call logic here. For now, return a sample message.
                const responseData = {
                    message: 'Called the LLM successfully.',
                    model,
                    apiKey: `***${apiKey.slice(-4)}`, // Masked for logging
                    endpoint,
                    originalInput: items[itemIndex].json,
                };
                returnData.push({
                    json: responseData,
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    let errorMessage = 'An unknown error occurred during execution.';
                    if (error instanceof Error) {
                        errorMessage = error.message;
                    }
                    returnData.push({
                        json: { error: errorMessage },
                        pairedItem: { item: itemIndex },
                    });
                    continue;
                }
                throw error;
            }
        }
        return this.prepareOutputData(returnData);
    }
}
exports.CustomAIAgent = CustomAIAgent;
// Export as default so that n8n's custom node loader detects it.
exports.default = CustomAIAgent;
