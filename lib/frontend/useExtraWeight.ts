import type { Record } from '../../models/Record'
import { useBodyweights, useModifiers } from './restService'

export default function useExtraWeight(record: Record) {
  const modifiers = useModifiers()
  const { data: bodyweightData } = useBodyweights(
    {
      limit: 2,
      end: record.date,
      sort: 'newestFirst',
    },
    record.exercise?.attributes.bodyweight
  )

  const { activeModifiers, exercise } = record

  let bodyweight = 0
  if (exercise?.attributes.bodyweight && bodyweightData?.length) {
    if (bodyweightData.length === 1) {
      bodyweight = bodyweightData[0].value
    } else if (bodyweightData[0].date !== bodyweightData[1].date) {
      bodyweight = bodyweightData[0].value
    } else {
      // if same date use the unofficial weight.
      bodyweight =
        bodyweightData[0].type === 'unofficial'
          ? bodyweightData[0].value
          : bodyweightData[1].value
    }
  }

  const exerciseWeight = exercise?.weight ?? 0

  const modifierWeight = activeModifiers.reduce(
    (total, name) => total + (modifiers.index[name]?.weight ?? 0),
    0
  )

  return {
    exerciseWeight,
    modifierWeight,
    bodyweight,
    extraWeight: exerciseWeight + modifierWeight + bodyweight,
  }
}
