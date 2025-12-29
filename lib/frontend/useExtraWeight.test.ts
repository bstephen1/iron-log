import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createExercise,
  type Exercise,
} from '../../models/AsyncSelectorOption/Exercise'
import { type Bodyweight, createBodyweight } from '../../models/Bodyweight'
import { createTestRecord } from '../test/data'
import { renderHook } from '../test/rtl'
import useExtraWeight from './useExtraWeight'

const exercise = createExercise('test exercise', {
  modifiers: ['light', 'heavy'],
})
const bwExercise = {
  ...exercise,
  attributes: { bodyweight: true },
}
const record = createTestRecord({ exerciseId: exercise._id })

const mocks = vi.hoisted(() => ({
  modifiers: [
    { name: 'light', weight: 10 },
    { name: 'heavy', weight: 25 },
  ],
  bodyweights: [] as Bodyweight[],
  exercise: null as Exercise | null,
}))

const unofficialBw = createBodyweight(82.3, 'unofficial', '2000-01-01')
const officialBw = createBodyweight(76.4, 'official', '2000-01-01')

vi.mock('./data/useQuery', () => ({
  useModifiers: () => mocks.modifiers,
  useBodyweights: () => ({ data: mocks.bodyweights }),
  useExercise: () => mocks.exercise,
}))

beforeEach(() => {
  mocks.bodyweights = []
  mocks.exercise = null
})

it('returns zero when nothing is using extra weight', () => {
  const { result } = renderHook(() => useExtraWeight(record))

  expect(result.current).toMatchObject({
    exerciseWeight: 0,
    modifierWeight: 0,
    bodyweight: 0,
    extraWeight: 0,
  })
})

it('returns extra weight when enabled', () => {
  const modifierWeight = mocks.modifiers.reduce(
    (sum, cur) => (cur.weight ?? 0) + sum,
    0
  )
  const exerciseWeight = 7.5
  const bodyweight = 82.3
  mocks.bodyweights = [unofficialBw]
  mocks.exercise = {
    ...exercise,
    weight: exerciseWeight,
    attributes: { bodyweight: true },
  }

  const { result } = renderHook(() =>
    useExtraWeight({
      ...record,
      activeModifiers: ['light', 'heavy'],
    })
  )

  expect(result.current).toMatchObject({
    exerciseWeight,
    bodyweight,
    modifierWeight,
    extraWeight: modifierWeight + exerciseWeight + bodyweight,
  })
})

it('handles unknown modifier', () => {
  const { result } = renderHook(() =>
    useExtraWeight({
      ...record,
      activeModifiers: ['unknown'],
    })
  )

  expect(result.current).toMatchObject({
    modifierWeight: 0,
    extraWeight: 0,
  })
})

describe('bodyweight', () => {
  beforeEach(() => {
    mocks.exercise = bwExercise
  })

  it('uses latest bw if latest two bws are different days', () => {
    // data is sorted newest first
    mocks.bodyweights = [{ ...officialBw, date: '2000-02-02' }, unofficialBw]
    const { result } = renderHook(() => useExtraWeight(record))

    expect(result.current).toMatchObject({
      bodyweight: officialBw.value,
      extraWeight: officialBw.value,
    })
  })

  it('uses unofficial weight if latest two bws are the same day', () => {
    // unofficial first
    mocks.bodyweights = [unofficialBw, officialBw]
    const { result, rerender } = renderHook(() => useExtraWeight(record))

    expect(result.current).toMatchObject({
      bodyweight: unofficialBw.value,
      extraWeight: unofficialBw.value,
    })

    // unofficial second
    mocks.bodyweights = [officialBw, unofficialBw]
    rerender()

    expect(result.current).toMatchObject({
      bodyweight: unofficialBw.value,
      extraWeight: unofficialBw.value,
    })
  })

  it('handles no bodyweight data', () => {
    mocks.bodyweights = []

    const { result } = renderHook(() => useExtraWeight(record))

    expect(result.current).toMatchObject({
      bodyweight: 0,
      extraWeight: 0,
    })
  })
})
