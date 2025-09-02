import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import { useCurrentDate } from '../../../../app/sessions/[date]/useCurrentDate'
import { updateRecordFields } from '../../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../../lib/frontend/constants'
import { dbUpdate } from '../../../../lib/frontend/restService'
import { type Set } from '../../../../models/Set'

interface Props {
  sets: Set[]
  disabled?: boolean
  /** record id to add the set to */
  _id: string
}
export default function AddSetButton({ sets, disabled, _id }: Props) {
  const date = useCurrentDate()

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

    dbUpdate({
      optimisticKey: [QUERY_KEYS.records, { date }],
      id: _id,
      updates: { sets: sets.concat(newSet) },
      updateFunction: updateRecordFields,
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Fab
        color="primary"
        size="medium"
        disabled={disabled}
        onClick={addSet}
        aria-label="Add new set"
      >
        <AddIcon />
      </Fab>
    </Box>
  )
}
