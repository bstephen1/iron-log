// import Swiper core and required modules
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper'

import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/effect-cards'
import 'swiper/css/effect-creative'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const centered = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const slides: string[] = []
for (let i = 1; i < 10; i++) {
  slides.push('Slide ' + i)
}

export default function SwiperDemo() {
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      grabCursor
      loop
      centeredSlides
      pagination={{
        clickable: true,
        // renderBullet: function (index, className) {
        //   return '<span class="' + className + '">' + (index + 1) + '</span>'
        // },
      }}
      // scrollbar={{ draggable: true }}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
      style={{ height: '400px' }}
    >
      {slides.map((text) => (
        <SwiperSlide key={text} style={centered}>
          {text}
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
