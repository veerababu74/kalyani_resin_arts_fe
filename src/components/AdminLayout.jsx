import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaHome, FaBox, FaCog, FaSignOutAlt, FaTachometerAlt, FaStar } from 'react-icons/fa'
import { authService } from '../services/api'
import './AdminLayout.css'

function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/admin/login')
  }

  const navItems = [
    { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/admin/products', icon: <FaBox />, label: 'Products' },
    { path: '/admin/reviews', icon: <FaStar />, label: 'Reviews' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Settings' }
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Kalyani</h2>
          <span>Admin Panel</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-item">
            <FaHome />
            <span>View Site</span>
          </a>
          <button onClick={handleLogout} className="admin-nav-item logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-content">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
