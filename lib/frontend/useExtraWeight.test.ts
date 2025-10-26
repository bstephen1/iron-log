import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import { type Bodyweight, createBodyweight } from '../../models/Bodyweight'
import { createRecord } from '../../models/Record'
import { renderHook } from '../testUtils'
import useExtraWeight from './useExtraWeight'

const exercise = createExercise('test exercise', {
  modifiers: ['light', 'heavy'],
})
const record = createRecord('2000-01-01', { exercise })
const bwRecord = {
  ...record,
  exercise: {
    ...exercise,
    attributes: { bodyweight: true },
  },
}

const mocks = vi.hoisted(() => ({
  modifierIndex: { light: { weight: 10 }, heavy: { weight: 25 } },
  bodyweights: [] as Bodyweight[],
}))

const unofficialBw = createBodyweight(82.3, 'unofficial', '2000-01-01')
const officialBw = createBodyweight(76.4, 'official', '2000-01-01')

vi.mock('./restService', () => ({
  useModifiers: () => ({
    index: mocks.modifierIndex,
  }),
  useBodyweights: () => ({ data: mocks.bodyweights }),
}))

beforeEach(() => {
  mocks.bodyweights = []
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
  const modifierWeight =
    mocks.modifierIndex.light.weight + mocks.modifierIndex.heavy.weight
  const exerciseWeight = 7.5
  const bodyweight = 82.3
  mocks.bodyweights = [unofficialBw]
  const { result } = renderHook(() =>
    useExtraWeight({
      ...record,
      activeModifiers: ['light', 'heavy'],
      exercise: {
        ...exercise,
        weight: exerciseWeight,
        attributes: { bodyweight: true },
      },
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
  it('uses latest bw if latest two bws are different days', () => {
    // data is sorted newest first
    mocks.bodyweights = [{ ...officialBw, date: '2000-02-02' }, unofficialBw]

    const { result } = renderHook(() => useExtraWeight(bwRecord))

    expect(result.current).toMatchObject({
      bodyweight: officialBw.value,
      extraWeight: officialBw.value,
    })
  })

  it('uses unofficial weight if latest two bws are the same day', () => {
    // unofficial first
    mocks.bodyweights = [unofficialBw, officialBw]
    const { result, rerender } = renderHook(() => useExtraWeight(bwRecord))

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

    const { result } = renderHook(() => useExtraWeight(bwRecord))

    expect(result.current).toMatchObject({
      bodyweight: 0,
      extraWeight: 0,
    })
  })
})
