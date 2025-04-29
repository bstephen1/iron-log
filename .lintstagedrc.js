// lintstaged appends a list of all the staged files at the end of any commands
// given to it, so the commands must support multiple files in a list like that.
// Otherwise, a function can be passed instead of a string, which will have the
// list of staged filenames as an arg.

const prettier = 'npx prettier --write'
// we must explicitly null out the dirs or it will still lint over all the dirs
// specified in next.config.js
const lint = 'npx next lint --fix --dir --file'

// tasks are run in parallel, but they MUST have mutually exclusive matchers
// to avoid multiple tasks writing to the same file
export default {
  '*.{ts,tsx}': [lint, prettier],
  // js files are usually jsut config for external pkgs, so we don't lint them
  '*.js': [prettier],
}
