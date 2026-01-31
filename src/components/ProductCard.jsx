import { Link } from 'react-router-dom'
import './ProductCard.css'

function ProductCard({ product }) {
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder.jpg'

  return (
    <Link to={`/products/${product._id}`} className="product-card card">
      <div className="product-image">
        <img src={mainImage} alt={product.name} />
        <div className="badges">
          {product.is_featured && <span className="badge badge-featured">Featured</span>}
          {product.is_new && <span className="badge badge-new">New</span>}
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        {product.price > 0 && <p className="price">₹{product.price.toLocaleString()}</p>}
      </div>
    </Link>
  )
}

export default ProductCard
