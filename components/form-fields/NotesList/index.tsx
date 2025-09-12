import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import { memo } from 'react'
import isEqual from 'react-fast-compare'
import { TransitionGroup } from 'react-transition-group'
import type { Note } from '../../../models/Note'
import FormDivider from '../../forms/FormDivider'
import AddNote from './AddNote'
import NotesListItem from './NotesListItem'

interface Props {
  label?: string
  /** list of selectable tags */
  options?: string[]
  addItemPlaceholder?: string
  listItemPlaceholder?: string
  initialTags?: string[]
  /** considered readOnly if omitted */
  handleSubmit?: (notes: Note[]) => void
  notes: Note[]
  multiple?: boolean
  readOnly?: boolean
}
/** This component is setup for memoization. For memoization to work any functions passed in
 *  must be wrapped in useCallback(). Eg, handleSubmit().
 */
export default memo(function NotesList(props: Props) {
  const {
    label,
    notes,
    options = [],
    addItemPlaceholder,
    listItemPlaceholder,
    initialTags,
    handleSubmit,
    multiple,
    readOnly,
  } = props

  // we need to save these as functions in the parent component
  // or the list won't be able to properly rerender on change
  const handleAdd = (newNote: Note) => handleSubmit?.([newNote, ...notes])
  const handleDelete = (i: number) => {
    handleSubmit?.(notes.slice(0, i).concat(notes.slice(i + 1)))
  }
  const handleUpdate = (i: number, newNote: Note) => {
    handleSubmit?.(
      notes
        .slice(0, i)
        .concat(newNote)
        .concat(notes.slice(i + 1))
    )
  }

  return (
    <>
      {label && <FormDivider title={label} />}
      {/* todo: drag n drop? */}
      {!readOnly && (
        <AddNote
          placeholder={addItemPlaceholder}
          {...{ handleAdd, options, multiple, initialTags }}
        />
      )}
      <TransitionGroup>
        {notes.map((note, index) => (
          <Collapse key={note._id}>
            <NotesListItem
              placeholder={listItemPlaceholder}
              {...{
                handleDelete,
                handleUpdate,
                options,
                note,
                index,
                multiple,
                readOnly,
              }}
            />
          </Collapse>
        ))}
      </TransitionGroup>
      {readOnly && !notes.length && (
        <Typography>This record has no notes</Typography>
      )}
    </>
  )
}, isEqual)
