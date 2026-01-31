import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Basic ${token}`
  }
  return config
})

// Products API
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

// Settings API
export const settingsService = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  getCarousel: () => api.get('/settings/carousel'),
  updateCarousel: (data) => api.put('/settings/carousel', data),
  getFeatures: () => api.get('/settings/features'),
  updateFeatures: (data) => api.put('/settings/features', data)
}

// Reviews API
export const reviewService = {
  getAll: () => api.get('/reviews'),
  getById: (id) => api.get(`/reviews/${id}`),
  getFeatured: () => api.get('/reviews/featured'),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`)
}

// Auth API
export const authService = {
  login: (username, password) => {
    const token = btoa(`${username}:${password}`)
    return api.post('/auth/login', {}, {
      headers: { Authorization: `Basic ${token}` }
    }).then(response => {
      localStorage.setItem('adminToken', token)
      return response
    })
  },
  logout: () => {
    localStorage.removeItem('adminToken')
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken')
  },
  verifyToken: () => api.get('/auth/verify')
}

export default api
