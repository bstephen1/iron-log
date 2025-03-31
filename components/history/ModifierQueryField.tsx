import { ComponentProps } from 'react'
import ComboBoxField from '../../components/form-fields/ComboBoxField'
import { UpdateState } from '../../lib/util'
import { ArrayMatchType } from '../../models/query-filters/ArrayMatchType'
import { RecordQuery } from '../../models/query-filters/RecordQuery'
import MatchTypeSelector from './MatchTypeSelector'

interface Props extends Partial<ComponentProps<typeof ComboBoxField>> {
  matchType?: ArrayMatchType
  updateQuery: UpdateState<RecordQuery>
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
      initialValue={initialValue || []}
      handleSubmit={(modifiers) => updateQuery({ modifier: modifiers })}
      helperText=""
      startAdornment={
        <MatchTypeSelector
          matchType={matchType}
          updateMatchType={(matchType) =>
            updateQuery({ modifierMatchType: matchType })
          }
          options={[ArrayMatchType.Exact, ArrayMatchType.Partial]}
          descriptions={{
            [ArrayMatchType.Exact]: 'Records have only the listed modifiers',
            [ArrayMatchType.Partial]: 'Records may have extra modifiers',
          }}
        />
      }
      {...comboBoxFieldProps}
    />
  )
}
