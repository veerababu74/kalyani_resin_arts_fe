import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBox, FaStar, FaTags, FaPlus } from 'react-icons/fa'
import AdminLayout from '../../components/AdminLayout'
import { productService } from '../../services/api'
import '../../components/AdminLayout.css'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    categories: 0
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.getAll()
      .then(res => {
        const products = res.data
        const categories = new Set(products.map(p => p.category).filter(Boolean))
        
        setStats({
          totalProducts: products.length,
          featuredProducts: products.filter(p => p.is_featured).length,
          categories: categories.size
        })
        
        setRecentProducts(products.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back to your admin panel</p>
        </div>
        <Link to="/admin/products" className="btn btn-primary">
          <FaPlus /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon products">
                <FaBox />
              </div>
              <div className="stat-info">
                <h3>{stats.totalProducts}</h3>
                <p>Total Products</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon featured">
                <FaStar />
              </div>
              <div className="stat-info">
                <h3>{stats.featuredProducts}</h3>
                <p>Featured Products</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon categories">
                <FaTags />
              </div>
              <div className="stat-info">
                <h3>{stats.categories}</h3>
                <p>Categories</p>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h2>Recent Products</h2>
            {recentProducts.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Featured</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img 
                          src={product.images?.[0] || '/placeholder.jpg'} 
                          alt={product.name}
                          className="table-image"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category || '-'}</td>
                      <td>{product.price > 0 ? `₹${product.price.toLocaleString()}` : '-'}</td>
                      <td>{product.is_featured ? '⭐ Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No products yet. Add your first product!</p>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  )
}

export default AdminDashboard
