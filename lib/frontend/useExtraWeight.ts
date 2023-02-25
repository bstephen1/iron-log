import Record from '../../models/Record'
import { DEFAULT_CLOTHING_OFFSET } from './constants'
import { useBodyweightHistory, useModifiers } from './restService'

interface Props {
  record?: Record
}
export default function useExtraWeight({ record }: Props) {
  const { modifiersIndex } = useModifiers()
  const { data: bodyweightData } = useBodyweightHistory({
    limit: 1,
    end: record?.date,
  })

  if (
    record === undefined ||
    modifiersIndex === undefined ||
    bodyweightData === undefined
  ) {
    return 0
  }

  const { activeModifiers, exercise } = record
  const attributes = exercise?.attributes ?? {}

  // have to account for no bodyweight data
  const bodyweight = bodyweightData[0]
    ? bodyweightData[0].value +
      (bodyweightData[0].type === 'official' ? DEFAULT_CLOTHING_OFFSET : 0)
    : 0

  const extraWeight =
    activeModifiers.reduce(
      (total, name) => (total += modifiersIndex[name]?.weight ?? 0),
      0
    ) + (attributes.bodyweight ? bodyweight : 0)

  return extraWeight
}
