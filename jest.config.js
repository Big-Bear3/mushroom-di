/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    clearMocks: true,
    preset: 'ts-jest',
    coverageProvider: 'v8',
    coveragePathIgnorePatterns: ['node_modules/*', 'tests/*']
};
