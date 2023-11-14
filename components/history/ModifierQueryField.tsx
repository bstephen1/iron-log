import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import { ArrayMatchType } from 'models/query-filters/MongoQuery'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import { ComponentProps } from 'react'
import MatchTypeSelector from './MatchTypeSelector'

interface Props extends Partial<ComponentProps<typeof ComboBoxField>> {
  matchType?: ArrayMatchType
  updateQuery: (changes: Partial<RecordQuery>) => void
  initialValue?: string[]
  options?: string[]
}
export default function ModifierQueryField({
  matchType = ArrayMatchType.Exact,
  updateQuery,
  options,
  initialValue,
  ...comboBoxFieldProps
}: Props) {
  return (
    <ComboBoxField
      label="Modifiers"
      emptyPlaceholder="None"
      options={options || []}
      noOptionsText="Select an exercise to select from its available modifiers"
      initialValue={initialValue || []}
      handleSubmit={(modifiers) => updateQuery({ modifier: modifiers })}
      helperText=""
      startAdornment={
        <MatchTypeSelector
          disabled={comboBoxFieldProps.disabled}
          matchType={matchType}
          updateMatchType={(matchType) =>
            updateQuery({ modifierMatchType: matchType })
          }
        />
      }
      {...comboBoxFieldProps}
    />
  )
}
