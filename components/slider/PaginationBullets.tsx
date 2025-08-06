import Box from '@mui/material/Box'
import useDesktopCheck from '../../lib/frontend/useDesktopCheck'

// swiper's default is 8
const defaultSize = 10

interface Props {
  className: string
  /** in pixels */
  desktopSize?: number
  /** in pixels */
  mobileSize?: number
}
export default function PaginationBullets({
  className,
  desktopSize = defaultSize,
  mobileSize = defaultSize,
}: Props) {
  const isDesktop = useDesktopCheck()

  return (
    <Box
      className={className}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={[
        {
          '--swiper-pagination-bullet-size': `${
            isDesktop ? desktopSize : mobileSize
          }px`,
          pb: isDesktop ? 0 : 1,
        },
        (theme) =>
          theme.applyStyles('dark', {
            '--swiper-theme-color': theme.palette.primary.light,
            '--swiper-pagination-bullet-inactive-color': '#fff',
          }),
      ]}
    />
  )
}
