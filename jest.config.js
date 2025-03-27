/* eslint-disable no-undef */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 50000,
  moduleNameMapper: {
    '^@features/(.*)$': '<rootDir>/features/$1',
    '^@core/(.*)$': '<rootDir>/core/$1',
    '^@infrastructure/(.*)$': '<rootDir>/infrastructure/$1',
    '^src/(.*)$': '<rootDir>/$1',
  },
};
