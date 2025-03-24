import { jwtDecode } from 'jwt-decode'
import React, { createContext, useState, useEffect } from 'react'

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      try {
        const userInfo = jwtDecode(token)
        console.log(userInfo);
        setUser(userInfo)
      } catch (error) {
        console.error("Can not decode token", error)
      }
    }
    setLoading(false)
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}
