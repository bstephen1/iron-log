import { expect, type Page } from '@playwright/test'

export class ExtendedPage {
  constructor(public readonly page: Page) {}

  /** Playwright can perform actions so fast it introduces bugs due to
   *  essentially doing two things at the same time. In such cases waiting
   *  for saving to finish can reduce flakiness.
   *
   *  Also, if a page is reloaded before a POST request completes it will
   *  be aborted.
   */
  async waitForSave() {
    await expect(this.page.getByText('Saving...')).not.toBeVisible()
  }
}
