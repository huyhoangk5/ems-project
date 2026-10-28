import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as apiLogin } from '../../api/auth'
import { register as apiRegister } from '../../api/auth'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/helpers'
import PasswordInput from '../../components/common/PasswordInput'

const DEMOS = [
  { label: 'Admin', u: 'admin', p: 'admin123' },
  { label: 'Quản lý (Đoàn TN)', u: 'trandmang', p: 'password123' },
  { label: 'Quản lý (HSV)', u: 'hoangbchau', p: 'password123' },
  { label: 'CLB Hướng nghiệp', u: 'cac_club', p: 'password123' },
  { label: 'CLB MC', u: 'mcc_club', p: 'password123' },
  { label: 'CLB Chứng khoán', u: 'sec_club', p: 'password123' },
  { label: 'Sinh viên', u: '27a4031327', p: 'password123' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [modal, setModal] = useState(null) // 'login' | 'register' | null
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [regForm, setRegForm] = useState({ fullName: '', username: '', password: '', confirm: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [regLoading, setRegLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    if (!loginForm.username) return toast.error('Vui lòng nhập tên đăng nhập')
    if (!loginForm.password) return toast.error('Vui lòng nhập mật khẩu')
    setLoginLoading(true)
    try {
      const res = await apiLogin(loginForm)
      const data = res.data.data
      login(data)
      if (data.role === 'ADMIN')         navigate('/admin')
      else if (data.role === 'APPROVER') navigate('/approver')
      else if (data.role === 'CLUB')     navigate('/club')
      else                               navigate('/student/events')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally { setLoginLoading(false) }
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (!regForm.fullName || !regForm.username || !regForm.password)
      return toast.error('Vui lòng nhập đầy đủ thông tin')
    if (!/^[a-zA-Z0-9_]+$/.test(regForm.username))
      return toast.error('Tên đăng nhập chỉ cho phép chữ cái, chữ số và dấu gạch dưới')
    if (regForm.password.length < 6)
      return toast.error('Mật khẩu phải có tối thiểu 6 ký tự')
    if (regForm.password !== regForm.confirm)
      return toast.error('Mật khẩu xác nhận không khớp')
    setRegLoading(true)
    try {
      await apiRegister({ fullName: regForm.fullName, username: regForm.username, password: regForm.password })
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      setRegForm({ fullName: '', username: '', password: '', confirm: '' })
      setModal('login')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally { setRegLoading(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* ===== HEADER ===== */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <img src="/logo.png" alt="EMS" style={{ height: 36 }}
            onError={e => { e.target.style.display = 'none' }} />
          <span style={styles.brand}>EMS</span>
          <span style={styles.subtitle}>Hệ thống Quản lý Sự kiện — Học viện Ngân hàng</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={() => setModal('login')}>Đăng nhập</button>
          <button className="btn btn-primary" onClick={() => setModal('register')}>Đăng ký</button>
        </div>
      </header>

      {/* ===== HERO (full remaining height) ===== */}
      <div style={styles.hero}>
        {/* Decorative background circles */}
        <div style={styles.bgCircle1} />
        <div style={styles.bgCircle2} />
        <div style={styles.bgCircle3} />

        {/* 4/6 split layout */}
        <div style={styles.heroInner}>

          {/* LEFT — Logo (4 parts) */}
          <div style={styles.heroLeft}>
            <img
              src="/logo.png"
              alt="EMS Logo"
              style={styles.heroLogo}
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div style={{ ...styles.logoFallback, display: 'none' }}>
              <span style={{ fontSize: 96 }}>🎓</span>
            </div>
          </div>

          {/* Divider */}
          <div style={styles.heroDivider} />

          {/* RIGHT — Text + buttons (6 parts) */}
          <div style={styles.heroRight}>
            <h1 style={styles.heroTitle}>Hệ thống Quản lý Sự kiện</h1>
            <p style={styles.heroSubtitle}>Học viện Ngân hàng</p>
            <p style={styles.heroDesc}>
              Nền tảng số hóa toàn bộ quy trình đăng ký, tổ chức và phê duyệt sự kiện
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button className="btn btn-lg" onClick={() => setModal('login')}
                style={{ background: '#fff', color: '#1a3a8a', fontWeight: 700, padding: '12px 36px', fontSize: 16, fontFamily: 'inherit' }}>
                Đăng nhập ngay
              </button>
              <button className="btn btn-lg btn-outline" onClick={() => setModal('register')}
                style={{ borderColor: '#fff', color: '#fff', padding: '12px 36px', fontSize: 16, fontFamily: 'inherit' }}>
                Đăng ký tài khoản
              </button>
            </div>
          </div>

        </div>
      </div>

      <footer style={styles.footer}>
        © 2026 EMS — Học viện Ngân hàng. Hệ thống Quản lý Sự kiện.
      </footer>

      {/* ===== LOGIN MODAL ===== */}
      {modal === 'login' && (
        <div style={styles.overlay} onClick={() => setModal(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Đăng nhập</span>
              <button style={styles.closeBtn} onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Tên đăng nhập</label>
                <input type="text" placeholder="Nhập tên đăng nhập" autoFocus
                  value={loginForm.username}
                  onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <PasswordInput placeholder="Nhập mật khẩu"
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
                disabled={loginLoading}>
                {loginLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 14, fontSize: 14, color: '#666' }}>
              Chưa có tài khoản?{' '}
              <button onClick={() => setModal('register')}
                style={{ background: 'none', border: 'none', color: '#1a3a8a', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
                Đăng ký ngay
              </button>
            </p>

            {/* Demo accounts */}
            <div style={{ marginTop: 16, padding: 14, background: '#f8f9fa', borderRadius: 6 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6c757d', marginBottom: 8 }}>
                Tài khoản demo — Click để điền nhanh:
              </p>
              <div>
                {DEMOS.map(d => (
                  <button key={d.u} onClick={() => setLoginForm({ username: d.u, password: d.p })}
                    style={styles.demoBtn}>{d.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== REGISTER MODAL ===== */}
      {modal === 'register' && (
        <div style={styles.overlay} onClick={() => setModal(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Đăng ký tài khoản</span>
              <button style={styles.closeBtn} onClick={() => setModal(null)}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: '#6c757d', marginBottom: 16 }}>
              Dành cho sinh viên Học viện Ngân hàng
            </p>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Họ và tên *</label>
                <input type="text" placeholder="Nguyễn Văn A" autoFocus
                  value={regForm.fullName}
                  onChange={e => setRegForm(f => ({ ...f, fullName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Tên đăng nhập *</label>
                <input type="text" placeholder="Chọn tên đăng nhập"
                  value={regForm.username}
                  onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Mật khẩu * (tối thiểu 6 ký tự)</label>
                <PasswordInput placeholder="Nhập mật khẩu"
                  value={regForm.password}
                  onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu *</label>
                <PasswordInput placeholder="Nhập lại mật khẩu"
                  value={regForm.confirm}
                  onChange={e => setRegForm(f => ({ ...f, confirm: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-success"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={regLoading}>
                {regLoading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 14, fontSize: 14, color: '#666' }}>
              Đã có tài khoản?{' '}
              <button onClick={() => setModal('login')}
                style={{ background: 'none', border: 'none', color: '#1a3a8a', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  header: {
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    padding: '12px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    zIndex: 100,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  brand: { fontSize: 22, fontWeight: 700, color: '#1a3a8a' },
  subtitle: { fontSize: 14, color: '#6c757d', display: 'none' },
  hero: {
    flex: 1,
    background: 'linear-gradient(135deg, #0d2462 0%, #1a3a8a 40%, #1a5fb4 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  bgCircle1: {
    position: 'absolute',
    width: 500, height: 500,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
    top: -160, left: -140,
    pointerEvents: 'none',
  },
  bgCircle2: {
    position: 'absolute',
    width: 360, height: 360,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    bottom: -100, right: -80,
    pointerEvents: 'none',
  },
  bgCircle3: {
    position: 'absolute',
    width: 200, height: 200,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
    top: '40%', right: '15%',
    pointerEvents: 'none',
  },
  /* 4/6 horizontal split */
  heroInner: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: 1100,
    padding: '0 48px',
    gap: 0,
  },
  /* LEFT — 4 parts */
  heroLeft: {
    flex: '0 0 40%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 40px 24px 0',
  },
  heroLogo: {
    width: '90%',
    maxWidth: 380,
    minWidth: 220,
    height: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 8px 40px rgba(0,0,0,0.4))',
  },
  logoFallback: {
    width: 220, height: 220,
    borderRadius: 24,
    background: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(6px)',
    border: '2px solid rgba(255,255,255,0.2)',
  },
  /* Thin vertical divider */
  heroDivider: {
    width: 1,
    alignSelf: 'stretch',
    background: 'rgba(255,255,255,0.2)',
    flexShrink: 0,
    margin: '32px 0',
  },
  /* RIGHT — 6 parts */
  heroRight: {
    flex: '0 0 60%',
    padding: '24px 0 24px 52px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 0,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: 800,
    marginBottom: 10,
    letterSpacing: '-0.3px',
    lineHeight: 1.25,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  heroSubtitle: {
    fontSize: 18,
    opacity: 0.72,
    marginBottom: 14,
    fontWeight: 500,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  heroDesc: {
    fontSize: 15,
    marginBottom: 32,
    opacity: 0.85,
    lineHeight: 1.75,
    maxWidth: 420,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  footer: {
    background: '#343a40', color: '#adb5bd',
    textAlign: 'center', padding: '16px', fontSize: 13,
    flexShrink: 0,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 16,
  },
  modalBox: {
    background: '#fff', borderRadius: 10,
    padding: '28px 28px',
    width: '100%', maxWidth: 440,
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    maxHeight: '90vh', overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20, paddingBottom: 14,
    borderBottom: '1px solid #e9ecef',
  },
  closeBtn: {
    background: 'none', border: 'none', fontSize: 20,
    cursor: 'pointer', color: '#6c757d', padding: 0, lineHeight: 1,
  },
  demoBtn: {
    display: 'inline-block', margin: '3px',
    padding: '3px 10px',
    background: '#e7f1ff', border: '1px solid #b3d4ff',
    borderRadius: 20, cursor: 'pointer',
    fontSize: 12, color: '#1a3a8a', fontWeight: 500,
    fontFamily: 'inherit',
  },
}
