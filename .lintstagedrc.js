/** next lint requires us to pass each staged file name prefixed with "--file".
 * Normally lint-staged simply appends all file names to the end of the command you
 * provide, so we have to manually build the command to include the "--file" option.
 */
const buildNextLintCommand = (filenames) =>
  `npx next lint --fix --file ${filenames.join(' --file ')}`

export default {
  '*.{ts,tsx}': [buildNextLintCommand, 'npx prettier --write'],
}
