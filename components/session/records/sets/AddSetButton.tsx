import AddIcon from '@mui/icons-material/Add'
import { Box, Fab, Tooltip } from '@mui/material'
import { useSWRConfig } from 'swr'
import { URI_RECORDS } from '../../../../lib/frontend/constants'
import { updateRecordFields } from '../../../../lib/frontend/restService'
import { Record } from '../../../../models/Record'
import { Set } from '../../../../models/Set'

interface Props {
  sets: Set[]
  disabled?: boolean
  _id: string
}
export default function AddSetButton({ sets, disabled, _id }: Props) {
  const { mutate } = useSWRConfig()

  const addSet = async () => {
    const newSet = sets.at(-1)
      ? { ...sets.at(-1), effort: undefined }
      : ({} as Set)

    // Behavior is a bit up for debate. We've decided to only add a single new set
    // rather than automatically add an L and R set with values from the latest L and R
    // sets. This way should be more flexible if the user has a few sets as "both" and only
    // splits into L/R when it gets near failure. But if the last set was specified as L or R
    // we switch to the other side for the new set.
    // Another behavior could be to add L/R sets automatically when adding a new record, but
    // again the user may want to start with "both" and only split into L/R if they diverge.
    if (newSet.side === 'L') {
      newSet.side = 'R'
    } else if (newSet.side === 'R') {
      newSet.side = 'L'
    }

    mutate<Record | null>(
      URI_RECORDS + _id,
      updateRecordFields(_id, { sets: sets.concat(newSet) }),
      {
        optimisticData: (cur) =>
          cur ? { ...cur, sets: sets.concat(newSet) } : null,
        revalidate: false,
      }
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Tooltip title="Add set" placement="right">
        <span>
          <Fab
            color="primary"
            size="medium"
            disabled={disabled}
            onClick={addSet}
          >
            <AddIcon />
          </Fab>
        </span>
      </Tooltip>
    </Box>
  )
}
