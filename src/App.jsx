import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { AuthProvider, useAuth } from './context/AuthContext'
import { isSupabaseConfigured } from './lib/supabase'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Error Boundary Component
const ErrorDisplay = ({ error }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Application Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
      const errorMessage = isProduction
        ? 'Missing Supabase configuration. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set as GitHub Secrets in your repository settings.'
        : 'Missing Supabase configuration. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
      setError(errorMessage)
    }

    // Catch any unhandled errors
    const handleError = (event) => {
      console.error('Unhandled error:', event.error)
      setError(event.error?.message || 'An unexpected error occurred')
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      setError(event.reason?.message || 'An unexpected error occurred')
    })

    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [])

  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App




