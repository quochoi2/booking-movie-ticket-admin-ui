import { jwtDecode } from 'jwt-decode'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem('accessToken')
  const user = jwtDecode(token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />
  }

  if (roles && (!user || !roles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default PrivateRoute
