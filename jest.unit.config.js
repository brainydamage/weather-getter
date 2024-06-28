module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)unit.test.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage/unit',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/interfaces/**',
    '!src/**/config/**',
    '!src/**/tests/integration/**',
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