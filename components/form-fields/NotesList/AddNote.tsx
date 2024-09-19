import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { OutlinedInput } from '@mui/material'
import { useRef, useState } from 'react'
import TransitionIconButton from '../../../components/TransitionIconButton'
import Note from '../../../models/Note'
import useField from '../useField'
import TagSelect from './TagSelect'

interface Props {
  placeholder?: string
  handleAdd: (value: Note) => void
  disabled: boolean
  options: string[]
  multiple?: boolean
  initialTags?: string[]
}
// This Input is a temporary value that isn't include in the list until/unless it is submitted.
export default function AddNote({
  placeholder,
  handleAdd,
  disabled,
  options,
  multiple,
  initialTags = [],
}: Props) {
  const inputRef = useRef<HTMLInputElement>()
  const [tags, setTags] = useState<Note['tags']>(initialTags)
  const handleSubmit = (value: string) => {
    handleAdd(new Note(value.trim(), tags))
    onReset()
  }
  const onReset = () => {
    reset('')
    // if it's single we can just leave the tag as is
    if (multiple) setTags(initialTags)
    inputRef.current?.focus()
  }

  const { control, isEmpty, reset, submit } = useField({
    handleSubmit,
    initialValue: '',
    autoSubmit: false,
  })

  return (
    <OutlinedInput
      {...control()}
      multiline
      size="small"
      fullWidth
      placeholder={placeholder}
      disabled={disabled}
      // removing this for multiline notes
      // onKeyDown={(e) => e.code === 'Enter' && submit()}
      inputRef={inputRef}
      startAdornment={
        <TagSelect
          handleUpdate={setTags}
          {...{ selectedTags: tags, options, multiple }}
        />
      }
      endAdornment={
        <>
          <TransitionIconButton
            isVisible={!isEmpty}
            onClick={() => submit()}
            aria-label="add note"
          >
            <CheckIcon />
          </TransitionIconButton>
          <TransitionIconButton
            isVisible={!isEmpty || !!tags.length}
            onClick={onReset}
            aria-label="clear input"
          >
            <ClearIcon />
          </TransitionIconButton>
        </>
      }
      sx={{ my: 1 }}
    />
  )
}
