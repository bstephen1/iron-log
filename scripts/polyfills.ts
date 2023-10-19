import crypto from 'crypto'

// This file contains polyfills needed to run ts scripts from command line
// to use, simply import this file in the script

// Node crypto does not have this function, required for uuid().
// Have to point it to the web crypto implementation.
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: crypto.webcrypto.getRandomValues,
  },
})
