import Input from '@mui/material/Input'
import Paper from '@mui/material/Paper'
import { useColorScheme } from '@mui/material/styles'
import { useRef } from 'react'
import type { Note } from '../../../models/Note'
import useField from '../useField'
import NoteHeader from './NoteHeader'

interface Props {
  note: Note
  index: number
  handleDelete: (index: number) => void
  handleUpdate: (index: number, value: Note) => void
  placeholder?: string
  options?: string[]
  multiple?: boolean
  readOnly?: boolean
}
export default function NotesListItem(props: Props) {
  const {
    note,
    placeholder = 'Empty note (will be deleted)',
    index,
    handleDelete,
    handleUpdate,
    options = [],
    multiple,
    readOnly,
  } = props

  const inputRef = useRef<HTMLInputElement>(undefined)
  const { mode } = useColorScheme()
  const handleSubmit = (value: string) =>
    handleUpdate(index, { ...note, value })
  const { control, isEmpty, reset } = useField({
    handleSubmit,
    initialValue: note.value,
    // lower debounce causes a lot of strangeness on mobile (words duplicated on save, etc)
    // need to be very sure the user is done typing before trying to autosave
    debounceMilliseconds: 2500,
  })

  const onDelete = (index: number) => {
    // have to reset to ensure the debounce timer is cancelled
    reset()
    handleDelete(index)
  }

  return (
    <Paper
      variant={mode === 'dark' ? 'elevation' : 'outlined'}
      sx={{ mt: 2, p: 1 }}
    >
      <NoteHeader
        isEmpty={isEmpty}
        handleDelete={() => onDelete(index)}
        tagSelectProps={{
          handleUpdate: (newTags) =>
            handleUpdate(index, { ...note, tags: newTags }),
          selectedTags: note.tags,
          options,
          multiple,
          readOnly,
        }}
      />
      <Input
        {...control()}
        multiline
        size="small"
        fullWidth
        disableUnderline
        onBlur={(e) =>
          isEmpty ? onDelete(index) : handleSubmit(e.target.value)
        }
        placeholder={placeholder}
        autoComplete="off"
        readOnly={readOnly}
        inputRef={inputRef}
        slotProps={{
          input: { 'aria-label': `note ${index + 1}` },
        }}
        sx={{ px: 1 }}
      />
    </Paper>
  )
}
