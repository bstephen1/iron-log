import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Skeleton,
  SxProps,
  TypographyProps,
} from '@mui/material'
import { JSX } from 'react'
import StyledDivider from '../../components/StyledDivider'

interface Props {
  title?: string
  showSetButton?: boolean
  /** Override all card content.  */
  Content?: JSX.Element
  elevation?: number
  titleTypographyProps?: Partial<TypographyProps>
  sx?: SxProps
}
export default function RecordCardSkeleton({
  title,
  elevation = 3,
  showSetButton,
  Content,
  titleTypographyProps,
  sx,
}: Props) {
  return (
    <Card elevation={elevation} sx={{ px: 1, m: 0.5, ...sx }}>
      {title && (
        <>
          <CardHeader
            title={title}
            slotProps={{
              title: { variant: 'h6', ...titleTypographyProps },
            }}
          />
          <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />
        </>
      )}
      <CardContent sx={{ px: 1 }}>
        {Content ? (
          Content
        ) : (
          <div aria-label="Loading record...">
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
          </div>
        )}
      </CardContent>
      {showSetButton && (
        <CardActions sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
          <Skeleton variant="circular" height="50px" width="50px" />
        </CardActions>
      )}
    </Card>
  )
}
