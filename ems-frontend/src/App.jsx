import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import LoginPage         from './pages/auth/LoginPage'
import AdminPage         from './pages/admin/AdminPage'
import ClubPage          from './pages/club/ClubPage'
import ApproverPage      from './pages/approver/ApproverPage'
import StudentEventsPage from './pages/student/StudentEventsPage'

function RequireAuth({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'ADMIN')    return <Navigate to="/admin" replace />
  if (user.role === 'APPROVER') return <Navigate to="/approver" replace />
  if (user.role === 'CLUB')     return <Navigate to="/club" replace />
  return <Navigate to="/student/events" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />

      <Route path="/admin" element={
        <RequireAuth role="ADMIN"><AdminPage /></RequireAuth>
      } />

      <Route path="/approver" element={
        <RequireAuth role="APPROVER"><ApproverPage /></RequireAuth>
      } />

      <Route path="/club" element={
        <RequireAuth role="CLUB"><ClubPage /></RequireAuth>
      } />

      {/* Student: 1 trang duy nhất, có tab bên trong */}
      <Route path="/student/events" element={
        <RequireAuth role="STUDENT"><StudentEventsPage /></RequireAuth>
      } />
      <Route path="/student/history" element={
        <RequireAuth role="STUDENT"><StudentEventsPage /></RequireAuth>
      } />

      <Route path="/" element={<RoleRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
