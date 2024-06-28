module.exports = {
  roots: ['<rootDir>/tests/integration'],
  testMatch: ['**/?(*.)integration.test.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage/integration',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/interfaces/**',
    '!src/**/config/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
};