import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import SubmitGrievancePage from './pages/SubmitGrievancePage'
import TrackGrievancePage from './pages/TrackGrievancePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Layout>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/submit" element={<SubmitGrievancePage />} />
            <Route path="/track" element={<TrackGrievancePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/submit" element={<SubmitGrievancePage />} />
            <Route path="/track" element={<TrackGrievancePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </>
        )}
      </Routes>
    </Layout>
  )
}

export default App