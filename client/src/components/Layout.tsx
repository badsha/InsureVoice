import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth, logout } from '../hooks/useAuth'
import { Home, FileText, Search, LogOut, User, BarChart3 } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logout()
      window.location.reload()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 idra-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IDRA</h1>
                <p className="text-xs text-gray-500">Grievance Management</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/submit"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/submit') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Submit Grievance</span>
              </Link>

              <Link
                to="/track"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/track') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Track Grievance</span>
              </Link>

              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-gray-500 capitalize">
                        {user.profile.role.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-300">
              © 2025 Insurance Development and Regulatory Authority (IDRA), Bangladesh
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Protecting policyholders' interests and ensuring fair insurance practices
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}