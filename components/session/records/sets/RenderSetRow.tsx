import { Box, Stack } from '@mui/material'
import { blue, grey, lightGreen } from '@mui/material/colors'
import { memo, useCallback } from 'react'
import { useSWRConfig } from 'swr'
import { URI_RECORDS } from '../../../../lib/frontend/constants'
import { updateRecordFields } from '../../../../lib/frontend/restService'
import { UpdateFields } from '../../../../lib/util'
import { DisplayFields } from '../../../../models/DisplayFields'
import { Record } from '../../../../models/Record'
import { Set } from '../../../../models/Set'
import DeleteSetButton from './DeleteSetButton'
import SetFieldInput from './RenderSetField'

const pyStack = 0.5

const background = (side: Set['side']) => {
  switch (side) {
    case 'L':
      return blue[50]
    case 'R':
      return lightGreen[50]
    default:
      return grey[100]
  }
}

interface Props extends Set {
  readOnly?: boolean
  index: number
  displayFields: DisplayFields
  extraWeight: number
  _id: Record['_id']
}
/** Render a set. Note the set to render must be spread into the props.
 *  This destructures the set into primitive values to avoid unecessary rerenders.
 */
export default memo(function RenderSetRow({
  readOnly = false,
  index,
  displayFields,
  extraWeight,
  _id,
  ...set
}: Props) {
  const { mutate } = useSWRConfig()

  const handleSetChange: UpdateFields<Set> = useCallback(
    async (changes) => {
      mutate<Record | null>(
        URI_RECORDS + _id,
        (cur) => {
          if (!cur) return null

          const newSets = [...cur.sets]
          newSets[index] = { ...newSets[index], ...changes }
          return updateRecordFields(_id, { sets: newSets })
        },
        {
          optimisticData: (cur) => {
            if (!cur) return null

            const newSets = [...cur.sets]
            newSets[index] = { ...newSets[index], ...changes }
            return { ...cur, sets: newSets }
          },
          revalidate: false,
        }
      )
    },
    [_id, index, mutate]
  )

  if (!displayFields.visibleFields.length) {
    return <></>
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      // border is from TextField underline
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        background: background(set.side),
        py: pyStack,
        pl: 1,
      }}
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
        <Box minWidth={'32px'} />
      ) : (
        <DeleteSetButton index={index} _id={_id} sx={{ my: -pyStack }} />
      )}
    </Stack>
  )
})
