import { type SxProps, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Box from '@mui/material/Box'

interface Props {
  onDelete: () => void
  disabled?: boolean
  children: ReactNode
  /** Used to match the height of the delete slide to the height of the child.
   *  If not provided, will compute the height of the child internally.
   */
  childHeight?: number
}
export default function SwipeToDelete({
  children,
  onDelete,
  disabled,
  childHeight,
}: Props) {
  const resizeDetector = useResizeDetector()
  const height = childHeight ?? resizeDetector.height
  const ref = childHeight ? undefined : resizeDetector.ref

  if (disabled) {
    return children
  }

  return (
    <Swiper
      initialSlide={1}
      onSlideChange={({ activeIndex }) => {
        if (activeIndex !== 1) {
          onDelete()
        }
      }}
    >
      {/* SwiperSlide must be directly in the Swiper; it doesn't render 
          properly even if DeleteSlide is wrapped in SwiperSlide */}
      <SwiperSlide>
        <DeleteSlide justification="right" height={height} />
      </SwiperSlide>
      <SwiperSlide>
        <div ref={ref}>{children}</div>
      </SwiperSlide>
      <SwiperSlide>
        <DeleteSlide justification="left" height={height} />
      </SwiperSlide>
    </Swiper>
  )
}

const DeleteSlide = ({
  justification,
  height,
}: {
  justification: 'left' | 'right'
  height?: number
}) => {
  const { palette } = useTheme()
  const paddingSx: SxProps = justification === 'left' ? { pl: 1 } : { pr: 1 }

  return (
    <Box
      style={{
        backgroundColor: palette.error.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: justification,
        height,
      }}
    >
      <Typography sx={{ ...paddingSx, color: 'white' }}>Delete</Typography>
    </Box>
  )
}
