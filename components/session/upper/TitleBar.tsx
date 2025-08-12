import Grid from '@mui/material/Grid'
import { type Dayjs } from 'dayjs'
import { DATE_FORMAT } from '../../../lib/frontend/constants'
import BodyweightInput from './BodyweightInput'
import SessionDatePicker from './SessionDatePicker'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useRouter } from 'next/navigation'

interface Props {
  day: Dayjs
}
export default function TitleBar({ day }: Props) {
  const router = useRouter()
  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.up('md'))
  // getServerSideProps messes up useSwr and prevents rerenders from
  // being triggered for the bodyweight input and date picker, causing them to
  // load infinitely. It only affects these useSwr calls.
  // Other ones like useModifiers seem to still work due to nameSort().
  // This is a tmp fix to force a rerender on small screens.
  const _tmpLoadingFix = useMediaQuery(theme.breakpoints.down('md'))

  const handleDateChange = (newDay: Dayjs) => {
    const date = newDay.format(DATE_FORMAT)
    router.push(date)
  }

  return (
    <Grid container spacing={2}>
      {/* todo: change this to a data type which is user defined per program, or freestyle/unstructured type*/}
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 4,
        }}
      >
        <SessionDatePicker
          day={day}
          handleDayChange={handleDateChange}
          textFieldProps={{ fullWidth: true }}
        />
      </Grid>
      {/* todo: session type */}
      {isMd && (
        <Grid
          size={{
            md: 4,
          }}
        ></Grid>
      )}
      {/* todo: customize to show days that have a record; possibly show title; 
            possibly give days a 'type' instead of title, with an associated icon;
            could also highlight different programs / meso cycles */}
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 4,
        }}
      >
        <BodyweightInput day={day} fullWidth />
      </Grid>
    </Grid>
  )
}
