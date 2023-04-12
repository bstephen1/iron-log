import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Skeleton,
  SxProps,
  TypographyProps,
} from '@mui/material'
import StyledDivider from 'components/StyledDivider'

interface Props {
  title?: string
  noSetButton?: boolean
  /** Override all card content.  */
  Content?: JSX.Element
  elevation?: number
  titleTypographyProps?: Partial<TypographyProps>
  sx?: SxProps
}
export default function RecordCardSkeleton({
  title = 'Record',
  elevation = 3,
  noSetButton,
  Content,
  titleTypographyProps,
  sx,
}: Props) {
  return (
    <Card elevation={elevation} sx={{ px: 1, m: 0.5, ...sx }}>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: 'h6', ...titleTypographyProps }}
      />
      <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />

      <CardContent sx={{ px: 1 }}>
        {Content ? (
          Content
        ) : (
          <>
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
          </>
        )}
      </CardContent>
      {!noSetButton && !Content && (
        <CardActions sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
          <Skeleton variant="circular" height="50px" width="50px" />
        </CardActions>
      )}
    </Card>
  )
}
