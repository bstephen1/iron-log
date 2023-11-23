import SetTypeSelect from '../../components/session/records/SetTypeSelect'
import { UpdateState } from '../../lib/util'
import { MatchType } from '../../models/query-filters/MongoQuery'
import { RecordHistoryQuery } from '../../models/query-filters/RecordQuery'
import { Units } from '../../models/Set'
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
      disabled={disabled || query.setTypeMatchType === MatchType.Any}
      SelectProps={{
        startAdornment: (
          <MatchTypeSelector
            matchType={query.setTypeMatchType}
            updateMatchType={(setTypeMatchType) =>
              updateQuery({ setTypeMatchType })
            }
            options={[MatchType.Exact, MatchType.Any]}
            descriptions={{
              [MatchType.Exact]: 'Records with the same set type',
              [MatchType.Partial]: 'Records with any set matching the set type',
              [MatchType.Any]: 'No filter',
            }}
          />
        ),
      }}
    />
  )
}
