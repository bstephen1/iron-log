import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Input from '@mui/material/Input'
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
    <Card
      elevation={3}
      sx={{
        mt: 2,
      }}
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
        onBlur={(e) =>
          isEmpty ? onDelete(index) : handleSubmit(e.target.value)
        }
        placeholder={placeholder}
        autoComplete="off"
        readOnly={readOnly}
        inputRef={inputRef}
        // for padding while still allowing underline to span full width
        startAdornment={<Box px={0.5} />}
        endAdornment={<Box px={0.5} />}
        slotProps={{
          input: { 'aria-label': `note ${index + 1}` },
        }}
      />
    </Card>
  )
}
