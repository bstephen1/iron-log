import useDesktopCheck from 'lib/frontend/useDesktopCheck'

/** Gets swiper pagination size for desktop and mobile. Spread return value into the
 * sx of the pagination container
 */
export default function usePaginationSize() {
  const isDesktop = useDesktopCheck()

  return { '--swiper-pagination-bullet-size': isDesktop ? '8px' : '14px' }
}
