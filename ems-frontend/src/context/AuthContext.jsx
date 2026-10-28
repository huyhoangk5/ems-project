import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token    = localStorage.getItem('token')
    const role     = localStorage.getItem('role')
    const userId   = localStorage.getItem('userId')
    const fullName = localStorage.getItem('fullName')
    const username = localStorage.getItem('username')
    if (token && role) {
      setUser({ token, role, userId: Number(userId), fullName, username })
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    localStorage.setItem('token',    data.token)
    localStorage.setItem('role',     data.role)
    localStorage.setItem('userId',   data.userId)
    localStorage.setItem('fullName', data.fullName)
    localStorage.setItem('username', data.username)
    setUser(data)
  }

  const updateUser = (fields) => {
    setUser(prev => {
      const updated = { ...prev, ...fields }
      if (fields.fullName) localStorage.setItem('fullName', fields.fullName)
      return updated
    })
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
