import { useEffect, useState } from 'react'
import { FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import { settingsService } from '../services/api'
import './Contact.css'

function Contact() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    settingsService.get()
      .then(res => setSettings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div className="contact-page">
      <div className="container">
        <div className="page-header">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you! Reach out for custom orders, inquiries, or collaborations.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-section">
            <h2>Contact Information</h2>
            <p className="contact-intro">
              Interested in our resin art pieces? Have a custom design in mind? 
              We're here to help bring your vision to life!
            </p>

            <div className="contact-methods">
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=Hi! I'm interested in your resin art products.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-method whatsapp"
                >
                  <div className="contact-icon">
                    <FaWhatsapp />
                  </div>
                  <div className="contact-details">
                    <h3>WhatsApp</h3>
                    <p>Chat with us directly</p>
                    <span>+{settings.whatsapp}</span>
                  </div>
                </a>
              )}

              {settings.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-method instagram"
                >
                  <div className="contact-icon">
                    <FaInstagram />
                  </div>
                  <div className="contact-details">
                    <h3>Instagram</h3>
                    <p>Follow our creations</p>
                    <span>@{settings.instagram}</span>
                  </div>
                </a>
              )}

              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="contact-method email"
                >
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact-details">
                    <h3>Email</h3>
                    <p>Send us a message</p>
                    <span>{settings.email}</span>
                  </div>
                </a>
              )}

              {settings.address && (
                <div className="contact-method location">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="contact-details">
                    <h3>Location</h3>
                    <p>Visit our studio</p>
                    <span>{settings.address}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="contact-cta-section">
            <div className="cta-card">
              <h2>Ready to Order?</h2>
              <p>
                The fastest way to reach us is through WhatsApp. 
                We typically respond within a few hours!
              </p>
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=Hi! I'm interested in your resin art products.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-large"
                >
                  <FaWhatsapp /> Message on WhatsApp
                </a>
              )}
            </div>

            <div className="cta-card">
              <h2>Custom Orders</h2>
              <p>
                Have a specific design in mind? We create custom resin art pieces 
                tailored to your preferences. Share your ideas with us!
              </p>
              <ul className="custom-list">
                <li>✓ Custom colors and designs</li>
                <li>✓ Personalized pieces for gifts</li>
                <li>✓ Bulk orders for events</li>
                <li>✓ Home décor customization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
