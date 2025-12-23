import Box from '@mui/material/Box'
import { grey, lightBlue, lightGreen } from '@mui/material/colors'
import Stack from '@mui/material/Stack'
import { useCallback } from 'react'
import { updateSet } from '../../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../../lib/frontend/constants'
import { useOptimisticMutation } from '../../../../lib/frontend/data/useMutation'
import {
  useRecordSet,
  useRecords,
} from '../../../../lib/frontend/data/useQuery'
import useNoSwipingDesktop from '../../../../lib/frontend/useNoSwipingDesktop'
import type { PartialUpdate } from '../../../../lib/types'
import type { DisplayFields } from '../../../../models/DisplayFields'
import type { Record } from '../../../../models/Record'
import type { Set } from '../../../../models/Set'
import DeleteSetButton from './DeleteSetButton'
import RenderSetField from './RenderSetField'

const pyStack = 0.5
const deleteButtonHeight = '32px'

/* v8 ignore next */
const getBackground = (side: Set['side']) => {
  switch (side) {
    case 'L':
      return lightBlue[50]
    case 'R':
      return lightGreen[50]
    default:
      return grey[100]
  }
}

/* v8 ignore next */
const getDarkBackground = (side: Set['side']) => {
  switch (side) {
    case 'L':
      return lightBlue[900]
    case 'R':
      return lightGreen[900]
    default:
      return grey[800]
  }
}

interface Props {
  readOnly?: boolean
  index: number
  date: string
  displayFields: DisplayFields
  extraWeight?: number
  _id: Record['_id']
}
/** Render a set. Note the set to render must be spread into the props.
 *  This destructures the set into primitive values to avoid unecessary rerenders.
 */
export default function RenderSetRow({
  readOnly = false,
  index,
  date,
  displayFields,
  extraWeight = 0,
  _id,
}: Props) {
  const set = useRecordSet(_id, date, index)
  console.log('DEBUG retrieved set', set)
  const records = useRecords({ date })
  console.log('DEBUG all records', JSON.stringify(records.data))
  const replaceSet = useSetReplace(_id, date, index)
  const noSwipingDesktop = useNoSwipingDesktop()

  const handleSetChange: PartialUpdate<Set> = useCallback(
    async (changes) => {
      replaceSet({ set: { ...set, ...changes } })
      console.log('DEBUG handleSetChange', changes)
    },
    [set, replaceSet]
  )

  return (
    <Stack
      direction="row"
      alignItems="center"
      aria-label={`Set ${index + 1}`}
      className={noSwipingDesktop}
      // border is from TextField underline
      sx={[
        {
          borderBottom: '1px solid rgba(0, 0, 0, .42)',
          background: getBackground(set.side),
          py: pyStack,
          height: deleteButtonHeight,
          pl: '24px', // match delete button
        },
        (theme) =>
          theme.applyStyles('dark', {
            borderBottom: '1px solid rgba(255, 255, 255, 0.60)',
            backgroundColor: getDarkBackground(set.side),
          }),
      ]}
    >
      {displayFields.visibleFields.map(({ delimiter, name, source }, i) => (
        <RenderSetField
          key={i}
          index={i}
          unit={displayFields.units[source]}
          value={set[source]}
          {...{
            handleSetChange,
            extraWeight,
            delimiter,
            name,
            source,
            readOnly,
          }}
        />
      ))}
      {readOnly ? (
        // insert a box for padding when clear icon is hidden
        <Box minWidth={deleteButtonHeight} />
      ) : (
        <DeleteSetButton index={index} _id={_id} sx={{ my: -pyStack }} />
      )}
    </Stack>
  )
}

function useSetReplace(_id = '', date: string, index: number) {
  return useOptimisticMutation<Record[], Record, { set: Set }>({
    queryKey: [QUERY_KEYS.records, { date }],
    mutationFn: ({ set }) => updateSet(_id, set, index),
    updater: (prev = [], { set }) =>
      prev.map((record) =>
        record._id === _id
          ? {
              ...record,
              sets: record.sets.map((oldSet, i) =>
                i === index ? set : oldSet
              ),
            }
          : record
      ),
  })
}
