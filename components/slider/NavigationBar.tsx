import Stack from '@mui/material/Stack'
import { type SxProps } from '@mui/material/styles'
import NavigationArrow from './NavigationArrow'
import PaginationBullets from './PaginationBullets'

interface Props {
  navPrevClassName: string
  navNextClassName: string
  paginationClassName: string
  sx?: SxProps
  isLoading?: boolean
}
/** Adds navigation and pagination to a Swiper.
 * Must be called within a Swiper component.
 *
 * Swiper won't recognize the nav functions from this component if it is called conditionally within the swiper.
 * Instead, the isLoading prop should be used, which will hide the visible elements when true.
 *
 * Note: A slot must be declared to position the component (like any other prop, "slot=xxx").
 * "container-start" is recommended. The slot doesn't work if
 * declared internally within the component. */
export default function NavigationBar({
  navPrevClassName,
  navNextClassName,
  paginationClassName,
  sx,
  isLoading,
}: Props) {
  return (
    <Stack direction="row" sx={sx}>
      <NavigationArrow
        direction="prev"
        className={navPrevClassName}
        isHidden={isLoading}
      />
      <PaginationBullets className={paginationClassName} />
      <NavigationArrow
        direction="next"
        className={navNextClassName}
        isHidden={isLoading}
      />
    </Stack>
  )
}
