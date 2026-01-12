import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Input from '@mui/material/Input'
import { useRef, useState } from 'react'
import { createNote, type Note } from '../../../models/Note'
import useField from '../useField'
import NoteHeader from './NoteHeader'

interface Props {
  placeholder?: string
  handleAdd: (value: Note) => void
  disabled?: boolean
  options?: string[]
  multiple?: boolean
  initialTags?: string[]
}
// This Input is a temporary value that isn't include in the list until/unless it is submitted.
export default function AddNote({
  placeholder = 'Add note',
  handleAdd,
  disabled,
  options = [],
  multiple,
  initialTags = [],
}: Props) {
  const inputRef = useRef<HTMLInputElement>(undefined)
  const [tags, setTags] = useState<Note['tags']>(initialTags)
  const handleSubmit = (value: string) => {
    handleAdd(createNote(value.trim(), tags))
    onReset()
  }
  const onReset = () => {
    // we only reset the input; tags are left as-is
    reset('')
    inputRef.current?.focus()
  }

  const { control, isEmpty, reset, submit } = useField({
    handleSubmit,
    initialValue: '',
    autoSubmit: false,
  })

  return (
    <Card elevation={3} sx={{ mt: 1 }}>
      <NoteHeader
        isEmpty={isEmpty}
        // have to explicitly submit with no arg
        handleAdd={() => submit()}
        handleDelete={onReset}
        tagSelectProps={{
          handleUpdate: setTags,
          selectedTags: tags,
          options,
          multiple,
        }}
      />
      <Input
        {...control()}
        multiline
        size="small"
        fullWidth
        placeholder={placeholder}
        disabled={disabled}
        // for padding while still allowing underline to span full width
        startAdornment={<Box px={0.5} />}
        endAdornment={<Box px={0.5} />}
        inputRef={inputRef}
      />
    </Card>
  )
}
