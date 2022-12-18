module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.base.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '**/packages/*/tests/**/*.spec.ts',
    '**/packages/*/tests/**/*.test.ts',
  ],
  testEnvironment: 'node',
};
