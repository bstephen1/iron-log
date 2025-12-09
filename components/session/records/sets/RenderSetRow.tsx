import Box from '@mui/material/Box'
import { grey, lightBlue, lightGreen } from '@mui/material/colors'
import Stack from '@mui/material/Stack'
import { useCallback } from 'react'
import { useCurrentDate } from '../../../../app/sessions/[date]/useCurrentDate'
import { updateRecordFields } from '../../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../../lib/frontend/constants'
import { useUpdateMutation } from '../../../../lib/frontend/restService'
import useNoSwipingDesktop from '../../../../lib/frontend/useNoSwipingDesktop'
import type { PartialUpdate } from '../../../../lib/types'
import type { DisplayFields } from '../../../../models/DisplayFields'
import type { Record } from '../../../../models/Record'
import type { Set } from '../../../../models/Set'
import DeleteSetButton from './DeleteSetButton'
import SetFieldInput from './RenderSetField'

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
  displayFields: DisplayFields
  extraWeight?: number
  _id: Record['_id']
  sets: Set[]
}
/** Render a set. Note the set to render must be spread into the props.
 *  This destructures the set into primitive values to avoid unecessary rerenders.
 */
export default function RenderSetRow({
  readOnly = false,
  index,
  displayFields,
  extraWeight = 0,
  _id,
  sets,
}: Props) {
  const set = sets[index]
  const date = useCurrentDate()
  const noSwipingDesktop = useNoSwipingDesktop()
  const updateRecordMutate = useUpdateMutation({
    queryKey: [QUERY_KEYS.records, { date }],
    updateFn: updateRecordFields,
  })

  const handleSetChange: PartialUpdate<Set> = useCallback(
    async (changes) => {
      const newSets = [...sets]
      newSets[index] = { ...newSets[index], ...changes }
      updateRecordMutate({ _id, updates: { sets: newSets } })
    },
    [_id, index, sets, updateRecordMutate]
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
        },
        (theme) =>
          theme.applyStyles('dark', {
            borderBottom: '1px solid rgba(255, 255, 255, 0.60)',
            backgroundColor: getDarkBackground(set.side),
          }),
      ]}
    >
      {displayFields.visibleFields.map(({ delimiter, name, source }, i) => (
        <SetFieldInput
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
        <DeleteSetButton
          index={index}
          _id={_id}
          sets={sets}
          sx={{ my: -pyStack }}
        />
      )}
    </Stack>
  )
}
