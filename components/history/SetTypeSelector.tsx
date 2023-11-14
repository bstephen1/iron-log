import SetTypeSelect from 'components/session/records/SetTypeSelect'
import { Units } from 'models/Set'
import { MatchType } from 'models/query-filters/MongoQuery'
import { RecordHistoryQuery } from 'models/query-filters/RecordQuery'
import MatchTypeSelector from './MatchTypeSelector'

interface Props {
  units: Units
  query: RecordHistoryQuery
  updateQuery: (changes: Partial<RecordHistoryQuery>) => void
}
export default function SetTypeSelector({ units, query, updateQuery }: Props) {
  return (
    <SetTypeSelect
      variant="outlined"
      handleChange={({ setType }) => updateQuery(setType ?? {})}
      units={units}
      setType={query}
      SelectProps={{
        startAdornment: (
          <MatchTypeSelector
            matchType={query.setMatchType}
            updateMatchType={(setMatchType) => updateQuery({ setMatchType })}
            descriptions={{
              [MatchType.Exact]: 'Records with the same set type',
              [MatchType.Partial]: 'Records with any set matching the set type',
            }}
          />
        ),
      }}
    />
  )
}
