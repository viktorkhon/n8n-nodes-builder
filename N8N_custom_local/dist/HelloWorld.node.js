"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloWorld = void 0;
class HelloWorld {
    constructor() {
        this.description = {
            displayName: 'Hello World',
            name: 'helloWorld',
            group: ['transform'],
            version: 1,
            description: 'A simple test node to confirm custom extension loading.',
            defaults: {
                name: 'Hello World',
                color: '#9933ff',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [],
        };
    }
    async execute() {
        return [this.getInputData().map(item => ({ json: { message: 'Hello from custom node!' } }))];
    }
}
exports.HelloWorld = HelloWorld;
// Export default
exports.default = HelloWorld;
