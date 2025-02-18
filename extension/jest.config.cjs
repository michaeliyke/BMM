module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: { // Use 'transform' instead of 'globals'
    '^.+\\.ts?$': [ // Transform regex for .ts files
      'ts-jest',
      { // ts-jest configuration starts here, inside the array with 'ts-jest'
        tsConfig: { // Use 'tsConfig' (or try 'tsconfig' if this doesn't work) - this is where tsconfig options go
          target: 'ES2020',       // Match your tsconfig.app.json target
          lib: ['ES2020', 'DOM', 'DOM.Iterable'], // Match your tsconfig.app.json lib
          esModuleInterop: true,   // Include esModuleInterop
        },
      },
    ],
  },
};
