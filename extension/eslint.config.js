import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', "**/globalstate.tsx"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['upload/**/*.{ts,tsx}', 'popup/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-explicit-any': 'error', // Enforce in regular code
    },
  },
  // ✅ Override for test files
  {
    files: [
      '{popup,upload}/**/*.test.{ts,tsx}',
      '{upload,popup}/**/*.d.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Allow `any` in tests
    },
  }
)
