import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedUsername = localStorage.getItem('mcApp_username')
    if (savedUsername) {
      setUsername(savedUsername)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = (user) => {
    setUsername(user)
    setIsAuthenticated(true)
    localStorage.setItem('mcApp_username', user)
  }

  const logout = () => {
    setUsername('')
    setIsAuthenticated(false)
    localStorage.removeItem('mcApp_username')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

