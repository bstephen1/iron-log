To run a script: `bun <file>`

The below were required when using `npx vite-node <file>` and may or may not still apply:

Scripts require `type: module` in package.json. vite-node needs no further setup.

For unknown reasons, absolute paths from imported files aren't recognized consistently.
Seems to mostly happen with `lib/util`. If you `import {something} from lib/util`
directly in a script file, it will work fine. But if you e.g. `import {Record} from models/Record`,
which internally imports `lib/util`, it will fail to resolve the `lib/util` import.
The easiest way to solve this seems to be to use relative imports in script files
(so `import {Record} from ../models/Record`). The internal imports are then somehow found.
