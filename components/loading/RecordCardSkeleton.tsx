import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Skeleton,
} from '@mui/material'
import StyledDivider from 'components/StyledDivider'

export default function RecordCardSkeleton() {
  return (
    <Card elevation={3} sx={{ px: 1, m: 0.5 }}>
      <CardHeader title={`Record`} titleTypographyProps={{ variant: 'h6' }} />
      <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />

      <CardContent>
        <Skeleton height="50px" />
        <Skeleton height="50px" />
        <Skeleton height="50px" />
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
        <Skeleton variant="circular" height="50px" width="50px" />
      </CardActions>
    </Card>
  )
}
