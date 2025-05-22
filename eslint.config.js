import { FlatCompat } from '@eslint/eslintrc'
import unusedImports from 'eslint-plugin-unused-imports'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})
const eslintConfig = [
  {
    plugins: { 'unused-imports': unusedImports },
  },
  // nextjs rules are formatted using this FlatCompat setup
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'plugin:@typescript-eslint/strict-type-checked',
      'prettier',
    ],
    parserOptions: {
      // generates type information for (strict) rules that require typed linting
      projectService: true,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@mui/[^/]+$',
              message:
                'This is a performance optimization for dev/test mode.' +
                ' Use the named import, eg "@mui/material/Box"',
            },
            {
              regex: '@emotion/react',
              message: 'use @mui/material/styles for theme',
            },
          ],
        },
      ],
      // this rule wants you to have <div>today&apos;s session</div>
      // instead of <div>today's session</div>
      'react/no-unescaped-entities': [
        'error',
        {
          // remove " and ' from the default "forbid" array
          forbid: ['>', '}'],
        },
      ],
      'spaced-comment': [
        'error',
        'always',
        { exceptions: ['-', '*'], markers: ['/'] },
      ],
      // turn off duplicate no-unused-var rules
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // allows --fix to automatically remove unused imports
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          caughtErrorsIgnorePattern: '^e',
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          // eg: true && myFunc()
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      // we prefer the simplified code from ignoring returns of void expressions
      '@typescript-eslint/no-confusing-void-expression': 'off',
      // we always want tests to be async even if they don't need it
      // in case the test is later updated to need async
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        // we prefer the simplified code from ignoring returns of void functions
        { checksVoidReturn: false },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        // allows numbers in grave strings: `example: ${5}`
        { allowNumber: true, allowNever: true },
      ],
      '@typescript-eslint/restrict-plus-operands': [
        'error',
        {
          // allows '0' + 1
          allowNumberAndString: true,
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'with-single-extends',
        },
      ],
      // this one seems too restrictive for little gain
      '@typescript-eslint/no-dynamic-delete': 'off',
      // this considers spreading JSX props as an error
      '@typescript-eslint/no-misused-spread': 'off',
      // we use StatusCodes enums as a list of values, sometimes relationally comparing them
      // eg statusCode > 499; statusCode === StatusCodes.INTERNAL_SERVER_ERROR
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      // too many external pkgs use floating promises. Eg, router.push, mutate (optimistic data)
      '@typescript-eslint/no-floating-promises': 'off',
      // doesn't seem to add any value
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  }),
]
export default eslintConfig
