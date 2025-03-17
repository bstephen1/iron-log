import { FlatCompat } from '@eslint/eslintrc'
import vitest from '@vitest/eslint-plugin'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})
const eslintConfig = [
  {
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      // we allows expects to be in external functions as long as they start with "expect"
      'vitest/expect-expect': ['error', { assertFunctionNames: ['expect*'] }],
      // no it.only
      'vitest/no-focused-tests': 'error',
    },
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
      // duplicate of @typescript-eslint/no-unused-vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          caughtErrorsIgnorePattern: '^e',
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
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
        { allowNumber: true },
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
      // todo: validate api body reqs and turn on
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  }),
]
export default eslintConfig
