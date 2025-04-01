import SetTypeSelect from '../../components/session/records/SetTypeSelect'
import { UpdateState } from '../../lib/util'
import { ArrayMatchType } from '../../models//ArrayMatchType'
import { RecordRangeQuery } from '../../models/Record'
import { DEFAULT_SET_TYPE } from '../../models/Set'
import { Units } from '../../models/Units'
import MatchTypeSelector from './MatchTypeSelector'

interface Props {
  units: Units
  query: RecordRangeQuery
  updateQuery: UpdateState<RecordRangeQuery>
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
      setType={{ ...DEFAULT_SET_TYPE, ...query }}
      disabled={disabled || query.setTypeMatchType === ArrayMatchType.Any}
      slotProps={{
        select: {
          startAdornment: (
            <MatchTypeSelector
              matchType={query.setTypeMatchType ?? ArrayMatchType.Any}
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
