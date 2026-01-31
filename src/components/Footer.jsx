import { Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram, FaHeart } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { settingsService } from '../services/api'
import './Footer.css'

function Footer() {
  const [settings, setSettings] = useState({
    whatsapp: '',
    instagram: '',
    email: '',
    address: '',
    footer_text: ''
  })

  useEffect(() => {
    settingsService.get()
      .then(res => setSettings(res.data))
      .catch(() => {})
  }, [])

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>Kalyani Resin Arts</h3>
            <p>{settings.footer_text || 'Handcrafted resin art pieces made with love and creativity. Each piece is unique and designed to bring beauty to your space.'}</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="footer-contact">
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <FaWhatsapp /> WhatsApp
                </a>
              )}
              {settings.instagram && (
                <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <FaInstagram /> Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Made with <FaHeart className="heart-icon" /> by Kalyani Resin Arts © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
