import { useEffect, useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaStar, FaUpload, FaSearch } from 'react-icons/fa'
import AdminLayout from '../../components/AdminLayout'
import { reviewService, productService } from '../../services/api'
import { toast } from 'react-toastify'
import './AdminReviews.css'

const emptyReview = {
  customer_name: '',
  customer_image: '',
  rating: 5,
  review_text: '',
  product_name: '',
  is_featured: false
}

function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [formData, setFormData] = useState(emptyReview)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = () => {
    reviewService.getAll()
      .then(res => {
        setReviews(res.data)
        setFilteredReviews(res.data)
      })
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false))
  }

  // Filter reviews based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredReviews(reviews)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = reviews.filter(review => 
        review.customer_name?.toLowerCase().includes(term) ||
        review.product_name?.toLowerCase().includes(term) ||
        review.review_text?.toLowerCase().includes(term)
      )
      setFilteredReviews(filtered)
    }
  }, [searchTerm, reviews])

  const handleOpenModal = (review = null) => {
    if (review) {
      setEditingReview(review)
      setFormData({
        customer_name: review.customer_name || '',
        customer_image: review.customer_image || '',
        rating: review.rating || 5,
        review_text: review.review_text || '',
        product_name: review.product_name || '',
        is_featured: review.is_featured || false
      })
    } else {
      setEditingReview(null)
      setFormData(emptyReview)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingReview(null)
    setFormData(emptyReview)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Use JPEG, PNG, WebP, or GIF')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB')
      return
    }

    setUploading(true)
    try {
      const response = await productService.uploadImage(file)
      setFormData(prev => ({ ...prev, customer_image: response.data.url }))
      toast.success('Image uploaded successfully!')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to upload image')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingReview) {
        await reviewService.update(editingReview._id, formData)
        toast.success('Review updated successfully!')
      } else {
        await reviewService.create(formData)
        toast.success('Review added successfully!')
      }
      handleCloseModal()
      loadReviews()
    } catch (error) {
      toast.error('Failed to save review')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.delete(id)
        toast.success('Review deleted successfully!')
        loadReviews()
      } catch (error) {
        toast.error('Failed to delete review')
      }
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < rating ? 'star filled' : 'star'} />
    ))
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Customer Reviews</h1>
          <p>Manage customer testimonials and reviews</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <FaPlus /> Add Review
        </button>
      </div>

      <div className="admin-search-bar">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')} type="button">
              <FaTimes />
            </button>
          )}
        </div>
        <span className="results-count">
          {filteredReviews.length} of {reviews.length} reviews
        </span>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <div className="admin-card">
          {filteredReviews.length > 0 ? (
            <div className="reviews-grid">
              {filteredReviews.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="customer-info">
                      {review.customer_image ? (
                        <img src={review.customer_image} alt={review.customer_name} className="customer-avatar" />
                      ) : (
                        <div className="customer-avatar-placeholder">
                          {review.customer_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4>{review.customer_name}</h4>
                        {review.product_name && <small>{review.product_name}</small>}
                      </div>
                    </div>
                    {review.is_featured && <span className="featured-badge">Featured</span>}
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                  <p className="review-text">{review.review_text}</p>
                  <div className="review-actions">
                    <button onClick={() => handleOpenModal(review)} className="btn-icon edit" title="Edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(review._id)} className="btn-icon delete" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No reviews yet. Click "Add Review" to add customer testimonials.</p>
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingReview ? 'Edit Review' : 'Add New Review'}</h2>
              <button onClick={handleCloseModal} className="modal-close">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    placeholder="e.g., Ocean Wave Coasters"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Customer Photo</label>
                <div className="image-upload-section">
                  <label className="file-upload-btn">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                    <FaUpload /> {uploading ? 'Uploading...' : 'Upload Photo'}
                  </label>
                  <span className="or-divider">or</span>
                  <input
                    type="url"
                    name="customer_image"
                    value={formData.customer_image}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                    style={{ flex: 1 }}
                  />
                </div>
                {formData.customer_image && (
                  <div className="image-preview-small">
                    <img src={formData.customer_image} alt="Preview" />
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, customer_image: '' }))}
                      className="remove-image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Rating *</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                    >
                      <FaStar />
                    </button>
                  ))}
                  <span className="rating-text">{formData.rating} star{formData.rating !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Review Text *</label>
                <textarea
                  name="review_text"
                  value={formData.review_text}
                  onChange={handleChange}
                  placeholder="Enter the customer's review..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-row checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />
                  <span>Show on Homepage (Featured)</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (editingReview ? 'Update Review' : 'Add Review')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminReviews
