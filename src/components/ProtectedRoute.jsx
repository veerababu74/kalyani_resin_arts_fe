import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { authService } from '../services/api'

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      setIsAuth(false)
      return
    }

    authService.verifyToken()
      .then(() => setIsAuth(true))
      .catch(() => {
        authService.logout()
        setIsAuth(false)
      })
  }, [])

  if (isAuth === null) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return isAuth ? children : <Navigate to="/admin/login" replace />
}

export default ProtectedRoute
