import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import { LOCAL_STORAGE } from '../../../lib/frontend/constants'
import type { IntervalSettings } from './RestTimer'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  handleSubmit: (settings: IntervalSettings) => void
}
export default function IntervalSettingsDialog({
  open,
  setOpen,
  handleSubmit,
}: Props) {
  const [stored, setStored] = useLocalStorageState<IntervalSettings>(
    LOCAL_STORAGE.intervalTimer
  )
  const [dirty, setDirty] = useState<Partial<IntervalSettings>>(stored ?? {})

  const updateDirty = (changes: Partial<typeof dirty>) => {
    setDirty((prev) => ({ ...prev, ...changes }))
  }

  const saveStored = () => {
    const newSettings = {
      delay: Math.max(dirty.delay ?? 0, 0),
      work: Math.max(dirty.work ?? 0, 1),
      rest: Math.max(dirty.rest ?? 0, 1),
    }

    handleClose()
    setStored(newSettings)
    handleSubmit(newSettings)
  }

  const handleClose = () => setOpen(false)

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Interval settings</DialogTitle>
      <DialogContent>
        <Stack spacing={2} pt={2}>
          <SettingsField
            label="Delay"
            value={dirty.delay}
            handleChange={(delay) => updateDirty({ delay })}
            helperText="Delay before first work set. Can be zero."
            placeholder="0"
          />
          <SettingsField
            label="Work"
            value={dirty.work}
            handleChange={(work) => updateDirty({ work })}
            helperText="Time given for each working rep."
            placeholder="1"
          />
          <SettingsField
            label="Rest"
            value={dirty.rest}
            handleChange={(rest) => updateDirty({ rest })}
            helperText="Rest time between each working rep."
            placeholder="1"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={saveStored}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}

interface SettingsFieldProps {
  label: string
  value?: number
  handleChange: (value?: number) => void
  helperText: string
  placeholder: string
}
const SettingsField = ({
  label,
  value,
  handleChange,
  helperText,
  placeholder,
}: SettingsFieldProps) => {
  return (
    <TextField
      label={label}
      value={value ?? ''}
      onChange={(e) =>
        handleChange(e.target.value ? +e.target.value : undefined)
      }
      helperText={helperText}
      placeholder={placeholder}
      onFocus={(e) => e.target.select()}
      slotProps={{
        input: {
          endAdornment: 'sec',
        },
        inputLabel: {
          shrink: true,
        },
        htmlInput: {
          inputMode: 'decimal',
          type: 'number',
        },
      }}
    />
  )
}
