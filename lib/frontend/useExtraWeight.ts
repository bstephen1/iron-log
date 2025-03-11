import { Record } from '../../models/Record'
import { useBodyweightHistory, useModifiers } from './restService'

export default function useExtraWeight(record: Record) {
  const { modifiersIndex } = useModifiers()
  const { data: bodyweightData } = useBodyweightHistory(
    {
      limit: 2,
      end: record.date,
    },
    record.exercise?.attributes.bodyweight
  )

  const { activeModifiers, exercise } = record
  const attributes = exercise?.attributes ?? {}

  let bodyweight = 0
  if (attributes.bodyweight) {
    switch (bodyweightData?.length) {
      case 1:
        bodyweight = bodyweightData[0].value
        break
      case 2:
        // if same date use the unofficial weight.
        if (bodyweightData[0].date !== bodyweightData[1].date) {
          bodyweight = bodyweightData[0].value
          break
        }
        bodyweight =
          bodyweightData[0].type === 'unofficial'
            ? bodyweightData[0].value
            : bodyweightData[1].value
      case 0:
      default:
        break
    }
  }

  const exerciseWeight = exercise?.weight ?? 0

  const modifierWeight = activeModifiers.reduce(
    (total, name) => (total += modifiersIndex[name]?.weight ?? 0),
    0
  )

  return {
    exerciseWeight,
    modifierWeight,
    bodyweight,
    extraWeight: exerciseWeight + modifierWeight + bodyweight,
  }
}
