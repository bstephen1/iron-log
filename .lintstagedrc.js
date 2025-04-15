/** next lint requires us to pass each staged file name prefixed with "--file".
 * Normally lint-staged simply appends all file names to the end of the command you
 * provide, so we have to manually build the command to include the "--file" option.
 */
const buildNextLintCommand = (filenames) =>
  `npx next lint --fix --file ${filenames.join(' --file ')}`

const prettier = 'npx prettier --write'

// tasks are run in parallel, but they MUST have mutually exclusive matchers
// to avoid multiple tasks writing to the same file
export default {
  '*.{ts,tsx}': [buildNextLintCommand, prettier],
  // js files are usually jsut config for external pkgs, so we don't lint them
  '*.js': [prettier],
}
