import { test as baseTest } from '@playwright/test'
import fs from 'fs'
import { ObjectId } from 'mongodb'
import path from 'path'

/** Generates a userId from a unique number.
 *  The result is idempotent: the same number will
 *  always correspond to the same id.
 */
const getUserId = (uniqueNum: number) =>
  ObjectId.createFromTime(uniqueNum).toHexString()

// This file is taken from the playwright docs.
// See: https://playwright.dev/docs/auth#moderate-one-account-per-parallel-worker

export * from '@playwright/test'
export const test = baseTest.extend<object, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, apply) => apply(workerStorageState),
  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({ browser }, apply) => {
      // Workers have workerIndex and parallelIndex as unique ids.
      // The difference is parallelIndex will remain the same if the worker is
      // restarted (eg, due to a failure), but workerIndex will be regenerated.
      const id = test.info().workerIndex

      const fileName = path.resolve(
        test.info().project.outputDir,
        `.auth/${id}.json`
      )

      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await apply(fileName)
        return
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const page = await browser.newPage({ storageState: undefined })

      // Acquire a unique account, for example create a new one.
      // Alternatively, you can have a list of precreated accounts for testing.
      // Make sure that accounts are unique, so that multiple team members
      // can run tests at the same time without interference.
      const userId = getUserId(id)

      // Perform authentication steps.
      // todo: can we reuse baseUrl to not have to repeat it here?
      await page.goto('http://localhost:7357/api/auth/signin')
      await page.getByRole('textbox', { name: 'user id' }).fill(userId)
      await page.getByRole('button', { name: 'dev user' }).click()

      // Wait until sign-in is complete
      await page.waitForURL('http://localhost:7357')

      await page.context().storageState({ path: fileName })
      await page.close()
      await apply(fileName)
    },
    { scope: 'worker' },
  ],
})
