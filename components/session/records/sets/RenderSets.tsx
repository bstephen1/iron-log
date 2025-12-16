import Box from '@mui/material/Box'
import type { DisplayFields } from '../../../../models/DisplayFields'
import type { Record } from '../../../../models/Record'
import AddSetButton from './AddSetButton'
import RenderSetRow from './RenderSetRow'
import SetHeader from './SetHeader'

interface Props extends Pick<Record, '_id' | 'sets'> {
  /** if omitted, sets are treated as readOnly */
  exerciseId?: string
  /** displayFields must be given as a prop because history records use the parent's fields
   *  so they can reflect changes to the parent's display fields.
   */
  displayFields: DisplayFields
  showSplitWeight?: boolean
  showUnilateral?: boolean
  /** Exercise weight is ignored if the record is computed to be a bodyweight exercise
   *  (no weight provided). This allows for adding weight with eg a dip belt without
   *  needing to add a modifier and mess up history tracking.
   */
  exerciseWeight?: number
  extraWeight?: number
}
export default function RenderSets({
  exerciseId,
  displayFields,
  showSplitWeight,
  showUnilateral,
  sets,
  exerciseWeight = 0,
  extraWeight = 0,
  _id,
}: Props) {
  const readOnly = !exerciseId

  // todo: clean up passing around the full sets to every set.
  // Possibly have an updateSets() in mongoService to limit component scope.
  const hasVisibleFields = !!displayFields.visibleFields.length

  return (
    <Box>
      <SetHeader
        {...{
          displayFields,
          exerciseId,
          readOnly,
          showSplitWeight,
          showUnilateral,
        }}
      />
      <Box>
        {sets.map((set, i) => (
          <RenderSetRow
            key={i}
            index={i}
            {...{
              sets,
              displayFields,
              readOnly: readOnly || !hasVisibleFields,
              _id,
              // exerciseWeight represents eg a dip belt.
              // When there is no extra plate weight, you wouldn't be using the belt.
              extraWeight: extraWeight - (set.weight ? 0 : exerciseWeight),
            }}
          />
        ))}
      </Box>
      {!readOnly && (
        <AddSetButton disabled={!hasVisibleFields} {...{ sets, _id }} />
      )}
    </Box>
  )
}
