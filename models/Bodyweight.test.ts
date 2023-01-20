import dayjs from 'dayjs'
import { DEFAULT_CLOTHING_OFFSET } from '../lib/frontend/constants'
import Bodyweight from './Bodyweight'

const date = dayjs()
const unofficial1 = 80
const unofficial2 = 83
const official1 = 74
const official2 = 77

describe('Update', () => {
  fit('performs official update to existing official weigh-in', () => {
    const bw = new Bodyweight(official1, date, true)
    bw.update(official2, true)

    expect(bw).toMatchObject({
      value: official2,
      offset: DEFAULT_CLOTHING_OFFSET,
      isOfficial: true,
    })
  })

  it('performs unofficial update to existing unofficial weigh-in', () => {
    const bw = new Bodyweight(unofficial1, date, false)
    bw.update(unofficial2, false)

    expect(bw).toMatchObject({
      value: unofficial2 - DEFAULT_CLOTHING_OFFSET,
      offset: DEFAULT_CLOTHING_OFFSET,
      isOfficial: false,
    })
  })

  fit('performs unofficial update to existing official weigh-in', () => {
    const bw = new Bodyweight(official1, date, true)
    bw.update(unofficial1, false)

    expect(bw).toMatchObject({
      value: official1,
      offset: unofficial1 - official1,
      isOfficial: true,
    })
  })

  fit('performs official update to existing unofficial weigh-in', () => {
    const bw = new Bodyweight(unofficial1, date, false)
    bw.update(official1, true)

    expect(bw).toMatchObject({
      value: official1,
      offset: unofficial1 - official1,
      isOfficial: true,
    })
  })

  fit('performs official update after multiple updates', () => {
    const bw = new Bodyweight(unofficial1, date, false)
    bw.update(official1, true)
    bw.update(unofficial2, false)
    bw.update(official2, true)

    expect(bw).toMatchObject({
      value: official2,
      offset: unofficial2 - official2,
      isOfficial: true,
    })
  })

  fit('performs unofficial update after multiple updates', () => {
    const bw = new Bodyweight(unofficial1, date, false)
    bw.update(official1, true)
    bw.update(official2, true)
    bw.update(unofficial2, false)

    expect(bw).toMatchObject({
      value: official2,
      offset: unofficial2 - official2,
      isOfficial: true,
    })
  })
})
