import AddIcon from '@mui/icons-material/Add'
import { Box, Fab, Tooltip } from '@mui/material'
import { updateRecordFields } from 'lib/frontend/restService'
import useNoSwipingSmScreen from 'lib/frontend/useNoSwipingSmScreen'
import { Set } from 'models/Set'
import useRecordCard from '../useRecordCard'

export default function AddSetButton() {
  const { record, displayFields, sets, mutate, _id } = useRecordCard()
  const className = useNoSwipingSmScreen()

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

    mutate(updateRecordFields(_id, { [`sets.${sets.length}`]: newSet }), {
      optimisticData: { ...record, sets: sets.concat(newSet) },
      revalidate: false,
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
      <Tooltip title="Add Set" placement="right">
        <span>
          <Fab
            color="primary"
            size="medium"
            disabled={!displayFields?.visibleFields.length}
            onClick={addSet}
            className={className}
          >
            <AddIcon />
          </Fab>
        </span>
      </Tooltip>
    </Box>
  )
}
