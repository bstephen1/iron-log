import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { OutlinedInput } from '@mui/material'
import { useRef, useState } from 'react'
import Note from '../../../models/Note'
import TransitionIconButton from '../../TransitionIconButton'
import useField from '../useField'
import TagSelect from './TagSelect'

interface Props {
  placeholder?: string
  handleAdd: (value: Note) => void
  disabled: boolean
  options: string[]
}
// This Input is a temporary value that isn't include in the list until/unless it is submitted.
export default function AddNote({
  placeholder,
  handleAdd,
  disabled,
  options,
}: Props) {
  const inputRef = useRef<HTMLInputElement>()
  const [tags, setTags] = useState<Note['tags']>([])
  const handleSubmit = (value: string) => {
    handleAdd(new Note(value, tags))
    onReset()
  }
  const onReset = () => {
    reset('')
    setTags([])
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
      placeholder={placeholder}
      disabled={disabled}
      onKeyDown={(e) => e.code === 'Enter' && submit()}
      inputRef={inputRef}
      startAdornment={
        <TagSelect handleUpdate={setTags} tags={tags} options={options} />
      }
      endAdornment={
        <>
          <TransitionIconButton
            isVisible={!isEmpty}
            onClick={submit}
            aria-label="add cue"
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
    />
  )
}
