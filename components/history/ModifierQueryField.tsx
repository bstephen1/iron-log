import { type ComponentProps } from 'react'
import ComboBoxField from '../../components/form-fields/ComboBoxField'
import { type UpdateState } from '../../lib/util'
import { ArrayMatchType } from '../../models//ArrayMatchType'
import { type RecordRangeQuery } from '../../models/Record'
import MatchTypeSelector from './MatchTypeSelector'

interface Props extends Partial<ComponentProps<typeof ComboBoxField>> {
  matchType?: ArrayMatchType
  updateQuery: UpdateState<RecordRangeQuery>
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
      handleSubmit={(modifiers) => updateQuery({ modifiers })}
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
