import type { APIRequestContext, Page } from '@playwright/test'

export class Api {
  constructor(
    public readonly request: APIRequestContext,
    public readonly page: Page
  ) {}

  post = (uri: string, data: unknown) =>
    // if we don't fail when the status is not ok the data will just silently
    // not be saved to db
    this.request.post(uri, {
      data,
      failOnStatusCode: true,
    })

  async addData<T>(data: T) {
    const res = await this.post('api/data', data)
    return (await res.json()) as T
  }
}
