import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import { MatchType } from 'models/query-filters/MongoQuery'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import { ComponentProps } from 'react'
import MatchTypeSelector from './MatchTypeSelector'

interface Props extends Partial<ComponentProps<typeof ComboBoxField>> {
  matchType?: MatchType
  updateQuery: (changes: Partial<RecordQuery>) => void
  initialValue?: string[]
  options?: string[]
}
export default function ModifierQueryField({
  matchType = MatchType.Exact,
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
          matchType={matchType}
          updateMatchType={(matchType) =>
            updateQuery({ modifierMatchType: matchType })
          }
          descriptions={{
            [MatchType.Exact]: 'Records have only the listed modifiers',
            [MatchType.Partial]: 'Records may have extra modifiers',
          }}
        />
      }
      {...comboBoxFieldProps}
    />
  )
}
