import SetTypeSelect from '../../components/session/records/SetTypeSelect'
import { UpdateState } from '../../lib/util'
import { ArrayMatchType } from '../../models/query-filters/ArrayMatchType'
import { RecordHistoryQuery } from '../../models/query-filters/RecordQuery'
import { Units } from '../../models/Units'
import MatchTypeSelector from './MatchTypeSelector'

interface Props {
  units: Units
  query: RecordHistoryQuery
  updateQuery: UpdateState<RecordHistoryQuery>
  disabled?: boolean
}
export default function SetTypeQueryField({
  units,
  query,
  updateQuery,
  disabled,
}: Props) {
  return (
    <SetTypeSelect
      variant="outlined"
      handleChange={({ setType }) => updateQuery(setType ?? {})}
      units={units}
      setType={query}
      disabled={disabled || query.setTypeMatchType === ArrayMatchType.Any}
      slotProps={{
        select: {
          startAdornment: (
            <MatchTypeSelector
              matchType={query.setTypeMatchType}
              updateMatchType={(setTypeMatchType) =>
                updateQuery({ setTypeMatchType })
              }
              options={[ArrayMatchType.Exact, ArrayMatchType.Any]}
              descriptions={{
                [ArrayMatchType.Exact]: 'Records with the same set type',
                [ArrayMatchType.Partial]:
                  'Records with any set matching the set type',
                [ArrayMatchType.Any]: 'No filter',
              }}
            />
          ),
        },
      }}
    />
  )
}
