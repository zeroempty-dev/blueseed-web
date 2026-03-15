import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LandingPage from './LandingPage'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import BusinessDashboard from './pages/BusinessDashboard'
import TransportDashboard from './pages/TransportDashboard'
import DriverView from './pages/DriverView'
import TrackingPage from './pages/TrackingPage'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

function RootRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/demo/login" replace />
  return <Navigate to={`/demo/${user.role}`} replace />
}

function DemoApp() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/business/*" element={
        <ProtectedRoute roles={['business']}>
          <BusinessDashboard />
        </ProtectedRoute>
      } />
      <Route path="/transport/*" element={
        <ProtectedRoute roles={['transport']}>
          <TransportDashboard />
        </ProtectedRoute>
      } />
      <Route path="/driver/*" element={
        <ProtectedRoute roles={['driver']}>
          <DriverView />
        </ProtectedRoute>
      } />
      <Route path="/tracking" element={
        <ProtectedRoute roles={['business', 'transport', 'driver']}>
          <TrackingPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute roles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/demo" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo/*" element={<DemoApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
  )
}
