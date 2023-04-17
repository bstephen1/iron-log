import { Stack, SxProps } from '@mui/material'
import NavigationArrow from './NavigationArrow'
import PaginationBullets from './PaginationBullets'

interface Props {
  navPrevClassName: string
  navNextClassName: string
  paginationClassName: string
  sx?: SxProps
}
/** Adds navigation and pagination to a Swiper.
 * Must be called within a Swiper component.
 *
 * Note: A slot must be declared to position the component.
 * "container-start" is recommended. The slot doesn't work if
 * declared internally within the component. */
export default function NavigationBar({
  navPrevClassName,
  navNextClassName,
  paginationClassName,
  sx,
}: Props) {
  return (
    <Stack direction="row" sx={sx}>
      <NavigationArrow direction="prev" className={navPrevClassName} />
      <PaginationBullets className={paginationClassName} />
      <NavigationArrow direction="next" className={navNextClassName} />
    </Stack>
  )
}