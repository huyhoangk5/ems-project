import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getNotifications, getUnreadCount, markAllRead } from '../../api/notifications'
import { formatDate } from '../../utils/helpers'
import ProfileModal from '../profile/ProfileModal'

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread]         = useState(0)
  const [notifs, setNotifs]         = useState([])
  const [showNotifs, setShowNotifs] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const notifRef    = useRef()
  const userMenuRef = useRef()

  useEffect(() => {
    fetchUnread()
    const t = setInterval(fetchUnread, 60000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    function handler(e) {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifs(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function fetchUnread() {
    try {
      const r = await getUnreadCount()
      setUnread(r.data.data.count || 0)
    } catch {}
  }

  async function openNotifs() {
    const next = !showNotifs
    setShowNotifs(next)
    if (next) {
      try {
        const r = await getNotifications()
        setNotifs(r.data.data || [])
      } catch {}
    }
  }

  async function handleMarkAllRead() {
    try { await markAllRead() } catch {}
    setNotifs(n => n.map(x => ({ ...x, isRead: true })))
    setUnread(0)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleBrandClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isStudent = user?.role === 'STUDENT'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ===== HEADER ===== */}
      <header>
        {/* Brand */}
        <div className="header-brand" onClick={handleBrandClick}>
          <img src="/logo.png" alt="EMS" className="logo-img"
            onError={e => { e.target.style.display = 'none' }} />
          <div>
            <div className="brand-name">EMS</div>
            <div className="brand-sub">Hệ thống Quản lý Sự kiện</div>
          </div>
        </div>

        {/* Right side */}
        <div className="header-right">
          {/* Notification bell */}
          <div className="notif-wrapper" ref={notifRef} onClick={openNotifs}>
            <span className="notif-icon" title="Thông báo">🔔</span>
            {unread > 0 && (
              <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>
            )}
            {showNotifs && (
              <div className="notif-dropdown" onClick={e => e.stopPropagation()}>
                <div className="notif-dropdown-header">
                  <span>Thông báo</span>
                  {unread > 0 && (
                    <button onClick={handleMarkAllRead} style={{
                      background: 'none', border: 'none', color: '#1a5fb4',
                      cursor: 'pointer', fontSize: 12, padding: 0, fontFamily: 'inherit'
                    }}>
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
                <div className="notif-scroll">
                  {notifs.length === 0 ? (
                    <p style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                      Không có thông báo
                    </p>
                  ) : notifs.slice(0, 10).map(n => (
                    <div key={n.idNotification} className={`notif-item ${!n.isRead ? 'unread' : ''}`}>
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-body">{n.content}</div>
                      <div className="notif-time">{formatDate(n.createdDate)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.2)' }} />

          {isStudent ? (
            /* ===== STUDENT: tên + icon menu + dropdown ===== */
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="header-greeting">
                Xin chào, <strong>{user?.fullName}</strong>
              </span>
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  title="Menu tài khoản"
                  style={{
                    background: showUserMenu ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                    border: '1.5px solid rgba(255,255,255,0.35)',
                    borderRadius: 8,
                    color: '#fff',
                    cursor: 'pointer',
                    width: 38, height: 38,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                    transition: 'background 0.15s',
                  }}
                >
                  ☰
                </button>
                {showUserMenu && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: '#fff', borderRadius: 10,
                    boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
                    border: '1px solid #e0e6f0',
                    minWidth: 210, zIndex: 300, overflow: 'hidden',
                  }}>
                    {/* Header dropdown */}
                    <div style={{
                      padding: '12px 16px', background: '#f7f9fc',
                      borderBottom: '1px solid #e9ecef',
                      fontSize: 13, color: '#6c757d',
                    }}>
                      <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 14 }}>{user?.fullName}</div>
                      <div style={{ marginTop: 2 }}>Sinh viên</div>
                    </div>
                    {/* Chỉnh sửa thông tin */}
                    <button
                      onClick={() => { setShowUserMenu(false); setShowProfile(true) }}
                      style={dropdownItemStyle}
                      onMouseEnter={e => e.currentTarget.style.background = '#dce8ff'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      Chỉnh sửa thông tin cá nhân
                    </button>
                    {/* Đăng xuất */}
                    <button
                      onClick={handleLogout}
                      style={{ ...dropdownItemStyle, color: '#dc3545', borderTop: '1px solid #f0f2f5' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#ffd7d7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ===== OTHER ROLES: tên + nút đăng xuất ===== */
            <>
              <span className="header-greeting"
                style={{ cursor: 'default' }}>
                Xin chào, <strong>{user?.fullName}</strong>
              </span>
              <button className="header-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Profile Modal — chỉ student */}
      {showProfile && isStudent && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
    </div>
  )
}

const dropdownItemStyle = {
  display: 'flex', alignItems: 'center', gap: 10,
  width: '100%', padding: '11px 16px',
  background: 'none', border: 'none',
  cursor: 'pointer', textAlign: 'left',
  fontSize: 14, color: '#1a1a1a',
  fontFamily: 'inherit',
  transition: 'background 0.12s',
}
