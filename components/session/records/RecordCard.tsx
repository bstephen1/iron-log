import SettingsIcon from '@mui/icons-material/Settings'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material'
import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import RecordCardSkeleton from 'components/loading/RecordCardSkeleton'
import StyledDivider from 'components/StyledDivider'
import dayjs from 'dayjs'
import { DATE_FORMAT } from 'lib/frontend/constants'
import {
  updateExerciseFields,
  updateRecordFields,
  useRecord,
} from 'lib/frontend/restService'
import useNoSwipingSmScreen from 'lib/frontend/useNoSwipingSmScreen'
import { doNothing } from 'lib/util'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import Note from 'models/Note'
import { ArrayMatchType } from 'models/query-filters/MongoQuery'
import { RecordQuery, SetMatchType } from 'models/query-filters/RecordQuery'
import Record, { SetType } from 'models/Record'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useMeasure } from 'react-use'
import HistoryCardsSwiper from '../history/HistoryCardsSwiper'
import HistoryFilterHeaderButton from '../history/HistoryFilterHeaderButton'
import DeleteRecordButton from './actions/DeleteRecordButton'
import ExerciseNotesButton from './actions/ExerciseNotesButton'
import MoreActionsButton from './actions/MoreActionsButton'
import RecordNotesButton from './actions/ReccordNotesButton'
import SwapRecordButton from './actions/SwapRecordButton'
import { RecordContext } from './RecordContext'
import RecordExerciseSelector from './RecordExerciseSelector'
import RecordHeaderButton from './RecordHeaderButton'
import RecordUnitsButton from './RecordUnitsButton'
import RenderSets from './sets/RenderSets'
import SetTypeSelect from './SetTypeSelect'
import useCurrentRecord from './useCurrentRecord'

// Note: mui icons MUST use path imports instead of named imports!
// Otherwise in prod there will be serverless function timeout errors. Path imports also
// make loading significantly faster. Apparently the auto tree-shaking
// mui advertises does not actually work, or isn't set up properly.
// The icons were not causing any issues until 2023/03/06, when an updated
// prod build retractively made every build fail to work.
// See difference between path/named import: https://mui.com/material-ui/guides/minimizing-bundle-size/#option-one-use-path-imports
// See bug: https://github.com/orgs/vercel/discussions/1657
interface Props {
  id: string
  isQuickRender?: boolean
  setMostRecentlyUpdatedExercise: (exercise: Exercise) => void
  /** This allows records within a session that are using the same exercise to see updates to notes/displayFields */
  mostRecentlyUpdatedExercise: Exercise | null
  updateSessionNotes: (notes: Note[]) => Promise<void>
  sessionNotes: Note[]
  swiperIndex: number
}
export default function RecordCard(props: Props) {
  const { id, swiperIndex, mostRecentlyUpdatedExercise } = props
  const { record } = useRecord(id)

  if (record === undefined || (props.isQuickRender && swiperIndex > 1)) {
    return <RecordCardSkeleton title={`Record ${swiperIndex + 1}`} />
  } else if (record === null) {
    return (
      <RecordCardSkeleton
        Content={
          <Typography textAlign="center">
            Could not find record! Try reloading.
          </Typography>
        }
      />
    )
  } else {
    // Use the newly updated exercise so multiple cards with the same exercise will ripple their updates.
    // Note this doesn't mutate the underlying cache, but the cache is set up to mutate when the exercise is updated.
    const exercise =
      mostRecentlyUpdatedExercise?._id === record.exercise?._id
        ? mostRecentlyUpdatedExercise
        : record.exercise
    return (
      <RecordContext.Provider value={{ record }}>
        <LoadedRecordCard
          // key resets history filter when exercise changes or is renamed
          key={exercise?.name}
          {...props}
        />
      </RecordContext.Provider>
    )
  }
}

function LoadedRecordCard({
  swiperIndex,
  setMostRecentlyUpdatedExercise,
  isQuickRender,
}: Props) {
  const {
    exercise,
    activeModifiers,
    sets,
    setType,
    _id,
    record,
    displayFields,
    mutate: mutateRecord,
  } = useCurrentRecord()

  const noSwipingClassName = useNoSwipingSmScreen()
  const router = useRouter()
  const [titleRef, { width: titleWidth }] = useMeasure<HTMLSpanElement>()

  const [shouldSyncFilter, setShouldSyncFilter] = useState(true)
  const [historyFilter, setHistoryFilter] = useState<RecordQuery>({
    // todo: can't filter on no modifiers. Api gets "modifier=&" which is just dropped.
    modifier: record.activeModifiers,
    // don't want to include the current record in its own history
    end: dayjs(record.date).add(-1, 'day').format(DATE_FORMAT),
    exercise: record.exercise?.name,
    limit: 10,
    modifierMatchType: ArrayMatchType.Equivalent,
    setMatchType: SetMatchType.SetType,
    ...setType,
  })

  const updateFilter = (changes: Partial<RecordQuery>) =>
    setHistoryFilter((prevState) => ({ ...prevState, ...changes }))

  const handleFieldChange = async (changes: Partial<Record>) => {
    if (shouldSyncFilter && changes.activeModifiers) {
      updateFilter({ modifier: changes.activeModifiers })
    }
    mutateRecord(updateRecordFields(_id, { ...changes }), {
      optimisticData: { ...record, ...changes },
      revalidate: false,
    })
  }

  const handleExerciseFieldsChange = async (changes: Partial<Exercise>) => {
    if (!exercise) return

    const newExercise = { ...exercise, ...changes }
    mutateRecord({ ...record, exercise: newExercise }, { revalidate: false })
    setMostRecentlyUpdatedExercise(newExercise)
    await updateExerciseFields(exercise, { ...changes })
  }

  const handleSetTypeChange = async (changes: Partial<SetType>) => {
    const newSetType = { ...setType, ...changes }
    const newRecord = { ...record, setType: newSetType }
    if (shouldSyncFilter) {
      updateFilter(changes)
    }
    mutateRecord(updateRecordFields(_id, { setType: newSetType }), {
      optimisticData: newRecord,
      revalidate: false,
    })
  }

  const UnitsButton = () => (
    <RecordUnitsButton
      displayFields={displayFields}
      handleSubmit={(displayFields) =>
        handleExerciseFieldsChange({ displayFields })
      }
      handleClose={doNothing}
      // handleClose={() => setMoreButtonsAnchorEl(null)}
    />
  )

  const actionButtons = [
    <RecordNotesButton key="record notes" />,
    <ExerciseNotesButton
      key="exercise notes"
      handleSubmit={(notes) => handleExerciseFieldsChange({ notes })}
    />,
    <HistoryFilterHeaderButton
      key="filter"
      {...{
        record,
        filter: historyFilter,
        units: displayFields.units,
        shouldSync: shouldSyncFilter,
        onSyncChange: (shouldSync) => {
          setShouldSyncFilter(shouldSync)

          // reset filter to current match current record
          if (shouldSync) {
            updateFilter({
              ...setType,
              modifier: activeModifiers,
              modifierMatchType: ArrayMatchType.Equivalent,
            })
          }
        },
        updateFilter: (changes) => {
          updateFilter(changes)
          setShouldSyncFilter(false)
        },
      }}
    />,
    <UnitsButton key="units" />,
    //  todo: use nextjs prefetch when record is active: https://nextjs.org/docs/api-reference/next/router#routerprefetch  }
    !!exercise && (
      <RecordHeaderButton
        key="manage"
        title="Manage Exercise"
        onClick={() => router.push(`/manage?exercise=${exercise.name}`)}
      >
        <SettingsIcon />
      </RecordHeaderButton>
    ),
    <SwapRecordButton key="left" direction="left" index={swiperIndex} />,
    <SwapRecordButton key="right" direction="right" index={swiperIndex} />,
    <DeleteRecordButton key="delete" />,
  ]

  const [visibleActions, setVisibleActions] = useState(actionButtons.length)
  // todo: incredibly slow because it's rerendering the entire record card.
  // should be limited to just the header
  // todo: same with opening the "more..." menu. It rerenders the ENTIRE record card
  const maxVisibleActions = Math.floor((titleWidth - 132) / 40)
  // const maxVisibleActions = 4
  useEffect(() => {
    setVisibleActions(maxVisibleActions > 0 ? maxVisibleActions : 0)
  }, [maxVisibleActions])
  // todo: width resets to 0 on date change due to component rerender, making this always flash to true

  // todo: if there would only be a single item in the menu, don't render as a menu

  // total - 40x + 8 > 100
  // x = floor((total - 92) /  40)

  // todo: add Category to Record so it persists (if exercise is filtered; mainly for programming)
  return (
    <>
      <Card elevation={3} sx={{ px: 1, m: 0.5 }}>
        <CardHeader
          ref={titleRef}
          title={`Record ${swiperIndex + 1}`}
          titleTypographyProps={{ variant: 'h6' }}
          action={
            <Box
              className={noSwipingClassName}
              sx={{ cursor: 'default', width: '100%' }}
            >
              {actionButtons.slice(0, visibleActions)}
              <MoreActionsButton {...{ actionButtons, visibleActions }} />
            </Box>
          }
        />
        <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />
        <CardContent
          // swiping causes weird behavior on desktop when combined with data input fields
          className={noSwipingClassName}
          sx={{ cursor: { sm: 'default' }, px: 1 }}
        >
          <Stack spacing={2}>
            <RecordExerciseSelector />
            <ComboBoxField
              label="Modifiers"
              options={exercise?.modifiers}
              initialValue={activeModifiers}
              variant="standard"
              helperText=""
              handleSubmit={(value: string[]) =>
                handleFieldChange({ activeModifiers: value })
              }
            />
            <SetTypeSelect
              setType={setType}
              units={displayFields.units}
              handleSubmit={handleSetTypeChange}
              sets={sets}
              showTotal
            />
            <RenderSets
              handleExerciseFieldsChange={handleExerciseFieldsChange}
              displayFields={displayFields}
            />
          </Stack>
        </CardContent>
        <Box pt={3}>
          <HistoryCardsSwiper
            isQuickRender={isQuickRender}
            filter={historyFilter}
            shouldSync={shouldSyncFilter}
            paginationId={_id}
            displayFields={displayFields}
          />
        </Box>
      </Card>
    </>
  )
}
