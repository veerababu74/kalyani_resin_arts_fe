import { useEffect, useState } from 'react'
import { FaSave, FaPlus, FaTimes, FaUpload, FaEdit } from 'react-icons/fa'
import AdminLayout from '../../components/AdminLayout'
import { settingsService, productService } from '../../services/api'
import { toast } from 'react-toastify'
import './AdminSettings.css'

const defaultFeatures = [
  { icon: '🎨', title: 'Handcrafted', description: 'Every piece is made by hand with attention to detail' },
  { icon: '✨', title: 'Unique Designs', description: 'No two pieces are exactly alike - each is one of a kind' },
  { icon: '💎', title: 'Premium Quality', description: 'We use only the finest resin and materials' },
  { icon: '🎁', title: 'Perfect Gifts', description: 'Ideal for special occasions and memorable moments' },
  { icon: '🌿', title: 'Eco-Friendly', description: 'Sustainable practices and eco-conscious materials' },
  { icon: '💕', title: 'Made with Love', description: 'Each creation is crafted with passion and care' }
]

function AdminSettings() {
  const [settings, setSettings] = useState({
    whatsapp: '',
    instagram: '',
    email: '',
    address: '',
    about_text: '',
    hero_title: '',
    hero_subtitle: '',
    footer_text: ''
  })
  const [carousel, setCarousel] = useState([])
  const [features, setFeatures] = useState(defaultFeatures)
  const [editingFeature, setEditingFeature] = useState(null)
  const [newSlide, setNewSlide] = useState({ image: '', title: '', subtitle: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    Promise.all([
      settingsService.get(),
      settingsService.getCarousel(),
      settingsService.getFeatures()
    ])
      .then(([settingsRes, carouselRes, featuresRes]) => {
        if (settingsRes.data) setSettings(settingsRes.data)
        if (carouselRes.data) setCarousel(carouselRes.data)
        if (featuresRes.data && featuresRes.data.length > 0) setFeatures(featuresRes.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSettingsChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await settingsService.update(settings)
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleAddSlide = () => {
    if (newSlide.image) {
      setCarousel([...carousel, { ...newSlide }])
      setNewSlide({ image: '', title: '', subtitle: '' })
    }
  }

  const handleCarouselImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

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
      setNewSlide(prev => ({ ...prev, image: response.data.url }))
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.detail || 'Failed to upload image')
    } finally {
      setUploading(false)
      e.target.value = '' // Reset file input
    }
  }

  const handleRemoveSlide = (index) => {
    setCarousel(carousel.filter((_, i) => i !== index))
  }

  const handleSaveCarousel = async () => {
    setSaving(true)
    try {
      await settingsService.updateCarousel(carousel)
      toast.success('Carousel updated successfully!')
    } catch (error) {
      toast.error('Failed to save carousel')
    } finally {
      setSaving(false)
    }
  }

  const handleFeatureChange = (index, field, value) => {
    const updated = [...features]
    updated[index] = { ...updated[index], [field]: value }
    setFeatures(updated)
  }

  const handleSaveFeatures = async () => {
    setSaving(true)
    try {
      await settingsService.updateFeatures(features)
      toast.success('Feature cards updated successfully!')
      setEditingFeature(null)
    } catch (error) {
      toast.error('Failed to save feature cards')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading"><div className="spinner"></div></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your website settings and content</p>
        </div>
      </div>

      {/* Contact Settings */}
      <div className="admin-card">
        <h2>Contact Information</h2>
        <p className="card-description">
          These details will be shown on your website for customers to contact you.
        </p>

        <div className="settings-form">
          <div className="form-row">
            <div className="form-group">
              <label>WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleSettingsChange}
                placeholder="e.g., 919876543210 (with country code)"
              />
              <small>Enter number with country code, without + or spaces</small>
            </div>
            <div className="form-group">
              <label>Instagram Username</label>
              <input
                type="text"
                name="instagram"
                value={settings.instagram}
                onChange={handleSettingsChange}
                placeholder="e.g., kalyani_resin_arts"
              />
              <small>Just the username, without @</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleSettingsChange}
                placeholder="e.g., hello@kalyaniresinarts.com"
              />
            </div>
            <div className="form-group">
              <label>Address / Location</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleSettingsChange}
                placeholder="e.g., Mumbai, Maharashtra, India"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Hero Title (Welcome Text)</label>
            <input
              type="text"
              name="hero_title"
              value={settings.hero_title}
              onChange={handleSettingsChange}
              placeholder="e.g., Welcome to Kalyani Resin Arts"
            />
            <small>Main heading shown on the homepage hero section</small>
          </div>

          <div className="form-group">
            <label>Hero Subtitle</label>
            <textarea
              name="hero_subtitle"
              value={settings.hero_subtitle}
              onChange={handleSettingsChange}
              placeholder="e.g., Beautiful handcrafted resin art pieces made with love and creativity"
              rows="2"
            />
            <small>Subtext shown below the main heading</small>
          </div>

          <div className="form-group">
            <label>About Text</label>
            <textarea
              name="about_text"
              value={settings.about_text}
              onChange={handleSettingsChange}
              placeholder="Write a brief description about your business..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Footer Text</label>
            <textarea
              name="footer_text"
              value={settings.footer_text}
              onChange={handleSettingsChange}
              placeholder="e.g., Handcrafted resin art pieces made with love and creativity..."
              rows="3"
            />
            <small>Description shown in the footer section</small>
          </div>

          <button onClick={handleSaveSettings} className="btn btn-primary" disabled={saving}>
            <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Carousel Settings */}
      <div className="admin-card">
        <h2>Homepage Carousel</h2>
        <p className="card-description">
          Manage the image slider on your homepage. Add up to 5 slides.
        </p>

        <div className="carousel-settings">
          {carousel.length < 5 && (
            <div className="add-slide-form">
              <h3>Add New Slide</h3>
              
              {/* Image Upload Section */}
              <div className="form-group">
                <label>Slide Image *</label>
                <div className="carousel-image-upload">
                  <label className="file-upload-btn">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleCarouselImageUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                    <FaUpload /> {uploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                  <span className="or-divider">or</span>
                  <input
                    type="url"
                    value={newSlide.image}
                    onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                    placeholder="Enter image URL"
                    className="url-input"
                  />
                </div>
                {newSlide.image && (
                  <div className="image-preview">
                    <img src={newSlide.image} alt="Preview" />
                    <button 
                      type="button" 
                      onClick={() => setNewSlide({ ...newSlide, image: '' })}
                      className="remove-preview"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newSlide.title}
                    onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                    placeholder="e.g., Welcome to Kalyani Resin Arts"
                  />
                </div>
                <div className="form-group">
                  <label>Subtitle</label>
                  <input
                    type="text"
                    value={newSlide.subtitle}
                    onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                    placeholder="e.g., Beautiful handcrafted pieces"
                  />
                </div>
              </div>
              <button 
                onClick={handleAddSlide} 
                className="btn btn-secondary"
                disabled={!newSlide.image}
              >
                <FaPlus /> Add Slide
              </button>
            </div>
          )}

          {carousel.length > 0 && (
            <div className="slides-list">
              <h3>Current Slides ({carousel.length}/5)</h3>
              <div className="slides-grid">
                {carousel.map((slide, index) => (
                  <div key={index} className="slide-item">
                    <img src={slide.image} alt={`Slide ${index + 1}`} />
                    <div className="slide-info">
                      <p><strong>{slide.title || 'No title'}</strong></p>
                      <p>{slide.subtitle || 'No subtitle'}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveSlide(index)}
                      className="remove-slide"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSaveCarousel} className="btn btn-primary" disabled={saving}>
                <FaSave /> {saving ? 'Saving...' : 'Save Carousel'}
              </button>
            </div>
          )}

          {carousel.length === 0 && (
            <p className="no-data">No carousel slides yet. Add your first slide above.</p>
          )}
        </div>
      </div>

      {/* Feature Cards Settings */}
      <div className="admin-card">
        <h2>About Section - Feature Cards</h2>
        <p className="card-description">
          Customize the 6 feature cards displayed in the About section on the homepage.
        </p>

        <div className="features-settings">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-edit-card">
                {editingFeature === index ? (
                  <div className="feature-edit-form">
                    <div className="form-group">
                      <label>Icon (Emoji)</label>
                      <input
                        type="text"
                        value={feature.icon}
                        onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                        placeholder="🎨"
                        className="icon-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                        placeholder="Feature Title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                        placeholder="Feature description..."
                        rows="2"
                      />
                    </div>
                    <button 
                      onClick={() => setEditingFeature(null)} 
                      className="btn btn-secondary btn-sm"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="feature-preview" onClick={() => setEditingFeature(index)}>
                    <div className="feature-icon-preview">{feature.icon}</div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                    <button className="edit-btn">
                      <FaEdit /> Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={handleSaveFeatures} className="btn btn-primary" disabled={saving}>
            <FaSave /> {saving ? 'Saving...' : 'Save Feature Cards'}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminSettings
