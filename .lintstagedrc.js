// lintstaged will automatically apply --fix changes during commit with no
// intervention required. If you just run the linter directly in the precommit
// hook the fixes will not be included in the commit.
export default {
  '*': 'npx biome check --staged --fix',
}
