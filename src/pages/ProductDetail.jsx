import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram, FaArrowLeft } from 'react-icons/fa'
import ImageGallery from '../components/ImageGallery'
import { productService, settingsService } from '../services/api'
import './ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      productService.getById(id),
      settingsService.get()
    ])
      .then(([productRes, settingsRes]) => {
        setProduct(productRes.data)
        setSettings(settingsRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  if (!product) {
    return (
      <div className="container">
        <div className="not-found">
          <h2>Product not found</h2>
          <Link to="/products" className="btn btn-primary">
            <FaArrowLeft /> Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const whatsappMessage = product.price > 0
    ? `Hi! I'm interested in the "${product.name}" (₹${product.price.toLocaleString()}). Can you provide more details?`
    : `Hi! I'm interested in the "${product.name}". Can you provide more details?`

  return (
    <div className="product-detail">
      <div className="container">
        <Link to="/products" className="back-link">
          <FaArrowLeft /> Back to Products
        </Link>

        <div className="product-detail-grid">
          <div className="product-gallery">
            <ImageGallery images={product.images} />
          </div>

          <div className="product-info-detail">
            {product.category && (
              <span className="product-category-badge">{product.category}</span>
            )}
            <h1>{product.name}</h1>
            {product.price > 0 && <p className="price">₹{product.price.toLocaleString()}</p>}

            {product.description && (
              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            {product.dimensions && (
              <div className="product-specs">
                <h3>Dimensions</h3>
                <p>{product.dimensions}</p>
              </div>
            )}

            {product.materials && (
              <div className="product-specs">
                <h3>Materials</h3>
                <p>{product.materials}</p>
              </div>
            )}

            <div className="product-contact">
              <h3>Interested in this piece?</h3>
              <p>Contact us for purchase or custom orders</p>
              <div className="contact-buttons">
                {settings.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>
                )}
                {settings.instagram && (
                  <a
                    href={`https://instagram.com/${settings.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-instagram"
                  >
                    <FaInstagram /> Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
