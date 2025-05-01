import type { APIRequestContext } from '@playwright/test'
import {
  URI_BODYWEIGHT,
  URI_EXERCISES,
  URI_MODIFIERS,
  URI_RECORDS,
} from '../../lib/frontend/constants'
import {
  createExercise,
  Exercise,
} from '../../models/AsyncSelectorOption/Exercise'
import {
  createModifier,
  Modifier,
} from '../../models/AsyncSelectorOption/Modifier'
import { Bodyweight, createBodyweight } from '../../models/Bodyweight'
import { createRecord, Record } from '../../models/Record'

export class Api {
  constructor(public readonly request: APIRequestContext) {}

  post = (uri: string, data: unknown) =>
    // if we don't fail when the status is not ok the data will just silently
    // not be saved to db
    this.request.post(uri, { data, failOnStatusCode: true })

  async addModifier(...args: Parameters<typeof createModifier>) {
    const res = await this.post(URI_MODIFIERS, createModifier(...args))
    return (await res.json()) as Modifier
  }

  async addExercise(...args: Parameters<typeof createExercise>) {
    const res = await this.post(URI_EXERCISES, createExercise(...args))
    return (await res.json()) as Exercise
  }

  async addRecord(...args: Parameters<typeof createRecord>) {
    const res = await this.post(URI_RECORDS, createRecord(...args))
    return (await res.json()) as Record
  }

  // bodyweight uses an update schema with put given a date, not an add with post
  async addBodyweight(...args: Parameters<typeof createBodyweight>) {
    const bw = createBodyweight(...args)
    const res = await this.request.put(URI_BODYWEIGHT + bw.date, {
      data: bw,
      failOnStatusCode: true,
    })
    return (await res.json()) as Bodyweight
  }
}
