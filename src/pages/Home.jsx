import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import ProductCard from '../components/ProductCard'
import { productService, settingsService, reviewService } from '../services/api'
import { FaWhatsapp, FaInstagram, FaArrowRight, FaStar, FaQuoteLeft } from 'react-icons/fa'
import './Home.css'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [carousel, setCarousel] = useState([])
  const [settings, setSettings] = useState({})
  const [reviews, setReviews] = useState([])
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      productService.getFeatured(),
      settingsService.getCarousel(),
      settingsService.get(),
      reviewService.getFeatured(),
      settingsService.getFeatures()
    ])
      .then(([productsRes, carouselRes, settingsRes, reviewsRes, featuresRes]) => {
        setFeaturedProducts(productsRes.data)
        setCarousel(carouselRes.data)
        setSettings(settingsRes.data)
        setReviews(reviewsRes.data)
        setFeatures(featuresRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div className="home">
      {/* Hero Carousel Section */}
      <section className="hero-section">
        {carousel.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="hero-swiper"
          >
            {carousel.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="hero-slide" style={{ backgroundImage: `url(${slide.image})` }}>
                  <div className="hero-overlay"></div>
                  <div className="hero-content container">
                    <h1>{slide.title || 'Welcome to Kalyani Resin Arts'}</h1>
                    <p>{slide.subtitle || 'Beautiful handcrafted resin art pieces'}</p>
                    <Link to="/products" className="btn btn-primary">
                      Explore Products <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="hero-slide hero-default">
            <div className="hero-overlay"></div>
            <div className="hero-content container">
              <h1>{settings.hero_title || 'Welcome to Kalyani Resin Arts'}</h1>
              <p>{settings.hero_subtitle || 'Beautiful handcrafted resin art pieces made with love and creativity'}</p>
              <Link to="/products" className="btn btn-primary">
                Explore Products <FaArrowRight />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="section about-section">
        <div className="container">
          <div className="section-title">
            <h2>About Our Art</h2>
            <p>{settings.about_text || 'Each piece is uniquely crafted with premium resin materials'}</p>
          </div>
          <div className="about-features">
            {features.length > 0 ? (
              features.map((feature, index) => (
                <div className="feature-card card" key={index}>
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))
            ) : (
              <>
                <div className="feature-card card">
                  <div className="feature-icon">🎨</div>
                  <h3>Handcrafted</h3>
                  <p>Every piece is made by hand with attention to detail</p>
                </div>
                <div className="feature-card card">
                  <div className="feature-icon">✨</div>
                  <h3>Unique Designs</h3>
                  <p>No two pieces are exactly alike - each is one of a kind</p>
                </div>
                <div className="feature-card card">
                  <div className="feature-icon">💎</div>
                  <h3>Premium Quality</h3>
                  <p>We use only the finest resin and materials</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-title">
            <h2>Featured Products</h2>
            <p>Discover our most loved creations</p>
          </div>
          {featuredProducts.length > 0 ? (
            <>
              <div className="grid-4">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="view-all">
                <Link to="/products" className="btn btn-secondary">
                  View All Products <FaArrowRight />
                </Link>
              </div>
            </>
          ) : (
            <p className="no-products">No featured products yet. Check back soon!</p>
          )}
        </div>
      </section>

      {/* Happy Customers Section */}
      {reviews.length > 0 && (
        <section className="section reviews-section">
          <div className="container">
            <div className="section-title">
              <h2>Happy Customers</h2>
              <p>What our customers say about our resin art</p>
            </div>
            <div className="reviews-carousel">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 }
                }}
                className="reviews-swiper"
              >
                {reviews.map((review, index) => (
                  <SwiperSlide key={review._id || index}>
                    <div className="review-card-home">
                      <div className="quote-icon">
                        <FaQuoteLeft />
                      </div>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? 'star-filled' : 'star-empty'} />
                        ))}
                      </div>
                      <p className="review-text-home">{review.review_text}</p>
                      <div className="review-author">
                        {review.customer_image ? (
                          <img src={review.customer_image} alt={review.customer_name} className="author-avatar" />
                        ) : (
                          <div className="author-avatar-placeholder">
                            {review.customer_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="author-info">
                          <h4>{review.customer_name}</h4>
                          {review.product_name && <span>{review.product_name}</span>}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Interested in Our Art?</h2>
            <p>Get in touch with us for custom orders, inquiries, or just to say hello!</p>
            <div className="cta-buttons">
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=Hi! I'm interested in your resin art products.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <FaWhatsapp /> WhatsApp Us
                </a>
              )}
              {settings.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-instagram"
                >
                  <FaInstagram /> Follow on Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
