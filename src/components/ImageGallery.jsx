import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, Zoom } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/zoom'
import './ImageGallery.css'

function ImageGallery({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  if (!images || images.length === 0) {
    return (
      <div className="gallery-placeholder">
        <p>No images available</p>
      </div>
    )
  }

  return (
    <div className="image-gallery">
      <Swiper
        modules={[Navigation, Thumbs, Zoom]}
        navigation
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        zoom
        className="gallery-main"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-zoom-container">
              <img src={image} alt={`Product image ${index + 1}`} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          slidesPerView={4}
          spaceBetween={10}
          watchSlidesProgress
          className="gallery-thumbs"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Thumbnail ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}

export default ImageGallery
