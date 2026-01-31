import { useEffect, useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaUpload, FaSearch } from 'react-icons/fa'
import AdminLayout from '../../components/AdminLayout'
import { productService } from '../../services/api'
import { toast } from 'react-toastify'
import './AdminProducts.css'

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: '',
  dimensions: '',
  materials: '',
  images: [],
  is_featured: false,
  is_new: false
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(emptyProduct)
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    productService.getAll()
      .then(res => {
        setProducts(res.data)
        setFilteredProducts(res.data)
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = products.filter(product => 
        product.name?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, products])

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        dimensions: product.dimensions || '',
        materials: product.materials || '',
        images: product.images || [],
        is_featured: product.is_featured || false,
        is_new: product.is_new || false
      })
    } else {
      setEditingProduct(null)
      setFormData(emptyProduct)
    }
    setImageUrl('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData(emptyProduct)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddImage = () => {
    if (imageUrl && formData.images.length < 5) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }))
      setImageUrl('')
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (formData.images.length >= 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Use JPEG, PNG, WebP, or GIF')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB')
      return
    }

    setUploading(true)
    try {
      const response = await productService.uploadImage(file)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, response.data.url]
      }))
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.detail || 'Failed to upload image')
    } finally {
      setUploading(false)
      e.target.value = '' // Reset file input
    }
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const productData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null
    }

    try {
      if (editingProduct) {
        await productService.update(editingProduct._id, productData)
        toast.success('Product updated successfully!')
      } else {
        await productService.create(productData)
        toast.success('Product created successfully!')
      }
      handleCloseModal()
      loadProducts()
    } catch (error) {
      toast.error('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id)
        toast.success('Product deleted successfully!')
        loadProducts()
      } catch (error) {
        toast.error('Failed to delete product')
      }
    }
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Products</h1>
          <p>Manage your resin art products</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="admin-search-bar">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
              type="button"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <span className="results-count">
          {filteredProducts.length} of {products.length} products
        </span>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <div className="admin-card">
          {filteredProducts.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={product.images?.[0] || '/placeholder.jpg'} 
                        alt={product.name}
                        className="table-image"
                      />
                    </td>
                    <td><strong>{product.name}</strong></td>
                    <td>{product.category || '-'}</td>
                    <td>{product.price > 0 ? `₹${product.price.toLocaleString()}` : '-'}</td>
                    <td>{product.is_featured ? '⭐' : '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="btn-icon edit"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="btn-icon delete"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              <p>No products yet. Click "Add Product" to create your first product.</p>
            </div>
          )}
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={handleCloseModal} className="modal-close">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price (optional)"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Coasters, Wall Art, Jewelry"
                  />
                </div>
                <div className="form-group">
                  <label>Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    placeholder="e.g., 10cm x 10cm"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Materials</label>
                <input
                  type="text"
                  name="materials"
                  value={formData.materials}
                  onChange={handleChange}
                  placeholder="e.g., Epoxy resin, dried flowers, gold flakes"
                />
              </div>

              <div className="form-group">
                <label>Images (Max 5)</label>
                
                {/* File Upload */}
                <div className="image-upload-section">
                  <label className="file-upload-btn">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileUpload}
                      disabled={formData.images.length >= 5 || uploading}
                      style={{ display: 'none' }}
                    />
                    <FaUpload /> {uploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                  <span className="or-divider">or</span>
                </div>
                
                {/* URL Input */}
                <div className="image-input-row">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    disabled={formData.images.length >= 5}
                  />
                  <button 
                    type="button" 
                    onClick={handleAddImage}
                    className="btn btn-secondary"
                    disabled={!imageUrl || formData.images.length >= 5}
                  >
                    Add URL
                  </button>
                </div>
                <div className="image-preview-grid">
                  {formData.images.map((img, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={img} alt={`Preview ${index + 1}`} />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImage(index)}
                        className="remove-image"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-row checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />
                  <span>Featured Product</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_new"
                    checked={formData.is_new}
                    onChange={handleChange}
                  />
                  <span>Mark as New</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminProducts
