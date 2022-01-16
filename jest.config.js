module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    setupFiles: ['dotenv/config'],
    testPathIgnorePatterns: ['/node_modules/', '/built/'],
}
