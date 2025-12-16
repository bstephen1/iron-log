import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import { useSetAdd } from '../../../../lib/frontend/restService'
import type { Set } from '../../../../models/Set'

interface Props extends Set {
  disabled?: boolean
  /** record id to add the set to */
  _id: string
}
/** This component also takes in fields from the previous Set,
 *  which will be passed along to the new Set
 */
export default function AddSetButton({ disabled, _id, ...prevSet }: Props) {
  const addSet = useSetAdd(_id)

  const handleAdd = async () => {
    const newSet = { ...prevSet, effort: undefined }

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

    addSet({ set: newSet })
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
        onClick={handleAdd}
        aria-label="Add new set"
      >
        <AddIcon />
      </Fab>
    </Box>
  )
}
