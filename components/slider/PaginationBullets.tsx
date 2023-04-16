import { Box, useMediaQuery } from '@mui/material'

// swiper's default is 8
const defaultSize = 10

interface Props {
  className: string
  /** in pixels */
  desktopSize?: number
  /** in */
  mobileSize?: number
}
export default function PaginationBullets({
  className,
  desktopSize = defaultSize,
  mobileSize = defaultSize,
}: Props) {
  const isDesktop = useMediaQuery('(pointer: fine)')

  return (
    <Box
      className={className}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        '--swiper-pagination-bullet-size': `${
          isDesktop ? desktopSize : mobileSize
        }px`,
      }}
    />
  )
}
