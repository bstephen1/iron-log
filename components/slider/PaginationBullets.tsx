import { Box, useMediaQuery } from '@mui/material'

const defaultSize = 8

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
      pt={2}
      sx={{
        '--swiper-pagination-bullet-size': `${
          isDesktop ? desktopSize : mobileSize
        }px`,
      }}
    />
  )
}
