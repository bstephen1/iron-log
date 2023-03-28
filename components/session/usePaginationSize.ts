import { useMediaQuery } from '@mui/material'

/** Gets swiper pagination size for desktop and mobile. Spread return value into the
 * sx of the pagination container
 */
export default function usePaginationSize() {
  const isDesktop = useMediaQuery('(pointer: fine)')

  return { '--swiper-pagination-bullet-size': isDesktop ? '8px' : '16px' }
}
