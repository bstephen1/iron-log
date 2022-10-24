import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import {
  Divider,
  Grow,
  IconButton,
  InputBase,
  Paper,
  Stack,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useExerciseFormContext } from './useExerciseForm'

export default function CuesList() {
  const { dirtyExercise, setField } = useExerciseFormContext()
  const cues = dirtyExercise?.cues ?? []

  function handleDeleteCue(i: number) {
    const newCues = cues.slice(0, i).concat(cues.slice(i + 1))
    setField('cues', newCues)
  }

  function handleUpdateCue(newCue: string, i: number) {
    if (newCue === cues[i]) return // don't update to the same thing!
    if (!newCue) return handleDeleteCue(i) // delete empty cues // todo: maybe a toast "deleted empty cue"

    const newCues = cues
      .slice(0, i)
      .concat(newCue)
      .concat(cues.slice(i + 1))
    setField('cues', newCues)
  }

  function handleAddCue(newCue: string) {
    if (!newCue) return

    setField('cues', [newCue, ...cues])
  }

  return (
    <>
      {/* todo: center text? outline? divider style in the middle? */}
      <Divider textAlign="center">Cues</Divider>
      {/* todo: drag n drop? */}
      <Stack spacing={2}>
        <CueInputAdd handleAdd={handleAddCue} />
        {cues.map((cue, i) => (
          <CueInputListItem
            key={i}
            index={i}
            value={cue}
            handleDelete={handleDeleteCue}
            handleUpdate={handleUpdateCue}
          />
        ))}
      </Stack>
    </>
  )
}

// todo: useRef to focus on add cue again after inputting something
// todo: Add cue on clear() is actually adding because it's blurring!

interface AddProps {
  handleAdd: (newCue: string) => void
}
function CueInputAdd({ handleAdd }: AddProps) {
  return (
    <CueInputBase
      value={''}
      handleClear={() => {}}
      handleConfirm={(value: string) => handleAdd(value)}
      placeholder="Add Cue"
    />
  )
}

interface ListItemProps {
  index: number
  value: string
  handleDelete: (index: number) => void
  handleUpdate: (newCue: string, index: number) => void
}
function CueInputListItem(props: ListItemProps) {
  const { index, value, handleDelete, handleUpdate } = props

  return (
    <CueInputBase
      value={value}
      handleClear={() => handleDelete(index)}
      handleConfirm={(value: string) => handleUpdate(value, index)}
      placeholder="Edit Cue"
    />
  )
}

interface BaseProps {
  value: string
  handleClear: any
  handleConfirm: any
  placeholder?: string
}
function CueInputBase(props: BaseProps) {
  const { handleClear, handleConfirm, placeholder } = props
  const { cues, cleanExercise } = useExerciseFormContext()
  const [value, setValue] = useState(props.value)

  // reset state whenever the cues list changes.
  // This handles switching exercises, clearing the Add Cue bar after confirming, and any other weirdness (hopefully)
  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        autoFocus={!value}
        disabled={!cleanExercise}
        multiline // allow it to be multiline if it gets that long, but don't allow manual newlines
        value={value}
        onBlur={() => handleConfirm(value)}
        onKeyDown={(e) =>
          e.key === 'Enter' && (document.activeElement as HTMLElement).blur()
        }
        onChange={(e) => setValue(e.target.value)}
        inputProps={{ 'aria-label': 'edit cue' }}
        endAdornment={
          <>
            <Grow in={!!value && value !== props.value}>
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                disabled={!value}
                aria-label="add cue"
                onClick={() => handleConfirm(value)}
              >
                <CheckIcon />
              </IconButton>
            </Grow>
            <Grow in={!!value}>
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                aria-label="clear input"
                onClick={() => {
                  setValue('')
                  handleClear()
                }}
              >
                <ClearIcon />
              </IconButton>
            </Grow>
          </>
        }
      />
    </Paper>
  )
}
